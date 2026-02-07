/**
 * Telegram-бот квалификации лидов для УМЦ Калуга
 * @Safety_OT_bot
 *
 * Запуск:
 *   npm install (из директории с tg-bot-package.json, переименовав его в package.json)
 *   node tg-bot.js
 *
 * Или:
 *   cp tg-bot-package.json package.json && npm install && npm start
 */

const TelegramBot = require('node-telegram-bot-api');

// ─── Конфигурация ────────────────────────────────────────────────────────────

const BOT_TOKEN = '8287804149:AAGKTuIr04l3Cgoay-iiI94VvMVIBri5zuw';
const ADMIN_CHAT_ID = '-1003435345833';

// ─── Данные о программах ─────────────────────────────────────────────────────

const PROGRAMS = {
  leaders: {
    name: 'Охрана труда для руководителей',
    shortName: 'Руководители',
    duration: '16-32 часа',
    price: 'от 3 500 руб.',
    description:
      'Программа для руководителей организаций и подразделений. ' +
      'Включает требования законодательства, организацию системы управления ОТ, ' +
      'оценку профрисков, расследование несчастных случаев.',
  },
  specialist: {
    name: 'Специалист по охране труда',
    shortName: 'Специалист ОТ',
    duration: '40-72 часа',
    price: 'от 5 500 руб.',
    description:
      'Углублённая программа для специалистов и инженеров по ОТ. ' +
      'Полный курс по всем направлениям охраны труда с практическими заданиями и итоговой аттестацией.',
  },
  authorized: {
    name: 'Уполномоченный по охране труда',
    shortName: 'Уполномоченный',
    duration: '24 часа',
    price: 'от 4 000 руб.',
    description:
      'Обучение уполномоченных (доверенных) лиц по охране труда от профсоюза или трудового коллектива. ' +
      'Права, обязанности, порядок контроля.',
  },
  fire: {
    name: 'Пожарная безопасность',
    shortName: 'Пожарная безопасность',
    duration: '16 часов',
    price: 'от 3 000 руб.',
    description:
      'Пожарно-технический минимум и дополнительные программы по пожарной безопасности. ' +
      'Для ответственных лиц и работников организаций.',
  },
  corporate: {
    name: 'Корпоративное обучение',
    shortName: 'Корпоративное',
    duration: 'гибкий формат',
    price: 'по запросу',
    description:
      'Индивидуальная программа под задачи вашей организации. ' +
      'Выезд преподавателя, адаптация материалов, удобный график. Скидки при групповом обучении.',
  },
  consultation: {
    name: 'Консультация по охране труда',
    shortName: 'Консультация',
    duration: '2-4 часа',
    price: 'от 2 000 руб.',
    description:
      'Экспресс-консультация по вопросам охраны труда: аудит документации, ' +
      'подготовка к проверкам ГИТ, разбор конкретных ситуаций.',
  },
};

const PROGRAM_KEYS = Object.keys(PROGRAMS);

// ─── Контактная информация ───────────────────────────────────────────────────

const CONTACTS = {
  phone: '8 (4842) 57-01-04',
  email: 'safety.ot@mail.ru',
  address: 'г. Калуга, ул. Ленина 81, оф. 504',
  workHours: 'Пн-Пт: 9:00 - 18:00',
};

// ─── Этапы квалификации ──────────────────────────────────────────────────────

const STEPS = {
  IDLE: 'idle',
  ASK_COMPANY: 'ask_company',
  ASK_ROLE: 'ask_role',
  ASK_EMPLOYEES: 'ask_employees',
  ASK_PROGRAM: 'ask_program',
  ASK_URGENCY: 'ask_urgency',
  DONE: 'done',
};

// ─── Хранилище состояний (in-memory) ────────────────────────────────────────

const sessions = new Map();

function getSession(chatId) {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, {
      step: STEPS.IDLE,
      data: {},
      startedAt: null,
    });
  }
  return sessions.get(chatId);
}

function resetSession(chatId) {
  sessions.set(chatId, {
    step: STEPS.IDLE,
    data: {},
    startedAt: null,
  });
}

// ─── Инициализация бота ──────────────────────────────────────────────────────

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('UMC Kaluga Bot (@Safety_OT_bot) запущен...');

// ─── Утилиты ─────────────────────────────────────────────────────────────────

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function userLabel(msg) {
  const u = msg.from;
  const parts = [];
  if (u.first_name) parts.push(u.first_name);
  if (u.last_name) parts.push(u.last_name);
  const name = parts.join(' ') || 'Без имени';
  const username = u.username ? ` (@${u.username})` : '';
  return `${name}${username}`;
}

