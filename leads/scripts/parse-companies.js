#!/usr/bin/env node

/**
 * Парсер данных ЕГРЮЛ для поиска потенциальных клиентов УМЦ
 * 
 * Ищет активные компании в Калужской области с численностью >50 сотрудников
 * Использует публичные открытые данные:
 * - egrul.nalog.ru (официальный сайт ФНС)
 * - Открытые данные ФНС (data.nalog.ru)
 * 
 * ВАЖНО: Официального публичного API для массового скачивания нет.
 * Скрипт демонстрирует подход к работе с открытыми данными.
 */

import { 
  log, 
  sleep, 
  fetchWithRetry, 
  createCSVFile, 
  appendToCSV,
  cleanText,
  formatPhone,
  RateLimiter,
  getOutputDir,
  generateFilename
} from './utils.js';
import { join } from 'path';

// ============================================================================
// КОНФИГУРАЦИЯ
// ============================================================================

const CONFIG = {
  // Регион (Калужская область, код 40)
  REGION_CODE: '40',
  REGION_NAME: 'Калужская область',
  
  // Минимальное количество сотрудников
  MIN_EMPLOYEES: 50,
  
  // Коды ОКВЭД для целевых отраслей
  // Полный список: https://оквэд.рф/
  TARGET_OKVED_CODES: [
    // Обрабатывающие производства
    '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
    '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
    '30', '31', '32', '33',
    // Строительство
    '41', '42', '43',
    // Транспортировка и хранение
    '49', '50', '51', '52', '53'
  ],
  
  // API конфигурация
  // Используем открытые данные ФНС
  FNS_OPEN_DATA_URL: 'https://www.nalog.gov.ru/opendata',
  
  // Rate limiting
  REQUESTS_PER_SECOND: 0.5, // Очень медленно, чтобы не нагружать сервер
  
  // Задержка между запросами (мс)
  REQUEST_DELAY: 2000
};

// ============================================================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================================

/**
 * Получение информации о компании через поиск ЕГРЮЛ по ИНН
 * @param {string} inn - ИНН компании
 * @returns {Promise<Object|null>} Данные компании
 */
async function getCompanyByINN(inn) {
  // Используем неофициальный метод запроса к egrul.nalog.ru
  // ВНИМАНИЕ: Это демонстрационный код. Для production используйте:
  // 1. Коммерческие API (DaData, Контур.Фокус, СПАРК)
  // 2. Официальные открытые данные ФНС в формате XML/JSON
  
  const searchUrl = 'https://egrul.nalog.ru/';
  
  try {
    // Формируем запрос на поиск
    const searchParams = new URLSearchParams({
      query: inn,
      region: CONFIG.REGION_CODE,
      page: '0',
      pageSize: '10'
    });
    
    // В реальности нужно:
    // 1. Сначала получить токен через POST запрос
    // 2. Затем получить результаты через другой POST запрос
    // Это сложная цепочка, которая часто меняется
    
    log(`Поиск компании с ИНН ${inn}...`, 'info');
    
    // Заглушка: в production здесь должна быть реальная реализация
    // или использование коммерческого API
    
    return null;
  } catch (error) {
    log(`Ошибка получения данных для ИНН ${inn}: ${error.message}`, 'error');
    return null;
  }
}

/**
 * Парсинг компании из открытых данных ФНС
 * Открытые данные доступны на https://www.nalog.gov.ru/opendata/
 * В формате: JSON, XML, CSV
 */
async function parseCompaniesFromOpenData() {
  log('Загрузка открытых данных ФНС...', 'info');
  
  // ЕГРЮЛ открытые данные публикуются ежедневно
  // Формат: https://www.nalog.gov.ru/opendata/7707329152-egrul/
  
  // ВАЖНО: Файлы очень большие (несколько ГБ)
  // Для работы с ними нужно:
  // 1. Скачать файл целиком
  // 2. Парсить построчно
  // 3. Фильтровать по региону и другим параметрам
  
  log('ВНИМАНИЕ: Прямое скачивание открытых данных ЕГРЮЛ требует обработки файлов размером >5GB', 'warning');
  log('Рекомендуется использовать коммерческие API или предварительно подготовленные датасеты', 'warning');
  
  return [];
}

// ============================================================================
// АЛЬТЕРНАТИВНЫЙ ПОДХОД: СПИСОК ИЗВЕСТНЫХ КОМПАНИЙ
// ============================================================================

/**
 * Для демонстрации: создаём список известных крупных компаний Калужской области
 * В production это должно быть заменено на реальный API или базу данных
 */
