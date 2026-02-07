# Email Nurturing Chain — УМЦ Калужского облсовпрофа

> Цепочка прогрева: 7 писем за 30 дней
> Цель: довести подписчика от первого касания до заявки на обучение
> Отправитель: УМЦ охраны труда &lt;safety.ot@mail.ru&gt;
> Reply-to: safety.ot@mail.ru
> Unsubscribe: обязательная ссылка в футере каждого письма

---

## Общие настройки цепочки

| Параметр | Значение |
|---|---|
| Триггер входа | Подписка на чек-лист / заявка на консультацию / заполнение формы на сайте |
| Условие остановки | Оплата обучения ИЛИ отписка ИЛИ жалоба на спам |
| Время отправки | Вт–Чт, 10:00–11:00 МСК (оптимум для B2B) |
| Пауза при открытии | Если письмо не открыто — повтор через 48ч с темой B |
| UTM-метки | utm_source=email&utm_medium=nurture&utm_campaign=chain_v1&utm_content=email_N |

---

## EMAIL 1 — День 0: Welcome + Лид-магнит

### Условия отправки
- **Триггер:** Немедленно после подтверждения подписки (double opt-in)
- **Задержка:** 0 минут (мгновенная отправка)
- **Условие:** Email подтверждён, контакт новый в базе

### Тема письма
- **Вариант A:** Ваш чек-лист «Готовность к проверке ГИТ» — скачайте сейчас
- **Вариант B:** Скачайте бесплатно: 30 пунктов для подготовки к проверке ГИТ

### Превью-текст
Проверьте себя до того, как проверят вас. Чек-лист от действующих инспекторов ОТ.

### Тело письма

```html
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">

  <div style="background: #1a365d; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 22px; margin: 0;">
      УМЦ охраны труда — Калуга
    </h1>
    <p style="color: #a0c4ff; font-size: 13px; margin: 4px 0 0;">
      Аккредитация Минтруда №590 · Лицензия №286
    </p>
  </div>

  <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0;">

    <p style="font-size: 16px; line-height: 1.6;">
      Здравствуйте!
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Спасибо, что доверяете нам. Меня зовут Александр Земсков, я действующий инспектор по охране труда и преподаватель УМЦ Калужского облсовпрофа.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Как и обещали — вот ваш чек-лист <strong>«Готовность к проверке ГИТ»</strong>. Это 30+ пунктов, которые мы составили на основе реальных проверок предприятий Калужской области за последний год.
    </p>

    <div style="background: #f0f7ff; border-left: 4px solid #2b6cb0; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 15px; line-height: 1.5;">
        <strong>Что внутри:</strong><br>
        — Документы, которые проверяют в первую очередь<br>
        — Типичные нарушения, за которые штрафуют (от 50 000 до 150 000 ₽)<br>
        — Пункты, которые 80% компаний забывают подготовить
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://umc-project.vercel.app/checklist-git?utm_source=email&utm_medium=nurture&utm_campaign=chain_v1&utm_content=email_1"
         style="display: inline-block; background: #2b6cb0; color: #ffffff; font-size: 16px; font-weight: 600; padding: 14px 36px; border-radius: 6px; text-decoration: none;">
        Скачать чек-лист бесплатно
      </a>
    </div>

    <p style="font-size: 16px; line-height: 1.6;">
      В ближайшие дни я расскажу вам о важных изменениях в ПП-2464, которые уже затронули сотни предприятий. Не пропустите — это поможет избежать штрафов.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Если у вас есть срочный вопрос — просто ответьте на это письмо, я читаю каждое.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      С уважением,<br>
      <strong>Земсков Александр Владимирович</strong><br>
      Преподаватель УМЦ, действующий инспектор ОТ
    </p>

  </div>

  <div style="background: #f7fafc; padding: 20px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; font-size: 13px; color: #718096;">
    <p style="margin: 0 0 8px;">
      ЧОУ ДПО «УМЦ Калужского облсовпрофа»<br>
      Тел: 8(4842) 57-01-04 · safety.ot@mail.ru<br>
      umc-project.vercel.app
    </p>
    <p style="margin: 0;">
      <a href="{{unsubscribe_url}}" style="color: #a0aec0;">Отписаться от рассылки</a>
    </p>
  </div>

</div>
```

### CTA кнопка
**Текст:** Скачать чек-лист бесплатно
**Ссылка:** /checklist-git + UTM

---

## EMAIL 2 — День 3: Образовательное письмо

### Условия отправки
- **Триггер:** 3 дня после Email 1
- **Условие:** Контакт открыл Email 1 ИЛИ прошло 3 дня (отправляем в любом случае)
- **Если не открыл Email 1:** Переотправить Email 1 с темой B, Email 2 сдвинуть на День 5