// ─── /start ──────────────────────────────────────────────────────────────────

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  resetSession(chatId);

  const welcome =
    `Здравствуйте! Добро пожаловать в <b>УМЦ Калуга</b> -- ваш надёжный партнёр ` +
    `в сфере обучения по охране труда и промышленной безопасности.\n\n` +
    `Я помогу вам:\n` +
    `-- подобрать подходящую программу обучения\n` +
    `-- рассчитать стоимость\n` +
    `-- связать с нашими специалистами\n\n` +
    `Выберите действие:`;

  bot.sendMessage(chatId, welcome, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Подобрать программу', callback_data: 'qualify_start' }],
        [{ text: 'Наши программы', callback_data: 'cmd_programs' }],
        [{ text: 'Цены', callback_data: 'cmd_price' }],
        [{ text: 'Контакты', callback_data: 'cmd_contacts' }],
      ],
    },
  });
});

// ─── /programs ───────────────────────────────────────────────────────────────

bot.onText(/\/programs/, (msg) => {
  sendProgramsList(msg.chat.id);
});

function sendProgramsList(chatId) {
  let text = '<b>Программы обучения УМЦ Калуга</b>\n\n';

  for (const key of PROGRAM_KEYS) {
    const p = PROGRAMS[key];
    text += `<b>${p.name}</b>\n`;
    text += `Длительность: ${p.duration}\n`;
    text += `Стоимость: ${p.price}\n`;
    text += `${p.description}\n\n`;
  }

  text +=
    `Для подбора оптимальной программы нажмите кнопку ниже ` +
    `или напишите /start.`;

  bot.sendMessage(chatId, text, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Подобрать программу', callback_data: 'qualify_start' }],
        [{ text: 'Узнать цены', callback_data: 'cmd_price' }],
      ],
    },
  });
}

// ─── /contacts ───────────────────────────────────────────────────────────────

bot.onText(/\/contacts/, (msg) => {
  sendContacts(msg.chat.id);
});

function sendContacts(chatId) {
  const text =
    `<b>Контакты УМЦ Калуга</b>\n\n` +
    `Телефон: ${CONTACTS.phone}\n` +
    `Email: ${CONTACTS.email}\n` +
    `Адрес: ${CONTACTS.address}\n` +
    `Время работы: ${CONTACTS.workHours}\n\n` +
    `Мы всегда рады помочь с подбором программы обучения!`;

  bot.sendMessage(chatId, text, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Подобрать программу', callback_data: 'qualify_start' }],
        [
          {
            text: 'Позвонить',
            url: 'tel:+74842570104',
          },
          {
            text: 'Написать на email',
            url: 'mailto:safety.ot@mail.ru',
          },
        ],
      ],
    },
  });
}

// ─── /price ──────────────────────────────────────────────────────────────────

bot.onText(/\/price/, (msg) => {
  sendPrice(msg.chat.id);
});

function sendPrice(chatId) {
  let text =
    `<b>Стоимость обучения в УМЦ Калуга</b>\n\n` +
    `Ориентировочные цены (за 1 слушателя):\n\n`;

  const priceLines = [
    ['Руководители (16-32 ч)', 'от 3 500 руб.'],
    ['Специалист ОТ (40-72 ч)', 'от 5 500 руб.'],
    ['Уполномоченный (24 ч)', 'от 4 000 руб.'],
    ['Пожарная безопасность (16 ч)', 'от 3 000 руб.'],
    ['Корпоративное обучение', 'по запросу'],
    ['Консультация (2-4 ч)', 'от 2 000 руб.'],
  ];

  for (const [name, price] of priceLines) {
    text += `  ${name} -- <b>${price}</b>\n`;
  }

  text +=
    `\n<b>Скидки:</b>\n` +
    `  -- от 5 человек: скидка 5%\n` +
    `  -- от 10 человек: скидка 10%\n` +
    `  -- от 20 человек: индивидуальные условия\n\n` +
    `Точную стоимость рассчитаем после уточнения деталей.`;

  bot.sendMessage(chatId, text, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Рассчитать для нашей компании', callback_data: 'qualify_start' }],
        [{ text: 'Связаться с менеджером', callback_data: 'cmd_contacts' }],
      ],
    },
  });
}

