"use client";
import { FC } from "react";
// > Components
import { Container } from "@/components/ui/container";
import { Background } from "./_components/bg";
import { Article } from "./_components/article";
type THero = {};

export const Hero: FC = ({}) => {
  return (
    <section id="hero" className="w-full h-dvh grid place-items-center">
      <Container className="w-full h-full grid md:place-items-center">
        <section className=" bg-greenPrimary px-5 rounded-[8px] relative overflow-hidden w-full mt-4 md:mt-0 h-[550px] md:h-[75%] md:px-10 lg:px-20 grid  items-start md:items-center">
          <Article />
          <Background />
        </section>
      </Container>
    </section>
  );
};
