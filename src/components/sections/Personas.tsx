'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { personas } from '@/lib/data/personas';

const Personas = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const togglePersona = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Для кого это предназначено?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {personas.map((persona) => {
            const isActive = activeId === persona.id;

            return (
              <div
                key={persona.id}
                onClick={() => togglePersona(persona.id)}
                className={cn(
                  'rounded-lg p-6 cursor-pointer transition-all duration-300 border-2',
                  isActive
                    ? 'bg-[#1f7e9f] text-white border-[#1f7e9f] shadow-lg transform scale-105'
                    : 'bg-white text-gray-900 border-gray-200 hover:border-[#1f7e9f] hover:shadow-md'
                )}
              >
                <h3 className={cn(
                  'text-xl font-bold mb-2',
                  isActive ? 'text-white' : 'text-[#1f7e9f]'
                )}>
                  {persona.title}
                </h3>
                <p className={cn(
                  'text-sm mb-4',
                  isActive ? 'text-white/90' : 'text-gray-600'
                )}>
                  {persona.subtitle}
                </p>

                <div className="space-y-2">
                  {persona.needs.map((need, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className={cn(
                        'mt-1 flex-shrink-0',
                        isActive ? 'text-white' : 'text-[#2ebc7e]'
                      )}>
                        ✓
                      </span>
                      <span className={cn(
                        'text-sm',
                        isActive ? 'text-white' : 'text-gray-700'
                      )}>
                        {need}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Personas;
