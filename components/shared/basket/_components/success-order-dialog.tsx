"use client";

import { FC, useMemo } from "react";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  CreditCard,
  Flame,
  Info,
  MapPin,
  Phone,
  User,
  Utensils,
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
import { daysWord } from "../utils";
import type { SuccessOrderSnapshot } from "../types";

const CITY_LABELS: Record<string, string> = {
  minsk: "Минск",
  brest: "Брест",
  gomel: "Гомель",
  vitebsk: "Витебск",
};

const SOCIAL_LABELS: Record<string, string> = {
  telegram: "Telegram",
  viber: "Viber",
  whatsapp: "WhatsApp",
};

const formatSelectedDay = (value: string) => {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat("ru-RU", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(parsed);
  }
  return value;
};

const formatAddress = (order: SuccessOrderSnapshot) => {
  const parts = [
    CITY_LABELS[order.customer.city] ?? order.customer.city,
    order.customer.street,
    order.customer.house ? `д. ${order.customer.house}` : null,
    order.customer.apartment ? `кв. ${order.customer.apartment}` : null,
    order.customer.floor ? `эт. ${order.customer.floor}` : null,
    order.customer.intercom ? `домофон ${order.customer.intercom}` : null,
  ].filter(Boolean);
  return parts.join(", ") || null;
};

