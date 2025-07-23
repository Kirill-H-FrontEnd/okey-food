"use client";

import { AboutUs } from "./_components/aboutUs/about";
import { Calculator } from "./_components/calculator/calculator";
import { FAQ } from "./_components/FAQ/FAQ";
import { Hero } from "./_components/hero/hero";
import { Products } from "./_components/products/products";
import { Reviews } from "./_components/reviews/reviews";
import { YandexMap } from "./_components/yandex-map/yandex-map";

// > Components

export default function HomePage() {
  return (
    <>
      <Hero />
      <Products />
      <Calculator />
      <AboutUs />
      {/* <Reviews /> */}
      <FAQ />
      <YandexMap />
    </>
  );
}
