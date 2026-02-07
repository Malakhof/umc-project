export interface ContactInfo {
  address: string
  phone: string
  phoneHref: string
  email: string
  hours: string
  legalName: string
}

export const contacts: ContactInfo = {
  address: 'г. Калуга, ул. Ленина, д. 81, оф. 504',
  phone: '8 (4842) 57-01-04',
  phoneHref: 'tel:+74842570104',
  email: 'umcentr_kaluga@mail.ru',
  hours: 'Пн-пт: 8:00-17:00, Перерыв: 13:00-14:00',
  legalName: 'ЧОУ ДПО «УМЦ Калужского облсовпрофа»',
}
