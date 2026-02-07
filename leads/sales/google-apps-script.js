/**
 * Google Apps Script — CRM для УМЦ Калуга
 *
 * Функционал:
 * 1. Прием заявок с сайта через doPost() вебхук
 * 2. Добавление лида в Google Sheet с временной меткой
 * 3. Автоматический расчет скоринга
 * 4. Отправка уведомлений в Telegram
 * 5. Цветовое кодирование строк по статусу
 * 6. Ежедневная утренняя сводка
 *
 * Установка:
 * 1. Откройте Google Таблицу → Расширения → Apps Script
 * 2. Вставьте этот код
 * 3. Развернуть → Новое развертывание → Веб-приложение
 * 4. Доступ: "Все" → Развернуть → Скопировать URL
 * 5. Настройте триггеры (sendDailySummary — ежедневно в 9:00)
 */

// ============================================
// КОНФИГУРАЦИЯ
// ============================================

const CONFIG = {
  // Telegram
  TELEGRAM_BOT_TOKEN: '8287804149:AAGKTuIr04l3Cgoay-iiI94VvMVIBri5zuw',
  TELEGRAM_CHAT_ID: '-1003435345833',

  // Названия листов
  SHEET_LEADS: 'Лиды',
  SHEET_DASHBOARD: 'Дашборд',

  // Столбцы (A=1, B=2, ... )
  COL: {
    ID: 1,           // A
    DATE: 2,         // B
    SOURCE: 3,       // C
    COMPANY: 4,      // D
    INN: 5,          // E
    CONTACT: 6,      // F
    POSITION: 7,     // G
    PHONE: 8,        // H
    EMAIL: 9,        // I
    CITY: 10,        // J
    PROGRAM: 11,     // K
    PEOPLE: 12,      // L
    FORMAT: 13,      // M
    DEADLINE: 14,    // N
    PRICE_PER: 15,   // O
    DISCOUNT: 16,    // P
    TOTAL: 17,       // Q
    SCORE_SIZE: 18,  // R
    SCORE_URG: 19,   // S
    SCORE_BUD: 20,   // T
    SCORE_DM: 21,    // U
    SCORE_TOTAL: 22, // V
    CATEGORY: 23,    // W
    STATUS: 24,      // X
    MANAGER: 25,     // Y
    NEXT_CONTACT: 26,// Z
    COMMENT: 27,     // AA
    REJECT_REASON: 28,// AB
    CLOSE_DATE: 29,  // AC
  },

  // Цены программ
  PRICES: {
    'Руководители': 3500,
    'Специалист ОТ': 5500,
    'Уполномоченный': 4000,
    'Пожарная': 3000,
    'Консультация': 2000,
    'Корпоративное': 0, // по запросу
  },

  // Контакты УМЦ
  UMC_PHONE: '8(4842)57-01-04',
  UMC_EMAIL: 'safety.ot@mail.ru',
};


// ============================================
// ВЕБХУК — ПРИЕМ ЗАЯВОК С САЙТА
// ============================================

/**
 * Обработчик POST-запросов (вебхук для формы сайта)
 *
 * Ожидаемый JSON:
 * {
 *   "name": "ФИО",
 *   "phone": "+74842570104",
 *   "email": "email@example.ru",
 *   "company": "ООО Компания",
 *   "program": "Руководители",
 *   "people_count": 15,
 *   "message": "Текст сообщения",
 *   "source": "website",
 *   "city": "Калуга",
 *   "position": "Директор",
 *   "inn": "1234567890"
 * }
 */
function doPost(e) {
  try {
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    let data;

    // Парсим данные — поддержка JSON и form-data
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('Нет данных в запросе');
    }

    // Добавляем лид в таблицу
    const leadId = addLeadToSheet(data);

    // Рассчитываем скоринг
    const score = calculateLeadScore(data);

    // Отправляем уведомление в Telegram
    sendNewLeadNotification(data, leadId, score);

    // Применяем цветовое кодирование
    applyRowFormatting();

    lock.releaseLock();

    // Возвращаем успешный ответ
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        lead_id: leadId,
        score: score.total,
        category: score.category,
        message: 'Заявка успешно принята'
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Ошибка обработки заявки:', error);

    // Уведомляем об ошибке в Telegram
    sendTelegramMessage(
      '⚠️ <b>ОШИБКА ОБРАБОТКИ ЗАЯВКИ</b>\n\n' +
      'Ошибка: ' + error.message + '\n' +
      'Данные: ' + (e.postData ? e.postData.contents : 'нет данных')
    );

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Обработчик GET-запросов (для тестирования)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'УМЦ Калуга CRM Webhook активен. Используйте POST для отправки заявок.',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}


