"use client";

import React, { FC, useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";

import { Container } from "@/components/ui/container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { ReviewCard } from "./_components/review-card";

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
  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: 3500,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

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

            <Carousel
              opts={{ align: "start", loop: true, skipSnaps: false }}
              // plugins={[autoplayPlugin]}
              className="relative"
            >
              <CarouselContent className="gap-4 [--slide-gap:1rem] [--slides-per-view:1] sm:[--slides-per-view:1.25] md:[--slides-per-view:2] lg:[--slides-per-view:3] 2xl:[--slides-per-view:4]">
                {DATA_REVIEWS_CARD.map((review, idx) => (
                  <CarouselItem
                    key={idx}
                    className="flex h-full"
                    style={{
                      flexBasis:
                        "calc((100% - (var(--slides-per-view) - 1) * var(--slide-gap, 1.5rem)) / var(--slides-per-view))",
                    }}
                  >
                    <ReviewCard data={review} />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious
                aria-label="Предыдущий отзыв"
                className="hidden md:flex border border-grey-border bg-white text-greenPrimary hover:bg-whitePrimary"
              />
              <CarouselNext
                aria-label="Следующий отзыв"
                className="hidden md:flex border border-grey-border bg-white text-greenPrimary hover:bg-whitePrimary"
              />
            </Carousel>
          </div>
        </article>
      </Container>
    </section>
  );
};
