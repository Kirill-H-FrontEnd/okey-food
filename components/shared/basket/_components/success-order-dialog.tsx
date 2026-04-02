"use client";

import { FC, useMemo } from "react";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  ShoppingBag,
  BadgeInfo,
  UtensilsCrossed,
  User,
  Phone,
} from "lucide-react";

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
import { daysWord, formatDeliveryDate } from "../utils";

import type { SuccessOrderSnapshot } from "../types";
import { FaTelegram } from "react-icons/fa6";
import { RiTelegram2Line } from "react-icons/ri";

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
        className="w-[calc(100%-16px)] max-w-[520px] rounded-[24px] border border-black/10 bg-whitePrimary p-0 overflow-hidden"
      >
        {order && summary && (
          <div className="flex max-h-[85vh] flex-col">
            <div className="relative overflow-hidden border-b border-colorPrimary/10 bg-gradient-to-b from-greenPrimary/15 via-yellowPrimary/10 to-transparent px-4 pb-5 pt-5 text-center sm:px-6 sm:pt-6">
              <div className="pointer-events-none absolute -left-8 top-0 h-24 w-24 rounded-full bg-greenPrimary/15 blur-2xl" />
              <div className="pointer-events-none absolute -right-8 top-6 h-24 w-24 rounded-full bg-yellowPrimary/15 blur-2xl" />

              <Image
                width={120}
                height={120}
                alt="Заказ успешно оформлен"
                src="/images/illustrations/success_order.png"
                className="mx-auto mb-2 h-auto w-auto object-contain"
                priority
              />

              <DialogHeader className="items-center text-center">
                <DialogTitle className="text-xl font-extrabold text-colorPrimary sm:text-2xl">
                  Заказ успешно оформлен
                </DialogTitle>
                <DialogDescription className="max-w-[340px] text-sm leading-5 text-greySecondary text-center">
                  Мы скоро свяжемся с вами для подтверждения заказа и уточнения
                  доставки.
                </DialogDescription>
              </DialogHeader>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4 sm:px-6 sm:pb-6">
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

                {/* <div className="rounded-2xl border border-colorPrimary/10 bg-whiteSecondary p-4 shadow">
                  <p className="mb-3 text-sm font-bold text-colorPrimary">
                    Данные клиента
                  </p>

                  <div className="grid gap-2.5 text-sm text-colorPrimary">
                    <div className="flex items-start gap-2">
                      <User
                        size={15}
                        className="mt-0.5 shrink-0 text-yellow-hover"
                      />
                      <p className="min-w-0 break-words">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                    </div>

                    <div className="flex items-start gap-2">
                      <Phone
                        size={15}
                        className="mt-0.5 shrink-0 text-yellow-hover"
                      />
                      <p className="min-w-0 break-words">
                        {order.customer.phone}
                      </p>
                    </div>
                    {order.customer.social && (
                      <div className="flex items-start gap-2">
                        <RiTelegram2Line
                          size={15}
                          className="text-yellow-hover"
                        />
                        <p className="min-w-0 break-words">
                          {order.customer.social}
                        </p>
                      </div>
                    )}
                    {order.customer.date && (
                      <div className="flex items-start gap-2">
                        <CalendarDays
                          size={15}
                          className="mt-0.5 shrink-0 text-yellow-hover"
                        />
                        <p className="min-w-0 break-words">
                          {formatDeliveryDate(order.customer.date)}
                        </p>
                      </div>
                    )}

                    {summary.address && (
                      <p className="rounded-xl bg-whitePrimary px-3 py-2 text-xs leading-5 text-greySecondary break-words">
                        {summary.address}
                      </p>
                    )}
                  </div>
                </div> */}

                <Accordion
                  type="single"
                  collapsible
                  defaultValue=""
                  className="rounded-2xl border border-colorPrimary/10 px-4 shadow bg-whiteSecondary"
                >
                  <AccordionItem value="order-content" className="border-none">
                    <AccordionTrigger className="  py-3  bg-whiteSecondary">
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

                    <AccordionContent className=" pb-0 bg-whiteSecondary">
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

                <div className="rounded-2xl border border-colorPrimary/10 bg-colorPrimary/10 p-3">
                  <div className="flex items-start gap-2 text-xs leading-5 text-colorPrimary">
                    <BadgeInfo
                      size={20}
                      className="mt-0.5 shrink-0 text-yellow-hover"
                    />
                    <p className="font-semibold">
                      После подтверждения заказа менеджером мы свяжемся с вами
                      для уточнения деталей доставки.
                    </p>
                  </div>
                </div>
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