type SuccessOrderDialogProps = {
  order: SuccessOrderSnapshot | null;
  onClose: () => void;
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
    const address = formatAddress(order);
    const socialLabel =
      SOCIAL_LABELS[order.customer.social] ?? order.customer.social;

    return {
      totalItems: order.items.length,
      totalDays,
      address,
      socialLabel: socialLabel || null,
    };
  }, [order]);

  return (
    <Dialog open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="w-[calc(100%-16px)] max-w-[520px] overflow-hidden rounded-[24px] border border-black/10 bg-whitePrimary p-0"
      >
        {order && summary && (
          <div className="flex max-h-[90vh] flex-col">
            {/* ── HEADER ── */}
            <div className="relative overflow-hidden bg-colorPrimary px-5 pb-6 pt-6 text-center">
              <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
              <div className="pointer-events-none absolute -right-6 bottom-0 h-28 w-28 rounded-full bg-yellowPrimary/10 blur-2xl" />

              <div className="relative z-[1] flex flex-col items-center gap-2">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
                  <Image
                    src="/images/illustrations/success_order.png"
                    alt="Заказ оформлен"
                    width={72}
                    height={72}
                    priority
                    sizes="72px"
                    className="h-[72px] w-[72px] select-none object-contain"
                  />
                </div>

                <DialogTitle className="text-center text-xl font-extrabold text-white sm:text-2xl">
                  Заказ оформлен!
                </DialogTitle>

                <DialogDescription className="text-center text-sm leading-relaxed text-white/60">
                  Менеджер свяжется с вами в ближайшее время для подтверждения
                  деталей доставки.
                </DialogDescription>
              </div>
            </div>

            {/* ── SCROLLABLE BODY ── */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
              <div className="grid gap-3">
                {/* Total price */}
                <div className="flex items-center justify-between rounded-2xl border border-yellowPrimary/30 bg-yellowPrimary/10 px-4 py-3">
                  <p className="text-sm font-semibold text-yellow-hover">
                    Итого к оплате
                  </p>
                  <p className="text-lg font-extrabold text-yellow-hover">
                    {order.totalPrice} BYN
                  </p>
                </div>

                {/* Customer info — accordion, closed by default */}
                <Accordion
                  type="single"
                  collapsible
                  defaultValue=""
                  className="rounded-2xl border border-colorPrimary/10 bg-whiteSecondary"
                >
                  <AccordionItem value="customer-info" className="border-none">
                    <AccordionTrigger className="px-4 py-3">
                      <div className="flex items-center gap-2 text-left">
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-greenPrimary"
                        />
                        <div>
                          <p className="text-sm font-bold text-colorPrimary">
                            Данные получателя
                          </p>
                          <p className="text-xs text-greySecondary">
                            {order.customer.firstName} · {order.customer.phone}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-3">
                      <div className="grid gap-0 divide-y divide-colorPrimary/6">
                        <div className="flex items-center gap-3 py-3">
                          <User
                            size={14}
                            className="shrink-0 text-yellow-hover"
                          />
                          <div>
                            <p className="text-xs text-greySecondary">Имя</p>
                            <p className="text-sm font-semibold text-colorPrimary">
                              {order.customer.firstName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 py-3">
                          <Phone
                            size={14}
                            className="shrink-0 text-yellow-hover"
                          />
                          <div>
                            <p className="text-xs text-greySecondary">
                              Телефон
                            </p>
                            <p className="text-sm font-semibold text-colorPrimary">
                              {order.customer.phone}
                            </p>
                          </div>
                        </div>

                        {summary.address && (
                          <div className="flex items-start gap-3 py-3">
                            <MapPin
                              size={14}
                              className="mt-0.5 shrink-0 text-yellow-hover"
                            />
                            <div>
                              <p className="text-xs text-greySecondary">
                                Адрес доставки
                              </p>
                              <p className="text-sm font-semibold text-colorPrimary">
                                {summary.address}
                              </p>
                            </div>
                          </div>
                        )}

                        {summary.socialLabel && (
                          <div className="flex items-center gap-3 py-3">
                            <Phone
                              size={14}
                              className="shrink-0 text-yellow-hover"
                            />
                            <div>
                              <p className="text-xs text-greySecondary">
                                Мессенджер
                              </p>
                              <p className="text-sm font-semibold text-colorPrimary">
                                {summary.socialLabel}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Состав заказа — accordion */}
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="order-content"
                  className="rounded-2xl border border-colorPrimary/10 bg-whiteSecondary"
                >
                  <AccordionItem value="order-content" className="border-none">
                    <AccordionTrigger className="px-4 py-3">
                      <div className="text-left">
                        <p className="text-sm font-bold text-colorPrimary">
                          Состав заказа
                        </p>
                        <p className="text-xs text-greySecondary">
                          {summary.totalItems} поз. · {summary.totalDays}{" "}
                          {daysWord(summary.totalDays)}
                        </p>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3 pb-3">
                      <div className="grid gap-2">
                        {order.items.map((item) => {
                          const itemTotal =
                            item.pricePerDay * item.selectedDays.length;
                          return (
                            <article
                              key={`success-${item.id}`}
                              className="overflow-hidden rounded-xl border border-colorPrimary/10 bg-whitePrimary"
                            >
                              {/* Card header */}
                              <div className="flex items-center justify-between gap-3 bg-colorPrimary px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-white/10">
                                    <Flame size={9} className="text-white/60" />
                                    <span className="text-xs font-extrabold leading-none text-white">
                                      {item.calories}
                                    </span>
                                    <span className="text-[6px] font-bold uppercase tracking-wide text-white/50">
                                      ккал
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-xs font-extrabold text-white">
                                      Тариф {item.calories} ккал
                                    </p>
                                    <p className="text-[10px] text-white/55">
                                      {item.selectedDays.length}{" "}
                                      {daysWord(item.selectedDays.length)}
                                    </p>
                                  </div>
                                </div>
                                <div className="rounded-lg bg-yellowPrimary px-2.5 py-1 text-right">
                                  <p className="text-[9px] font-semibold leading-none text-colorPrimary/60">
                                    итого
                                  </p>
                                  <p className="text-xs font-extrabold leading-tight text-colorPrimary">
                                    {itemTotal} BYN
                                  </p>
                                </div>
                              </div>

                              {/* Card body */}
                              <div className="grid gap-2 p-3">
                                {item.selectedDays.length > 0 ? (
                                  <div>
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-greySecondary">
                                      <CalendarDays size={11} />
                                      Дни доставки
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {item.selectedDays.map((day) => (
                                        <span
                                          key={`${item.id}-${day}`}
                                          className="rounded-md border border-colorPrimary/10 bg-colorPrimary/5 px-2 py-0.5 text-[11px] font-semibold text-colorPrimary"
                                        >
                                          {formatSelectedDay(day)}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                ) : null}

                                <div className="flex items-center justify-between rounded-lg border border-black/5 bg-whiteSecondary px-2.5 py-2">
                                  <div className="flex items-center gap-1.5 text-xs font-semibold text-colorPrimary">
                                    <Utensils
                                      size={12}
                                      className="text-yellow-hover"
                                    />
                                    {item.dishesCount} блюд в день
                                  </div>
                                  <div className="text-xs font-bold text-greySecondary">
                                    {item.pricePerDay} BYN/день
                                  </div>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Payment info */}
                <div className="flex gap-3 rounded-2xl border border-yellow-hover/20 bg-yellow-hover/8 p-4">
                  <div className="mt-0.5 shrink-0">
                    <Info size={15} className="text-yellow-hover" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-1.5 text-sm font-bold text-yellow-hover">
                      <CreditCard size={13} />
                      Оплата
                    </div>
                    <p className="text-xs font-medium leading-relaxed text-yellow-hover/80">
                      Наличными или картой при получении, либо через ЕРИП после
                      подтверждения заказа менеджером.
                    </p>
                  </div>
                </div>

                {/* Processing time */}
                <div className="flex items-center gap-3 rounded-2xl border border-colorPrimary/10 bg-whiteSecondary px-4 py-3">
                  <Clock size={16} className="shrink-0 text-greySecondary" />
                  <p className="text-xs font-medium leading-relaxed text-greySecondary">
                    Менеджер обработает ваш заказ в течение{" "}
                    <span className="font-bold text-colorPrimary">
                      1–2 часов
                    </span>{" "}
                    в рабочее время.
                  </p>
                </div>
              </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="border-t border-colorPrimary/10 bg-whitePrimary px-4 py-4 sm:px-5">
              <Button
                type="button"
                variant="default"
                className="h-11 w-full bg-yellowPrimary font-bold text-colorPrimary hover:bg-yellow-hover hover:text-white"
                onClick={onClose}
              >
                Понятно!
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
