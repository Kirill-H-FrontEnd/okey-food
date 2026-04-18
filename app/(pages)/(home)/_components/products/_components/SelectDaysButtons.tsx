"use client";
import { FC } from "react";
import { format, parseISO, addDays } from "date-fns";
import { ru } from "date-fns/locale";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

type TSelectDaysButtons = {
  range: string;
  activeDay: string | null;
  onSetActiveDay: (day: string) => void;
};

export const SelectDaysButtons: FC<TSelectDaysButtons> = ({
  range,
  activeDay,
  onSetActiveDay,
}) => {
  if (!range) return null;

  const [startStr, endStr] = range.split("_");
  const start = parseISO(startStr);
  const end = parseISO(endStr);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(start, i);
    if (day > end) break;
    days.push(day);
  }

  const renderBtn = (day: Date) => {
    const value = format(day, "yyyy-MM-dd");
    const label = format(day, "EEE, d", { locale: ru });
    const isActive = activeDay === value;

    return (
      <Button
        key={value}
        onClick={() => onSetActiveDay(value)}
        className={clsx(
          "min-w-[72px] flex-1 capitalize text-xs px-2",
          isActive
            ? "bg-colorPrimary text-whitePrimary "
            : "bg-colorPrimary/10 text-colorPrimary shadow hover:bg-colorPrimary/20",
        )}
      >
        {label}
      </Button>
    );
  };

  return (
    <div className="flex gap-1.5 flex-wrap mt-3">
      {days.map((d) => renderBtn(d))}
    </div>
  );
};