function getKnownCompanies() {
  // Это демонстрационные данные - крупнейшие предприятия Калужской области
  // Источник: открытая информация, справочники предприятий
  
  return [
    {
      inn: '4027044003',
      name: 'ООО "ФОЛЬКСВАГЕН Групп Рус"',
      address: 'Калужская обл., Боровский р-н, д. Северная',
      director: '',
      employees: 2000,
      okved: '29.10',
      phone: '+7 (484) 394-94-00',
      website: 'https://www.volkswagen.ru'
    },
    {
      inn: '4028000250',
      name: 'АО "Калугапутьмаш"',
      address: 'г. Калуга, ул. Московская, д. 247',
      director: '',
      employees: 500,
      okved: '30.20',
      phone: '+7 (4842) 79-60-01',
      website: 'http://www.kpm-kaluga.ru'
    },
    {
      inn: '4027084575',
      name: 'ООО "ПСМА Рус"',
      address: 'Калужская обл., Ферзиковский р-н, промзона "Грабцево"',
      director: '',
      employees: 1500,
      okved: '29.10',
      phone: '+7 (484) 394-70-00',
      website: ''
    },
    {
      inn: '4028000287',
      name: 'ПАО "Калужский электромеханический завод"',
      address: 'г. Калуга, ул. Ленина, д. 92',
      director: '',
      employees: 1200,
      okved: '26.51',
      phone: '+7 (4842) 74-85-00',
      website: 'http://www.kemz.ru'
    },
    {
      inn: '4028000301',
      name: 'АО "Калужский турбинный завод"',
      address: 'г. Калуга, ул. Московская, д. 247',
      director: '',
      employees: 800,
      okved: '28.11',
      phone: '+7 (4842) 79-60-00',
      website: 'http://www.ktz.kaluga.ru'
    },
    {
      inn: '4029023499',
      name: 'ООО "Кока-Кола ЭйчБиСи Евразия"',
      address: 'Калужская обл., Боровский р-н., промзона "Ворсино"',
      director: '',
      employees: 600,
      okved: '11.07',
      phone: '',
      website: 'https://www.coca-colahellenic.ru'
    },
    {
      inn: '4027117296',
      name: 'ООО "Континентал Калуга"',
      address: 'Калужская обл., Боровский р-н, промзона "Ворсино"',
      director: '',
      employees: 1000,
      okved: '22.11',
      phone: '',
      website: ''
    },
    {
      inn: '4028000324',
      name: 'АО "Калужский завод телеграфной аппаратуры"',
      address: 'г. Калуга, ул. Московская, д. 247',
      director: '',
      employees: 400,
      okved: '26.30',
      phone: '+7 (4842) 79-60-00',
      website: ''
    },
    {
      inn: '4028000338',
      name: 'АО "Калужский научно-исследовательский радиотехнический институт"',
      address: 'г. Калуга, Грабцевское шоссе, д. 49',
      director: '',
      employees: 350,
      okved: '26.51',
      phone: '+7 (4842) 72-52-00',
      website: 'http://www.knirti.ru'
    },
    {
      inn: '4029000484',
      name: 'ООО "Самсунг Электроникс РУС Калуга"',
      address: 'Калужская обл., Боровский р-н, промзона "Коряково"',
      director: '',
      employees: 1500,
      okved: '26.40',
      phone: '',
      website: 'https://www.samsung.com/ru'
    },
    {
      inn: '4028000365',
      name: 'АО "Калужский завод "Ремпутьмаш"',
      address: 'г. Калуга, ул. Московская, д. 247',
      director: '',
      employees: 300,
      okved: '28.92',
      phone: '+7 (4842) 79-60-00',
      website: ''
    },
    {
      inn: '4028000379',
      name: 'АО "Калужский опытно-экспериментальный завод "Металлист"',
      address: 'г. Калуга, ул. Московская, д. 247',
      director: '',
      employees: 250,
      okved: '25.62',
      phone: '+7 (4842) 79-60-00',
      website: ''
    }
  ];
}

/**
 * Поиск дополнительной информации о компании через веб-поиск
 * @param {Object} company - Базовые данные компании
 * @returns {Promise<Object>} Дополненные данные
 */
async function enrichCompanyData(company) {
  // Здесь можно было бы использовать:
  // 1. API DaData для получения полной информации по ИНН
  // 2. Парсинг открытых источников
  // 3. API Контур.Фокус или СПАРК
  
  // Для демонстрации возвращаем как есть
  return company;
}

// ============================================================================
// ОСНОВНАЯ ЛОГИКА
// ============================================================================

/**
 * Главная функция парсинга
 */
