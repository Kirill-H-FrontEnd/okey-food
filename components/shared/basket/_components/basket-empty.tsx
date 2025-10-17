// components/cart/basket-empty.tsx
"use client";
import { FC } from "react";
import { ShoppingCart } from "lucide-react";

type BasketEmptyProps = { text?: string };

export const BasketEmpty: FC<BasketEmptyProps> = ({
  text = "Ваша корзина пуста.",
}) => {
  return (
    <div
      className="min-h-full grid place-items-center px-4"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center gap-3 text-greenPrimary">
        <div className="rounded-xl p-4 bg-greyPrimary">
          <ShoppingCart className="w-10 h-10" aria-hidden />
        </div>
        <p className="text-sm text-greySecondary max-w-[28ch]">{text}</p>
      </div>
    </div>
  );
};
