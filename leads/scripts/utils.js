/**
 * Утилиты для парсинга лидов
 * Общие функции для обработки данных, rate limiting, запись в CSV
 */

import { writeFile, appendFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Задержка выполнения (для rate limiting)
 * @param {number} ms - Миллисекунды задержки
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Логирование с временной меткой
 * @param {string} message - Сообщение для логирования
 * @param {string} level - Уровень: info, error, success
 */
export const log = (message, level = 'info') => {
  const timestamp = new Date().toLocaleString('ru-RU');
  const prefix = {
    info: '[INFO]',
    error: '[ERROR]',
    success: '[SUCCESS]',
    warning: '[WARNING]'
  }[level] || '[INFO]';
  
  console.log(`${timestamp} ${prefix} ${message}`);
};

/**
 * Создание CSV строки из массива значений
 * @param {Array} values - Массив значений
 * @returns {string} CSV строка
 */
export const createCSVRow = (values) => {
  return values
    .map(val => {
      if (val === null || val === undefined) return '';
      const str = String(val).replace(/"/g, '""'); // Экранирование кавычек
      return `"${str}"`;
    })
    .join(',') + '\n';
};

/**
 * Создание CSV файла с заголовками
 * @param {string} filepath - Путь к файлу
 * @param {Array} headers - Массив заголовков
 */
export const createCSVFile = async (filepath, headers) => {
  try {
    // Создаём директорию если не существует
    const dir = dirname(filepath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
      log(`Создана директория: ${dir}`);
    }
    
    // Записываем заголовки с BOM для корректного отображения кириллицы в Excel
    const BOM = '\uFEFF';
    await writeFile(filepath, BOM + createCSVRow(headers), 'utf8');
    log(`Создан файл: ${filepath}`);
  } catch (error) {
    log(`Ошибка создания файла ${filepath}: ${error.message}`, 'error');
    throw error;
  }
};

/**
 * Добавление строки в CSV файл
 * @param {string} filepath - Путь к файлу
 * @param {Array} values - Массив значений
 */
export const appendToCSV = async (filepath, values) => {
  try {
    await appendFile(filepath, createCSVRow(values), 'utf8');
  } catch (error) {
    log(`Ошибка записи в файл ${filepath}: ${error.message}`, 'error');
    throw error;
  }
};

/**
 * Безопасный HTTP запрос с повторными попытками
 * @param {string} url - URL для запроса
 * @param {Object} options - Опции fetch
 * @param {number} retries - Количество попыток
 * @returns {Promise<Response>}
 */
export const fetchWithRetry = async (url, options = {}, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'application/json',
          ...options.headers
        }
      });
      
      if (!response.ok && response.status !== 404) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // Экспоненциальная задержка
      log(`Ошибка запроса (попытка ${i + 1}/${retries}): ${error.message}. Повтор через ${delay}ms`, 'warning');
      await sleep(delay);
    }
  }
};

/**
 * Очистка текста от лишних символов
 * @param {string} text - Исходный текст
 * @returns {string} Очищенный текст
 */
export const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n/g, ' ')
    .trim();
};

/**
 * Форматирование телефонного номера
 * @param {string} phone - Телефон
 * @returns {string} Отформатированный телефон
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  // Убираем все кроме цифр и +
  return phone.replace(/[^\d+]/g, '');
};

/**
 * Извлечение email из текста
 * @param {string} text - Текст для поиска
 * @returns {string|null} Email или null
 */
export const extractEmail = (text) => {
  if (!text) return null;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : null;
};

/**
 * Rate limiter класс
 */
export class RateLimiter {
  constructor(requestsPerSecond = 1) {
    this.delay = 1000 / requestsPerSecond;
    this.lastRequest = 0;
  }
  
  async wait() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    
    if (timeSinceLastRequest < this.delay) {
      await sleep(this.delay - timeSinceLastRequest);
    }
    
    this.lastRequest = Date.now();
  }
}

/**
 * Получение пути к output директории
 * @returns {string} Абсолютный путь к директории output
 */
export const getOutputDir = () => {
  return join(dirname(dirname(__dirname)), 'leads', 'output');
};

/**
 * Генерация имени файла с датой
 * @param {string} prefix - Префикс имени файла
 * @param {string} extension - Расширение файла (по умолчанию csv)
 * @returns {string} Имя файла с датой
 */
export const generateFilename = (prefix, extension = 'csv') => {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  return `${prefix}_${date}_${time}.${extension}`;
};