// ─── Обработка inline-кнопок ─────────────────────────────────────────────────

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Подтверждаем нажатие кнопки
  bot.answerCallbackQuery(query.id);

  // Команды-меню
  if (data === 'cmd_programs') {
    sendProgramsList(chatId);
    return;
  }
  if (data === 'cmd_price') {
    sendPrice(chatId);
    return;
  }
  if (data === 'cmd_contacts') {
    sendContacts(chatId);
    return;
  }

  // Начало квалификации
  if (data === 'qualify_start') {
    startQualification(chatId, query.message);
    return;
  }

  // Отмена
  if (data === 'qualify_cancel') {
    resetSession(chatId);
    bot.sendMessage(
      chatId,
      'Квалификация отменена. Если захотите вернуться -- напишите /start.',
      { parse_mode: 'HTML' }
    );
    return;
  }

  // Ответы в рамках квалификации
  const session = getSession(chatId);

  // Выбор роли
  if (data.startsWith('role_') && session.step === STEPS.ASK_ROLE) {
    const roleMap = {
      role_ceo: 'Руководитель / Директор',
      role_hr: 'HR / Кадры',
      role_safety: 'Специалист по ОТ',
      role_union: 'Представитель профсоюза',
      role_other: 'Другое',
    };
    session.data.role = roleMap[data] || data;
    askEmployees(chatId);
    return;
  }

  // Выбор программы
  if (data.startsWith('prog_') && session.step === STEPS.ASK_PROGRAM) {
    const key = data.replace('prog_', '');
    if (PROGRAMS[key]) {
      session.data.program = PROGRAMS[key].shortName;
      session.data.programKey = key;
      sendProgramInfo(chatId, key);
      askUrgency(chatId);
    }
    return;
  }

  // Выбор программы «не знаю»
  if (data === 'prog_unknown' && session.step === STEPS.ASK_PROGRAM) {
    session.data.program = 'Нужна консультация по выбору';
    session.data.programKey = null;
    askUrgency(chatId);
    return;
  }

  // Выбор срочности
  if (data.startsWith('urgency_') && session.step === STEPS.ASK_URGENCY) {
    const urgencyMap = {
      urgency_month: 'В этом месяце',
      urgency_quarter: 'В этом квартале',
      urgency_exploring: 'Пока изучаю варианты',
    };
    session.data.urgency = urgencyMap[data] || data;
    finishQualification(chatId, query.message);
    return;
  }
});

// ─── Квалификация: шаг 1 -- Компания ────────────────────────────────────────

function startQualification(chatId, msg) {
  const session = getSession(chatId);
  session.step = STEPS.ASK_COMPANY;
  session.startedAt = new Date();
  session.data = {};

  // Сохраняем данные пользователя
  if (msg && msg.chat) {
    session.data.userId = msg.chat.id;
  }

  bot.sendMessage(
    chatId,
    `Отлично! Давайте подберём для вас оптимальное решение.\n\n` +
      `Для начала, напишите <b>название вашей организации</b>:`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Отмена', callback_data: 'qualify_cancel' }],
        ],
      },
    }
  );
}

// ─── Квалификация: шаг 2 -- Роль ────────────────────────────────────────────

function askRole(chatId) {
  const session = getSession(chatId);
  session.step = STEPS.ASK_ROLE;

  bot.sendMessage(chatId, `Какова ваша роль в организации?`, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Руководитель', callback_data: 'role_ceo' },
          { text: 'HR / Кадры', callback_data: 'role_hr' },
        ],
        [
          { text: 'Специалист по ОТ', callback_data: 'role_safety' },
          { text: 'Профсоюз', callback_data: 'role_union' },
        ],
        [{ text: 'Другое', callback_data: 'role_other' }],
        [{ text: 'Отмена', callback_data: 'qualify_cancel' }],
      ],
    },
  });
}

// ─── Квалификация: шаг 3 -- Количество сотрудников ──────────────────────────

function askEmployees(chatId) {
  const session = getSession(chatId);
  session.step = STEPS.ASK_EMPLOYEES;

  bot.sendMessage(
    chatId,
    `Сколько сотрудников планируете обучить?\n\n` +
      `Напишите примерное количество (число):`,
    {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Отмена', callback_data: 'qualify_cancel' }],
        ],
      },
    }
  );
}

// ─── Квалификация: шаг 4 -- Программа ───────────────────────────────────────

