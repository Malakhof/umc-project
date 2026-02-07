#!/usr/bin/env node

/**
 * Парсер 2GIS для поиска потенциальных клиентов УМЦ
 * 
 * Ищет компании в Калужской области, которым требуется обучение по охране труда:
 * - Производственные предприятия
 * - Строительные компании
 * - Транспортные компании
 * - Складские комплексы
 * - Заводы
 * 
 * Использует: 2GIS Places API
 * Документация: https://docs.2gis.com/en/api/search/places/overview
 */

import { 
  log, 
  sleep, 
  fetchWithRetry, 
  createCSVFile, 
  appendToCSV,
  cleanText,
  formatPhone,
  extractEmail,
  RateLimiter,
  getOutputDir,
  generateFilename
} from './utils.js';
import { join } from 'path';

// ============================================================================
// КОНФИГУРАЦИЯ
// ============================================================================

const CONFIG = {
  // 2GIS API конфигурация
  API_KEY: process.env.TWOGIS_API_KEY || '', // Получить на https://dev.2gis.ru/
  API_BASE_URL: 'https://catalog.api.2gis.com/3.0',
  
  // Регион поиска (Калужская область)
  REGION: {
    name: 'Калужская область',
    // Можно также использовать region_id для более точного поиска
    // Получить region_id можно через Regions API
  },
  
  // Ключевые слова для поиска целевых компаний
  KEYWORDS: [
    'производство',
    'завод',
    'строительство',
    'строительная компания',
    'транспортная компания',
    'логистика',
    'складской комплекс',
    'склад',
    'промышленное предприятие',
    'цех',
    'фабрика',
    'металлообработка',
    'деревообработка',
    'мебельное производство',
    'пищевое производство',
    'химическое производство'
  ],
  
  // Rate limiting (запросов в секунду)
  REQUESTS_PER_SECOND: 1,
  
  // Максимальное количество результатов на запрос
  PAGE_SIZE: 50,
  
  // Максимальное количество страниц на один поисковый запрос
  MAX_PAGES: 5
};

// ============================================================================
// API ФУНКЦИИ
// ============================================================================

/**
 * Поиск организаций через 2GIS API
 * @param {string} query - Поисковый запрос
 * @param {number} page - Номер страницы
 * @returns {Promise<Object>} Результаты поиска
 */
