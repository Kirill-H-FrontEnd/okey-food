"use client";
// > React
import { FC } from "react";
// > Components
import { Container } from "@/components/ui/container";
import dynamic from "next/dynamic";
const DynamicYandexMap = dynamic(
  () =>
    import("@/components/ui/yandex-map-component").then(
      (mod) => mod.YandexMapComponent,
    ),
  { ssr: false },
);
type TYandexMap = {};

export const YandexMap: FC = ({}) => {
  return (
    <section id="map" className="py-14 lg:py-20 bg-whitePrimary">
      <Container>
        <section>
          <article className="mb-8">
            <h3 className="text-[28px] lg:text-[32px] font-bold text-colorPrimary">
              Зона доставки
            </h3>
          </article>
          <DynamicYandexMap zoom={10} />
          <section className="grid gap-2 md:grid-cols-[400px] mt-10 text-colorPrimary">
            <p>Время доставки 19:00 - 23:00</p>

            <p>
              Если необходимо изменить адрес доставки, сообщите нам по телефону
              +375 44 725 66 66 или в социальных сетях до 19:00
            </p>
          </section>
        </section>
      </Container>
    </section>
  );
};
