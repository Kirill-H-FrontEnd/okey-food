"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import { ReviewCard } from "./_components/review-card";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, A11y, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const DATA_REVIEWS_CARD = [
  {
    name: "Анастасия",
    avatar: "/images/home/reviews/review-avatar-1.jpg",
    date: "28.02.2025",
    content:
      "Полмесяца ем еду OkeyFood. Прям очень довольна! Первое — это вкусно. Второе — ребята согласились менять рыбу на другое. До этого все подобные службы отказывали. Третье — если я уезжаю, без проблем переносят дни. Короче, советую!",
  },
  {
    name: "Сергей",
    avatar: "/images/home/reviews/review-avatar-2.jpg",
    date: "24.02.2025",
    content:
      "Еда вкусная и разнообразная. Доставка всегда вовремя. Особенно радует, что учли мои пожелания по замене некоторых ингредиентов. Сервис на высоте!",
  },
  {
    name: "Анна",
    avatar: "/images/home/reviews/review-avatar-3.jpg",
    date: "13.02.2025",
    content:
      "Очень удобно, когда нет времени готовить. Экономия времени колоссальная. Меню сбалансированное, порции достаточные. Стала чувствовать себя бодрее. Спасибо OkeyFood!",
  },
  {
    name: "Дмитрий",
    avatar: "/images/home/reviews/review-avatar-2.jpg",
    date: "10.03.2025",
    content:
      "Ребята молодцы! Всегда идут навстречу, если нужно перенести доставку. Качество еды отличное, все свежее. Рекомендую всем, кто ценит свое время и здоровье.",
  },
];

export const Reviews: FC = () => {
  // Рендерим Swiper только на клиенте, чтобы исключить гидрацию
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Навигация через рефы (инициализируем в onInit)
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="w-full bg-whitePrimary py-14 lg:py-20 overflow-x-hidden">
      <Container className="relative">
        <article>
          <h3 className="mb-8 text-[28px] lg:text-[32px] font-bold text-greenPrimary">
            О нас
          </h3>

          <div className="relative overflow-hidden">
            {/* градиенты по краям дорожки */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-whitePrimary to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-whitePrimary to-transparent" />

            {mounted && (
              <Swiper
                modules={[Navigation, Autoplay, A11y, Keyboard]}
                onInit={(swiper) => {
                  // привязываем кнопки навигации ПОСЛЕ маунта
                  // @ts-ignore
                  swiper.params.navigation.prevEl = prevRef.current;
                  // @ts-ignore
                  swiper.params.navigation.nextEl = nextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }}
                navigation={{ enabled: true }}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                keyboard={{ enabled: true }}
                a11y={{ enabled: true }}
                watchOverflow
                resistanceRatio={0.85}
                centeredSlides={false}
                slidesPerView={1}
                spaceBetween={24}
                breakpoints={{
                  480: { slidesPerView: 1.2, spaceBetween: 14 },
                  640: { slidesPerView: 1.4, spaceBetween: 16 },
                  700: { slidesPerView: 1.7, spaceBetween: 16 },
                  768: { slidesPerView: 2.5, spaceBetween: 16 },
                  1024: { slidesPerView: 3.2, spaceBetween: 16 },
                  1280: { slidesPerView: 4, spaceBetween: 16 },
                }}
                className="reviews-swiper"
                style={{ overflow: "visible" }}
              >
                {DATA_REVIEWS_CARD.map((review, idx) => (
                  <SwiperSlide key={idx} className="reviews-slide">
                    <div className="w-full h-[300px] min-h-[300px] flex">
                      <ReviewCard data={review} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {/* стрелки — показываем только на md+ */}
            <button
              ref={prevRef}
              aria-label="Предыдущий отзыв"
              className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-grey-border bg-white text-greenPrimary hover:bg-whitePrimary transition-colors z-10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M15 18l-6-6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              ref={nextRef}
              aria-label="Следующий отзыв"
              className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 h-8 w-8 items-center justify-center rounded-full border border-grey-border bg-white text-greenPrimary hover:bg-whitePrimary transition-colors z-10"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  d="M9 18l6-6-6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </article>
      </Container>

      {/* Немного «страховки», чтобы контент не распирал трек */}
      <style jsx>{`
        :global(.reviews-swiper .swiper-wrapper) {
          align-items: stretch;
        }
        :global(.reviews-slide) {
          height: auto;
          min-width: 0;
        }
        :global(.reviews-slide *) {
          min-width: 0;
        }
      `}</style>
    </section>
  );
};
