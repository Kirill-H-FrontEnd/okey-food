"use client";

import { FC, useEffect } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Truck, Moon } from "lucide-react";
import type { CartItem } from "@/store/useStore";
import type { TRation } from "@/types/admin";
import type { DeliverySlotItem } from "../types";
import { Button } from "@/components/ui/button";

type DeliverySlotPickerProps = {
  items: CartItem[];
  rations: TRation[];
  slots: DeliverySlotItem[];
  onSlotsChange: (slots: DeliverySlotItem[]) => void;
};

const TIME_SLOTS = [
  { value: "8-10" as const, label: "8:00 – 10:00", hint: "утро" },
  { value: "12-16" as const, label: "12:00 – 16:00", hint: "день" },
];

function formatDay(isoDate: string): string {
  try {
    const date = new Date(isoDate + "T00:00:00");
    return format(date, "d MMMM, EEE", { locale: ru });
  } catch {
    return isoDate;
  }
}

function formatRangeLabel(range: string | null): string {
  if (!range) return "";
  const [start, end] = range.split("_");
  try {
    const s = new Date(start + "T00:00:00");
    const e = new Date(end + "T00:00:00");
    return `${format(s, "d MMM", { locale: ru })} – ${format(e, "d MMM", { locale: ru })}`;
  } catch {
    return range;
  }
}

export const DeliverySlotsPicker: FC<DeliverySlotPickerProps> = ({
  items,
  rations,
  slots,
  onSlotsChange,
}) => {
  useEffect(() => {
    const newSlots: DeliverySlotItem[] = items.map((item) => {
      const existing = slots.find((s) => s.rationCalories === item.calories);
      const rationName =
        rations.find((r) => r.calories === item.calories)?.name ??
        `Рацион ${item.calories} ккал`;
      return {
        rationCalories: item.calories,
        rationName,
        days: item.selectedDays,
        range: item.range,
        timeSlot: existing?.timeSlot ?? "8-10",
      };
    });
    onSlotsChange(newSlots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.calories + i.selectedDays.join(",")).join("|")]);

  const updateSlot = (rationCalories: string, timeSlot: "8-10" | "12-16") => {
    onSlotsChange(
      slots.map((s) =>
        s.rationCalories === rationCalories ? { ...s, timeSlot } : s,
      ),
    );
  };

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Truck size={16} className="text-yellow-hover shrink-0" />
        <p className="text-sm font-bold text-colorPrimary">График доставки</p>
      </div>

      <div className="rounded-2xl border border-yellow-hover/20 bg-yellow-hover/5 p-3 flex items-start gap-2">
        <Moon size={14} className="text-yellow-hover shrink-0 mt-0.5" />
        <p className="text-xs font-medium text-yellow-hover leading-relaxed">
          Доставка осуществляется <span className="font-bold"> накануне</span>{" "}
          выбранного дня. Выберите удобный временной интервал.
        </p>
      </div>

      <div className="space-y-4">
        {slots.map((slot) => (
          <div
            key={slot.rationCalories}
            className="rounded-2xl border border-greySecondary/30 bg-whitePrimary overflow-hidden "
          >
            <div className="px-4 py-3 bg-colorPrimary/5 border-b border-greySecondary/20">
              <p className="text-sm font-bold text-colorPrimary capitalize">
                {slot.rationName}
              </p>
              {slot.range && (
                <p className="text-xs text-greySecondary mt-0.5">
                  Неделя: {formatRangeLabel(slot.range)}
                </p>
              )}
            </div>

            <div className="px-4 py-3 space-y-3">
              <div>
                <p className="text-xs font-semibold text-greySecondary mb-2  tracking-wide">
                  Выбранные дни ({slot.days.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {slot.days.map((day) => (
                    <span
                      key={day}
                      className="rounded-md border border-colorPrimary/10 bg-colorPrimary/5 px-2 py-0.5 text-xs font-medium text-colorPrimary"
                    >
                      {formatDay(day)}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-greySecondary mb-2  tracking-wide">
                  Время доставки
                </p>
                <div className="flex gap-2">
                  {TIME_SLOTS.map((ts) => {
                    const isActive = slot.timeSlot === ts.value;
                    return (
                      <Button
                        key={ts.value}
                        type="button"
                        onClick={() =>
                          updateSlot(slot.rationCalories, ts.value)
                        }
                        className={`flex-1 rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all ${
                          isActive
                            ? "border-yellow-hover bg-yellowPrimary text-colorPrimary shadow-sm"
                            : "border-greySecondary/30 bg-whiteSecondary text-colorPrimary/60 hover:border-yellow-hover/50 hover:text-colorPrimary"
                        }`}
                      >
                        <span className="block font-bold">{ts.label}</span>
                        <span className="block text-[10px] mt-0.5 opacity-70">
                          {ts.hint}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
