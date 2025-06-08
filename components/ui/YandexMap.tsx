// components/YandexMap.tsx
"use client";

import { FC, useEffect, useRef } from "react";
import Script from "next/script";

type YandexMapProps = {
  // можно не указывать apiKey, тянем из .env
  center?: [number, number];
  zoom?: number;
  width?: string;
  height?: string;
};

export const YandexMap: FC<YandexMapProps> = ({
  center = [53.9, 27.5667], // Минск
  zoom = 11,
  width = "100%",
  height = "500px",
}) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ymaps = (window as any).ymaps;
    if (!ymaps || !container.current) return;

    ymaps.ready(() => {
      const map = new ymaps.Map(container.current, {
        center,
        zoom,
        controls: ["zoomControl", "fullscreenControl"],
      });

      // Загружаем границы Минска
      ymaps.borders
        .load("Минск", {
          lang: "ru",
          quality: 2,
        })
        .then((result: any) => {
          // result — GeoObjectCollection с границами
          result.options.set({
            // полупрозрачная заливка
            fillColor: "#FF660077",
            // цвет контура
            strokeColor: "#FF6600",
            strokeWidth: 2,
          });
          map.geoObjects.add(result);
        })
        .catch(console.error);
    });
  }, [center, zoom]);

  const src = `
    https://api-maps.yandex.ru/2.1/
    ?lang=ru_RU
    &apikey=b33e1fa3-291a-41ec-b70a-c8c958b792bb
    &load=package.full
  `.replace(/\s+/g, "");

  return (
    <>
      <Script src={src} strategy="afterInteractive" />
      <div
        ref={container}
        style={{ width, height }}
        aria-label="Яндекс.Карта: Минск"
      />
    </>
  );
};
