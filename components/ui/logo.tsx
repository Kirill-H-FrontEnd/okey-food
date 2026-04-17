"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type TLogo = {
  url?: string;
  width?: number;
  height?: number;
  rounded?: number;
  className?: string;
};

export const Logo: FC<TLogo> = ({
  url = "/okey-food-logo.png",
  width = 50,
  height = 50,
  rounded = 2,
  className,
}) => {
  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Link
      href="/"
      aria-label="На главную"
      onClick={handleClick}
      className={cn("cursor-pointer block overflow-hidden shrink-0", className)}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: `${rounded}px`,
      }}
    >
      <Image
        src={url}
        alt="OkeyFood логотип"
        width={width}
        height={height}
        priority
        sizes={`${width}px`}
        className="block h-full w-full object-contain"
      />
    </Link>
  );
};
