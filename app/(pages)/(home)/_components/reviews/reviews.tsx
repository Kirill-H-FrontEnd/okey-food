"use client";
import { FC } from "react";
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
  ];
  return (
    <section className="w-full bg-whitePrimary py-14 lg:py-20">
      <Container>
        <section>
          <h3 className="text-[28px] lg:text-[32px] font-bold text-greenPrimary mb-8">
            Отзывы
          </h3>
          <Carousel
            opts={{
              align: "start",
              containScroll: "trimSnaps",
              loop: true,
              skipSnaps: true,
            }}
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full "
          >
            <CarouselContent className="flex flex-nowrap relative">
              {DATA_REVIEWS_CARD.map((data, i) => (
                <CarouselItem
                  key={i}
                  className=" flex flex-col basis-1/2 lg:basis-1/3 px-2"
                >
                  <ReviewCard data={data} key={i} />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious />
            <CarouselNext /> */}
          </Carousel>
        </section>
      </Container>
    </section>
  );
};
