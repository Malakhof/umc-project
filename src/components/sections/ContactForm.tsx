'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { submitForm } from '@/lib/actions/submitForm';

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

const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    role: '',
    company: '',
    phone: '',
    email: '',
    program: '',
    count: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Введите ваше имя';
    }

    if (!formData.role) {
      newErrors.role = 'Выберите вашу роль';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Введите название организации';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Некорректный номер телефона';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email адрес';
    }

    if (!formData.program) {
      newErrors.program = 'Выберите программу';
    }

    if (!formData.count.trim()) {
      newErrors.count = 'Укажите количество человек';
    } else if (isNaN(Number(formData.count)) || Number(formData.count) < 1) {
      newErrors.count = 'Введите корректное число';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitStatus('idle');

    try {
      const result = await submitForm(formData);

      if (!result.success) {
        setSubmitStatus('error');
        return;
      }

      setSubmitStatus('success');

      // Reset form
      setFormData({
        name: '',
        role: '',
        company: '',
        phone: '',
        email: '',
        program: '',
        count: '',
        message: '',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="form" className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-[800px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Запросить информацию
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Заполните форму, и наш специалист свяжется с вами в ближайшее время
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Ваше имя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f7e9f] transition-colors',
                errors.name ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="Иван Иванов"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Ваша роль <span className="text-red-500">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f7e9f] transition-colors',
                errors.role ? 'border-red-500' : 'border-gray-300'
              )}
            >
              <option value="">Выберите роль</option>
              <option value="hr">Специалист по кадрам</option>
              <option value="safety">Специалист по охране труда</option>
              <option value="union">Представитель профсоюза</option>
              <option value="manager">Руководитель</option>
              <option value="other">Другое</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Организация <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className={cn(
                'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f7e9f] transition-colors',
                errors.company ? 'border-red-500' : 'border-gray-300'
              )}
              placeholder="ООО Компания"
            />
            {errors.company && <p className="mt-1 text-sm text-red-500">{errors.company}</p>}
          </div>

          {/* Phone and Email Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f7e9f] transition-colors',
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="+7 (999) 123-45-67"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f7e9f] transition-colors',
                  errors.email ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="email@example.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>

          {/* Program and Count Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                Программа <span className="text-red-500">*</span>
              </label>
              <select
                id="program"
                name="program"
                value={formData.program}
                onChange={handleChange}
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f7e9f] transition-colors',
                  errors.program ? 'border-red-500' : 'border-gray-300'
                )}
              >
                <option value="">Выберите программу</option>
                <option value="a">Программа А (40 часов)</option>
                <option value="b">Программа Б (20 часов)</option>
                <option value="c">Программа В (16 часов)</option>
                <option value="refresher">Повышение квалификации</option>
                <option value="consulting">Консультация</option>
              </select>
              {errors.program && <p className="mt-1 text-sm text-red-500">{errors.program}</p>}
            </div>

            <div>
              <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">
                Количество человек <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="count"
                name="count"
                min="1"
                value={formData.count}
                onChange={handleChange}
                className={cn(
                  'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f7e9f] transition-colors',
                  errors.count ? 'border-red-500' : 'border-gray-300'
                )}
                placeholder="1"
              />
              {errors.count && <p className="mt-1 text-sm text-red-500">{errors.count}</p>}
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Дополнительная информация
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1f7e9f] transition-colors resize-none"
              placeholder="Расскажите подробнее о ваших потребностях..."
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Отправка...
                </span>
              ) : (
                'Отправить заявку'
              )}
            </Button>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-center font-medium">
                Спасибо! Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.
              </p>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-center font-medium">
                Произошла ошибка при отправке. Пожалуйста, попробуйте позже или свяжитесь с нами по телефону.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;