// ============================================
// РАБОТА С ТАБЛИЦЕЙ
// ============================================

/**
 * Добавляет лид в Google Sheet
 * @param {Object} data — данные из формы
 * @returns {number} ID нового лида
 */
function addLeadToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_LEADS);

  if (!sheet) {
    throw new Error('Лист "' + CONFIG.SHEET_LEADS + '" не найден');
  }

  // Определяем следующий ID
  const lastRow = sheet.getLastRow();
  const newId = lastRow <= 1 ? 1 : lastRow; // Учитываем заголовок в строке 1

  // Определяем цену программы
  const program = data.program || '';
  const pricePerPerson = CONFIG.PRICES[program] || 0;
  const peopleCount = parseInt(data.people_count) || 0;

  // Рассчитываем скидку
  let discount = 0;
  if (peopleCount >= 20) {
    discount = 0.15;
  } else if (peopleCount >= 10) {
    discount = 0.10;
  }

  // Итоговая сумма
  const totalAmount = peopleCount * pricePerPerson * (1 - discount);

  // Рассчитываем скоринг
  const score = calculateLeadScore(data);

  // Формируем дату следующего контакта
  const now = new Date();
  let nextContact = new Date(now);
  if (score.total >= 8) {
    // HOT — через 1 час (но ставим сегодня)
    nextContact = now;
  } else if (score.total >= 5) {
    // WARM — сегодня
    nextContact = now;
  } else if (score.total >= 3) {
    // COOL — завтра
    nextContact.setDate(nextContact.getDate() + 1);
  } else {
    // COLD — через 3 дня
    nextContact.setDate(nextContact.getDate() + 3);
  }

  // Формируем строку данных
  const rowData = [];
  rowData[CONFIG.COL.ID - 1] = newId;
  rowData[CONFIG.COL.DATE - 1] = now;
  rowData[CONFIG.COL.SOURCE - 1] = mapSource(data.source || 'Сайт');
  rowData[CONFIG.COL.COMPANY - 1] = data.company || '';
  rowData[CONFIG.COL.INN - 1] = data.inn || '';
  rowData[CONFIG.COL.CONTACT - 1] = data.name || '';
  rowData[CONFIG.COL.POSITION - 1] = data.position || '';
  rowData[CONFIG.COL.PHONE - 1] = data.phone || '';
  rowData[CONFIG.COL.EMAIL - 1] = data.email || '';
  rowData[CONFIG.COL.CITY - 1] = data.city || 'Калуга';
  rowData[CONFIG.COL.PROGRAM - 1] = program;
  rowData[CONFIG.COL.PEOPLE - 1] = peopleCount;
  rowData[CONFIG.COL.FORMAT - 1] = data.format || '';
  rowData[CONFIG.COL.DEADLINE - 1] = data.deadline || data.message || '';
  rowData[CONFIG.COL.PRICE_PER - 1] = pricePerPerson;
  rowData[CONFIG.COL.DISCOUNT - 1] = discount;
  rowData[CONFIG.COL.TOTAL - 1] = totalAmount;
  rowData[CONFIG.COL.SCORE_SIZE - 1] = score.size;
  rowData[CONFIG.COL.SCORE_URG - 1] = score.urgency;
  rowData[CONFIG.COL.SCORE_BUD - 1] = score.budget;
  rowData[CONFIG.COL.SCORE_DM - 1] = score.dm;
  rowData[CONFIG.COL.SCORE_TOTAL - 1] = score.total;
  rowData[CONFIG.COL.CATEGORY - 1] = score.category;
  rowData[CONFIG.COL.STATUS - 1] = 'НОВЫЙ';
  rowData[CONFIG.COL.MANAGER - 1] = '';
  rowData[CONFIG.COL.NEXT_CONTACT - 1] = nextContact;
  rowData[CONFIG.COL.COMMENT - 1] = data.message || '';
  rowData[CONFIG.COL.REJECT_REASON - 1] = '';
  rowData[CONFIG.COL.CLOSE_DATE - 1] = '';

  // Добавляем строку
  sheet.appendRow(rowData);

  return newId;
}

/**
 * Маппинг источника на русский
 */
