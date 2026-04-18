"use client";

import { FC, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CartItem } from "@/store/useStore";
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
  const totalPrice = item.pricePerDay * daysCount;

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
      layout
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      exit={{
        opacity: 0,
        y: -10,
        scale: 0.96,
        filter: "blur(4px)",
        transition: {
          duration: 0.24,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      transition={{
        layout: {
          duration: 0.32,
          ease: [0.22, 1, 0.36, 1],
        },
        opacity: {
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1],
        },
        y: {
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1],
        },
        scale: {
          duration: 0.25,
          ease: [0.22, 1, 0.36, 1],
        },
        filter: {
          duration: 0.2,
          ease: "easeOut",
        },
      }}
      style={{ transformOrigin: "top center" }}
      className="overflow-hidden rounded-2xl border border-greySecondary/40 bg-whiteSecondary"
      aria-label={`Тариф ${item.calories} ккал`}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
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
              <p className="truncate text-sm font-bold text-colorPrimary">
                {item.calories} ккал
              </p>

              <p className="text-xs text-greySecondary">
                {item.dishesCount} блюд/день ·{" "}
                <span className="font-semibold text-yellow-hover">
                  {item.pricePerDay} BYN/день
                </span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-greySecondary transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="Удалить из корзины"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-2 border-t border-colorPrimary/10 bg-colorPrimary/5 px-4 py-2.5 text-left transition-colors hover:bg-colorPrimary/10"
            >
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={14}
                  className="shrink-0 text-yellow-hover"
                />

                {daysCount > 0 ? (
                  <span className="text-xs font-semibold text-colorPrimary">
                    {daysCount}{" "}
                    {daysCount === 1 ? "день" : daysCount < 5 ? "дня" : "дней"}{" "}
                    выбрано
                    <span className="font-bold text-yellow-hover">
                      {" "}
                      · {totalPrice} BYN
                    </span>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-yellow-hover">
                    Выберите даты доставки
                  </span>
                )}
              </div>
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start" sideOffset={6}>
            <div className="flex flex-col">
              <div className="px-3 pb-3 pt-3">
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
      </div>
    </motion.li>
  );
};