async function searchPlaces(query, page = 1) {
  const params = new URLSearchParams({
    q: query,
    region_id: '40', // Код Калужской области
    page: page.toString(),
    page_size: CONFIG.PAGE_SIZE.toString(),
    fields: 'items.point,items.address,items.contact_groups,items.schedule,items.rubrics',
    type: 'branch', // Ищем филиалы (конкретные организации)
  });
  
  // Добавляем API key если есть
  if (CONFIG.API_KEY) {
    params.append('key', CONFIG.API_KEY);
  }
  
  const url = `${CONFIG.API_BASE_URL}/items?${params.toString()}`;
  
  try {
    const response = await fetchWithRetry(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    log(`Ошибка поиска "${query}" (страница ${page}): ${error.message}`, 'error');
    return { result: { items: [], total: 0 } };
  }
}

/**
 * Извлечение данных компании из результата 2GIS
 * @param {Object} item - Элемент из результатов API
 * @returns {Object} Структурированные данные компании
 */
function extractCompanyData(item) {
  // Название компании
  const name = cleanText(item.name || '');
  
  // Адрес
  const address = item.address_name || 
                  (item.address ? cleanText(item.address.name) : '');
  
  // Телефоны
  let phones = [];
  if (item.contact_groups && Array.isArray(item.contact_groups)) {
    item.contact_groups.forEach(group => {
      if (group.contacts && Array.isArray(group.contacts)) {
        group.contacts.forEach(contact => {
          if (contact.type === 'phone' && contact.value) {
            phones.push(formatPhone(contact.value));
          }
        });
      }
    });
  }
  const phone = phones.length > 0 ? phones[0] : '';
  const phoneAll = phones.join('; ');
  
  // Сайт
  let website = '';
  if (item.contact_groups && Array.isArray(item.contact_groups)) {
    item.contact_groups.forEach(group => {
      if (group.contacts && Array.isArray(group.contacts)) {
        group.contacts.forEach(contact => {
          if (contact.type === 'website' && contact.value) {
            website = contact.value;
          }
        });
      }
    });
  }
  
  // Email (если есть в контактах или попытка извлечь из сайта)
  let email = '';
  if (item.contact_groups && Array.isArray(item.contact_groups)) {
    item.contact_groups.forEach(group => {
      if (group.contacts && Array.isArray(group.contacts)) {
        group.contacts.forEach(contact => {
          if (contact.type === 'email' && contact.value) {
            email = contact.value;
          }
        });
      }
    });
  }
  
  // Категории (рубрики)
  let categories = [];
  if (item.rubrics && Array.isArray(item.rubrics)) {
    categories = item.rubrics.map(r => cleanText(r.name || '')).filter(Boolean);
  }
  const category = categories.join('; ');
  
  // Координаты
  let coordinates = '';
  if (item.point) {
    coordinates = `${item.point.lat},${item.point.lon}`;
  }
  
  // ID для уникальности
  const id = item.id || '';
  
  return {
    id,
    name,
    address,
    phone,
    phoneAll,
    website,
    email,
    category,
    coordinates,
    source: '2GIS'
  };
}

/**
 * Проверка релевантности компании (фильтрация)
 * @param {Object} company - Данные компании
 * @returns {boolean} True если компания подходит
 */
function isRelevantCompany(company) {
  // Минимальные требования
  if (!company.name || !company.address) {
    return false;
  }
  
  // Проверяем наличие контактов (хотя бы один)
  if (!company.phone && !company.website) {
    return false;
  }
  
  // Исключаем ритуальные услуги, медицину и другие нецелевые компании
  const excludeKeywords = [
    'ритуал',
    'похорон',
    'морг',
    'поликлиника',
    'больница',
    'аптека',
    'магазин',
    'кафе',
    'ресторан',
    'салон красоты',
    'парикмахерская'
  ];
  
  const nameAndCategory = (company.name + ' ' + company.category).toLowerCase();
  
  for (const keyword of excludeKeywords) {
    if (nameAndCategory.includes(keyword)) {
      return false;
    }
  }
  
  return true;
}

// ============================================================================
// ОСНОВНАЯ ЛОГИКА
// ============================================================================

/**
 * Главная функция парсинга
 */
async function main() {
  log('Запуск парсера 2GIS для поиска клиентов УМЦ');
  log(`Регион: ${CONFIG.REGION.name}`);
  log(`Ключевых слов: ${CONFIG.KEYWORDS.length}`);
  
  // Проверка API ключа
  if (!CONFIG.API_KEY) {
    log('ВНИМАНИЕ: API ключ 2GIS не установлен. Некоторые запросы могут быть ограничены.', 'warning');
    log('Получите ключ на https://dev.2gis.ru/ и установите переменную окружения TWOGIS_API_KEY', 'warning');
  }
  
  // Создание CSV файла
  const outputDir = getOutputDir();
  const filename = generateFilename('2gis-leads');
  const filepath = join(outputDir, filename);
  
  const headers = [
    'ID',
    'Название компании',
    'Адрес',
    'Телефон',
    'Все телефоны',
    'Сайт',
    'Email',
    'Категория',
    'Координаты',
    'Источник'
  ];
  
  await createCSVFile(filepath, headers);
  
  // Rate limiter
  const rateLimiter = new RateLimiter(CONFIG.REQUESTS_PER_SECOND);
  
  // Статистика
  let stats = {
    totalSearched: 0,
    totalFound: 0,
    totalSaved: 0,
    byKeyword: {}
  };
  
  // Множество для отслеживания уникальных компаний (по ID)
  const seenIds = new Set();
  
  // Поиск по каждому ключевому слову
  for (const keyword of CONFIG.KEYWORDS) {
    log(`\nПоиск по ключевому слову: "${keyword}"`);
    stats.byKeyword[keyword] = 0;
    
    let currentPage = 1;
    let hasMorePages = true;
    
    while (hasMorePages && currentPage <= CONFIG.MAX_PAGES) {
      // Rate limiting
      await rateLimiter.wait();
      
      // Поиск
      const searchResults = await searchPlaces(keyword, currentPage);
      
      if (!searchResults.result || !searchResults.result.items) {
        log(`Нет результатов для "${keyword}" (страница ${currentPage})`, 'warning');
        break;
      }
      
      const items = searchResults.result.items;
      const total = searchResults.result.total || 0;
      
      log(`Страница ${currentPage}: найдено ${items.length} результатов (всего ${total})`);
      
      stats.totalSearched += items.length;
      
      // Обработка каждой компании
      for (const item of items) {
        const company = extractCompanyData(item);
        
        // Пропускаем дубликаты
        if (company.id && seenIds.has(company.id)) {
          continue;
        }
        
        // Проверка релевантности
        if (!isRelevantCompany(company)) {
          continue;
        }
        
        // Добавляем в множество уникальных
        if (company.id) {
          seenIds.add(company.id);
        }
        
        // Сохраняем в CSV
        await appendToCSV(filepath, [
          company.id,
          company.name,
          company.address,
          company.phone,
          company.phoneAll,
          company.website,
          company.email,
          company.category,
          company.coordinates,
          company.source
        ]);
        
        stats.totalSaved++;
        stats.byKeyword[keyword]++;
        
        log(`Сохранено: ${company.name}`, 'success');
      }
      
      // Проверяем есть ли ещё страницы
      const itemsOnPage = items.length;
      if (itemsOnPage < CONFIG.PAGE_SIZE) {
        hasMorePages = false;
      } else {
        currentPage++;
      }
      
      // Небольшая задержка между страницами
      if (hasMorePages) {
        await sleep(500);
      }
    }
  }
  
  // Итоговая статистика
  log('\n' + '='.repeat(60));
  log('ИТОГИ ПАРСИНГА', 'success');
  log('='.repeat(60));
  log(`Всего просмотрено компаний: ${stats.totalSearched}`);
  log(`Уникальных компаний найдено: ${seenIds.size}`);
  log(`Сохранено в CSV: ${stats.totalSaved}`);
  log(`Файл сохранён: ${filepath}`);
  
  log('\nСтатистика по ключевым словам:');
  Object.entries(stats.byKeyword)
    .sort((a, b) => b[1] - a[1])
    .forEach(([keyword, count]) => {
      if (count > 0) {
        log(`  "${keyword}": ${count} компаний`);
      }
    });
  
  log('\n' + '='.repeat(60));
  log('Парсинг завершён!', 'success');
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
