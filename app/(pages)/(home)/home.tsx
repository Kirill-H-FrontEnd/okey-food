"use client";

import { AboutUs } from "./_components/aboutUs/about";
import { Calculator } from "./_components/calculator/calculator";
import { FAQ } from "./_components/FAQ/FAQ";
import { Hero } from "./_components/hero/hero";

// > Components

export default function HomePage() {
  return (
    <>
      <Hero />
      <Calculator />
      <AboutUs />
      <FAQ />
    </>
  );
}
