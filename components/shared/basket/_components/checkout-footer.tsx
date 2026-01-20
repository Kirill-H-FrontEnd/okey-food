"use client";

import { FC } from "react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import Link from "next/link";

type CheckoutFooterProps = {
  isConsentGiven: boolean;
  onConsentChange: (value: boolean) => void;
  onSubmit: () => void;
};

export const CheckoutFooter: FC<CheckoutFooterProps> = ({
  isConsentGiven,
  onConsentChange,
  onSubmit,
}) => (
  <div className="w-full bg-whitePrimary border-t border-grey-border/50 px-6 py-4 ">
    <div className="grid gap-4">
      <div className="flex items-center gap-2">
        <Switch
          id="consent-switch"
          checked={isConsentGiven}
          onCheckedChange={onConsentChange}
        />
        <label
          htmlFor="consent-switch"
          className="text-[12px] font-bold text-colorPrimary"
        >
          Ознакомьтесь с {""}{" "}
          <Link href="/privacy-policy" className="text-yellow-hover">
            политикой конфиденциальности
          </Link>
        </label>
      </div>

      <Button
        type="button"
        variant="default"
        disabled={!isConsentGiven}
        className={cn(
          "w-full py-6 font-bold transition-colors",
          isConsentGiven
            ? "bg-yellowPrimary text-colorPrimary"
            : "bg-greyPrimary text-greySecondary disabled:cursor-not-allowed disabled:opacity-100",
        )}
        onClick={onSubmit}
      >
        Оформить заказ
      </Button>
    </div>
  </div>
);