function mapSource(source) {
  const sourceMap = {
    'website': 'Сайт',
    'phone': 'Звонок',
    'email': 'Email',
    'referral': 'Рекомендация',
    'Сайт': 'Сайт',
    'Звонок': 'Звонок',
    'Email': 'Email',
    'Рекомендация': 'Рекомендация',
  };
  return sourceMap[source] || 'Другое';
}


// ============================================
// СКОРИНГ ЛИДОВ
// ============================================

/**
 * Рассчитывает скоринг лида
 * @param {Object} data — данные из формы
 * @returns {Object} { size, urgency, budget, dm, total, category }
 */
function calculateLeadScore(data) {
  const peopleCount = parseInt(data.people_count) || 0;
  const message = (data.message || '').toLowerCase();
  const position = (data.position || '').toLowerCase();
  const program = data.program || '';

  // 1. Размер компании (по количеству обучаемых как индикатор)
  let sizeScore = 3; // по умолчанию
  if (peopleCount >= 30) {
    sizeScore = 10;
  } else if (peopleCount >= 20) {
    sizeScore = 8;
  } else if (peopleCount >= 10) {
    sizeScore = 6;
  } else if (peopleCount >= 5) {
    sizeScore = 4;
  } else if (peopleCount >= 1) {
    sizeScore = 2;
  }

  // 2. Срочность (анализ текста сообщения)
  let urgencyScore = 4; // по умолчанию — средняя
  const urgentKeywords = ['срочно', 'предписание', 'проверка', 'гит', 'инспекция', 'штраф', 'несчастный случай', 'авария', 'немедленно', 'завтра'];
  const mediumKeywords = ['месяц', 'скоро', 'ближайшее время', 'быстрее', 'в этом месяце'];
  const lowKeywords = ['когда-нибудь', 'планируем', 'не срочно', 'на будущее', 'интересуемся', 'узнать цены'];

  for (const kw of urgentKeywords) {
    if (message.includes(kw)) {
      urgencyScore = 9;
      break;
    }
  }
  if (urgencyScore === 4) {
    for (const kw of mediumKeywords) {
      if (message.includes(kw)) {
        urgencyScore = 6;
        break;
      }
    }
  }
  if (urgencyScore === 4) {
    for (const kw of lowKeywords) {
      if (message.includes(kw)) {
        urgencyScore = 2;
        break;
      }
    }
  }

  // 3. Бюджет (косвенная оценка — по размеру группы и типу программы)
  let budgetScore = 5; // по умолчанию
  if (program === 'Корпоративное') {
    budgetScore = 8; // корпоративный — обычно с бюджетом
  } else if (peopleCount >= 15) {
    budgetScore = 7; // крупная группа — бюджет скорее есть
  } else if (peopleCount >= 5) {
    budgetScore = 5;
  } else if (peopleCount <= 2) {
    budgetScore = 3;
  }

  // 4. ЛПР (по должности)
  let dmScore = 4; // по умолчанию
  const dmHighKeywords = ['директор', 'генеральный', 'руководитель', 'зам', 'заместитель', 'главный инженер', 'владелец', 'собственник', 'учредитель'];
  const dmMediumKeywords = ['специалист от', 'охрана труда', 'инженер', 'hr', 'кадры', 'начальник отдела'];
  const dmLowKeywords = ['секретарь', 'помощник', 'стажер', 'студент'];

  for (const kw of dmHighKeywords) {
    if (position.includes(kw)) {
      dmScore = 9;
      break;
    }
  }
  if (dmScore === 4) {
    for (const kw of dmMediumKeywords) {
      if (position.includes(kw)) {
        dmScore = 6;
        break;
      }
    }
  }
  if (dmScore === 4) {
    for (const kw of dmLowKeywords) {
      if (position.includes(kw)) {
        dmScore = 2;
        break;
      }
    }
  }

  // Итоговый скоринг: (размер + срочность×1.5 + бюджет×1.3 + ЛПР×1.2) / 5
  const totalScore = Math.round(
    ((sizeScore + urgencyScore * 1.5 + budgetScore * 1.3 + dmScore * 1.2) / 5) * 10
  ) / 10;

  // Ограничиваем максимумом 10
  const cappedScore = Math.min(totalScore, 10);

  // Категория
  let category = 'COLD';
  if (cappedScore >= 8) {
    category = 'HOT';
  } else if (cappedScore >= 5) {
    category = 'WARM';
  } else if (cappedScore >= 3) {
    category = 'COOL';
  }

  return {
    size: sizeScore,
    urgency: urgencyScore,
    budget: budgetScore,
    dm: dmScore,
    total: cappedScore,
    category: category,
  };
}


