// Reviews.tsx
"use client";
import { FC } from "react";
// import Autoplay from "embla-carousel-autoplay";
import { Container } from "@/components/ui/container";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
} from "@/components/ui/carousel";
import { ReviewCard } from "./_components/review-card";

type TReviews = {};

export const Reviews: FC = ({}) => {
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
        "Полмесяца ем еду OkeyFood. Прям очень довольна! Первое — это вкусно. Второе — ребята согласились менять рыбу на другое. До этого все подобные службы отказывали. Третье — если я уезжаю, без проблем переносят дни. Короче, советую!",
    },
    {
      name: "Анна",
      avatar: "/images/home/reviews/review-avatar-3.jpg",
      date: "13.02.2025",
      content:
        "Полмесяца ем еду OkeyFood. Прям очень довольна! Первое — это вкусно. Второе — ребята согласились менять рыбу на другое. До этого все подобные службы отказывали. Третье — если я уезжаю, без проблем переносят дни. Короче, советую!",
    },
    {
      name: "Анастасия",
      avatar: "/images/home/reviews/review-avatar-1.jpg",
      date: "28.02.2025",
      content:
        "Полмесяца ем еду OkeyFood. Прям очень довольна! Первое — это вкусно. Второе — ребята согласились менять рыбу на другое. До этого все подобные службы отказывали. Третье — если я уезжаю, без проблем переносят дни. Короче, советую!",
    },
    {
      name: "Анастасия",
      avatar: "/images/home/reviews/review-avatar-1.jpg",
      date: "28.02.2025",
      content:
        "Полмесяца ем еду OkeyFood. Прям очень довольна! Первое — это вкусно. Второе — ребята согласились менять рыбу на другое. До этого все подобные службы отказывали. Третье — если я уезжаю, без проблем переносят дни. Короче, советую!",
    },
    {
      name: "Анастасия",
      avatar: "/images/home/reviews/review-avatar-1.jpg",
      date: "28.02.2025",
      content:
        "Полмесяца ем еду OkeyFood. Прям очень довольна! Первое — это вкусно. Второе — ребята согласились менять рыбу на другое. До этого все подобные службы отказывали. Третье — если я уезжаю, без проблем переносят дни. Короче, советую!",
    },
    {
      name: "Анастасия",
      avatar: "/images/home/reviews/review-avatar-1.jpg",
      date: "28.02.2025",
      content:
        "Полмесяца ем еду OkeyFood. Прям очень довольна! Первое — это вкусно. Второе — ребята согласились менять рыбу на другое. До этого все подобные службы отказывали. Третье — если я уезжаю, без проблем переносят дни. Короче, советую!",
    },
  ];
  return (
    <section className="w-full bg-whitePrimary py-14 lg:py-20">
      <Container>
        <section className="">
          <h3 className="text-[28px] lg:text-[32px] font-bold text-greenPrimary mb-8">
            Отзывы
          </h3>

          <Swiper
            modules={[Autoplay]}
            autoplay={{
              delay: 2500,
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
            /* optional — отключить drag мышью на десктопе:
        simulateTouch={false}
        */
          >
            {DATA_REVIEWS_CARD.map((data) => (
              <SwiperSlide key={data.name + data.date} className="h-auto">
                {/* Важно: внутри карточки w-full, чтоб занимала выданную ширину */}
                <ReviewCard data={data} />
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      </Container>
    </section>
  );
};