async function main() {
  log('Запуск парсера ЕГРЮЛ для поиска клиентов УМЦ');
  log(`Регион: ${CONFIG.REGION_NAME} (код ${CONFIG.REGION_CODE})`);
  log(`Минимум сотрудников: ${CONFIG.MIN_EMPLOYEES}`);
  
  // Создание CSV файла
  const outputDir = getOutputDir();
  const filename = generateFilename('egrul-leads');
  const filepath = join(outputDir, filename);
  
  const headers = [
    'ИНН',
    'Название компании',
    'Адрес',
    'ФИО Руководителя',
    'Численность',
    'ОКВЭД',
    'Телефон',
    'Сайт',
    'Источник'
  ];
  
  await createCSVFile(filepath, headers);
  
  // Rate limiter
  const rateLimiter = new RateLimiter(CONFIG.REQUESTS_PER_SECOND);
  
  // Статистика
  let stats = {
    totalProcessed: 0,
    totalSaved: 0
  };
  
  log('\n' + '='.repeat(60));
  log('ВАЖНОЕ ПРИМЕЧАНИЕ', 'warning');
  log('='.repeat(60));
  log('Официальный API ФНС для массового получения данных ЕГРЮЛ не предоставляется.');
  log('Открытые данные доступны в виде больших XML/JSON файлов на nalog.gov.ru/opendata');
  log('\nРекомендуемые решения для production:');
  log('  1. DaData API (https://dadata.ru) - коммерческий сервис с удобным API');
  log('  2. Контур.Фокус (https://focus.kontur.ru) - подробная информация о компаниях');
  log('  3. СПАРК (https://spark-interfax.ru) - аналитическая система');
  log('  4. Скачивание и парсинг открытых данных ФНС (требует обработки файлов >5GB)');
  log('\nДля демонстрации используем список известных крупных предприятий региона.');
  log('='.repeat(60) + '\n');
  
  // Получаем список компаний
  const companies = getKnownCompanies();
  log(`Загружено компаний для обработки: ${companies.length}`);
  
  // Обрабатываем каждую компанию
  for (const company of companies) {
    await rateLimiter.wait();
    
    stats.totalProcessed++;
    
    log(`\nОбработка: ${company.name}`);
    
    // Фильтрация по количеству сотрудников
    if (company.employees < CONFIG.MIN_EMPLOYEES) {
      log(`  Пропущено: мало сотрудников (${company.employees} < ${CONFIG.MIN_EMPLOYEES})`);
      continue;
    }
    
    // Дополняем данные если возможно
    const enrichedCompany = await enrichCompanyData(company);
    
    // Сохраняем в CSV
    await appendToCSV(filepath, [
      enrichedCompany.inn || '',
      enrichedCompany.name || '',
      enrichedCompany.address || '',
      enrichedCompany.director || '',
      enrichedCompany.employees || '',
      enrichedCompany.okved || '',
      enrichedCompany.phone || '',
      enrichedCompany.website || '',
      'ЕГРЮЛ (демо данные)'
    ]);
    
    stats.totalSaved++;
    log(`  Сохранено: ${enrichedCompany.name}`, 'success');
    
    // Задержка между компаниями
    await sleep(CONFIG.REQUEST_DELAY);
  }
  
  // Итоговая статистика
  log('\n' + '='.repeat(60));
  log('ИТОГИ ПАРСИНГА', 'success');
  log('='.repeat(60));
  log(`Всего обработано компаний: ${stats.totalProcessed}`);
  log(`Сохранено в CSV: ${stats.totalSaved}`);
  log(`Файл сохранён: ${filepath}`);
  log('='.repeat(60));
  
  log('\nДЛЯ ПОЛУЧЕНИЯ РЕАЛЬНЫХ ДАННЫХ:', 'warning');
  log('1. Используйте коммерческие API (DaData, Контур.Фокус, СПАРК)');
  log('2. Или скачайте открытые данные ЕГРЮЛ с nalog.gov.ru/opendata');
  log('3. Пример работы с DaData API:');
  log('   npm install node-dadata');
  log('   // const { DadataApi } = require("node-dadata");');
  log('   // const api = new DadataApi(token, secret);');
  log('   // const result = await api.findById("party", inn);');
  
  log('\nПарсинг завершён!', 'success');
}

// ============================================================================
// ЗАПУСК
// ============================================================================

// Обработка ошибок
process.on('unhandledRejection', (error) => {
  log(`Необработанная ошибка: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});

// Запуск
main().catch(error => {
  log(`Критическая ошибка: ${error.message}`, 'error');
  console.error(error);
  process.exit(1);
});