// ============================================
// TELEGRAM УВЕДОМЛЕНИЯ
// ============================================

/**
 * Отправляет сообщение в Telegram
 * @param {string} text — текст сообщения (HTML)
 */
function sendTelegramMessage(text) {
  const url = 'https://api.telegram.org/bot' + CONFIG.TELEGRAM_BOT_TOKEN + '/sendMessage';

  const payload = {
    chat_id: CONFIG.TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());

    if (!result.ok) {
      console.error('Ошибка Telegram API:', result.description);
    }

    return result;
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
    return null;
  }
}

/**
 * Уведомление о новом лиде
 */
function sendNewLeadNotification(data, leadId, score) {
  const peopleCount = parseInt(data.people_count) || 0;
  const program = data.program || 'не указана';
  const pricePerPerson = CONFIG.PRICES[program] || 0;

  let discount = 0;
  if (peopleCount >= 20) discount = 0.15;
  else if (peopleCount >= 10) discount = 0.10;

  const totalAmount = peopleCount * pricePerPerson * (1 - discount);

  // Определяем иконку категории
  let categoryIcon = '⚪';
  let urgencyText = '';
  if (score.category === 'HOT') {
    categoryIcon = '🔴';
    urgencyText = '\n\n⏰ <b>Связаться в течение 1 часа!</b>';
  } else if (score.category === 'WARM') {
    categoryIcon = '🟡';
    urgencyText = '\n\n⏰ Связаться в течение 4 часов';
  } else if (score.category === 'COOL') {
    categoryIcon = '🔵';
    urgencyText = '\n\n⏰ Связаться в течение 24 часов';
  } else {
    categoryIcon = '⚪';
    urgencyText = '\n\nДобавить в прогрев';
  }

  // Формируем сообщение
  let message = '🔔 <b>НОВАЯ ЗАЯВКА С САЙТА</b>\n\n';
  message += '👤 <b>Имя:</b> ' + (data.name || 'не указано') + '\n';
  message += '📞 <b>Телефон:</b> ' + (data.phone || 'не указан') + '\n';

  if (data.email) {
    message += '📧 <b>Email:</b> ' + data.email + '\n';
  }
  if (data.company) {
    message += '🏢 <b>Компания:</b> ' + data.company + '\n';
  }
  if (data.position) {
    message += '💼 <b>Должность:</b> ' + data.position + '\n';
  }

  message += '\n';
  message += '📋 <b>Программа:</b> ' + program + '\n';

  if (peopleCount > 0) {
    message += '👥 <b>Кол-во человек:</b> ' + peopleCount + '\n';
  }

  if (data.message) {
    message += '💬 <b>Сообщение:</b> ' + data.message + '\n';
  }

  message += '\n';
  message += categoryIcon + ' <b>Оценка:</b> ' + score.category + ' (' + score.total + ' баллов)\n';

  if (totalAmount > 0) {
    message += '💰 <b>Предв. сумма:</b> ' + formatCurrency(totalAmount);
    if (discount > 0) {
      message += ' (скидка ' + (discount * 100) + '%)';
    }
    message += '\n';
  }

  message += urgencyText;

  sendTelegramMessage(message);
}

/**
 * Ежедневная утренняя сводка
 * Настроить триггер: Triggers → Add Trigger → sendDailySummary → Time-driven → Day timer → 9:00-10:00
 */
function sendDailySummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_LEADS);

  if (!sheet || sheet.getLastRow() <= 1) {
    sendTelegramMessage('📊 <b>УТРЕННЯЯ СВОДКА</b>\n\nНет данных в таблице.');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1); // без заголовка

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Считаем метрики
  let newYesterday = 0;
  let needCallToday = 0;
  let overdue = 0;
  let pipelineCount = 0;
  let pipelineValue = 0;
  let closedMonthCount = 0;
  let closedMonthValue = 0;
  let totalLeadsMonth = 0;

  for (const row of rows) {
    const leadDate = row[CONFIG.COL.DATE - 1];
    const status = row[CONFIG.COL.STATUS - 1];
    const nextContact = row[CONFIG.COL.NEXT_CONTACT - 1];
    const total = parseFloat(row[CONFIG.COL.TOTAL - 1]) || 0;
    const closeDate = row[CONFIG.COL.CLOSE_DATE - 1];

    // Новые вчера
    if (leadDate instanceof Date) {
      const ld = new Date(leadDate);
      ld.setHours(0, 0, 0, 0);
      if (ld.getTime() === yesterday.getTime()) {
        newYesterday++;
      }
      if (ld >= monthStart) {
        totalLeadsMonth++;
      }
    }

    // Нужно позвонить сегодня
    if (nextContact instanceof Date && status !== 'СДЕЛКА' && status !== 'ОТКАЗ') {
      const nc = new Date(nextContact);
      nc.setHours(0, 0, 0, 0);
      if (nc.getTime() === today.getTime()) {
        needCallToday++;
      }
      // Просрочено
      if (nc < today) {
        overdue++;
      }
    }

    // Пайплайн (не сделка, не отказ)
    if (status !== 'СДЕЛКА' && status !== 'ОТКАЗ' && status !== 'ОТЛОЖЕН' && status !== '') {
      pipelineCount++;
      pipelineValue += total;
    }

    // Закрыто за месяц
    if (status === 'СДЕЛКА') {
      if (closeDate instanceof Date && closeDate >= monthStart) {
        closedMonthCount++;
        closedMonthValue += total;
      } else if (leadDate instanceof Date && leadDate >= monthStart) {
        // Если дата закрытия не заполнена, используем дату лида
        closedMonthCount++;
        closedMonthValue += total;
      }
    }
  }

  // Формируем сообщение
  const dateStr = Utilities.formatDate(today, 'Europe/Moscow', 'dd.MM.yyyy');
  let message = '📊 <b>УТРЕННЯЯ СВОДКА ' + dateStr + '</b>\n\n';

  message += '📩 Новых заявок вчера: <b>' + newYesterday + '</b>\n';
  message += '📞 Требуют звонка сегодня: <b>' + needCallToday + '</b>\n';

  if (overdue > 0) {
    message += '⚠️ Просрочено: <b>' + overdue + '</b> — ТРЕБУЮТ ВНИМАНИЯ!\n';
  } else {
    message += '✅ Просроченных контактов нет\n';
  }

  message += '\n';
  message += '📈 В пайплайне: <b>' + pipelineCount + '</b> сделок на <b>' + formatCurrency(pipelineValue) + '</b>\n';
  message += '💰 Закрыто за месяц: <b>' + closedMonthCount + '</b> на <b>' + formatCurrency(closedMonthValue) + '</b>\n';
  message += '📊 Всего лидов за месяц: <b>' + totalLeadsMonth + '</b>\n';

  if (totalLeadsMonth > 0 && closedMonthCount > 0) {
    const conversion = Math.round((closedMonthCount / totalLeadsMonth) * 100);
    message += '🎯 Конверсия: <b>' + conversion + '%</b>';
  }

  sendTelegramMessage(message);
}


// ============================================
// ЦВЕТОВОЕ КОДИРОВАНИЕ
// ============================================

/**
 * Применяет цветовое кодирование ко всем строкам
 * Вызывается автоматически при добавлении лида и может быть вызвана вручную
 */
function applyRowFormatting() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_LEADS);

  if (!sheet || sheet.getLastRow() <= 1) return;

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();

  // Получаем данные категорий и статусов
  const categories = sheet.getRange(2, CONFIG.COL.CATEGORY, lastRow - 1, 1).getValues();
  const statuses = sheet.getRange(2, CONFIG.COL.STATUS, lastRow - 1, 1).getValues();
  const nextContacts = sheet.getRange(2, CONFIG.COL.NEXT_CONTACT, lastRow - 1, 1).getValues();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Цвета категорий
  const categoryColors = {
    'HOT': '#FFCDD2',    // светло-красный
    'WARM': '#FFF9C4',   // светло-желтый
    'COOL': '#BBDEFB',   // светло-синий
    'COLD': '#E0E0E0',   // серый
  };

  // Применяем форматирование строка за строкой
  for (let i = 0; i < categories.length; i++) {
    const rowNum = i + 2; // +2 потому что данные начинаются со строки 2
    const category = categories[i][0];
    const status = statuses[i][0];
    const nextContact = nextContacts[i][0];

    const range = sheet.getRange(rowNum, 1, 1, lastCol);

    // Приоритет 1: Статус СДЕЛКА — зеленый
    if (status === 'СДЕЛКА') {
      range.setBackground('#C8E6C9');
      range.setFontLine('none');
      continue;
    }

    // Приоритет 2: Статус ОТКАЗ — красный, зачеркнутый
    if (status === 'ОТКАЗ') {
      range.setBackground('#FFCDD2');
      range.setFontLine('line-through');
      continue;
    }

    // Приоритет 3: Просроченный контакт — яркий красный фон
    if (nextContact instanceof Date) {
      const nc = new Date(nextContact);
      nc.setHours(0, 0, 0, 0);
      if (nc < today) {
        range.setBackground('#FF8A80');
        range.setFontLine('none');
        continue;
      }
    }

    // Приоритет 4: По категории скоринга
    const bgColor = categoryColors[category] || '#FFFFFF';
    range.setBackground(bgColor);
    range.setFontLine('none');
  }
}

