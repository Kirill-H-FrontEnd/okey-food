"use client";

import { FC, useMemo } from "react";
import Image from "next/image";
import { CalendarDays, ShoppingBag, UtensilsCrossed } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { daysWord } from "../utils";

import type { SuccessOrderSnapshot } from "../types";

type SuccessOrderDialogProps = {
  order: SuccessOrderSnapshot | null;
  onClose: () => void;
};

const formatSelectedDay = (value: string) => {
  const parsed = new Date(value);

  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(parsed);
  }

  return value;
};

const formatAddress = (order: SuccessOrderSnapshot) => {
  const CITY_LABELS: Record<string, string> = {
    minsk: "Минск",
    brest: "Брест",
    gomel: "Гомель",
    vitebsk: "Витебск",
  };

  const parts = [
    CITY_LABELS[order.customer.city] ?? order.customer.city,
    order.customer.street,
    order.customer.house ? `дом ${order.customer.house}` : null,
    order.customer.apartment ? `кв. ${order.customer.apartment}` : null,
  ].filter(Boolean);

  return parts.join(", ");
};

export const SuccessOrderDialog: FC<SuccessOrderDialogProps> = ({
  order,
  onClose,
}) => {
  const summary = useMemo(() => {
    if (!order) return null;

    const totalDays = order.items.reduce(
      (sum, item) => sum + item.selectedDays.length,
      0,
    );

    return {
      totalItems: order.items.length,
      totalDays,
      address: formatAddress(order),
    };
  }, [order]);

  return (
    <Dialog open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-16px)] max-w-[520px] overflow-hidden rounded-[24px] border border-black/10 bg-whitePrimary p-0"
      >
        {order && summary && (
          <div className="flex max-h-[85vh] flex-col">
            <div className="relative overflow-hidden bg-gradient-to-b from-greenPrimary/15 via-yellowPrimary/10 to-transparent px-4 pb-5 pt-5 text-center sm:px-6 sm:pb-6 sm:pt-6">
              <div className="pointer-events-none absolute -left-8 top-0 h-24 w-24 rounded-full bg-greenPrimary/15 blur-2xl" />
              <div className="pointer-events-none absolute -right-8 top-6 h-24 w-24 rounded-full bg-yellowPrimary/15 blur-2xl" />

              <div className="relative z-[1] flex min-h-[140px] flex-col items-center justify-start">
                <div className="mb-2 flex h-[120px] w-[120px] shrink-0 items-center justify-center">
                  <Image
                    src="/images/illustrations/success_order.png"
                    alt="Заказ успешно оформлен"
                    width={120}
                    height={120}
                    priority
                    sizes="120px"
                    className="block h-[140px] w-[140px] select-none object-contain"
                  />
                </div>

                <DialogHeader className="grid items-center justify-center text-center">
                  <DialogTitle className="text-xl font-extrabold text-colorPrimary sm:text-2xl">
                    Заказ успешно оформлен
                  </DialogTitle>

                  <DialogDescription className="mx-auto max-w-[340px] text-center text-sm leading-5 text-greySecondary">
                    После подтверждения заказа менеджером мы свяжемся с вами для
                    уточнения деталей доставки.
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-colorPrimary/10 bg-whiteSecondary p-3">
                    <div className="mb-1 flex items-center gap-2 text-greySecondary">
                      <ShoppingBag size={14} className="text-yellow-hover" />
                      <span className="text-[11px] font-semibold">Позиции</span>
                    </div>
                    <p className="text-lg font-extrabold text-colorPrimary">
                      {summary.totalItems}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-yellowPrimary/20 bg-yellowPrimary/10 p-3">
                    <div className="mb-1 flex items-center gap-2 text-yellow-hover">
                      <CalendarDays size={14} />
                      <span className="text-[11px] font-semibold">Итого</span>
                    </div>
                    <p className="text-lg font-extrabold text-yellow-hover">
                      {order.totalPrice} BYN
                    </p>
                  </div>
                </div>

                <Accordion
                  type="single"
                  collapsible
                  defaultValue=""
                  className="rounded-2xl border border-colorPrimary/10 bg-whiteSecondary px-4 shadow"
                >
                  <AccordionItem value="order-content" className="border-none">
                    <AccordionTrigger className="bg-whiteSecondary py-3">
                      <div>
                        <p className="text-sm font-bold text-colorPrimary">
                          Состав заказа
                        </p>
                        <p className="text-xs text-greySecondary">
                          {summary.totalItems} поз. • {summary.totalDays}{" "}
                          {daysWord(summary.totalDays)}
                        </p>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="bg-whiteSecondary pb-0">
                      <div className="grid gap-3">
                        {order.items.map((item) => (
                          <article
                            key={`success-${item.id}`}
                            className="rounded-2xl border border-colorPrimary/10 bg-whitePrimary p-4"
                          >
                            <div className="mb-4 flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="grid h-11 min-w-11 place-items-center rounded-xl border border-colorPrimary/10 bg-whiteSecondary px-2 text-xs font-extrabold text-colorPrimary shadow">
                                  {item.calories}
                                </div>

                                <div>
                                  <p className="text-sm font-extrabold text-colorPrimary">
                                    Тариф {item.calories} ккал
                                  </p>
                                  <p className="mt-0.5 text-xs font-medium text-greySecondary">
                                    {item.selectedDays.length}{" "}
                                    {daysWord(item.selectedDays.length)}
                                  </p>
                                </div>
                              </div>

                              <div className="rounded-full border border-yellow-hover/15 bg-yellow-hover/10 px-3 py-1.5 text-xs font-bold text-yellow-hover">
                                {item.pricePerDay * item.selectedDays.length}{" "}
                                BYN
                              </div>
                            </div>

                            <div className="grid gap-3">
                              <div className="rounded-xl border border-colorPrimary/10 bg-whiteSecondary p-3">
                                <div className="mb-2 text-xs font-semibold tracking-[0.08em] text-greySecondary">
                                  Выбранные дни
                                </div>

                                {item.selectedDays.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {item.selectedDays.map((day) => (
                                      <span
                                        key={`${item.id}-${day}`}
                                        className="rounded-sm border border-colorPrimary/10 bg-colorPrimary/5 px-3 py-1 text-xs font-semibold text-colorPrimary"
                                      >
                                        {formatSelectedDay(day)}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-xs font-medium text-greySecondary">
                                    Дни пока не выбраны
                                  </p>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-colorPrimary/10 bg-whiteSecondary p-3">
                                <div className="flex items-center gap-2 text-sm font-semibold text-colorPrimary">
                                  <UtensilsCrossed
                                    size={15}
                                    className="text-yellow-hover"
                                  />
                                  <span>
                                    {item.dishesCount} полноценных блюд в день
                                  </span>
                                </div>

                                <div className="text-xs font-semibold text-greySecondary">
                                  {item.pricePerDay} BYN / день
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            <div className="border-t border-colorPrimary/10 bg-whitePrimary p-4 sm:p-5">
              <Button
                type="button"
                variant="default"
                className="h-11 w-full bg-yellowPrimary font-bold text-colorPrimary"
                onClick={onClose}
              >
                Понятно
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
