"use client";
import { AboutUs } from "./_components/aboutUs/about";
import { Calculator } from "./_components/calculator/calculator";
import { FAQ } from "./_components/FAQ/FAQ";
import { Hero } from "./_components/hero/hero";
import { Reviews } from "./_components/reviews/reviews";

// > Components

export default function HomePage() {
  return (
    <>
      <Hero />
      <Calculator />
      <AboutUs />
      {/* <Reviews /> */}
      {/* <YandexMap /> */}
      <FAQ />
    </>
  );
}
