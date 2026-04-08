"use client";

import { FC, useEffect, useState } from "react";
import { addDays, isBefore, format, set, startOfWeek } from "date-fns";
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
  defaultValue?: string;
};

export const SelectDate: FC<TSelectDate> = ({ onChange, defaultValue }) => {
  const [deliveryRanges, setDeliveryRanges] = useState<
    { label: string; value: string; disabled: boolean }[]
  >([]);
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    const today = set(new Date(), {
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });

    // Понедельник текущей недели
    let current = startOfWeek(today, { weekStartsOn: 1 });

    const ranges: { label: string; value: string; disabled: boolean }[] = [];

    for (let i = 0; i < 4; i++) {
      const rangeStart = current;
      const rangeEnd = addDays(current, 5); // понедельник–суббота
      const isPast = isBefore(rangeEnd, today);

      ranges.push({
        value: `${format(rangeStart, "yyyy-MM-dd")}_${format(
          rangeEnd,
          "yyyy-MM-dd",
        )}`,
        label: `${format(rangeStart, "dd.MM", { locale: ru })}–${format(
          rangeEnd,
          "dd.MM",
          { locale: ru },
        )}`,
        disabled: isPast,
      });

      current = addDays(current, 7);
    }

    setDeliveryRanges(ranges);
  }, []);

  useEffect(() => {
    if (deliveryRanges.length === 0) return;

    let nextValue = "";

    if (defaultValue) {
      const match = deliveryRanges.find(
        (range) => range.value === defaultValue && !range.disabled,
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
  }, [defaultValue, deliveryRanges, onChange, selectedValue]);

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
        className="w-[150px] text-colorPrimary font-semibold border-grey-border cursor-pointer select-none bg-whiteSecondary"
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
              className="text-colorPrimary"
            >
              {range.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
