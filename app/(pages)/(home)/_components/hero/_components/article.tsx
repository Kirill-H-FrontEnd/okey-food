"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { BsArrowRight } from "react-icons/bs";

type TArticle = {};

export const Article: FC = ({}) => {
  return (
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
          className="bg-yellowPrimary w-full md:w-[250px] py-6 group "
        >
          <p className="text-greenPrimary font-bold">Выбрать рацион</p>
          <BsArrowRight
            strokeWidth={0.6}
            className="text-greenPrimary group-hover:translate-x-1 transition-transform hidden md:block"
          />
        </Button>
      </div>
    </article>
  );
};
