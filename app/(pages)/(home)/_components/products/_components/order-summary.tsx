"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Flame, Trash2, ShoppingCart, Check } from "lucide-react";

type OrderSummaryProps = {
  activeCal: string;
  rationName?: string;
  dishesCount: number;
  pricePerDay: number;
  isInCart: boolean;
  totalInCart: number;
  onAdd: () => void;
  onRemove: () => void;
  onOpenBasket: () => void;
};

function dishesWord(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "блюдо";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "блюда";
  return "блюд";
}

const OrderSummaryComponent: React.FC<OrderSummaryProps> = ({
  activeCal,
  rationName,
  dishesCount,
  pricePerDay,
  isInCart,
  totalInCart,
  onAdd,
  onRemove,
  onOpenBasket,
}) => {
  return (
    <div
      className={`mt-6 rounded-2xl overflow-hidden border transition-all duration-300 ${
        isInCart
          ? "border-colorPrimary/20 bg-colorPrimary"
          : "border-grey-border bg-whiteSecondary"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
        {/* Left: ration info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div
            className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl ${
              isInCart ? "bg-white/15 text-white" : "bg-colorPrimary text-white"
            }`}
          >
            <Flame size={13} className="opacity-70" />
            <span className="text-[15px] font-extrabold leading-none">
              {activeCal}
            </span>
            <span className="text-[8px] font-bold uppercase opacity-60">
              ккал
            </span>
          </div>

          <div className="min-w-0">
            {rationName && (
              <p
                className={`text-xs font-semibold mb-0.5 truncate ${
                  isInCart ? "text-white/60" : "text-greySecondary"
                }`}
              >
                {rationName}
              </p>
            )}
            <p
              className={`text-xl font-extrabold leading-tight ${isInCart ? "text-white" : "text-colorPrimary"}`}
            >
              {activeCal}{" "}
              <span
                className={`text-sm font-semibold ${isInCart ? "text-white/70" : "text-greySecondary"}`}
              >
                ккал
              </span>
            </p>
            <p
              className={`text-xs mt-0.5 ${isInCart ? "text-white/70" : "text-greySecondary"}`}
            >
              {dishesCount} {dishesWord(dishesCount)} в день ·{" "}
              <span
                className={`font-bold ${isInCart ? "text-yellowPrimary" : "text-yellow-hover"}`}
              >
                {pricePerDay} BYN/день
              </span>
            </p>
            {isInCart && (
              <p className="text-xs text-white/60 mt-0.5">
                Выберите даты доставки в корзине
              </p>
            )}
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          {isInCart ? (
            <>
              <button
                onClick={onRemove}
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
                aria-label="Убрать рацион"
              >
                <Trash2 size={15} />
              </button>
              <Button
                size="default"
                className="flex-1 sm:flex-none bg-yellowPrimary text-colorPrimary font-bold hover:bg-yellow-hover hover:text-white"
                onClick={onOpenBasket}
              >
                <ShoppingCart size={14} />
                Корзина
                {totalInCart > 0 && (
                  <span className="ml-1 bg-colorPrimary/15 text-colorPrimary rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold">
                    {totalInCart}
                  </span>
                )}
              </Button>
            </>
          ) : (
            <Button
              size="default"
              className="w-full sm:w-auto bg-yellowPrimary text-colorPrimary font-bold hover:bg-yellow-hover hover:text-white min-w-[180px]"
              onClick={onAdd}
            >
              <ShoppingBag size={14} />В корзину
              {totalInCart > 0 && (
                <span className="ml-1.5 flex items-center gap-0.5 text-[11px] font-bold bg-colorPrimary/10 text-colorPrimary rounded-full px-1.5">
                  <Check size={9} strokeWidth={3} />
                  {totalInCart}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export const OrderSummary = React.memo(OrderSummaryComponent, (prev, next) => {
  return (
    prev.activeCal === next.activeCal &&
    prev.rationName === next.rationName &&
    prev.dishesCount === next.dishesCount &&
    prev.pricePerDay === next.pricePerDay &&
    prev.isInCart === next.isInCart &&
    prev.totalInCart === next.totalInCart
  );
});
