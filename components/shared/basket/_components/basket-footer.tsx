"use client";

import { FC } from "react";

import { AnimatedAmount } from "@/components/magicui/animated-amount";
import { Button } from "@/components/ui/button";

type BasketFooterProps = {
  totalLabel: string;
  disabled: boolean;
  onProceed: () => void;
};

export const BasketFooter: FC<BasketFooterProps> = ({
  totalLabel,
  disabled,
  onProceed,
}) => (
  <div className="w-full bg-white px-6 py-4 shadow-sm shadow-greySecondary/70">
    <div className="grid gap-4">
      <div className="flex items-center gap-2 text-greenPrimary">
        <p className="text-[20px] font-bold">Итого:</p>
        <p className="text-[20px] font-bold text-yellow-hover">
          <AnimatedAmount value={totalLabel} durationMs={200} />
        </p>
      </div>
      <Button
        type="button"
        variant="default"
        className="w-full bg-yellowPrimary py-6 font-bold text-greenPrimary disabled:opacity-60"
        disabled={disabled}
        onClick={onProceed}
      >
        Перейти к оформлению
      </Button>
    </div>
  </div>
);
