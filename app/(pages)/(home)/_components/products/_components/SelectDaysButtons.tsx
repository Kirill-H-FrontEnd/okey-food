"use client";

import { FC } from "react";
import { format, parseISO, addDays, isBefore, isToday } from "date-fns";
import { ru } from "date-fns/locale";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

type TSelectDaysButtons = {
  range: string; // формат: '2025-08-11_2025-08-16'
  onToggleDay: (day: string) => void;
  selectedDays: string[];
};

export const SelectDaysButtons: FC<TSelectDaysButtons> = ({
  range,
  onToggleDay,
  selectedDays,
}) => {
  if (!range) return null;

  const [startStr, endStr] = range.split("_");
  const start = parseISO(startStr);
  const end = parseISO(endStr);

  const days = [];
  for (let i = 0; i < 6; i++) {
    const day = addDays(start, i);
    if (day > end) break;
    days.push(day);
  }

  return (
    <div className="flex gap-3 mt-4 flex-wrap">
      {days.map((day) => {
        const value = format(day, "yyyy-MM-dd");
        const label = format(day, "EEE, d MMM", { locale: ru });
        const isDisabled = isBefore(day, new Date()) && !isToday(day);
        const isSelected = selectedDays.includes(value);

        return (
          <Button
            key={value}
            disabled={isDisabled}
            onClick={() => onToggleDay(value)}
            className={clsx(
              "w-[120px] capitalize",
              isSelected
                ? "bg-greenPrimary text-whitePrimary border-greenPrimary"
                : "bg-white text-greenPrimary border-[1px] border-grey-border hover:bg-whitePrimary",
              isDisabled && "opacity-50 cursor-not-allowed hover:bg-white"
            )}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};
