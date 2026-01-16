// components/cart/basket-empty.tsx
"use client";
import { FC } from "react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

type BasketEmptyProps = { text?: string };

export const BasketEmpty: FC<BasketEmptyProps> = ({
  text = "Ваша корзина пуста..",
}) => {
  return (
    <div
      className="min-h-full bg-whitePrimary grid place-items-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center text-greenPrimary">
        <div className="relative w-[250px] h-[210px] md:w-[350px] md:h-[290px] overflow-hidden">
          <Image
            src="/basketEmpty.png"
            alt=""
            fill
            className="object-contain object-bottom"
            priority
            placeholder="blur"
            blurDataURL="/basketEmpty.png"
          />
        </div>
        <div>
          <h5 className="text-xl font-bold text-greenPrimary ">{text}</h5>
        </div>
      </div>
    </div>
  );
};
