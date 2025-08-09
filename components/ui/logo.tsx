"use client";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";

type TLogo = { url?: string };

export const Logo: FC<TLogo> = ({ url = "/images/OkeyFoodLogo.svg" }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
      className="cursor-pointer block w-[40px] h-[40px] md:w-[50px] md:h-[50px] overflow-hidden"
    >
      <Image
        src={url}
        alt="OkeyFood логотип"
        width={50}
        height={50}
        priority
        sizes="(max-width: 768px) 40px, 50px"
        style={{
          objectFit: "contain",
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </Link>
  );
};