function askProgram(chatId) {
  const session = getSession(chatId);
  session.step = STEPS.ASK_PROGRAM;

  const keyboard = [
    [
      { text: 'Руководители', callback_data: 'prog_leaders' },
      { text: 'Специалист ОТ', callback_data: 'prog_specialist' },
    ],
    [
      { text: 'Уполномоченный', callback_data: 'prog_authorized' },
      { text: 'Пожарная безопасность', callback_data: 'prog_fire' },
    ],
    [
      { text: 'Корпоративное', callback_data: 'prog_corporate' },
      { text: 'Консультация', callback_data: 'prog_consultation' },
    ],
    [{ text: 'Не знаю, нужна помощь', callback_data: 'prog_unknown' }],
    [{ text: 'Отмена', callback_data: 'qualify_cancel' }],
  ];

  // Персонализированная подсказка на основе роли
  let hint = '';
  const role = session.data.role || '';
  if (role.includes('Руководитель')) {
    hint = '\n\nРуководителям чаще всего подходит программа "Руководители" (16-32 ч).';
  } else if (role.includes('Специалист')) {
    hint = '\n\nДля специалистов по ОТ рекомендуем программу "Специалист ОТ" (40-72 ч).';
  } else if (role.includes('Профсоюз') || role.includes('профсоюз')) {
    hint =
      '\n\nДля представителей профсоюза подойдёт программа "Уполномоченный" (24 ч).';
  }

  bot.sendMessage(
    chatId,
    `Какая программа обучения вас интересует?${hint}`,
    {
      parse_mode: 'HTML',
      reply_markup: { inline_keyboard: keyboard },
    }
  );
}

// ─── Отправка краткой информации о выбранной программе ───────────────────────

function sendProgramInfo(chatId, programKey) {
  const p = PROGRAMS[programKey];
  if (!p) return;

  bot.sendMessage(
    chatId,
    `<b>${p.name}</b>\n` +
      `Длительность: ${p.duration}\n` +
      `Стоимость: ${p.price}\n\n` +
      `${p.description}`,
    { parse_mode: 'HTML' }
  );
}

// ─── Квалификация: шаг 5 -- Срочность ───────────────────────────────────────

function askUrgency(chatId) {
  const session = getSession(chatId);
  session.step = STEPS.ASK_URGENCY;

  bot.sendMessage(chatId, `Когда планируете начать обучение?`, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'В этом месяце', callback_data: 'urgency_month' }],
        [{ text: 'В этом квартале', callback_data: 'urgency_quarter' }],
        [{ text: 'Пока изучаю варианты', callback_data: 'urgency_exploring' }],
        [{ text: 'Отмена', callback_data: 'qualify_cancel' }],
      ],
    },
  });
}

// ─── Завершение квалификации ─────────────────────────────────────────────────

