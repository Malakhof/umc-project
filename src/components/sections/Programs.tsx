'use client';

import React from 'react';
import { programs } from '@/lib/data/programs';
import Button from '@/components/ui/Button';

const Programs = () => {
  const scrollToForm = () => {
    const element = document.querySelector('#form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="programs" className="py-16 md:py-24 bg-[#f8fafb]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Программы обучения
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-[#1f7e9f] to-[#2ebc7e] p-6 text-white">
                <h3 className="text-xl font-bold mb-2">{program.title}</h3>
                <p className="text-white/90 text-sm">{program.duration}</p>
                <p className="text-white/90 text-sm">{program.format}</p>
              </div>

              {/* Body */}
              <div className="p-6 flex-grow">
                <ul className="space-y-3">
                  {program.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[#2ebc7e] mt-1 flex-shrink-0">•</span>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="p-6 pt-0 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-[#1f7e9f]">{program.price}</span>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={scrollToForm}
                >
                  Записаться
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
