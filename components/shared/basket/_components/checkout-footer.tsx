"use client";

import { FC } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import Link from "next/link";

type CheckoutFooterProps = {
  isConsentGiven: boolean;
  onConsentChange: (value: boolean) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
};

export const CheckoutFooter: FC<CheckoutFooterProps> = ({
  isConsentGiven,
  onConsentChange,
  onSubmit,
  isSubmitting = false,
}) => (
  <div className="w-full bg-whitePrimary border-t border-grey-border px-6 py-4 ">
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Switch
          id="consent-switch"
          checked={isConsentGiven}
          onCheckedChange={onConsentChange}
          disabled={isSubmitting}
        />
        <label
          htmlFor="consent-switch"
          className="text-[12px] font-bold text-colorPrimary"
        >
          Я согласен с {""}{" "}
          <Link href="/privacy" className="text-yellow-hover">
            политикой конфиденциальности
          </Link>
        </label>
      </div>

      <Button
        type="button"
        variant="default"
        disabled={!isConsentGiven || isSubmitting}
        className={cn(
          "w-full py-6 font-bold transition-colors",
          isConsentGiven && !isSubmitting
            ? "bg-yellowPrimary text-colorPrimary"
            : "bg-greyPrimary text-greySecondary disabled:cursor-not-allowed disabled:opacity-100",
        )}
        onClick={onSubmit}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Оформляем заказ...
          </span>
        ) : (
          "Оформить заказ"
        )}
      </Button>
    </div>
  </div>
);
