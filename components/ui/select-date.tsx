"use client";
import { FC, useMemo } from "react";
import { format } from "date-fns";
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

type TSelectDate = {};

export const SelectDate: FC = ({}) => {
  const { deliveryRanges, defaultRangeValue } = useMemo(() => {
    const today = new Date();
    const ranges: { label: string; value: string; disabled: boolean }[] = [];

    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 4; i++) {
      const rangeStart = new Date(today);
      rangeStart.setDate(today.getDate() + i * 7);

      const rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeEnd.getDate() + 6);

      const isPast = rangeEnd < today;

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
    }

    const firstAvailable = ranges.find((r) => !r.disabled)?.value || "";

    return { deliveryRanges: ranges, defaultRangeValue: firstAvailable };
  }, []);
  return (
    <Select defaultValue={defaultRangeValue}>
      <SelectTrigger className="w-[150px] text-greenPrimary font-semibold border-grey-border cursor-pointer select-none">
        <SelectValue placeholder="Выберите период доставки" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel className="text-greySecondary">
            Периоды доставки
          </SelectLabel>
          {deliveryRanges.map((range) => (
            <SelectItem
              className="text-greenPrimary "
              key={range.value}
              value={range.value}
              disabled={range.disabled}
            >
              {range.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
