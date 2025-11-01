"use client";

import { FC, useEffect, useState } from "react";
import {
  addDays,
  startOfMonth,
  isBefore,
  format,
  isMonday,
  isSameMonth,
  set,
} from "date-fns";
import { ru } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TSelectDate = {
  onChange?: (value: string) => void;
  defaultValue?: string; // CHANGED
};

export const SelectDate: FC<TSelectDate> = ({ onChange, defaultValue }) => {
  // CHANGED
  const [deliveryRanges, setDeliveryRanges] = useState<
    { label: string; value: string; disabled: boolean }[]
  >([]);
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    // генерим диапазоны
    const today = set(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    const startMonth = startOfMonth(today);
    let firstMonday = startMonth;
    while (!isMonday(firstMonday)) {
      firstMonday = addDays(firstMonday, 1);
    }

    const ranges: { label: string; value: string; disabled: boolean }[] = [];
    let current = firstMonday;

    for (let i = 0; i < 4; i++) {
      const days: Date[] = [];
      let temp = current;

      while (days.length < 6 && isSameMonth(temp, startMonth)) {
        if (temp.getDay() !== 0) {
          days.push(temp);
        }
        temp = addDays(temp, 1);
      }

      if (days.length === 0) break;

      const rangeStart = days[0];
      const rangeEnd = days[days.length - 1];
      const isPast = isBefore(rangeEnd, today);

      ranges.push({
        value: `${format(rangeStart, "yyyy-MM-dd")}_${format(
          rangeEnd,
          "yyyy-MM-dd"
        )}`,
        label: `${format(rangeStart, "dd.MM", { locale: ru })}–${format(
          rangeEnd,
          "dd.MM",
          { locale: ru }
        )}`,
        disabled: isPast,
      });

      current = temp;
    }

    setDeliveryRanges(ranges);
  }, []);

  useEffect(() => {
    if (deliveryRanges.length === 0) return;

    let nextValue = "";

    if (defaultValue) {
      const match = deliveryRanges.find(
        (range) => range.value === defaultValue && !range.disabled
      );
      if (match) {
        nextValue = match.value;
      }
    }

    if (!nextValue) {
      const firstAvailable = deliveryRanges.find((r) => !r.disabled);
      if (firstAvailable) {
        nextValue = firstAvailable.value;
      }
    }

    if (nextValue && nextValue !== selectedValue) {
      setSelectedValue(nextValue);
      onChange?.(nextValue);
    }
  }, [defaultValue, deliveryRanges, onChange, selectedValue]); // NEW

  return (
    <Select
      value={selectedValue}
      onValueChange={(value) => {
        setSelectedValue(value);
        onChange?.(value);
      }}
    >
      <SelectTrigger
        aria-label="Выбрать дату"
        className="w-[150px] text-greenPrimary font-semibold border-grey-border cursor-pointer select-none"
      >
        <SelectValue placeholder="Выберите период доставки" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-greySecondary">
            Периоды доставки
          </SelectLabel>
          {deliveryRanges.map((range) => (
            <SelectItem
              key={range.value}
              value={range.value}
              disabled={range.disabled}
              className="text-greenPrimary"
            >
              {range.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
