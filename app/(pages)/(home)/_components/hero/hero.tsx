"use client";
import { FC } from "react";
import Image from "next/image";
// > Components
import { Container } from "@/components/ui/container";
import { Background } from "./_components/bg";
import { Article } from "./_components/article";
type THero = {};

export const Hero: FC = ({}) => {
  return (
    <section
      id="hero"
      className={`w-full  grid place-items-center bg-whitePrimary`}
    >
      <Container className="w-full h-full grid md:place-items-center">
        <section className=" bg-greenPrimary px-5 rounded-[16px] relative overflow-hidden w-full mt-4 h-[550px] md:px-10 lg:px-20 grid  items-start md:items-center ">
          <Article />
          <Background />
          {/* Vector background */}
          <div className="absolute hidden md:block top-0 right-[20px] lg:right-[50px] z-1 w-[550px] h-[550px] overflow-hidden">
            <Image
              alt=""
              fill
              priority
              src={"/images/home/hero/vector-hero-bg.svg"}
            />
          </div>
        </section>
      </Container>
    </section>
  );
};
