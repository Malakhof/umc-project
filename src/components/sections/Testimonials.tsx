import React from 'react';
import { testimonials } from '@/lib/data/testimonials';

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1f7e9f] mb-12">
          Отзывы клиентов
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#f8fafb] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="text-2xl text-amber-400 mb-4">
                ★★★★★
              </div>

              {/* Quote */}
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div>
                <p className="font-bold text-[#1f7e9f] mb-1">
                  {testimonial.author}
                </p>
                <p className="text-sm text-gray-500">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
