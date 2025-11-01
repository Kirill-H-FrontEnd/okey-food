"use client";
import { FC, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CartItem } from "@/store/useStore";
import { listSelectableDays } from "@/lib/delivery-days";
import { Trash } from "lucide-react";
import { m } from "framer-motion";
type BasketItemProps = {
  item: CartItem;
  onRemove: (id: string) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
};

export const BasketItem: FC<BasketItemProps> = ({
  item,
  onRemove,
  onIncrement,
  onDecrement,
}) => {
  const daysCount = item.selectedDays.length;
  const totalPrice = item.pricePerDay * daysCount;

  const maxDays = useMemo(() => {
    if (!item.range) return null;
    return listSelectableDays(item.range).length;
  }, [item.range]);

  const canIncrement =
    typeof maxDays === "number" ? daysCount < maxDays : item.range !== null;

  const canDecrement = daysCount > 1;

  const handleDec = useCallback(() => {
    if (!canDecrement) return;
    onDecrement(item.id);
  }, [canDecrement, onDecrement, item.id]);

  return (
    <m.li
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-start gap-4 border-b border-input pb-4"
      aria-label={`Тариф ${item.calories}`}
    >
      <div className="hidden w-20 h-20 shrink-0 md:grid place-items-center bg-greyPrimary rounded-md text-greenPrimary font-bold">
        <p>{item.calories}</p>
      </div>

      <div className=" w-full  grid grid-cols-[auto_1fr_auto] justify-center ">
        <div className="md:grid gap-1 min-w-0">
          <p className="font-bold truncate text-greenPrimary">
            Тариф {item.calories}
          </p>
          <p className="text-xs text-greySecondary line-clamp-1">
            {item.dishesCount} блюд в день
          </p>

          <div className="mt-2 hidden md:block">
            <button
              className="h-auto text-greenPrimary cursor-pointer inline-flex items-center gap-1 hover:text-red-400 transition-colors"
              onClick={() => onRemove(item.id)}
              aria-label={`Удалить тариф ${item.calories} из корзины`}
            >
              <Trash size={18} />
              <span className="text-xs font-medium">Удалить</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center  gap-3 shrink-0">
          <div>
            <p className="text-greenPrimary text-sm font-semibold">
              Количество дней
            </p>
            <div className="flex items-center gap-1 md:gap-2">
              <Button
                onClick={handleDec}
                disabled={!canDecrement}
                title={!canDecrement ? "Минимум 1 день" : undefined}
                className="px-3 py-2 border-[1px] border-grey-border bg-white text-greenPrimary rounded-[6px] hover:bg-whitePrimary/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Уменьшить дни"
                aria-disabled={!canDecrement}
              >
                −
              </Button>

              <Input
                readOnly
                value={daysCount}
                inputMode="numeric"
                aria-readonly="true"
                className="w-[50px] sm:w-[80px] text-center font-bold border-[1px] border-grey-border bg-white text-greenPrimary rounded-[6px]"
              />

              <Button
                onClick={() => onIncrement(item.id)}
                className="px-3 py-2 border-[1px] border-grey-border bg-white text-greenPrimary rounded-[6px] hover:bg-whitePrimary/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Увеличить дни"
                disabled={!canIncrement}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="font-bold text-sm text-yellow-hover whitespace-nowrap">
            {totalPrice} BYN
          </span>
          <p className="text-xs hidden md:block text-greySecondary whitespace-nowrap">
            {item.pricePerDay} BYN / день
          </p>
          <div className="mt-1 md:hidden">
            <button
              className="h-auto text-greenPrimary cursor-pointer inline-flex items-center gap-1 hover:text-red-400 transition-colors"
              onClick={() => onRemove(item.id)}
              aria-label={`Удалить тариф ${item.calories} из корзины`}
            >
              <Trash size={18} />
              <span className="text-xs font-medium">Удалить</span>
            </button>
          </div>
        </div>
      </div>
    </m.li>
  );
};