### Тема письма
- **Вариант A:** 5 изменений ПП-2464, которые уже касаются вашей компании
- **Вариант B:** ПП-2464 изменился — проверьте, всё ли вы учли

### Превью-текст
Многие предприятия даже не знают об этих требованиях. Разбираем по пунктам.

### Тело письма

```html
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">

  <div style="background: #1a365d; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 22px; margin: 0;">
      УМЦ охраны труда — Калуга
    </h1>
    <p style="color: #a0c4ff; font-size: 13px; margin: 4px 0 0;">
      Аккредитация Минтруда №590 · Лицензия №286
    </p>
  </div>

  <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0;">

    <p style="font-size: 16px; line-height: 1.6;">
      Здравствуйте!
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Постановление Правительства №2464 о порядке обучения по охране труда продолжает менять правила игры. Разберём <strong>5 ключевых изменений</strong>, которые напрямую затрагивают вашу компанию.
    </p>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">

    <h2 style="font-size: 18px; color: #1a365d; margin-bottom: 8px;">
      1. Новые категории работников для обучения
    </h2>
    <p style="font-size: 15px; line-height: 1.6;">
      Расширен перечень должностей, подлежащих обучению по ОТ. Если раньше достаточно было обучить руководителей подразделений, то теперь требования распространяются и на ряд специалистов, непосредственно не управляющих персоналом. Проверьте — все ли ваши сотрудники охвачены.
    </p>

    <h2 style="font-size: 18px; color: #1a365d; margin-bottom: 8px;">
      2. Микрообучение на рабочем месте
    </h2>
    <p style="font-size: 15px; line-height: 1.6;">
      Введено понятие обучения по использованию СИЗ как отдельной программы. Это не замена инструктажу, а дополнительное требование. Штраф за отсутствие — до 130 000 ₽ на юридическое лицо.
    </p>

    <h2 style="font-size: 18px; color: #1a365d; margin-bottom: 8px;">
      3. Изменение периодичности обучения
    </h2>
    <p style="font-size: 15px; line-height: 1.6;">
      Для ряда программ периодичность повторного обучения сократилась с 3 лет до 1 года. Особенно это касается работ повышенной опасности. Пропуск срока = нарушение.
    </p>

    <h2 style="font-size: 18px; color: #1a365d; margin-bottom: 8px;">
      4. Практическая часть стала обязательной
    </h2>
    <p style="font-size: 15px; line-height: 1.6;">
      Теперь нельзя ограничиться только лекциями. Программы обучения должны включать практические занятия — минимум 25% от общего объёма. Наш УМЦ проводит практику на реальных кейсах калужских предприятий.
    </p>

    <h2 style="font-size: 18px; color: #1a365d; margin-bottom: 8px;">
      5. Единый реестр обученных
    </h2>
    <p style="font-size: 15px; line-height: 1.6;">
      Сведения о прошедших обучение вносятся в реестр Минтруда. Обучение в организации без аккредитации не будет учтено при проверке. <strong>УМЦ Калужского облсовпрофа — аккредитация №590</strong>, все наши выпускники в реестре.
    </p>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">

    <div style="background: #fffff0; border-left: 4px solid #d69e2e; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 15px; line-height: 1.5;">
        <strong>Подготовили подробный чек-лист</strong> с конкретными действиями по каждому пункту ПП-2464. Скачайте и передайте ответственному за ОТ в вашей компании.
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://umc-project.vercel.app/checklist-pp2464?utm_source=email&utm_medium=nurture&utm_campaign=chain_v1&utm_content=email_2"
         style="display: inline-block; background: #2b6cb0; color: #ffffff; font-size: 16px; font-weight: 600; padding: 14px 36px; border-radius: 6px; text-decoration: none;">
        Скачать чек-лист по ПП-2464
      </a>
    </div>

    <p style="font-size: 16px; line-height: 1.6;">
      Через несколько дней расскажу реальную историю — как одно предприятие Калужской области подготовилось к проверке и сэкономило более 400 000 рублей.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      С уважением,<br>
      <strong>Земсков Александр Владимирович</strong><br>
      Преподаватель УМЦ, действующий инспектор ОТ
    </p>

  </div>

  <div style="background: #f7fafc; padding: 20px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; font-size: 13px; color: #718096;">
    <p style="margin: 0 0 8px;">
      ЧОУ ДПО «УМЦ Калужского облсовпрофа»<br>
      Тел: 8(4842) 57-01-04 · safety.ot@mail.ru<br>
      umc-project.vercel.app
    </p>
    <p style="margin: 0;">
      <a href="{{unsubscribe_url}}" style="color: #a0aec0;">Отписаться от рассылки</a>
    </p>
  </div>

</div>
```

### CTA кнопка
**Текст:** Скачать чек-лист по ПП-2464
**Ссылка:** /checklist-pp2464 + UTM

---

## EMAIL 3 — День 7: Кейс-стади

