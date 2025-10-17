"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/store/useStore";

type BasketItemProps = {
  item: CartItem;
  onRemove: (id: string) => void;
  formatDay: (iso: string) => string;
};

export const BasketItem: FC<BasketItemProps> = ({
  item,
  onRemove,
  formatDay,
}) => {
  return (
    <li
      className="flex items-start justify-between gap-4 border-b border-grey-border pb-4"
      aria-label={`Тариф ${item.calories} на ${formatDay(item.day)}`}
    >
      <div className="text-greenPrimary">
        <p className="font-semibold">Тариф {item.calories}</p>
        <p className="text-sm text-greySecondary">{formatDay(item.day)}</p>
        <p className="text-xs text-greySecondary">
          {item.dishesCount} блюд в день
        </p>
      </div>

      <div className="text-right flex flex-col items-end gap-2">
        <span className="font-semibold text-greenPrimary whitespace-nowrap">
          {item.pricePerDay} BYN
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="px-2 py-1 h-auto text-xs text-red-600 hover:text-red-600"
          onClick={() => onRemove(item.id)}
          aria-label={`Удалить тариф ${item.calories} за ${formatDay(
            item.day
          )} из корзины`}
        >
          Удалить
        </Button>
      </div>
    </li>
  );
};
