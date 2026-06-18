import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { CraftStep } from '../types/craft';
import StepPlaceholder from './StepPlaceholder';

interface StepSwiperProps {
  steps: CraftStep[];
  accentColor: string;
  activeIndex: number;
  onSlideChange: (index: number) => void;
}

/**
 * 步骤横向 Swiper 浏览
 */
export default function StepSwiper({
  steps,
  accentColor,
  activeIndex,
  onSlideChange,
}: StepSwiperProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        initialSlide={activeIndex}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => onSlideChange(swiper.activeIndex)}
        pagination={{ clickable: true }}
        className="step-swiper rounded-xl pb-10"
      >
        {steps.map((step) => (
          <SwiperSlide key={step.id}>
            <article className="overflow-hidden rounded-xl border border-heritage-200 bg-white shadow-sm">
              <StepPlaceholder step={step} accentColor={accentColor} />
              <div className="p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                  >
                    {step.order}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-heritage-900">{step.title}</h3>
                </div>
                <p className="leading-relaxed text-gray-600">{step.description}</p>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        onClick={() => swiperRef.current?.slidePrev()}
        className="absolute left-0 top-1/3 z-10 -translate-x-3 rounded-full border border-heritage-200 bg-white p-2 shadow-md transition hover:bg-heritage-50 sm:-translate-x-4"
        aria-label="上一步"
      >
        <ChevronLeftIcon className="h-5 w-5 text-heritage-700" />
      </button>
      <button
        type="button"
        onClick={() => swiperRef.current?.slideNext()}
        className="absolute right-0 top-1/3 z-10 translate-x-3 rounded-full border border-heritage-200 bg-white p-2 shadow-md transition hover:bg-heritage-50 sm:translate-x-4"
        aria-label="下一步"
      >
        <ChevronRightIcon className="h-5 w-5 text-heritage-700" />
      </button>
    </div>
  );
}