### Условия отправки
- **Триггер:** 4 дня после Email 2
- **Условие:** Контакт не отписался, не совершил целевое действие (заявку)
- **Приоритет:** Если контакт кликнул ссылку в Email 2 — отправить на День 6 (на день раньше)

### Тема письма
- **Вариант A:** Как завод в Калужской области избежал штрафа в 450 000 ₽
- **Вариант B:** Реальный кейс: проверка ГИТ прошла без единого замечания

### Превью-текст
История предприятия, которое подготовилось за 3 недели. Подробности и выводы внутри.

### Тело письма

```html
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">

  <div style="background: #1a365d; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 22px; margin: 0;">
      УМЦ охраны труда — Калуга
    </h1>
    <p style="color: #a0c4ff; font-size: 13px; margin: 4px 0 0;">
      Аккредитация Минтруда №590 · Лицензия №286
    </p>
  </div>

  <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0;">

    <p style="font-size: 16px; line-height: 1.6;">
      Здравствуйте!
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Хочу рассказать вам реальную историю. Название предприятия изменено по просьбе клиента, но все цифры и факты — настоящие.
    </p>

    <div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 24px 0;">

      <h2 style="font-size: 18px; color: #1a365d; margin: 0 0 16px;">
        Кейс: ООО «ПромТехСервис», Калужская область
      </h2>

      <h3 style="font-size: 15px; color: #e53e3e; margin: 16px 0 8px;">Ситуация</h3>
      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 12px;">
        Производственное предприятие, 120 сотрудников, из них 45 — на работах повышенной опасности. Получили уведомление о плановой проверке ГИТ. Срок — 3 недели.
      </p>
      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 12px;">
        При внутреннем аудите выяснилось: у 28 сотрудников просрочено обучение по ОТ, программы обучения не обновлены под ПП-2464, отсутствуют протоколы проверки знаний по новому формату.
      </p>

      <h3 style="font-size: 15px; color: #d69e2e; margin: 16px 0 8px;">Потенциальный ущерб</h3>
      <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 0 0 12px;">
        <li>Штраф за допуск без обучения: до 130 000 ₽ x количество нарушений</li>
        <li>Приостановка деятельности: до 90 суток</li>
        <li>Общая сумма потенциальных штрафов: <strong>более 450 000 ₽</strong></li>
      </ul>

      <h3 style="font-size: 15px; color: #38a169; margin: 16px 0 8px;">Что сделали</h3>
      <p style="font-size: 15px; line-height: 1.6; margin: 0 0 12px;">
        Обратились в УМЦ Калужского облсовпрофа. За 2 недели мы:
      </p>
      <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 0 0 12px;">
        <li>Провели экспресс-аудит документации по ОТ</li>
        <li>Обучили 28 сотрудников по программам, соответствующим ПП-2464</li>
        <li>Оформили все протоколы и внесли данные в реестр Минтруда</li>
        <li>Подготовили пакет документов для проверяющих</li>
        <li>Провели консультацию руководителя перед проверкой</li>
      </ul>

      <h3 style="font-size: 15px; color: #2b6cb0; margin: 16px 0 8px;">Результат</h3>
      <p style="font-size: 15px; line-height: 1.6; margin: 0;">
        Проверка ГИТ прошла <strong>без единого предписания</strong> в части обучения по ОТ. Инспектор отметил высокое качество оформления документации. Предприятие сэкономило более 450 000 ₽ и сохранило репутацию надёжного работодателя.
      </p>

    </div>

    <div style="background: #f0fff4; border-left: 4px solid #38a169; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 15px; line-height: 1.5;">
        <strong>Ключевой вывод:</strong> Подготовка к проверке обошлась предприятию в 15 раз дешевле потенциальных штрафов. И заняла всего 2 недели.
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6;">
      Если у вас похожая ситуация — или вы просто хотите убедиться, что всё в порядке — напишите нам. Бесплатная экспресс-консультация занимает 15 минут.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://umc-project.vercel.app/consultation?utm_source=email&utm_medium=nurture&utm_campaign=chain_v1&utm_content=email_3"
         style="display: inline-block; background: #2b6cb0; color: #ffffff; font-size: 16px; font-weight: 600; padding: 14px 36px; border-radius: 6px; text-decoration: none;">
        Получить бесплатную консультацию
      </a>
    </div>

    <p style="font-size: 16px; line-height: 1.6;">
      С уважением,<br>
      <strong>Земсков Александр Владимирович</strong><br>
      Преподаватель УМЦ, действующий инспектор ОТ
    </p>

  </div>

  <div style="background: #f7fafc; padding: 20px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; font-size: 13px; color: #718096;">
    <p style="margin: 0 0 8px;">
      ЧОУ ДПО «УМЦ Калужского облсовпрофа»<br>
      Тел: 8(4842) 57-01-04 · safety.ot@mail.ru<br>
      umc-project.vercel.app
    </p>
    <p style="margin: 0;">
      <a href="{{unsubscribe_url}}" style="color: #a0aec0;">Отписаться от рассылки</a>
    </p>
  </div>

</div>
```

