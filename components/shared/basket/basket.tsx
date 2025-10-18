"use client";
import { FC, useEffect, useMemo, useState } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Check, ChevronRight, ShoppingBasket, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useBasketStore } from "@/store/useStore";
import { AnimatedAmount } from "@/components/magicui/animated-amount";
import { BasketItem } from "./_components/basket-item";
import { BasketEmpty } from "./_components/basket-empty";
import { listSelectableDays } from "@/lib/delivery-days";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const CITIES = [
  { value: "minsk", label: "Минск" },
  { value: "brest", label: "Брест" },
  { value: "gomel", label: "Гомель" },
  { value: "vitebsk", label: "Витебск" },
];

function formatDateRange(range: string | null) {
  if (!range) return null;
  const [startStr, endStr] = range.split("_");
  if (!startStr || !endStr) return null;

  const formatPart = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
    });
  };

  const start = formatPart(startStr);
  const end = formatPart(endStr);
  if (!start || !end) return null;
  return `${start} – ${end}`;
}

function daysWord(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
  return "дней";
}

export const Basket: FC = () => {
  const isBasketOpen = useBasketStore((s) => s.isBasketOpen);
  const setIsBasketOpen = useBasketStore((s) => s.setIsBasketOpen);
  const items = useBasketStore((s) => s.items);
  const updateItem = useBasketStore((s) => s.updateItem);
  const removeItem = useBasketStore((s) => s.removeItem);

  const [isCheckout, setIsCheckout] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => Number(a.calories) - Number(b.calories)),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.pricePerDay * item.selectedDays.length,
        0
      ),
    [items]
  );
  const totalLabel = totalPrice ? `${totalPrice} BYN` : "0 BYN";
  const itemCount = items.length;

  useEffect(() => {
    if (!isBasketOpen) {
      setIsCheckout(false);
      setIsConsentGiven(false);
    }
  }, [isBasketOpen]);

  useEffect(() => {
    if (sortedItems.length === 0) {
      setIsCheckout(false);
      setIsConsentGiven(false);
    }
  }, [sortedItems.length]);

  const handleIncrementDays = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item || !item.range) return;
    const selectable = listSelectableDays(item.range).sort();
    if (item.selectedDays.length >= selectable.length) return;
    const next = selectable.find((day) => !item.selectedDays.includes(day));
    if (!next) return;
    updateItem(id, (prev) => ({
      ...prev,
      selectedDays: [...prev.selectedDays, next],
    }));
  };

  const handleDecrementDays = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    if (item.selectedDays.length <= 1) {
      removeItem(id);
      return;
    }
    const sortedDays = [...item.selectedDays].sort();
    const nextDays = sortedDays.slice(0, -1);
    updateItem(id, (prev) => ({
      ...prev,
      selectedDays: nextDays,
    }));
  };

  const handleProceedToCheckout = () => {
    if (itemCount === 0) return;
    setIsCheckout(true);
    setIsConsentGiven(false);
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
            <ShoppingBasket size={10} />
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
        className="shadow-none border-none md:border-l-[2px] border-grey-border p-0 overflow-hidden"
      >
        <div className="flex h-full flex-col">
          <SheetHeader className="relative px-6 py-4 ">
            <SheetTitle className="text-[24px] flex items-center gap-2 text-greenPrimary font-bold">
              <ShoppingBasket className="text-yellowPrimary" />
              <p>{isCheckout ? "Оформление заказа" : "Корзина"}</p>
            </SheetTitle>
            <SheetClose
              style={{
                outline: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              className="absolute cursor-pointer bg-greyPrimary rounded-[6px] p-1 right-4 top-1/2 translate-y-[40px] md:-translate-y-1/2  transition-all group active:scale-[.98]"
            >
              <XIcon className="h-4 w-4 hidden md:block text-greenPrimary group-hover:text-yellow-hover transition-all bg-greyPrimary" />
              <div className="md:hidden px-4 flex items-center">
                <p className="text-[15px] text-greenPrimary font-bold">
                  Закрыть
                </p>
              </div>
            </SheetClose>
          </SheetHeader>

          <AnimatePresence mode="wait" initial={false}>
            {!isCheckout ? (
              <motion.section
                key="basket-view"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 overflow-y-auto px-6"
              >
                {sortedItems.length === 0 ? (
                  <BasketEmpty />
                ) : (
                  <ul className="grid gap-4 mt-16 md:mt-4 pb-6">
                    {sortedItems.map((item) => (
                      <BasketItem
                        key={item.id}
                        item={item}
                        onRemove={removeItem}
                        onIncrement={handleIncrementDays}
                        onDecrement={handleDecrementDays}
                      />
                    ))}
                  </ul>
                )}
              </motion.section>
            ) : (
              <motion.section
                key="checkout-view"
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 80 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 overflow-y-auto px-6"
              >
                <div className="py-4">
                  <div className="max-w-xl space-y-6 text-greenPrimary">
                    <div className="">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="checkout-first-name">Имя</Label>
                            <Input
                              id="checkout-first-name"
                              placeholder="Введите имя"
                              autoComplete="given-name"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="checkout-last-name">Фамилия</Label>
                            <Input
                              id="checkout-last-name"
                              placeholder="Введите фамилию"
                              autoComplete="family-name"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="checkout-phone">Телефон</Label>
                            <Input
                              id="checkout-phone"
                              type="tel"
                              placeholder="+375 (__ ) ___-__-__"
                              autoComplete="tel"
                            />
                          </div>
                          <div className="grid gap-2 ">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="checkout-social">
                                Telegram / Instagram
                              </Label>

                              <TooltipProvider delayDuration={150}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      aria-label="Подсказка по полю «Социальные сети»"
                                      className="inline-flex items-center text-greySecondary hover:text-greenPrimary"
                                    >
                                      <HelpCircle className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    className="max-w-[280px] text-greenPrimary"
                                    side="right"
                                    sideOffset={6}
                                  >
                                    Укажите ник в Telegram или Instagram — так
                                    нам будет проще связаться.
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>

                            <Input
                              id="checkout-social"
                              placeholder="Введите ник @"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="checkout-city">Город</Label>
                            <Select defaultValue={CITIES[0]?.value}>
                              <SelectTrigger
                                id="checkout-city"
                                className="w-full border-grey-border text-greenPrimary"
                              >
                                <SelectValue placeholder="Выберите город" />
                              </SelectTrigger>
                              <SelectContent className="text-greenPrimary">
                                {CITIES.map((city) => (
                                  <SelectItem
                                    key={city.value}
                                    value={city.value}
                                  >
                                    {city.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="checkout-street">Улица</Label>
                            <Input
                              id="checkout-street"
                              placeholder="Ул."
                              autoComplete="address-line1"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="checkout-house">Дом</Label>
                            <Input
                              id="checkout-house"
                              autoComplete="address-line2"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="checkout-apartment">Квартира</Label>
                            <Input id="checkout-apartment" autoComplete="off" />
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="checkout-comment">
                            Комментарий к заказу
                          </Label>
                          <Textarea
                            className=""
                            placeholder="Напишите ваш комментарий"
                            id="message"
                            maxLength={200}
                          />
                        </div>
                      </div>

                      <div className="space-y-4 mt-6">
                        <div className="rounded-[8px]  bg-greyPrimary p-4">
                          <div className="flex items-center justify-between text-greenPrimary">
                            <p className="font-semibold">Итого</p>
                            <p className="text-[22px] font-bold text-yellow-hover">
                              <AnimatedAmount
                                value={totalLabel}
                                durationMs={200}
                              />
                            </p>
                          </div>
                          {sortedItems.length > 0 && (
                            <ul className="mt-4 grid gap-3">
                              {sortedItems.map((item) => {
                                const rangeLabel = formatDateRange(item.range);
                                return (
                                  <li
                                    key={`summary-${item.id}`}
                                    className="rounded-[6px] border border-grey-border/60 bg-white px-3 py-3 text-sm text-greenPrimary"
                                  >
                                    <div className="flex items-center justify-between gap-4">
                                      <span className="font-semibold">
                                        Тариф {item.calories}
                                      </span>
                                      <span className="font-medium">
                                        {item.selectedDays.length}{" "}
                                        {daysWord(item.selectedDays.length)}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-xs text-greySecondary">
                                      {item.dishesCount} блюд в день
                                    </p>
                                    {rangeLabel && (
                                      <p className="mt-1 text-xs text-greySecondary">
                                        Период доставки: {rangeLabel}
                                      </p>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            {!isCheckout ? (
              <div className="px-6 py-4 bg-white">
                <div className="w-full grid gap-4">
                  <div className="flex items-center justify-start gap-2 text-greenPrimary">
                    <p className="text-[20px] font-bold">Итого:</p>
                    <p className="text-yellow-hover font-bold text-[24px]">
                      <AnimatedAmount value={totalLabel} durationMs={200} />
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="default"
                    className="w-full bg-yellowPrimary text-greenPrimary font-bold py-6 disabled:opacity-60 disabled:select-none"
                    disabled={itemCount === 0}
                    onClick={handleProceedToCheckout}
                  >
                    Перейти к оформлению
                  </Button>
                </div>
              </div>
            ) : (
              <div key="checkout-footer" className="px-6 py-4 bg-white">
                <div className="grid gap-4">
                  <label
                    htmlFor="consent-switch"
                    className="flex items-center gap-3 text-greenPrimary cursor-pointer"
                  >
                    <Switch
                      id="consent-switch"
                      checked={isConsentGiven}
                      onCheckedChange={setIsConsentGiven}
                    />
                    <span className="text-sm font-semibold select-none text-greenPrimary">
                      Я согласен на обработку персональных данных
                    </span>
                  </label>

                  <Button
                    type="button"
                    variant="default"
                    disabled={!isConsentGiven}
                    className={cn(
                      "w-full py-6 font-bold transition-colors",
                      !isConsentGiven &&
                        "bg-greyPrimary text-greySecondary disabled:opacity-100 disabled:cursor-not-allowed",
                      isConsentGiven && "bg-yellowPrimary text-greenPrimary"
                    )}
                  >
                    Оформить заказ
                  </Button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
};
