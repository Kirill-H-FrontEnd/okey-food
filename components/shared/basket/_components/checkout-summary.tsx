"use client";

import { FC } from "react";
import { AnimatedAmount } from "@/components/magicui/animated-amount";
import { daysWord } from "@/components/shared/basket/utils";
import { CartItem } from "@/store/useStore";
import { Calendar, CheckCircle2, Info } from "lucide-react";

type CheckoutSummaryProps = {
  items: CartItem[];
  totalLabel: string;
};

export const CheckoutSummary: FC<CheckoutSummaryProps> = ({
  items,
  totalLabel,
}) => (
  <div className="rounded-2xl bg-whiteSecondary border border-black/5 p-4 shadow-xl shadow-black/5 text-colorPrimary overflow-hidden relative">
    <div className="absolute top-0 right-0 p-8 opacity-[0.1] pointer-events-none text-yellow-hover">
      <CheckCircle2 size={120} />
    </div>

    <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/5">
      <p className="text-xl font-bold text-colorPrimary">Итого к оплате</p>
      <div className="text-md font-bold text-yellow-hover flex items-baseline gap-1">
        <AnimatedAmount value={totalLabel} durationMs={400} />
      </div>
    </div>

    {items.length > 0 && (
      <ul className="grid gap-4">
        {items.map((item) => (
          <li
            key={`summary-${item.id}`}
            className="rounded-xl bg-whitePrimary border border-black/5 p-4"
          >
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-greenPrimary text-yellow-hover grid place-items-center text-[10px] font-bold bg-whiteSecondary">
                  {item.calories}
                </div>
                <span className="font-bold text-sm">
                  Тариф {item.calories} ккал
                </span>
              </div>
              <span className="font-bold text-sm bg-white px-3 py-1 rounded-full shadow-sm">
                {item.selectedDays.length} {daysWord(item.selectedDays.length)}
              </span>
            </div>

            <div className="grid gap-2">
              <div className="flex items-start gap-2 text-[11px] font-bold text-greenPrimary/60 bg-white/50 p-2 rounded-lg">
                <Calendar size={12} className="shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  <span>Выбранные дни:</span>
                  {item.selectedDays.map((day, idx) => (
                    <span key={day} className="text-greenPrimary">
                      {day}
                      {idx !== item.selectedDays.length - 1 ? "," : ""}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-greenPrimary/60 px-2">
                <div className="w-1 h-1 rounded-full bg-greenPrimary/30" />
                <span>{item.dishesCount} полноценных блюд в день</span>
              </div>
            </div>
          </li>
        ))}

        <div className=" p-4 rounded-xl bg-yellow-hover/10 border border-yellow-hover/20 flex gap-2">
          <Info size={16} className="text-yellow-hover shrink-0" />
          <p className="text-[11px] font-semibold text-yellow-hover leading-relaxed">
            Оплата производится наличными или картой при получении, либо через
            систему ЕРИП после подтверждения заказа менеджером.
          </p>
        </div>
      </ul>
    )}
  </div>
);