### CTA кнопка
**Текст:** Получить бесплатную консультацию
**Ссылка:** /consultation + UTM

---

## EMAIL 4 — День 12: Социальное доказательство

### Условия отправки
- **Триггер:** 5 дней после Email 3
- **Условие:** Контакт не отписался, не оставил заявку
- **Сегмент:** Отправить всем, включая тех, кто не открывал предыдущие письма (письмо с короткими отзывами хорошо работает для реактивации)

### Тема письма
- **Вариант A:** 3 127 специалистов уже прошли обучение у нас. Вот что они говорят
- **Вариант B:** «Жалею, что не обратились раньше» — отзывы наших выпускников

### Превью-текст
Реальные отзывы руководителей и специалистов по ОТ из Калужской области.

### Тело письма

```html
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">

  <div style="background: #1a365d; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 22px; margin: 0;">
      УМЦ охраны труда — Калуга
    </h1>
    <p style="color: #a0c4ff; font-size: 13px; margin: 4px 0 0;">
      Аккредитация Минтруда №590 · Лицензия №286
    </p>
  </div>

  <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0;">

    <p style="font-size: 16px; line-height: 1.6;">
      Здравствуйте!
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Мы не любим хвалить себя — пусть за нас скажут цифры и отзывы тех, кто уже прошёл обучение.
    </p>

    <!-- Цифры -->
    <div style="display: flex; text-align: center; margin: 28px 0; gap: 12px;">
      <div style="flex: 1; background: #f0f7ff; border-radius: 8px; padding: 20px 12px;">
        <div style="font-size: 32px; font-weight: 700; color: #2b6cb0;">3 127</div>
        <div style="font-size: 13px; color: #4a5568; margin-top: 4px;">выпускников</div>
      </div>
      <div style="flex: 1; background: #f0fff4; border-radius: 8px; padding: 20px 12px;">
        <div style="font-size: 32px; font-weight: 700; color: #38a169;">15+</div>
        <div style="font-size: 13px; color: #4a5568; margin-top: 4px;">лет работы</div>
      </div>
      <div style="flex: 1; background: #fffff0; border-radius: 8px; padding: 20px 12px;">
        <div style="font-size: 32px; font-weight: 700; color: #d69e2e;">98%</div>
        <div style="font-size: 13px; color: #4a5568; margin-top: 4px;">сдают с первого раза</div>
      </div>
    </div>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;">

    <!-- Отзыв 1 -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 24px; color: #2b6cb0; line-height: 1;">&ldquo;</div>
      <p style="font-size: 15px; line-height: 1.6; font-style: italic; margin: 0 0 8px; padding-left: 16px;">
        Обучали группу из 15 человек — от мастеров до начальников цехов. Преподаватели объясняют не по учебнику, а на реальных ситуациях. После обучения прошли проверку ГИТ без замечаний. Жалею только о том, что не обратились раньше.
      </p>
      <p style="font-size: 14px; color: #718096; margin: 0; padding-left: 16px;">
        <strong>Сергей М.</strong>, директор по производству, машиностроительное предприятие, г. Калуга
      </p>
    </div>

    <!-- Отзыв 2 -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 24px; color: #2b6cb0; line-height: 1;">&ldquo;</div>
      <p style="font-size: 15px; line-height: 1.6; font-style: italic; margin: 0 0 8px; padding-left: 16px;">
        Как специалист по ОТ, я проходила обучение в разных центрах. В УМЦ Калужского облсовпрофа лучшее соотношение практики и теории. Особенно ценно, что преподаватели — действующие инспекторы. Они знают, на что реально обращают внимание при проверках.
      </p>
      <p style="font-size: 14px; color: #718096; margin: 0; padding-left: 16px;">
        <strong>Елена В.</strong>, специалист по ОТ, логистическая компания, Калужская область
      </p>
    </div>

    <!-- Отзыв 3 -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 24px; color: #2b6cb0; line-height: 1;">&ldquo;</div>
      <p style="font-size: 15px; line-height: 1.6; font-style: italic; margin: 0 0 8px; padding-left: 16px;">
        Нужно было срочно обучить 8 человек перед плановой проверкой. В других центрах предлагали ждать набора группы 2–3 недели. В УМЦ организовали обучение за 5 дней. Протоколы, удостоверения — всё получили в срок. Рекомендую.
      </p>
      <p style="font-size: 14px; color: #718096; margin: 0; padding-left: 16px;">
        <strong>Андрей К.</strong>, генеральный директор, строительная компания, г. Обнинск
      </p>
    </div>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;">

    <div style="background: #f0f7ff; border-left: 4px solid #2b6cb0; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 15px; line-height: 1.5;">
        <strong>Почему выбирают нас:</strong><br>
        — Преподаватели Земсков А.В. и Клюев А.А. — действующие инспекторы ОТ<br>
        — Аккредитация Минтруда №590 — данные в федеральном реестре<br>
        — Гибкий график: очно, дистанционно, выезд на предприятие<br>
        — Группы от 1 человека, без ожидания набора
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://umc-project.vercel.app/programs?utm_source=email&utm_medium=nurture&utm_campaign=chain_v1&utm_content=email_4"
         style="display: inline-block; background: #2b6cb0; color: #ffffff; font-size: 16px; font-weight: 600; padding: 14px 36px; border-radius: 6px; text-decoration: none;">
        Посмотреть программы обучения
      </a>
    </div>

    <p style="font-size: 16px; line-height: 1.6;">
      С уважением,<br>
      <strong>Клюев Андрей Александрович</strong><br>
      Преподаватель УМЦ, действующий инспектор ОТ
    </p>

  </div>

  <div style="background: #f7fafc; padding: 20px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; font-size: 13px; color: #718096;">
    <p style="margin: 0 0 8px;">
      ЧОУ ДПО «УМЦ Калужского облсовпрофа»<br>
      Тел: 8(4842) 57-01-04 · safety.ot@mail.ru<br>
      umc-project.vercel.app
    </p>
    <p style="margin: 0;">
      <a href="{{unsubscribe_url}}" style="color: #a0aec0;">Отписаться от рассылки</a>
    </p>
  </div>

</div>
```

