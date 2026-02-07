'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { faq } from '@/lib/data/faq';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };;

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#f8fafb]">
      <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1f7e9f] mb-12">
          Часто задаваемые вопросы
        </h2>

        <div className="space-y-4">
          {faq.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#1f7e9f]"
              >
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-900 text-lg">
                    {item.question}
                  </span>
                  <svg
                    className={cn(
                      'w-6 h-6 text-[#1f7e9f] transition-transform duration-300 flex-shrink-0',
                      isOpen ? 'rotate-180' : 'rotate-0'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    isOpen ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
