'use server';

import nodemailer from 'nodemailer';

interface FormData {
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
  program: string;
  count: string;
  message: string;
}

const roleLabels: Record<string, string> = {
  hr: 'Специалист по кадрам',
  safety: 'Специалист по охране труда',
  union: 'Представитель профсоюза',
  manager: 'Руководитель',
  other: 'Другое',
};

const programLabels: Record<string, string> = {
  a: 'Программа А (40 часов)',
  b: 'Программа Б (20 часов)',
  c: 'Программа В (16 часов)',
  refresher: 'Повышение квалификации',
  consulting: 'Консультация',
};

function formatMessage(data: FormData): string {
  return [
    `Имя: ${data.name}`,
    `Роль: ${roleLabels[data.role] || data.role}`,
    `Организация: ${data.company}`,
    `Телефон: ${data.phone}`,
    `Email: ${data.email}`,
    `Программа: ${programLabels[data.program] || data.program}`,
    `Кол-во человек: ${data.count}`,
    data.message ? `Сообщение: ${data.message}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

async function sendTelegram(data: FormData): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) return;

  const text = `📩 Новая заявка с сайта\n\n${formatMessage(data)}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
    }),
  });

  if (!res.ok) {
    console.error('Telegram error:', await res.text());
  }
}

async function sendEmail(data: FormData): Promise<void> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const to = process.env.NOTIFICATION_EMAIL;

  if (!host || !user || !pass || !to) {
    console.error('Email config missing:', { host: !!host, user: !!user, pass: !!pass, to: !!to });
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
  });

  await transporter.sendMail({
    from: `"УМЦ Сайт" <${user}>`,
    to,
    subject: `Новая заявка: ${data.name} — ${data.company}`,
    text: formatMessage(data),
    html: `
      <h2>Новая заявка с сайта</h2>
      <table style="border-collapse:collapse;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Имя:</td><td>${data.name}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Роль:</td><td>${roleLabels[data.role] || data.role}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Организация:</td><td>${data.company}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Телефон:</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Программа:</td><td>${programLabels[data.program] || data.program}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Кол-во:</td><td>${data.count}</td></tr>
        ${data.message ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Сообщение:</td><td>${data.message}</td></tr>` : ''}
      </table>
    `,
  });
}

export async function submitForm(
  data: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const results = await Promise.allSettled([
      sendTelegram(data),
      sendEmail(data),
    ]);

    const [tgResult, emailResult] = results;
    console.log('Telegram:', tgResult.status, tgResult.status === 'rejected' ? (tgResult as PromiseRejectedResult).reason?.message : 'ok');
    console.log('Email:', emailResult.status, emailResult.status === 'rejected' ? (emailResult as PromiseRejectedResult).reason?.message : 'ok');

    const allFailed = results.every((r) => r.status === 'rejected');
    if (allFailed) {
      return { success: false, error: 'Не удалось отправить заявку. Попробуйте позже.' };
    }

    return { success: true };
  } catch (error) {
    console.error('submitForm error:', error);
    return { success: false, error: 'Произошла ошибка. Попробуйте позже.' };
  }
}
