"use client";

import { FC, useMemo } from "react";
import { AnimatedAmount } from "@/components/magicui/animated-amount";
import { daysWord } from "@/components/shared/basket/utils";
import { CartItem } from "@/store/useStore";
import { getEffectivePricePerDay, getTotalPrice } from "@/lib/pricing";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Flame,
  Info,
  Utensils,
} from "lucide-react";

type CheckoutSummaryProps = {
  items: CartItem[];
  totalLabel: string;
  deliveryDate?: Date | null;
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

const formatDeliveryDate = (value?: Date | null) => {
  if (!value) return null;

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(value);
};

export const CheckoutSummary: FC<CheckoutSummaryProps> = ({
  items,
  totalLabel,
  deliveryDate,
}) => {
  const formattedDeliveryDate = useMemo(
    () => formatDeliveryDate(deliveryDate),
    [deliveryDate],
  );

  const enrichedItems = useMemo(() => {
    return items.map((item) => {
      const daysCount = item.selectedDays.length;
      const effectivePricePerDay = getEffectivePricePerDay(
        item.pricePerDay,
        daysCount,
      );
      const itemTotal = getTotalPrice(item.pricePerDay, daysCount);

      return {
        ...item,
        daysCount,
        effectivePricePerDay,
        itemTotal,
        formattedDays: item.selectedDays.map(formatSelectedDay),
      };
    });
  }, [items]);

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-greySecondary/50 bg-whiteSecondary p-4 text-colorPrimary sm:p-5">
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-yellow-hover/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-colorPrimary/10 blur-2xl" />

      <div className="pointer-events-none absolute right-1 top-1 opacity-[0.07] text-yellow-hover">
        <CheckCircle2 size={96} />
      </div>

      <div className="relative z-10 mb-5 rounded-2xl border border-black/5 p-4">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div>
            <p className="text-sm font-semibold tracking-[0.14em] text-greySecondary">
              Сумма заказа
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-colorPrimary sm:text-2xl">
              Итого к оплате
            </h2>
          </div>

          <div className="rounded-2xl sm:bg-yellow-hover/10 sm:px-4 sm:py-3 text-right">
            <div className="text-xs font-semibold tracking-[0.12em] text-yellow-hover/80">
              Общая сумма
            </div>
            <div className="mt-1 text-lg font-extrabold text-yellow-hover sm:text-xl">
              <AnimatedAmount value={totalLabel} durationMs={450} />
            </div>
          </div>
        </div>
      </div>

      {formattedDeliveryDate && (
        <div className="relative z-10 mb-5 rounded-2xl border border-colorPrimary/10 bg-whitePrimary p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="shrink-0 rounded-full bg-yellow-hover/10 p-2">
              <CalendarDays size={16} className="text-yellow-hover" />
            </div>

            <div>
              <p className="text-xs font-semibold text-greySecondary">
                Выбранный день доставки
              </p>
              <p className="mt-1 text-sm font-bold text-colorPrimary sm:text-base">
                {formattedDeliveryDate}
              </p>
            </div>
          </div>
        </div>
      )}

      {enrichedItems.length > 0 ? (
        <div className="relative z-10 grid gap-4">
          {enrichedItems.map((item) => (
            <article
              key={`summary-${item.id}`}
              className="overflow-hidden rounded-2xl border border-colorPrimary/10 bg-whitePrimary"
            >
              {/* ── Шапка карточки ── */}
              <div className="flex items-center justify-between gap-3 bg-colorPrimary px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-white/10">
                    <Flame size={10} className="text-white/60" />
                    <span className="text-sm font-extrabold leading-none text-white">
                      {item.calories}
                    </span>
                    <span className="text-[7px] font-bold uppercase tracking-wide text-white/50">
                      ккал
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-white">
                      Тариф {item.calories} ккал
                    </p>
                    <p className="text-[11px] text-white/55">
                      {item.daysCount} {daysWord(item.daysCount)} доставки
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-yellowPrimary px-3 py-1.5 text-right">
                  <p className="text-[10px] font-semibold text-colorPrimary/70 leading-none mb-0.5">
                    Итого
                  </p>
                  <p className="text-sm font-extrabold text-colorPrimary leading-none">
                    {item.itemTotal} BYN
                  </p>
                </div>
              </div>

              {/* ── Тело карточки ── */}
              <div className="grid gap-3 p-4">
                {/* Выбранные дни */}
                <div>
                  <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-greySecondary">
                    <CalendarDays size={12} />
                    Выбранные дни
                  </div>

                  {item.formattedDays.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {item.formattedDays.map((day) => (
                        <span
                          key={day}
                          className="rounded-lg border border-colorPrimary/10 bg-colorPrimary/5 px-2.5 py-1 text-[11px] font-semibold text-colorPrimary"
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-greySecondary">
                      Дни пока не выбраны
                    </p>
                  )}
                </div>

                {/* Нижняя строка: блюда + цена за день */}
                <div className="flex items-center justify-between rounded-xl border border-black/5 bg-whiteSecondary px-3 py-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold text-colorPrimary">
                    <Utensils size={13} className="text-yellow-hover" />
                    {item.dishesCount} блюд в день
                  </div>
                  <div className="text-xs font-bold text-greySecondary">
                    {item.effectivePricePerDay} BYN / день
                  </div>
                </div>
              </div>
            </article>
          ))}

          <div className="flex gap-3 rounded-2xl border border-yellow-hover/20 bg-yellow-hover/10 p-4">
            <div className="mt-0.5 shrink-0 self-start rounded-full bg-yellow-hover/15 p-1.5">
              <Info size={16} className="text-yellow-hover" />
            </div>

            <div>
              <div className="mb-1 flex items-center gap-2 text-sm font-bold text-yellow-hover">
                <CreditCard size={15} />
                Способ оплаты
              </div>
              <p className="text-xs font-medium leading-relaxed text-yellow-hover">
                Оплата производится наличными или картой при получении, либо
                через систему ЕРИП после подтверждения заказа менеджером.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 rounded-2xl border border-dashed border-black/10 bg-white/60 p-6 text-center">
          <p className="text-sm font-semibold text-greySecondary">
            В заказе пока нет выбранных рационов
          </p>
        </div>
      )}
    </section>
  );
};
