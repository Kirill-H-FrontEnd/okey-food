"use client";
import { FC, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/store/useStore";
import { listSelectableDays } from "@/lib/delivery-days";
import { Trash2, Calendar, Plus, Minus } from "lucide-react";

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
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-whiteSecondary backdrop-blur-sm border border-black/5 rounded-xl p-4 transition-all  "
      aria-label={`Тариф ${item.calories}`}
    >
      <div className="flex w-full items-center gap-4">
        <div className="w-16 h-16 sm:w-18 sm:h-18 shrink-0 grid place-items-center bg-greenPrimary/5 rounded-xl text-colorPrimary border border-greenPrimary/10">
          <p className="text-lg font-black tracking-tighter">{item.calories}</p>
          <p className="text-[10px] uppercase font-bold opacity-60">ккал</p>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold text-greenPrimary text-lg truncate">
              Тариф {item.calories}
            </h4>
            <div className="sm:hidden font-bold text-greenPrimary">
              {totalPrice} BYN
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-greySecondary font-medium">
            <span className="bg-greenPrimary/10 text-greenPrimary py-0.5 rounded-full">
              {item.dishesCount} блюд
            </span>
          </div>
        </div>
      </div>

      <div className="flex relative w-full sm:w-auto items-center justify-between sm:justify-end pt-3 sm:pt-0 border-t sm:border-none border-black/5">
        <div className="flex items-center bg-whitePrimary border border-black/10 rounded-xl p-1 ">
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

        <div className="flex flex-col items-end min-w-[100px]">
          <span className="font-bold text-md text-yellow-hover">
            {totalPrice} <span className="text-xs font-bold ">BYN</span>
          </span>
          <p className="text-[10px] text-colorPrimary font-extrabold uppercase tracking-wider">
            {item.pricePerDay} / день
          </p>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-greySecondary hover:text-red-500 cursor-pointer rounded-xl transition-all absolute bottom-[5px] left-[120px] "
          aria-label={`Удалить тариф ${item.calories} из корзины`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.li>
  );
};