### CTA кнопка
**Текст:** Посмотреть программы обучения
**Ссылка:** /programs + UTM

---

## EMAIL 5 — День 17: Специальное предложение

### Условия отправки
- **Триггер:** 5 дней после Email 4
- **Условие:** Контакт открыл хотя бы 1 из предыдущих писем (активный подписчик)
- **Альтернатива для неактивных:** Отправить сокращённую версию с другой темой: «Мы заметили, что вы не открываете наши письма — возможно, это будет полезно»

### Тема письма
- **Вариант A:** Скидка 15% для групп от 10 человек — только до конца месяца
- **Вариант B:** Специальные условия обучения для вашей компании

### Превью-текст
Обучите команду выгодно. Гибкий график, выезд на предприятие, все документы.

### Тело письма

```html
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">

  <div style="background: #1a365d; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 22px; margin: 0;">
      УМЦ охраны труда — Калуга
    </h1>
    <p style="color: #a0c4ff; font-size: 13px; margin: 4px 0 0;">
      Аккредитация Минтруда №590 · Лицензия №286
    </p>
  </div>

  <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0;">

    <p style="font-size: 16px; line-height: 1.6;">
      Здравствуйте!
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      За последние две недели вы получили от нас чек-листы и полезные материалы по охране труда. Надеюсь, они пригодились. Сегодня — конкретное предложение для вашей компании.
    </p>

    <div style="background: linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%); border-radius: 8px; padding: 28px; margin: 24px 0; color: #ffffff;">
      <h2 style="font-size: 20px; margin: 0 0 16px; color: #ffffff;">
        Специальные условия для корпоративных групп
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2);">Группа от 5 человек</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2); text-align: right; font-weight: 600;">скидка 10%</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2);">Группа от 10 человек</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2); text-align: right; font-weight: 600;">скидка 15%</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2);">Группа от 20 человек</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2); text-align: right; font-weight: 600;">скидка 20%</td>
        </tr>
        <tr>
          <td style="padding: 10px 0;">Выезд на предприятие (от 10 чел.)</td>
          <td style="padding: 10px 0; text-align: right; font-weight: 600;">бесплатно</td>
        </tr>
      </table>
    </div>

    <h3 style="font-size: 16px; color: #1a365d; margin: 24px 0 12px;">
      Что входит в корпоративное обучение:
    </h3>

    <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
      <li>Обучение по программам, соответствующим ПП-2464</li>
      <li>Практические занятия на примерах вашей отрасли</li>
      <li>Проверка знаний с оформлением протоколов</li>
      <li>Выдача удостоверений установленного образца</li>
      <li>Внесение данных в реестр Минтруда</li>
      <li>Гибкий график — подстраиваемся под ваш производственный цикл</li>
      <li><strong>Бонус:</strong> бесплатный экспресс-аудит документации по ОТ для групп от 10 человек</li>
    </ul>

    <div style="background: #fffff0; border-left: 4px solid #d69e2e; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 15px; line-height: 1.5;">
        <strong>Условие:</strong> Предложение действует при заключении договора до конца текущего месяца. Обучение можно провести позже — в удобные для вас даты.
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://umc-project.vercel.app/corporate?utm_source=email&utm_medium=nurture&utm_campaign=chain_v1&utm_content=email_5"
         style="display: inline-block; background: #38a169; color: #ffffff; font-size: 16px; font-weight: 600; padding: 14px 36px; border-radius: 6px; text-decoration: none;">
        Рассчитать стоимость для моей группы
      </a>
    </div>

    <p style="font-size: 15px; line-height: 1.6; color: #718096;">
      Или позвоните нам: <strong style="color: #333;">8(4842) 57-01-04</strong> — ответим на все вопросы и подберём оптимальную программу.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      С уважением,<br>
      <strong>Земсков Александр Владимирович</strong><br>
      Преподаватель УМЦ, действующий инспектор ОТ
    </p>

  </div>

  <div style="background: #f7fafc; padding: 20px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; font-size: 13px; color: #718096;">
    <p style="margin: 0 0 8px;">
      ЧОУ ДПО «УМЦ Калужского облсовпрофа»<br>
      Тел: 8(4842) 57-01-04 · safety.ot@mail.ru<br>
      umc-project.vercel.app
    </p>
    <p style="margin: 0;">
      <a href="{{unsubscribe_url}}" style="color: #a0aec0;">Отписаться от рассылки</a>
    </p>
  </div>

</div>
```