/**
 * Обработчик изменения ячейки — для автообновления форматирования при ручном изменении статуса
 * Устанавливается как триггер onEdit
 */
function onEdit(e) {
  const sheet = e.source.getActiveSheet();

  if (sheet.getName() !== CONFIG.SHEET_LEADS) return;

  const editedCol = e.range.getColumn();
  const editedRow = e.range.getRow();

  // Если изменен статус (столбец X = 24)
  if (editedCol === CONFIG.COL.STATUS) {
    const newStatus = e.value;
    const lastCol = sheet.getLastColumn();
    const range = sheet.getRange(editedRow, 1, 1, lastCol);
    const category = sheet.getRange(editedRow, CONFIG.COL.CATEGORY).getValue();

    if (newStatus === 'СДЕЛКА') {
      range.setBackground('#C8E6C9');
      range.setFontLine('none');
      // Устанавливаем дату закрытия
      sheet.getRange(editedRow, CONFIG.COL.CLOSE_DATE).setValue(new Date());

      // Уведомление в Telegram о закрытии сделки
      const company = sheet.getRange(editedRow, CONFIG.COL.COMPANY).getValue();
      const program = sheet.getRange(editedRow, CONFIG.COL.PROGRAM).getValue();
      const people = sheet.getRange(editedRow, CONFIG.COL.PEOPLE).getValue();
      const total = sheet.getRange(editedRow, CONFIG.COL.TOTAL).getValue();
      const manager = sheet.getRange(editedRow, CONFIG.COL.MANAGER).getValue();

      // Считаем общую выручку за месяц
      const monthRevenue = calculateMonthRevenue(sheet);

      let msg = '✅ <b>СДЕЛКА ЗАКРЫТА!</b>\n\n';
      msg += '🏢 <b>Компания:</b> ' + (company || 'не указана') + '\n';
      msg += '📋 <b>Программа:</b> ' + (program || 'не указана') + '\n';
      msg += '👥 <b>Человек:</b> ' + (people || '—') + '\n';
      msg += '💰 <b>Сумма:</b> ' + formatCurrency(total) + '\n';
      if (manager) {
        msg += '👤 <b>Менеджер:</b> ' + manager + '\n';
      }
      msg += '\n📊 Общая выручка за месяц: <b>' + formatCurrency(monthRevenue) + '</b>';

      sendTelegramMessage(msg);

    } else if (newStatus === 'ОТКАЗ') {
      range.setBackground('#FFCDD2');
      range.setFontLine('line-through');
      sheet.getRange(editedRow, CONFIG.COL.CLOSE_DATE).setValue(new Date());

    } else {
      // Возвращаем цвет по категории
      const categoryColors = {
        'HOT': '#FFCDD2',
        'WARM': '#FFF9C4',
        'COOL': '#BBDEFB',
        'COLD': '#E0E0E0',
      };
      range.setBackground(categoryColors[category] || '#FFFFFF');
      range.setFontLine('none');
    }
  }

  // Если изменен один из скорингов (столбцы R-U = 18-21) — пересчитать итог
  if (editedCol >= CONFIG.COL.SCORE_SIZE && editedCol <= CONFIG.COL.SCORE_DM) {
    recalculateScore(sheet, editedRow);
  }
}

/**
 * Пересчитывает итоговый скоринг для строки
 */
function recalculateScore(sheet, row) {
  const sizeScore = parseFloat(sheet.getRange(row, CONFIG.COL.SCORE_SIZE).getValue()) || 0;
  const urgScore = parseFloat(sheet.getRange(row, CONFIG.COL.SCORE_URG).getValue()) || 0;
  const budScore = parseFloat(sheet.getRange(row, CONFIG.COL.SCORE_BUD).getValue()) || 0;
  const dmScore = parseFloat(sheet.getRange(row, CONFIG.COL.SCORE_DM).getValue()) || 0;

  const total = Math.min(
    Math.round(((sizeScore + urgScore * 1.5 + budScore * 1.3 + dmScore * 1.2) / 5) * 10) / 10,
    10
  );

  let category = 'COLD';
  if (total >= 8) category = 'HOT';
  else if (total >= 5) category = 'WARM';
  else if (total >= 3) category = 'COOL';

  sheet.getRange(row, CONFIG.COL.SCORE_TOTAL).setValue(total);
  sheet.getRange(row, CONFIG.COL.CATEGORY).setValue(category);
}