function finishQualification(chatId, msg) {
  const session = getSession(chatId);
  session.step = STEPS.DONE;

  const d = session.data;

  // Определяем «теплоту» лида
  let leadScore = 0;
  let leadLabel = '';

  // Срочность
  if (d.urgency === 'В этом месяце') leadScore += 3;
  else if (d.urgency === 'В этом квартале') leadScore += 2;
  else leadScore += 1;

  // Количество сотрудников
  const empCount = parseInt(d.employees, 10) || 0;
  if (empCount >= 20) leadScore += 3;
  else if (empCount >= 5) leadScore += 2;
  else leadScore += 1;

  // Роль
  if (d.role && (d.role.includes('Руководитель') || d.role.includes('HR'))) {
    leadScore += 2;
  } else {
    leadScore += 1;
  }

  if (leadScore >= 7) leadLabel = 'ГОРЯЧИЙ';
  else if (leadScore >= 5) leadLabel = 'ТЁПЛЫЙ';
  else leadLabel = 'ХОЛОДНЫЙ';

  // Сообщение пользователю
  let userReply =
    `Спасибо! Вот сводка вашего запроса:\n\n` +
    `Организация: <b>${escapeHtml(d.company || '---')}</b>\n` +
    `Ваша роль: <b>${escapeHtml(d.role || '---')}</b>\n` +
    `Сотрудников на обучение: <b>${escapeHtml(d.employees || '---')}</b>\n` +
    `Программа: <b>${escapeHtml(d.program || '---')}</b>\n` +
    `Сроки: <b>${escapeHtml(d.urgency || '---')}</b>\n\n`;

  // Персональный ответ в зависимости от срочности
  if (d.urgency === 'В этом месяце') {
    userReply +=
      `Отлично! Наш менеджер свяжется с вами в ближайшее время для ` +
      `согласования дат и оформления документов.\n\n`;
  } else if (d.urgency === 'В этом квартале') {
    userReply +=
      `Хорошо! Мы подготовим для вас коммерческое предложение ` +
      `и свяжемся для уточнения деталей.\n\n`;
  } else {
    userReply +=
      `Понятно! Будем рады помочь, когда вы будете готовы. ` +
      `А пока -- вот наши контакты на случай вопросов:\n\n` +
      `Телефон: ${CONTACTS.phone}\n` +
      `Email: ${CONTACTS.email}\n\n`;
  }

  // Скидки при большом количестве
  if (empCount >= 10) {
    userReply +=
      `При обучении от 10 человек мы предоставляем скидку 10%. ` +
      `Точные условия обсудим при подготовке предложения.\n\n`;
  } else if (empCount >= 5) {
    userReply +=
      `При обучении от 5 человек действует скидка 5%.\n\n`;
  }

  userReply +=
    `Если хотите уточнить что-то прямо сейчас -- звоните: <b>${CONTACTS.phone}</b>\n` +
    `Или пишите: <b>${CONTACTS.email}</b>`;

  bot.sendMessage(chatId, userReply, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Начать заново', callback_data: 'qualify_start' }],
        [{ text: 'Наши программы', callback_data: 'cmd_programs' }],
        [{ text: 'Контакты', callback_data: 'cmd_contacts' }],
      ],
    },
  });

  // ─── Уведомление в админский чат ────────────────────────────────────────

  const adminMsg =
    `<b>НОВАЯ ЗАЯВКА [${leadLabel}]</b>\n\n` +
    `От: ${escapeHtml(userLabel(msg))}\n` +
    `Chat ID: <code>${chatId}</code>\n\n` +
    `Организация: <b>${escapeHtml(d.company || '---')}</b>\n` +
    `Роль: ${escapeHtml(d.role || '---')}\n` +
    `Кол-во сотрудников: ${escapeHtml(d.employees || '---')}\n` +
    `Программа: ${escapeHtml(d.program || '---')}\n` +
    `Сроки: ${escapeHtml(d.urgency || '---')}\n\n` +
    `Скоринг: ${leadScore}/8 (${leadLabel})\n` +
    `Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

  bot
    .sendMessage(ADMIN_CHAT_ID, adminMsg, { parse_mode: 'HTML' })
    .then(() => {
      console.log(`[OK] Заявка отправлена в админ-чат: ${d.company} (${leadLabel})`);
    })
    .catch((err) => {
      console.error('[ERROR] Не удалось отправить в админ-чат:', err.message);
    });

  // Сброс сессии
  resetSession(chatId);
}

// ─── Обработка текстовых сообщений (ввод данных) ─────────────────────────────

bot.on('message', (msg) => {
  // Пропускаем команды -- они обрабатываются отдельно
  if (msg.text && msg.text.startsWith('/')) return;
  // Пропускаем не-текстовые сообщения
  if (!msg.text) return;

  const chatId = msg.chat.id;
  const session = getSession(chatId);
  const text = msg.text.trim();

  switch (session.step) {
    // Шаг 1: ввод названия компании
    case STEPS.ASK_COMPANY:
      if (text.length < 2) {
        bot.sendMessage(
          chatId,
          'Пожалуйста, введите название организации (минимум 2 символа).'
        );
        return;
      }
      session.data.company = text;
      bot.sendMessage(chatId, `Принято: <b>${escapeHtml(text)}</b>`, {
        parse_mode: 'HTML',
      });
      askRole(chatId);
      break;

    // Шаг 3: ввод количества сотрудников
    case STEPS.ASK_EMPLOYEES: {
      // Пытаемся извлечь число
      const num = parseInt(text.replace(/\D/g, ''), 10);
      if (!num || num < 1) {
        bot.sendMessage(
          chatId,
          'Пожалуйста, введите число сотрудников (например, 5 или 15).'
        );
        return;
      }
      session.data.employees = String(num);
      bot.sendMessage(chatId, `Принято: <b>${num} чел.</b>`, {
        parse_mode: 'HTML',
      });
      askProgram(chatId);
      break;
    }

    // Если квалификация не начата -- предлагаем начать
    case STEPS.IDLE:
      bot.sendMessage(
        chatId,
        `Я -- бот <b>УМЦ Калуга</b> для подбора программ обучения по охране труда.\n\n` +
          `Команды:\n` +
          `/start -- начать\n` +
          `/programs -- наши программы\n` +
          `/price -- цены\n` +
          `/contacts -- контактная информация\n\n` +
          `Или нажмите кнопку ниже:`,
        {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Подобрать программу', callback_data: 'qualify_start' }],
            ],
          },
        }
      );
      break;

    default:
      // На остальных шагах (выбор кнопкой) -- напоминаем нажать кнопку
      bot.sendMessage(
        chatId,
        'Пожалуйста, выберите один из вариантов, нажав на кнопку выше.'
      );
      break;
  }
});

// ─── Обработка ошибок ────────────────────────────────────────────────────────

bot.on('polling_error', (error) => {
  console.error('[POLLING ERROR]', error.code, error.message);
});

process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT]', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

console.log('Бот готов к работе. Ожидание сообщений...');
