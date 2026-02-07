'use client';

import React from 'react';
import Button from '@/components/ui/Button';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#f8fafb] pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-fadeIn">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Обучение по охране труда по новому ПП-2464
            </h1>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              Получите аккредитованное обучение по охране труда с полной методической
              поддержкой. Доверие профсоюзов и признание работодателей по всей России.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollToSection('#form')}
              >
                Запросить информацию
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => scrollToSection('#programs')}
              >
                Посмотреть программы
              </Button>
            </div>
          </div>

          {/* Right Column - Trust Block */}
          <div className="rounded-2xl bg-white shadow-2xl p-8 md:p-10 space-y-6">
            {/* Accreditation Badge */}
            <div className="bg-[#1f7e9f] text-white rounded-xl p-5 text-center">
              <p className="text-sm font-medium uppercase tracking-wider mb-1">Аккредитация Минтруда РФ</p>
              <p className="text-3xl font-bold">№ 590</p>
              <p className="text-sm text-white/80 mt-1">Реестр аккредитованных организаций</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f8fafb] rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-[#1f7e9f]">15+</p>
                <p className="text-sm text-gray-600 mt-1">лет опыта</p>
              </div>
              <div className="bg-[#f8fafb] rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-[#1f7e9f]">3 000+</p>
                <p className="text-sm text-gray-600 mt-1">выпускников</p>
              </div>
              <div className="bg-[#f8fafb] rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-[#1f7e9f]">№ 286</p>
                <p className="text-sm text-gray-600 mt-1">лицензия</p>
              </div>
              <div className="bg-[#f8fafb] rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-[#2ebc7e]">100%</p>
                <p className="text-sm text-gray-600 mt-1">сдача экзамена</p>
              </div>
            </div>

            {/* Founder */}
            <div className="flex items-center gap-4 bg-[#f8fafb] rounded-xl p-4">
              <div className="w-12 h-12 rounded-full bg-[#1f7e9f] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                КО
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Калужский областной совет профсоюзов</p>
                <p className="text-xs text-gray-500">Учредитель центра</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
      `}</style>
    </section>
  );
};

export default Hero;