/**
 * Считает выручку за текущий месяц
 */
function calculateMonthRevenue(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 0;

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const statuses = sheet.getRange(2, CONFIG.COL.STATUS, lastRow - 1, 1).getValues();
  const totals = sheet.getRange(2, CONFIG.COL.TOTAL, lastRow - 1, 1).getValues();
  const closeDates = sheet.getRange(2, CONFIG.COL.CLOSE_DATE, lastRow - 1, 1).getValues();
  const leadDates = sheet.getRange(2, CONFIG.COL.DATE, lastRow - 1, 1).getValues();

  let revenue = 0;
  for (let i = 0; i < statuses.length; i++) {
    if (statuses[i][0] === 'СДЕЛКА') {
      const closeDate = closeDates[i][0];
      const leadDate = leadDates[i][0];
      const dateToCheck = (closeDate instanceof Date) ? closeDate : leadDate;

      if (dateToCheck instanceof Date && dateToCheck >= monthStart) {
        revenue += parseFloat(totals[i][0]) || 0;
      }
    }
  }
  return revenue;
}


// ============================================
// УТИЛИТЫ
// ============================================

/**
 * Форматирует число как валюту (₽)
 */
function formatCurrency(amount) {
  if (!amount || isNaN(amount)) return '0₽';
  return Math.round(amount).toLocaleString('ru-RU') + '₽';
}


// ============================================
// РУЧНЫЕ ФУНКЦИИ (запуск из меню Apps Script)
// ============================================

