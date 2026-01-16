"use client";
// > React
import { FC } from "react";
import Image from "next/image";
type TBg = {};

export const Background: FC = ({}) => {
  return (
    <>
      <div className="absolute z-2 hidden md:block top-1/2 -translate-y-1/2 right-0 lg:right-[50px]  ">
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[600px] h-[600px] lg:w-[750px] lg:h-[750px] overflow-hidden">
          <Image
            src="/images/home/hero/heroBg3.png"
            alt=""
            fill
            priority
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
      <div className="absolute sm:-bottom-38 -bottom-28 left-1/2 -translate-x-1/2 w-[140%] sm:w-[100%] overflow-hidden md:hidden">
        <Image
          src="/images/home/hero/productsImageMobile.png"
          alt=""
          width={1000}
          height={400}
          className="w-full h-auto scale-[1.25]"
          priority
        />
      </div>
    </>
  );
};
