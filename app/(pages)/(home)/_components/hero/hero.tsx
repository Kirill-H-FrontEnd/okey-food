"use client";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ArrowBigRight } from "lucide-react";
import Image from "next/image";
import { FC } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
type THero = {};

export const Hero: FC = ({}) => {
  return (
    <section id="hero" className="w-full h-dvh grid place-items-center">
      <Container className="w-full h-full grid place-items-center">
        <section className=" bg-greenPrimary px-5 rounded-[8px] relative overflow-hidden w-full h-[75%] md:px-10 lg:px-20 grid  items-start md:items-center">
          <article className="w-full max-w-[500px] text-center md:text-start mx-auto md:mx-0 mt-6 pt-10 md:pt-0 md:mt-0 grid gap-6 z-[2] relative">
            <div className="grid gap-2">
              <h1 className="text-whitePrimary text-[26px]  min-[425px]:text-[30px] md:text-[46px] font-extrabold leading-10 min-[425px]:leading-12 md:leading-14 tracking-[2px] ">
                Здоровое питание с доставкой на дом
              </h1>
              <h2 className="text-whitePrimary text-[18px]   ">
                Готовые рационы питания, которые подойдут под любую цель
              </h2>
            </div>
            <div>
              <Button
                size={"lg"}
                variant={"default"}
                className="bg-yellowPrimary w-full md:w-[250px] py-6"
              >
                <p className="text-greenPrimary font-bold">Выбрать рацион</p>
                <IoIosArrowRoundForward
                  className="text-greenPrimary"
                  size={30}
                />
              </Button>
            </div>
          </article>
          <div className="absolute hidden md:block top-1/2 -translate-y-1/2 right-[20px] lg:right-[100px]  ">
            <Image
              className=""
              src={"/images/home/hero/vector-hero-bg.svg"}
              width={700}
              height={700}
              alt=""
            />
            <div className="absolute  top-1/2 -translate-y-1/2 right-[0px] w-[560px] h-[560px] lg:w-[650px] lg:h-[650px] overflow-hidden">
              <Image
                src="/images/home/hero/products.png"
                alt=""
                fill
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full overflow-hidden md:hidden">
            <Image
              src="/images/home/hero/products-mobile-bg.png"
              alt=""
              width={600}
              height={600}
              className="w-full h-auto"
              priority
            />
          </div>
        </section>
      </Container>
    </section>
  );
};
