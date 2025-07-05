// Reviews.tsx

"use client";
import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Container } from "@/components/ui/container";
import { ReviewCard } from "./_components/review-card";

import "swiper/css";
import "swiper/css/autoplay";

// (Your DATA_REVIEWS_CARD remains the same)
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
  return (
    <section className="w-full bg-whitePrimary py-14 lg:py-20">
      <Container>
        <section>
          <h3 className="text-[28px] lg:text-[32px] font-bold text-greenPrimary mb-8">
            Отзывы
          </h3>

          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
          >
            {DATA_REVIEWS_CARD.map((data, index) => (
              <SwiperSlide key={index} className="h-auto self-stretch">
                <ReviewCard data={data} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </Container>
    </section>
  );
};