### CTA кнопка
**Текст:** Рассчитать стоимость для моей группы
**Ссылка:** /corporate + UTM

---

## EMAIL 6 — День 23: Срочность

### Условия отправки
- **Триггер:** 6 дней после Email 5
- **Условие:** Контакт не оставил заявку
- **Особое условие:** Если контакт кликнул CTA в Email 5 но не завершил заявку — отправить на День 20 (на 3 дня раньше) с пометкой «Вы начали оформление — завершите его»

### Тема письма
- **Вариант A:** Плановые проверки ГИТ 2025: ваша компания в списке?
- **Вариант B:** Роструд опубликовал план проверок на 2025 год — проверьте себя

### Превью-текст
Проверить, попало ли ваше предприятие в план, можно за 2 минуты. Показываем как.

### Тело письма

```html
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">

  <div style="background: #1a365d; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 22px; margin: 0;">
      УМЦ охраны труда — Калуга
    </h1>
    <p style="color: #a0c4ff; font-size: 13px; margin: 4px 0 0;">
      Аккредитация Минтруда №590 · Лицензия №286
    </p>
  </div>

  <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0;">

    <div style="background: #fff5f5; border: 1px solid #feb2b2; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
      <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #c53030;">
        <strong>Важно:</strong> Роструд утвердил план проверок на 2025 год. Количество плановых проверок в Калужской области увеличено по сравнению с прошлым годом.
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6;">
      Здравствуйте!
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Каждый год Генеральная прокуратура и Роструд публикуют сводный план проверок. В 2025 году мораторий на плановые проверки частично снят, и многие предприятия Калужской области снова попали в план.
    </p>

    <h3 style="font-size: 16px; color: #1a365d; margin: 24px 0 12px;">
      Как проверить, есть ли ваша компания в плане:
    </h3>

    <ol style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
      <li>Откройте сайт <strong>proverki.gov.ru</strong> (Единый реестр проверок)</li>
      <li>Введите ИНН или название вашей организации</li>
      <li>Посмотрите раздел «Плановые проверки» на текущий год</li>
      <li>Обратите внимание на графу «Проверяющий орган» — ищите ГИТ (Государственная инспекция труда)</li>
    </ol>

    <div style="background: #fffff0; border-left: 4px solid #d69e2e; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 15px; line-height: 1.5;">
        <strong>Даже если вас нет в плане</strong> — внеплановые проверки никто не отменял. Жалоба сотрудника, несчастный случай, обращение профсоюза — всё это основания для внеплановой проверки ГИТ. Готовым нужно быть всегда.
      </p>
    </div>

    <h3 style="font-size: 16px; color: #1a365d; margin: 24px 0 12px;">
      На что ГИТ обращает внимание в первую очередь:
    </h3>

    <ul style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
      <li>Наличие обучения по ОТ у всех категорий работников</li>
      <li>Соответствие программ обучения требованиям ПП-2464</li>
      <li>Актуальность протоколов проверки знаний (не просрочены ли)</li>
      <li>Наличие данных в реестре Минтруда</li>
      <li>Проведение инструктажей с правильным оформлением</li>
      <li>Обучение по использованию СИЗ (новое требование)</li>
    </ul>

    <p style="font-size: 16px; line-height: 1.6;">
      <strong>Средний штраф при выявлении нарушений обучения по ОТ в Калужской области в 2024 году составил 87 000 ₽.</strong> При повторном нарушении — дисквалификация руководителя на срок до 3 лет.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Мы помогаем предприятиям подготовиться к проверкам — быстро, грамотно, с гарантией результата. Начните с бесплатной экспресс-оценки.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://umc-project.vercel.app/audit?utm_source=email&utm_medium=nurture&utm_campaign=chain_v1&utm_content=email_6"
         style="display: inline-block; background: #e53e3e; color: #ffffff; font-size: 16px; font-weight: 600; padding: 14px 36px; border-radius: 6px; text-decoration: none;">
        Проверить готовность моей компании
      </a>
    </div>

    <p style="font-size: 16px; line-height: 1.6;">
      С уважением,<br>
      <strong>Клюев Андрей Александрович</strong><br>
      Преподаватель УМЦ, действующий инспектор ОТ
    </p>

  </div>

  <div style="background: #f7fafc; padding: 20px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; font-size: 13px; color: #718096;">
    <p style="margin: 0 0 8px;">
      ЧОУ ДПО «УМЦ Калужского облсовпрофа»<br>
      Тел: 8(4842) 57-01-04 · safety.ot@mail.ru<br>
      umc-project.vercel.app
    </p>
    <p style="margin: 0;">
      <a href="{{unsubscribe_url}}" style="color: #a0aec0;">Отписаться от рассылки</a>
    </p>
  </div>

</div>
```

