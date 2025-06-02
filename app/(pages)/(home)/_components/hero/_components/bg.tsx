"use client";
import { FC } from "react";
import Image from "next/image";
type TBg = {};

export const Background: FC = ({}) => {
  return (
    <>
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
    </>
  );
};
