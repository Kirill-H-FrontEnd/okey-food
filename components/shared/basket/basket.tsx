"use client";
import { FC, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, ShoppingCart, XIcon } from "lucide-react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useBasketStore } from "@/store/useStore";
import { AnimatedAmount } from "@/components/magicui/animated-amount";
import { BasketItem } from "./_components/basket-item";
import { BasketEmpty } from "./_components/basket-empty";

export const Basket: FC = () => {
  const isBasketOpen = useBasketStore((s) => s.isBasketOpen);
  const setIsBasketOpen = useBasketStore((s) => s.setIsBasketOpen);
  const items = useBasketStore((s) => s.items);
  const removeItem = useBasketStore((s) => s.removeItem);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.calories === b.calories) return a.day.localeCompare(b.day);
        return Number(a.calories) - Number(b.calories);
      }),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.pricePerDay, 0),
    [items]
  );
  const totalLabel = totalPrice ? `${totalPrice} BYN` : "0 BYN";
  const itemCount = items.length;

  const formatDay = (day: string) => {
    try {
      const formatted = format(parseISO(day), "d MMMM, EEEE", { locale: ru });
      return formatted.charAt(0).toUpperCase() + formatted.slice(1);
    } catch {
      return day;
    }
  };

  return (
    <Sheet open={isBasketOpen} onOpenChange={setIsBasketOpen}>
      <SheetTrigger asChild>
        <Button className="relative group bg-yellowPrimary" variant="default">
          <span className="text-[12px] text-greenPrimary font-bold whitespace-nowrap">
            <AnimatedAmount value={totalLabel} durationMs={200} />
          </span>
          <span className="w-[1px] h-[50%] bg-greenPrimary/50" aria-hidden />
          <div className="grid grid-cols-2-auto gap-2 items-center md:group-hover:opacity-0 transition-opacity text-greenPrimary">
            <ShoppingCart size={10} />
          </div>
          <ChevronRight
            size={18}
            strokeWidth={2}
            className="absolute right-3 transition duration-300 -translate-x-2 opacity-0 md:group-hover:opacity-100 group-hover:translate-x-0 text-greenPrimary"
          />
        </Button>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        className="shadow-none border-none md:border-l-[2px] border-grey-border p-0"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="relative px-6 py-4">
            <SheetTitle className="text-[24px] text-greenPrimary font-bold">
              Корзина
            </SheetTitle>
            <SheetClose className="absolute cursor-pointer bg-greyPrimary rounded-[6px] p-1 right-4 top-1/2 translate-y-[40px] md:-translate-y-1/2  transition-all group active:scale-[.98]">
              <XIcon className="h-4 w-4 hidden md:block text-greenPrimary group-hover:text-yellow-hover transition-all bg-greyPrimary" />
              <div className="md:hidden px-4 flex items-center">
                {" "}
                <p className="text-[15px] text-greenPrimary font-bold">
                  Закрыть
                </p>
              </div>
            </SheetClose>
          </SheetHeader>

          <section className="flex-1 overflow-y-auto px-6">
            {sortedItems.length === 0 ? (
              <BasketEmpty />
            ) : (
              <ul className="grid gap-4 mt-16 md:mt-0 pb-6">
                {sortedItems.map((item) => (
                  <BasketItem
                    key={item.id}
                    item={item}
                    onRemove={removeItem}
                    formatDay={formatDay}
                  />
                ))}
              </ul>
            )}
          </section>

          <footer className="px-6 py-4  bg-white">
            <div className="w-full grid gap-4">
              <div className="flex items-center justify-start gap-2 text-greenPrimary">
                <p className="text-[20px] font-bold">Итого:</p>
                <p className="text-yellow-hover font-bold text-[24px]">
                  <AnimatedAmount value={totalLabel} durationMs={200} />
                </p>
              </div>
              <Link href="#" aria-disabled={itemCount === 0}>
                <Button
                  variant="default"
                  className="w-full bg-yellowPrimary text-greenPrimary font-bold py-6 disabled:opacity-60 disabled:select-none"
                  disabled={itemCount === 0}
                >
                  Перейти к оформлению
                </Button>
              </Link>
            </div>
          </footer>
        </div>
      </SheetContent>
    </Sheet>
  );
};