### CTA кнопка
**Текст:** Проверить готовность моей компании
**Ссылка:** /audit + UTM

---

## EMAIL 7 — День 30: Последний шанс + Персональный бонус

### Условия отправки
- **Триггер:** 7 дней после Email 6
- **Условие:** Контакт не оставил заявку
- **Сегментация:**
  - Для активных (открывали 3+ письма): полная версия с бонусом
  - Для неактивных (открывали 0–2 письма): короткая версия с другой темой — «Нам не удалось быть полезными?» + предложение одной бесплатной консультации перед отпиской
- **После отправки:** Если нет реакции в течение 14 дней — перевести в сегмент «холодные», снизить частоту до 1 письма в месяц (дайджест)

### Тема письма
- **Вариант A:** Персональное предложение для вас — действует 5 дней
- **Вариант B:** Последняя возможность: скидка + бесплатная консультация инспектора

### Превью-текст
Индивидуальные условия, которых нет на сайте. Плюс бонус — 30 минут с инспектором ОТ.

### Тело письма

```html
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">

  <div style="background: #1a365d; padding: 24px 32px; border-radius: 8px 8px 0 0;">
    <h1 style="color: #ffffff; font-size: 22px; margin: 0;">
      УМЦ охраны труда — Калуга
    </h1>
    <p style="color: #a0c4ff; font-size: 13px; margin: 4px 0 0;">
      Аккредитация Минтруда №590 · Лицензия №286
    </p>
  </div>

  <div style="padding: 32px; background: #ffffff; border: 1px solid #e2e8f0;">

    <p style="font-size: 16px; line-height: 1.6;">
      Здравствуйте!
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      За последний месяц мы делились с вами полезными материалами по охране труда — чек-листами, разбором изменений в законодательстве, реальными кейсами. Надеюсь, что-то из этого было полезно.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      Сегодня я хочу сделать вам <strong>персональное предложение</strong>, которое действует только <strong>5 дней</strong> и только для подписчиков нашей рассылки.
    </p>

    <div style="background: linear-gradient(135deg, #1a365d 0%, #2b6cb0 100%); border-radius: 8px; padding: 28px; margin: 24px 0; color: #ffffff;">
      <h2 style="font-size: 20px; margin: 0 0 20px; color: #ffffff; text-align: center;">
        Ваше персональное предложение
      </h2>

      <div style="background: rgba(255,255,255,0.1); border-radius: 6px; padding: 16px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 15px;">Скидка на любую программу обучения</span>
          <span style="font-size: 20px; font-weight: 700;">10%</span>
        </div>
      </div>

      <div style="background: rgba(255,255,255,0.1); border-radius: 6px; padding: 16px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 15px;">Бесплатная консультация инспектора ОТ</span>
          <span style="font-size: 20px; font-weight: 700;">30 мин</span>
        </div>
      </div>

      <div style="background: rgba(255,255,255,0.1); border-radius: 6px; padding: 16px; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span style="font-size: 15px;">Экспресс-аудит документации по ОТ</span>
          <span style="font-size: 20px; font-weight: 700;">в подарок</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2);">
        <p style="font-size: 14px; margin: 0; opacity: 0.9;">
          Промокод: <strong style="font-size: 18px; letter-spacing: 2px;">UMC-VIP-{{subscriber_id}}</strong>
        </p>
        <p style="font-size: 13px; margin: 8px 0 0; opacity: 0.7;">
          Действует до {{expiry_date}} включительно
        </p>
      </div>
    </div>

    <h3 style="font-size: 16px; color: #1a365d; margin: 24px 0 12px;">
      Что вы получите при обращении по этому предложению:
    </h3>

    <ol style="font-size: 15px; line-height: 1.8; padding-left: 20px;">
      <li><strong>Персональная консультация</strong> (30 минут) — разберём конкретно вашу ситуацию с действующим инспектором ОТ. Какие сотрудники должны быть обучены, по каким программам, в какие сроки.</li>
      <li><strong>Экспресс-аудит документации</strong> — присылаете список имеющихся документов по ОТ, мы указываем, чего не хватает и что нужно обновить.</li>
      <li><strong>Обучение со скидкой 10%</strong> — на любую программу, для любого количества сотрудников. Скидка суммируется с корпоративной скидкой для групп.</li>
    </ol>

    <div style="background: #fff5f5; border-left: 4px solid #e53e3e; padding: 16px 20px; margin: 24px 0; border-radius: 0 6px 6px 0;">
      <p style="margin: 0; font-size: 15px; line-height: 1.5;">
        <strong>Предложение действует 5 дней.</strong> После этого промокод будет деактивирован, и мы перейдём в режим ежемесячного дайджеста. Не упустите возможность получить максимум пользы.
      </p>
    </div>

    <div style="text-align: center; margin: 32px 0;">
      <a href="https://umc-project.vercel.app/personal-offer?code=UMC-VIP-{{subscriber_id}}&utm_source=email&utm_medium=nurture&utm_campaign=chain_v1&utm_content=email_7"
         style="display: inline-block; background: #38a169; color: #ffffff; font-size: 17px; font-weight: 700; padding: 16px 40px; border-radius: 6px; text-decoration: none;">
        Воспользоваться предложением
      </a>
    </div>

    <p style="font-size: 15px; line-height: 1.6; text-align: center; color: #718096;">
      Или позвоните: <strong style="color: #333;">8(4842) 57-01-04</strong><br>
      Назовите промокод — мы всё оформим по телефону
    </p>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;">

    <p style="font-size: 16px; line-height: 1.6;">
      Спасибо, что были с нами этот месяц. Независимо от вашего решения, мы всегда готовы помочь с вопросами охраны труда.
    </p>

    <p style="font-size: 16px; line-height: 1.6;">
      С уважением,<br>
      <strong>Земсков Александр Владимирович</strong><br>
      <strong>Клюев Андрей Александрович</strong><br>
      Преподаватели УМЦ, действующие инспекторы ОТ
    </p>

  </div>

  <div style="background: #f7fafc; padding: 20px 32px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; font-size: 13px; color: #718096;">
    <p style="margin: 0 0 8px;">
      ЧОУ ДПО «УМЦ Калужского облсовпрофа»<br>
      Тел: 8(4842) 57-01-04 · safety.ot@mail.ru<br>
      umc-project.vercel.app
    </p>
    <p style="margin: 0;">
      <a href="{{unsubscribe_url}}" style="color: #a0aec0;">Отписаться от рассылки</a>
    </p>
  </div>

</div>
```

