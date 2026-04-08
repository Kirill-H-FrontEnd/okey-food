"use client";
import { FC, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/store/useStore";
import { listSelectableDays } from "@/lib/delivery-days";
import { Trash2, Plus, Minus } from "lucide-react";

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

  const canIncrement = typeof maxDays === "number" ? daysCount < maxDays : true;

  const canDecrement = daysCount > 1;

  const handleDec = useCallback(() => {
    if (!canDecrement) return;
    onDecrement(item.id);
  }, [canDecrement, onDecrement, item.id]);

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        layout: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        duration: 0.2,
      }}
      className="group relative flex flex-col gap-3 rounded-2xl border border-grey-border bg-whiteSecondary p-3 transition-colors hover:border-greenPrimary/25 sm:p-4"
      aria-label={`Тариф ${item.calories}`}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-colorPrimary/10 shadow bg-greenPrimary/5 text-colorPrimary">
            <div className="text-center">
              <p className="text-lg font-extrabold tracking-tighter">
                {item.calories}
              </p>
              <p className="text-[10px] uppercase font-bold opacity-60">ккал</p>
            </div>
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="truncate text-base font-bold text-colorPrimary sm:text-[18px]">
              Тариф {item.calories}
            </h4>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-greySecondary">
              <span className="rounded-full bg-greenPrimary/10  py-0.5 text-greenPrimary">
                {item.dishesCount} блюд
              </span>
              <span className="rounded-full text-yellow-hover bg-black/5 border border-colorPrimary/10 px-3 py-0.5">
                {daysCount} {daysCount === 1 ? "день" : "дней"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="inline-flex shrink-0 items-center justify-center rounded-lg p-2 text-greySecondary transition-colors hover:bg-red-50 hover:text-red-500 cursor-pointer"
          aria-label={`Удалить тариф ${item.calories} из корзины`}
          title="Удалить из корзины"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex w-full items-center justify-between border-t border-colorPrimary/10 pt-2">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-greySecondary">
            {item.pricePerDay} BYN / день
          </span>
          <span className="text-lg font-bold leading-none text-yellowPrimary">
            {totalPrice} <span className="text-xs font-semibold">BYN</span>
          </span>
        </div>

        <div className="flex items-center rounded-xl border border-black/10 bg-whitePrimary p-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDec}
            disabled={!canDecrement}
            className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500 disabled:opacity-20"
            aria-label="Уменьшить дни"
            aria-disabled={!canDecrement}
            title={!canDecrement ? "Минимум 1 день" : undefined}
          >
            <Minus size={14} />
          </Button>

          <div className="w-10 text-center font-bold text-greenPrimary select-none">
            {daysCount}
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => onIncrement(item.id)}
            disabled={!canIncrement}
            className="h-8 w-8 rounded-lg hover:bg-green-50 hover:text-green-500 disabled:opacity-20"
            aria-label="Увеличить дни"
            aria-disabled={!canIncrement}
          >
            <Plus size={14} />
          </Button>
        </div>
      </div>
    </motion.li>
  );
};
