"use client";

import { ChevronLeft, ShoppingBasket, XIcon } from "lucide-react";
import { FC } from "react";

import { SheetTitle } from "@/components/ui/sheet";

type BasketHeaderProps = {
  isCheckout: boolean;
  onClose: () => void;
  onReturn: () => void;
};

export const BasketHeader: FC<BasketHeaderProps> = ({
  isCheckout,
  onClose,
  onReturn,
}) => {
  const title = isCheckout ? "Оформление заказа" : "Корзина";

  return (
    <div className="relative flex items-center justify-between">
      <SheetTitle className="flex w-full items-center gap-2 text-center text-[20px] font-bold text-greenPrimary md:w-auto md:justify-start md:text-left md:text-[24px]">
        <ShoppingBasket className="h-7 w-7 text-yellowPrimary" />
        <span>{title}</span>
      </SheetTitle>

      <button
        type="button"
        onClick={isCheckout ? onReturn : onClose}
        className="group grid cursor-pointer rounded-sm bg-greyPrimary md:p-2"
        aria-label={isCheckout ? "Вернуться к корзине" : "Закрыть корзину"}
      >
        <span className="inline-flex items-center text-greenPrimary">
          {isCheckout ? (
            <>
              <ChevronLeft className="hidden h-4 w-4 text-greenPrimary transition-colors group-hover:text-yellow-hover md:block" />
              <span className="flex items-center gap-1 px-3 py-1 text-[13px] font-bold md:hidden">
                <ChevronLeft size={14} />
                Назад
              </span>
            </>
          ) : (
            <>
              <XIcon className="hidden h-4 w-4 text-greenPrimary transition-colors group-hover:text-yellow-hover md:block" />
              <span className="px-3 py-1 text-[13px] font-bold md:hidden">
                Закрыть
              </span>
            </>
          )}
        </span>
      </button>
    </div>
  );
};
