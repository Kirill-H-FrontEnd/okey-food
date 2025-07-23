// Reviews.tsx

"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
import { Container } from "@/components/ui/container";
import { ReviewCard } from "./_components/review-card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import "swiper/css";
import "swiper/css/autoplay";
import { Button } from "@/components/ui/button";

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
  // ... other reviews
];

export const Reviews: FC = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    breakpoints: {
      "(max-width: 639px)": {
        slides: { perView: 1.1, spacing: 16 },
      },
      "(min-width: 640px) and (max-width: 767px)": {
        slides: { perView: 1.5, spacing: 16 },
      },
      "(min-width: 768px) and (max-width: 1023px)": {
        slides: { perView: 2.5, spacing: 16 },
      },
      "(min-width: 1024px)": {
        slides: { perView: 3.5, spacing: 16 },
      },
    },
    slides: { perView: 3.5, spacing: 16 }, // Desktop по умолчанию
    renderMode: "performance",
  });
  return (
    <section className="w-full bg-whitePrimary py-14 lg:py-20 overflow-hidden">
      <Container className="relative">
        <div className="relative">
          {/* Fade overlays */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-whitePrimary to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-whitePrimary to-transparent" />
          <div ref={sliderRef} className="keen-slider">
            {DATA_REVIEWS_CARD.map((product, idx) => (
              <div
                key={idx}
                className="keen-slider__slide flex flex-shrink-0"
                style={{
                  minHeight: 300,
                  height: 300,
                }}
              >
                <ReviewCard data={product} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
{
  /* <Swiper
            // modules={[Autoplay]}
            className="w-full max-w-full"
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop
            spaceBetween={16}
            slidesPerView={3}
            breakpoints={{
              320: {
                slidesPerView: 1,
              },
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {DATA_REVIEWS_CARD.map((data, index) => (
              <SwiperSlide key={index}>
                <ReviewCard data={data} />
              </SwiperSlide>
            ))}
          </Swiper> */
}
