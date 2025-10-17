"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { HyperText } from "@/components/magicui/hyper-text";
type OrderSummaryProps = {
  activeCal: string;
  dishesCount: number;
  hasRange: boolean;
  daysCount: number;
  pricePerDay: number;
  totalPrice: number;
  onInc: () => void;
  onDec: () => void;
  onAdd: () => void;
};

const OrderSummaryComponent: React.FC<OrderSummaryProps> = ({
  activeCal,
  dishesCount,
  hasRange,
  daysCount,
  pricePerDay,
  totalPrice,
  onInc,
  onDec,
  onAdd,
}) => {
  function dishesWord(n: number) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return "блюдо";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
      return "блюда";
    return "блюд";
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 justify-between bg-greyPrimary items-end gap-8 md:gap-10 border border-grey-border pt-4 rounded-[8px] w-full md:max-w-[580px] p-4 mt-2">
      <div>
        <h5 className="font-bold text-greenPrimary">Ваш выбор:</h5>
        <div className="mt-4">
          <span className="font-bold flex items-center gap-3 text-[18px] text-greenPrimary">
            Тариф {activeCal}{" "}
            <span className="text-sm text-greySecondary font-light">
              {" "}
              {dishesCount} {dishesWord(dishesCount)} в день
            </span>
          </span>
        </div>

        <div className="grid gap-2 mt-2">
          <p className="text-greenPrimary text-sm font-semibold">
            Количество дней
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={onDec}
              className="px-4 py-2 border-[1px] border-grey-border bg-white text-greenPrimary rounded-[6px] hover:bg-whitePrimary/70 transition-colors"
              aria-label="Уменьшить дни"
            >
              −
            </Button>

            <Input
              readOnly
              value={daysCount}
              inputMode="numeric"
              aria-readonly="true"
              className="w-[85px] text-center font-bold border-[1px] border-grey-border bg-white text-greenPrimary rounded-[6px]"
            />

            <Button
              onClick={onInc}
              className="px-4 py-2 border-[1px] border-grey-border bg-white text-greenPrimary rounded-[6px] hover:bg-whitePrimary/70 transition-colors"
              aria-label="Увеличить дни"
              disabled={!hasRange}
            >
              +
            </Button>
          </div>
        </div>
      </div>
      <div className="grid content-end gap-4">
        <div className="flex items-center justify-between text-greenPrimary">
          <p className="font-bold flex gap-2 text-greenPrimary">
            Итого:
            <span className="text-yellow-hover inline-block min-h-[1em]">
              {totalPrice ? (
                <HyperText
                  key={totalPrice}
                  duration={600}
                  startOnView={false}
                  animateOnHover={false}
                  className="inline-block !py-0 !text-inherit !font-bold leading-none tabular-nums"
                >
                  {`${totalPrice} BYN`}
                </HyperText>
              ) : (
                ""
              )}
            </span>
          </p>
        </div>

        <Button
          size="lg"
          variant="default"
          className="bg-yellowPrimary text-greenPrimary font-bold "
          onClick={onAdd}
          disabled={!hasRange || daysCount === 0}
        >
          <ShoppingCart size={10} />
          Корзина
        </Button>
      </div>
    </div>
  );
};

export const OrderSummary = React.memo(OrderSummaryComponent, (prev, next) => {
  return (
    prev.activeCal === next.activeCal &&
    prev.dishesCount === next.dishesCount &&
    prev.hasRange === next.hasRange &&
    prev.daysCount === next.daysCount &&
    prev.pricePerDay === next.pricePerDay &&
    prev.totalPrice === next.totalPrice
  );
});
