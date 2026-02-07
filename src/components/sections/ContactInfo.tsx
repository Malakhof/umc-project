import React from 'react';
import { contacts } from '@/lib/data/contacts';

const ContactInfo = () => {
  return (
    <section id="contacts" className="py-16 md:py-24 bg-[#1f7e9f]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Свяжитесь с нами
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Address */}
          <div className="text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-lg font-bold text-white mb-2">Адрес</h3>
            <p className="text-white/90 leading-relaxed">
              {contacts.address}
            </p>
          </div>

          {/* Phone */}
          <div className="text-center">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="text-lg font-bold text-white mb-2">Телефон</h3>
            <a
              href={`tel:${contacts.phone.replace(/[\s\-\(\)]/g, '')}`}
              className="text-white/90 hover:text-white transition-colors duration-200 underline"
            >
              {contacts.phone}
            </a>
          </div>

          {/* Email */}
          <div className="text-center">
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="text-lg font-bold text-white mb-2">Email</h3>
            <a
              href={`mailto:${contacts.email}`}
              className="text-white/90 hover:text-white transition-colors duration-200 underline break-all"
            >
              {contacts.email}
            </a>
          </div>

          {/* Hours */}
          <div className="text-center">
            <div className="text-4xl mb-4">🕐</div>
            <h3 className="text-lg font-bold text-white mb-2">Часы работы</h3>
            <p className="text-white/90 leading-relaxed">
              {contacts.hours}
            </p>
          </div>
        </div>

        {/* Legal Name */}
        <div className="text-center border-t border-white/20 pt-8">
          <p className="text-white/80 text-sm">
            {contacts.legalName}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