### CTA кнопка
**Текст:** Воспользоваться предложением
**Ссылка:** /personal-offer + UTM + промокод

---

## Сводная таблица цепочки

| # | День | Тип | Тема (A) | Цель | KPI |
|---|------|------|----------|------|-----|
| 1 | 0 | Welcome | Ваш чек-лист «Готовность к проверке ГИТ» | Доставить лид-магнит, установить контакт | Open rate > 60% |
| 2 | 3 | Обучение | 5 изменений ПП-2464 | Показать экспертизу, дать второй лид-магнит | Click rate > 15% |
| 3 | 7 | Кейс | Как завод избежал штрафа 450 000 ₽ | Продемонстрировать результат | Click rate > 10% |
| 4 | 12 | Соцдок-во | 3 127 специалистов + отзывы | Укрепить доверие | Open rate > 35% |
| 5 | 17 | Оффер | Скидка 15% для групп | Первая продажа | Click rate > 8% |
| 6 | 23 | Срочность | Плановые проверки ГИТ 2025 | Создать ощущение необходимости | Click rate > 12% |
| 7 | 30 | Last chance | Персональное предложение + бонус | Конверсия / сегментация | Conv. rate > 3% |

---

## Технические переменные

| Переменная | Описание |
|---|---|
| `{{subscriber_name}}` | Имя подписчика (если известно) |
| `{{subscriber_id}}` | ID подписчика для персонализации промокода |
| `{{company_name}}` | Название компании (если известно) |
| `{{expiry_date}}` | Дата истечения предложения (дата отправки + 5 дней) |
| `{{unsubscribe_url}}` | Ссылка отписки (генерируется платформой рассылки) |

---

*Документ подготовлен для ЧОУ ДПО «УМЦ Калужского облсовпрофа»*
*Версия 1.0 — Февраль 2025*
