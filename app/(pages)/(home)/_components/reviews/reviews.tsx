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
    [],
  );

  return (
    <section className="py-14 lg:py-20 overflow-x-hidden">
      <Container>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
          }}
          // plugins={[autoplayPlugin]}
          className="w-full"
        >
          <CarouselContent>
            {DATA_REVIEWS_CARD.map((review, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="h-full">
                  <ReviewCard data={review} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden md:flex border border-grey-border bg-white text-whiteSecondary hover:bg-whitePrimary" />
          <CarouselNext className="hidden md:flex border border-grey-border bg-white text-whiteSecondary hover:bg-whitePrimary" />
        </Carousel>
      </Container>
    </section>
  );
};
