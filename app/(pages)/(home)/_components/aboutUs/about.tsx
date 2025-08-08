import { FC } from "react";

import { Container } from "@/components/ui/container";
import { AboutCard } from "./_components/about-card";

type TAbout = {};

export const AboutUs: FC = ({}) => {
  const DATA_ABOUT_CARDS = [
    {
      title: "Натуральные продукты",
      icon: "/images/home/aboutUs/icon-1.svg",
    },
    {
      title: "Удобный заказ",
      icon: "/images/home/aboutUs/icon-2.svg",
    },
    {
      title: "Уникальные блюда",
      icon: "/images/home/aboutUs/icon-3.svg",
    },
    {
      title: "Ежедневная доставка",
      icon: "/images/home/aboutUs/icon-4.svg",
    },
  ];
  return (
    <section id="aboutUs" className={" w-full bg-whitePrimary py-14 lg:py-20"}>
      <Container>
        <section>
          <article className="mb-8">
            <h3 className="text-[28px] lg:text-[32px] font-bold text-greenPrimary">
              О нас
            </h3>
            <div className=" mt-4 w-full max-w-[650px] text-greenPrimary font-medium">
              <p>
                Мы – сервис доставки здорового и вкусного питания, созданный для
                тех, кто ценит свое время и заботится о своем здоровье. Наши
                блюда готовятся из свежих и натуральных продуктов, без вредных
                добавок и лишнего сахара. Мы предлагаем разнообразное меню на
                каждый день, которое подойдет как для активных спортсменов, так
                и для тех, кто просто хочет правильно питаться.{" "}
              </p>
            </div>
          </article>
          <section className="grid  grid-cols-[repeat(auto-fill,_minmax(260px,_1fr))] justify-between gap-4">
            {DATA_ABOUT_CARDS.map((card, index) => (
              <AboutCard key={index} data={card} />
            ))}
          </section>
        </section>
      </Container>
    </section>
  );
};
