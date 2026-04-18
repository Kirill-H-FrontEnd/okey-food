"use client";
import { FC, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CartItem } from "@/store/useStore";
import { getEffectivePricePerDay, getTotalPrice } from "@/lib/pricing";
import { Trash2, CalendarDays, Flame } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { parseISO, isBefore, startOfToday, format } from "date-fns";

type BasketItemProps = {
  item: CartItem;
  onRemove: (id: string) => void;
  onDaysChange: (id: string, days: string[]) => void;
  onNoteChange: (id: string, note: string) => void;
};

function isoToDate(iso: string): Date | null {
  try {
    const d = parseISO(iso);
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function dateToIso(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export const BasketItem: FC<BasketItemProps> = ({
  item,
  onRemove,
  onDaysChange,
  onNoteChange,
}) => {
  const [open, setOpen] = useState(() => item.selectedDays.length === 0);

  const daysCount = item.selectedDays.length;
  const effectivePricePerDay = getEffectivePricePerDay(
    item.pricePerDay,
    daysCount,
  );
  const totalPrice = getTotalPrice(item.pricePerDay, daysCount);

  const selectedDates = useMemo(
    () => item.selectedDays.map(isoToDate).filter((d): d is Date => d !== null),
    [item.selectedDays],
  );

  const today = startOfToday();

  const isDateDisabled = (date: Date) => isBefore(date, today);

  const handleSelect = (dates: Date[] | undefined) => {
    const newDays = (dates ?? [])
      .filter((d) => !isDateDisabled(d))
      .map(dateToIso)
      .sort();
    onDaysChange(item.id, newDays);
  };

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col rounded-2xl border border-greySecondary/40 bg-whiteSecondary overflow-hidden"
      aria-label={`Тариф ${item.calories} ккал`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-colorPrimary text-white">
            <Flame size={12} className="opacity-70" />
            <span className="text-sm font-extrabold leading-none">
              {item.calories}
            </span>
            <span className="text-[8px] font-semibold uppercase opacity-60">
              ккал
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-colorPrimary truncate">
              {item.calories} ккал
            </p>
            <p className="text-xs text-greySecondary">
              {item.dishesCount} блюд/день ·{" "}
              <span className="text-yellow-hover font-semibold">
                {effectivePricePerDay} BYN/день
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-greySecondary hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
          aria-label="Удалить из корзины"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Popover trigger: date summary row */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-colorPrimary/10 bg-colorPrimary/5 hover:bg-colorPrimary/10 transition-colors cursor-pointer w-full text-left"
          >
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-yellow-hover shrink-0" />
              {daysCount > 0 ? (
                <span className="text-xs font-semibold text-colorPrimary">
                  {daysCount}{" "}
                  {daysCount === 1 ? "день" : daysCount < 5 ? "дня" : "дней"}{" "}
                  выбрано
                  <span className="text-yellow-hover font-bold">
                    {" "}
                    · {totalPrice} BYN
                  </span>
                </span>
              ) : (
                <span className="text-xs font-semibold text-yellow-hover">
                  Выберите даты доставки
                </span>
              )}
            </div>
            <CalendarDays
              size={13}
              className="text-greySecondary/60 shrink-0"
            />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start" sideOffset={6}>
          <div className="flex flex-col">
            <div className="px-3 pt-3 pb-3">
              <Calendar
                mode="multiple"
                selected={selectedDates}
                onSelect={handleSelect}
                disabled={isDateDisabled}
                startMonth={today}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </motion.li>
  );
};
