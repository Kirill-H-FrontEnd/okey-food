"use client";
import { FC } from "react";
import Image from "next/image";
type TBg = {};

export const Background: FC = ({}) => {
  return (
    <>
      <div className="absolute hidden md:block top-1/2 -translate-y-1/2 right-[0px] lg:right-[50px]  ">
        <div className=" ">
          <Image
            alt=""
            fill
            priority
            style={{ objectFit: "contain" }}
            src={"/images/home/hero/vector-hero-bg.svg"}
          />
        </div>
        <div className="absolute  top-1/2 -translate-y-1/2 right-[0px] w-[500px] h-[500px] lg:w-[650px] lg:h-[650px] overflow-hidden">
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