/**
 * Создает структуру таблицы с заголовками
 * Запустите эту функцию один раз при первичной настройке
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Создаем лист "Лиды" если нет
  let leadsSheet = ss.getSheetByName(CONFIG.SHEET_LEADS);
  if (!leadsSheet) {
    leadsSheet = ss.insertSheet(CONFIG.SHEET_LEADS);
  }

  // Заголовки
  const headers = [
    'ID', 'Дата заявки', 'Источник', 'Компания', 'ИНН',
    'Контактное лицо', 'Должность', 'Телефон', 'Email', 'Город',
    'Программа', 'Кол-во чел.', 'Формат', 'Желаемые сроки', 'Цена за чел.',
    'Скидка %', 'Итого сумма', 'Скор. размер', 'Скор. срочность', 'Скор. бюджет',
    'Скор. ЛПР', 'Итого скоринг', 'Категория', 'Статус', 'Менеджер',
    'След. контакт', 'Комментарий', 'Причина отказа', 'Дата закрытия'
  ];

  const headerRange = leadsSheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#4285F4');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setHorizontalAlignment('center');

  // Фиксируем первую строку
  leadsSheet.setFrozenRows(1);

  // Настраиваем ширину ключевых столбцов
  leadsSheet.setColumnWidth(CONFIG.COL.DATE, 150);
  leadsSheet.setColumnWidth(CONFIG.COL.COMPANY, 200);
  leadsSheet.setColumnWidth(CONFIG.COL.CONTACT, 180);
  leadsSheet.setColumnWidth(CONFIG.COL.PHONE, 150);
  leadsSheet.setColumnWidth(CONFIG.COL.PROGRAM, 140);
  leadsSheet.setColumnWidth(CONFIG.COL.COMMENT, 250);

  // Добавляем валидацию данных (выпадающие списки)
  const lastDataRow = 500; // на 500 строк вперед

  // Источник
  const sourceRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Сайт', 'Звонок', 'Email', 'Рекомендация', 'Другое'])
    .setAllowInvalid(false)
    .build();
  leadsSheet.getRange(2, CONFIG.COL.SOURCE, lastDataRow, 1).setDataValidation(sourceRule);

  // Программа
  const programRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Руководители', 'Специалист ОТ', 'Уполномоченный', 'Пожарная', 'Корпоративное', 'Консультация'])
    .setAllowInvalid(false)
    .build();
  leadsSheet.getRange(2, CONFIG.COL.PROGRAM, lastDataRow, 1).setDataValidation(programRule);

  // Формат
  const formatRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Очно', 'Дистанционно', 'Выездное'])
    .setAllowInvalid(false)
    .build();
  leadsSheet.getRange(2, CONFIG.COL.FORMAT, lastDataRow, 1).setDataValidation(formatRule);

  // Статус
  const statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['НОВЫЙ', 'КОНТАКТ', 'КВАЛИФИКАЦИЯ', 'КП', 'ПЕРЕГОВОРЫ', 'СДЕЛКА', 'ОТКАЗ', 'ОТЛОЖЕН'])
    .setAllowInvalid(false)
    .build();
  leadsSheet.getRange(2, CONFIG.COL.STATUS, lastDataRow, 1).setDataValidation(statusRule);

  // Формат столбцов
  leadsSheet.getRange(2, CONFIG.COL.DATE, lastDataRow, 1).setNumberFormat('dd.MM.yyyy HH:mm');
  leadsSheet.getRange(2, CONFIG.COL.DISCOUNT, lastDataRow, 1).setNumberFormat('0%');
  leadsSheet.getRange(2, CONFIG.COL.PRICE_PER, lastDataRow, 1).setNumberFormat('#,##0 ₽');
  leadsSheet.getRange(2, CONFIG.COL.TOTAL, lastDataRow, 1).setNumberFormat('#,##0 ₽');
  leadsSheet.getRange(2, CONFIG.COL.NEXT_CONTACT, lastDataRow, 1).setNumberFormat('dd.MM.yyyy');
  leadsSheet.getRange(2, CONFIG.COL.CLOSE_DATE, lastDataRow, 1).setNumberFormat('dd.MM.yyyy');

  // Создаем лист "Дашборд" если нет
  let dashSheet = ss.getSheetByName(CONFIG.SHEET_DASHBOARD);
  if (!dashSheet) {
    dashSheet = ss.insertSheet(CONFIG.SHEET_DASHBOARD);
  }

  // Базовая структура дашборда
  dashSheet.getRange('A1').setValue('ВОРОНКА ПРОДАЖ').setFontWeight('bold').setFontSize(14);
  dashSheet.getRange('A2').setValue('Всего лидов (месяц):');
  dashSheet.getRange('A3').setValue('Новые:');
  dashSheet.getRange('A4').setValue('Контакт:');
  dashSheet.getRange('A5').setValue('Квалификация:');
  dashSheet.getRange('A6').setValue('КП отправлено:');
  dashSheet.getRange('A7').setValue('Переговоры:');
  dashSheet.getRange('A8').setValue('Сделка:');
  dashSheet.getRange('A9').setValue('Отказ:');

  dashSheet.getRange('D1').setValue('КЛЮЧЕВЫЕ МЕТРИКИ').setFontWeight('bold').setFontSize(14);
  dashSheet.getRange('D2').setValue('Конверсия лид→сделка:');
  dashSheet.getRange('D3').setValue('Средний чек:');
  dashSheet.getRange('D4').setValue('Общая выручка (месяц):');
  dashSheet.getRange('D5').setValue('Стоимость пайплайна:');
  dashSheet.getRange('D6').setValue('Просроченные контакты:');

  SpreadsheetApp.flush();

  // Уведомление об успешной настройке
  sendTelegramMessage(
    '✅ <b>CRM НАСТРОЕНА</b>\n\n' +
    'Таблица "УМЦ Калуга — CRM Лиды" готова к работе.\n' +
    'Вебхук активен, уведомления подключены.'
  );

  console.log('Таблица настроена успешно!');
}

/**
 * Тестовая функция — добавляет тестовый лид
 */
function testAddLead() {
  const testData = {
    name: 'Иванов Иван Иванович',
    phone: '+74842570104',
    email: 'ivanov@testcompany.ru',
    company: 'ООО "Тестовая Компания"',
    position: 'Директор',
    program: 'Руководители',
    people_count: '15',
    message: 'Нужно срочно обучить сотрудников, предписание ГИТ',
    source: 'website',
    city: 'Калуга',
  };

  const leadId = addLeadToSheet(testData);
  const score = calculateLeadScore(testData);
  sendNewLeadNotification(testData, leadId, score);
  applyRowFormatting();

  console.log('Тестовый лид добавлен. ID: ' + leadId + ', Скоринг: ' + score.total + ' (' + score.category + ')');
}

/**
 * Тестовая функция — отправка ежедневной сводки
 */
function testDailySummary() {
  sendDailySummary();
  console.log('Ежедневная сводка отправлена.');
}

/**
 * Пересчитывает форматирование для всех строк (запуск вручную)
 */
function refreshFormatting() {
  applyRowFormatting();
  console.log('Форматирование обновлено.');
}
