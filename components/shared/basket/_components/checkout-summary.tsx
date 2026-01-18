"use client";

import { FC } from "react";

import { AnimatedAmount } from "@/components/magicui/animated-amount";
import { daysWord } from "@/components/shared/basket/utils";
import { CartItem } from "@/store/useStore";

type CheckoutSummaryProps = {
  items: CartItem[];
  totalLabel: string;
};

export const CheckoutSummary: FC<CheckoutSummaryProps> = ({
  items,
  totalLabel,
}) => (
  <div className="rounded-[8px] bg-greyPrimary p-4 text-primary">
    <div className="flex items-center gap-2">
      <p className="text-[20px] font-bold">Итого:</p>
      <p className="text-[20px] font-bold text-yellow-hover">
        <AnimatedAmount value={totalLabel} durationMs={200} />
      </p>
    </div>

    {items.length > 0 && (
      <ul className="mt-4 grid gap-4">
        {items.map((item) => (
          <li
            key={`summary-${item.id}`}
            className="rounded-[6px] border-b border-input pb-2 text-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold">Тариф {item.calories} ккал</span>
              <span className="font-semibold">
                {item.selectedDays.length} {daysWord(item.selectedDays.length)}
              </span>
            </div>
            <p className="mt-1 text-xs text-greySecondary">
              {item.dishesCount} блюд в день
            </p>
          </li>
        ))}
        <p className="text-[12px] text-yellow-hover">
          <span className="text-red-400">*</span> оплата производится наличными
          или картой при получении, или через систему ЕРИП
        </p>
      </ul>
    )}
  </div>
);
