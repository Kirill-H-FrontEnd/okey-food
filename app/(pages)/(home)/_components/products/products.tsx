"use client";

import React, { FC } from "react";
import { motion, type Transition, type Variants } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import toast from "react-hot-toast";

import { MdOutlineRestaurantMenu } from "react-icons/md";
import {
  CalendarDays,
  Flame,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  Check,
  UtensilsCrossed,
} from "lucide-react";
import { ProductCard } from "@/components/ui/product-card";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { SelectDaysButtons } from "./_components/SelectDaysButtons";
import { CaloriesTabsList } from "./_components/calories-tabs-list";

import { getWeekNumberFromRange, getDeliveryWeeks } from "@/lib/delivery-days";

import { useBasketStore } from "@/store/useStore";
import { useAdminStore } from "@/store/useAdminStore";
import type { TProduct } from "@/types/product-card-type";

function dishesWord(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "блюдо";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "блюда";
  return "блюд";
}

const RANGE_STORAGE_KEY = "okey-food:products-range";

export const Products: FC = () => {
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const allRations = useAdminStore((state) => state.rations);
  const activeRations = React.useMemo(
    () => allRations.filter((r) => r.isActive),
    [allRations],
  );

  const priceByCalMap = React.useMemo(
    () =>
      Object.fromEntries(activeRations.map((r) => [r.calories, r.pricePerDay])),
    [activeRations],
  );

  const [weeks, setWeeks] = React.useState<{ label: string; value: string }[]>(
    [],
  );
  React.useEffect(() => {
    setWeeks(getDeliveryWeeks(4));
  }, []);

  const [selectedRange, setSelectedRange] = React.useState<string | null>(null);

  const currentWeek = React.useMemo(() => {
    if (!selectedRange) return 1 as const;
    return getWeekNumberFromRange(selectedRange);
  }, [selectedRange]);

  const rationTabs = React.useMemo(
    () =>
      activeRations.map((r) => {
        const allDishes = r.dishes ?? [];
        const weekDishes = allDishes.filter(
          (d) => !d.week || d.week === currentWeek,
        );
        return {
          calories: r.calories,
          countProduct: weekDishes.length,
          pricePerDay: r.pricePerDay,
          name: r.name,
        };
      }),
    [activeRations, currentWeek],
  );

  const [activeCal, setActiveCal] = React.useState<string>(
    () => activeRations[0]?.calories ?? "",
  );
  const [activeDay, setActiveDay] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!activeCal && rationTabs[0]) {
      setActiveCal(rationTabs[0].calories);
    }
  }, [rationTabs, activeCal]);

  const items = useBasketStore((state) => state.items);
  const addItem = useBasketStore((state) => state.addItem);
  const removeItem = useBasketStore((state) => state.removeItem);
  const setIsBasketOpen = useBasketStore((state) => state.setIsBasketOpen);

  const cartCalories = React.useMemo(
    () => items.map((i) => i.calories),
    [items],
  );

  const itemForActiveCal = React.useMemo(
    () => items.find((item) => item.calories === activeCal) ?? null,
    [items, activeCal],
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(RANGE_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as { range?: string | null };
      if (parsed && typeof parsed.range === "string") {
        setSelectedRange(parsed.range);
      }
    } catch {
      return;
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedRange) {
      window.localStorage.setItem(
        RANGE_STORAGE_KEY,
        JSON.stringify({ range: selectedRange }),
      );
    } else {
      window.localStorage.removeItem(RANGE_STORAGE_KEY);
    }
  }, [selectedRange]);

  const dishesCount =
    rationTabs.find((t) => t.calories === activeCal)?.countProduct ?? 0;
  const pricePerDay = priceByCalMap[activeCal] ?? 0;

  React.useEffect(() => {
    if (!selectedRange) {
      setActiveDay(null);
      return;
    }
    const startStr = selectedRange.split("_")[0];
    setActiveDay(startStr);
  }, [selectedRange]);

  // Auto-select first week when weeks load and no range stored
  React.useEffect(() => {
    if (weeks.length > 0 && !selectedRange) {
      setSelectedRange(weeks[0].value);
    }
  }, [weeks, selectedRange]);

  const realDishesByCal = React.useMemo(
    () =>
      Object.fromEntries(
        activeRations.map((r) => [r.calories, r.dishes ?? []]),
      ),
    [activeRations],
  );

  const productsByDiet = React.useMemo(() => {
    const map: Record<string, TProduct[]> = {};
    const seedDay = activeDay || "default";

    // getDay(): 0=Sun,1=Mon,...,6=Sat → map to our system: Sun=7,Mon=1,...,Sat=6
    const activeDayOfWeek: number | null = (() => {
      if (!activeDay) return null;
      const dow = new Date(activeDay + "T12:00:00").getDay();
      const mapped = dow === 0 ? 7 : dow;
      return mapped >= 1 && mapped <= 7 ? mapped : null;
    })();

    for (const tab of rationTabs) {
      const allDishes = realDishesByCal[tab.calories] ?? [];
      // Блюда для текущей недели (или без привязки к неделе)
      const weekDishes = allDishes.filter(
        (d) => !d.week || d.week === currentWeek,
      );
      // Блюда для выбранного дня (или без привязки к дню)
      const dayDishes =
        activeDayOfWeek !== null
          ? weekDishes.filter(
              (d) => !d.dayOfWeek || d.dayOfWeek === activeDayOfWeek,
            )
          : weekDishes;

      const dishesToShow = dayDishes;

      if (dishesToShow.length > 0) {
        map[tab.calories] = dishesToShow.map((d) => ({
          id: d.id,
          name: d.name,
          image: d.image || "/product.png",
          calories: d.calories,
          weight: d.weight,
          proteins: d.proteins,
          fats: d.fats,
          carbs: d.carbs,
          description: d.description || "",
          dietCalories: tab.calories,
          meal: d.meal,
        }));
      } else {
        map[tab.calories] = [];
      }
    }
    return map;
  }, [activeDay, rationTabs, realDishesByCal, currentWeek]);

  const handleRangeChange = React.useCallback((value: string) => {
    setSelectedRange(value);
  }, []);

  const handleAdd = React.useCallback(() => {
    if (itemForActiveCal) return;
    addItem({
      id: activeCal,
      calories: activeCal,
      selectedDays: [],
      range: selectedRange ?? null,
      pricePerDay,
      dishesCount,
    });
    toast.success(`Рацион ${activeCal} ккал добавлен в корзину`, {
      duration: 3000,
    });
  }, [
    itemForActiveCal,
    addItem,
    activeCal,
    selectedRange,
    pricePerDay,
    dishesCount,
  ]);

  const handleRemove = React.useCallback(() => {
    if (itemForActiveCal) removeItem(itemForActiveCal.id);
  }, [itemForActiveCal, removeItem]);

  const containerV: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
  };

  const itemTransition: Transition = {
    type: "spring",
    stiffness: 260,
    damping: 20,
  };

  const itemV: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: itemTransition },
  };

  const isInCart = !!itemForActiveCal;
  const totalInCart = items.length;

  if (!isMounted) {
    return (
      <section id="products" className="bg-whitePrimary py-14 lg:py-20">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2">
            <div>
              <p className="text-xs font-semibold text-yellow-hover uppercase tracking-widest mb-1">
                Меню
              </p>
              <h3 className="text-[28px] font-bold text-colorPrimary lg:text-[32px]">
                Рационы питания
              </h3>
            </div>
          </div>
          <div className="mt-6 h-[320px] rounded-2xl bg-whiteSecondary animate-pulse" />
        </Container>
      </section>
    );
  }

  return (
    <section id="products" className="bg-whitePrimary py-14 lg:py-20">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
          <div>
            <p className="text-xs font-semibold text-yellow-hover uppercase tracking-widest mb-1">
              Меню
            </p>
            <h3 className="text-[28px] font-bold text-colorPrimary lg:text-[32px]">
              Рационы питания
            </h3>
          </div>
          <ScrollLink
            className="hidden cursor-pointer text-sm font-semibold text-colorPrimary/50 transition-colors hover:text-yellow-hover md:block mb-1"
            to="calculator"
            smooth
            duration={500}
            spy
            offset={100}
          >
            Рассчитать калорийность →
          </ScrollLink>
        </div>

        {activeRations.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border border-dashed border-greySecondary/50 bg-whiteSecondary text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-colorPrimary/10 flex items-center justify-center">
              <MdOutlineRestaurantMenu className="w-8 h-8 text-colorPrimary" />
            </div>
            <div>
              <p className="text-colorPrimary font-bold text-lg">
                Рационы скоро появятся
              </p>
              <p className="text-colorPrimary/50 text-sm mt-1">
                Мы готовим вкусные и сбалансированные рационы питания
              </p>
            </div>
          </div>
        ) : (
          <Tabs
            value={`calories-${activeCal}`}
            className="grid gap-4"
            onValueChange={(value) => {
              setActiveCal(value.replace("calories-", ""));
            }}
          >
            <CaloriesTabsList tabs={rationTabs} cartCalories={cartCalories} />

            {/* ── COMBINED PANEL: left = dates/days, right = order summary ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
              {/* LEFT: week tabs + day buttons */}
              <div className="rounded-2xl border border-grey-border bg-whiteSecondary p-4">
                <p className="text-xs font-semibold text-greySecondary uppercase tracking-widest mb-3">
                  Неделя доставки
                </p>
                <div className="flex flex-wrap gap-2">
                  {weeks.map((w) => {
                    const isActive = selectedRange === w.value;
                    return (
                      <button
                        key={w.value}
                        type="button"
                        onClick={() => handleRangeChange(w.value)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border cursor-pointer ${
                          isActive
                            ? "bg-colorPrimary text-white border-colorPrimary"
                            : "bg-white text-colorPrimary border-grey-border hover:border-colorPrimary/40"
                        }`}
                      >
                        {w.label}
                      </button>
                    );
                  })}
                </div>

                {selectedRange && (
                  <>
                    <p className="text-xs font-semibold text-greySecondary uppercase tracking-widest mt-4 mb-3">
                      День
                    </p>
                    <SelectDaysButtons
                      range={selectedRange}
                      activeDay={activeDay}
                      onSetActiveDay={setActiveDay}
                    />
                  </>
                )}
              </div>

              {/* RIGHT: order summary */}
              <div
                className={`rounded-2xl border flex flex-col justify-between gap-4 p-4 transition-all duration-300 min-w-[220px] ${
                  isInCart
                    ? "border-colorPrimary/20 bg-colorPrimary"
                    : "border-grey-border bg-whiteSecondary"
                }`}
              >
                {/* Ration info */}
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ${
                      isInCart
                        ? "bg-white/15 text-white"
                        : "bg-colorPrimary text-white"
                    }`}
                  >
                    <Flame size={11} className="opacity-70" />
                    <span className="text-sm font-extrabold leading-none">
                      {activeCal}
                    </span>
                    <span className="text-[8px] font-bold uppercase opacity-60">
                      ккал
                    </span>
                  </div>
                  <div>
                    <p
                      className={`text-base font-extrabold leading-tight ${isInCart ? "text-white" : "text-colorPrimary"}`}
                    >
                      {activeCal}{" "}
                      <span
                        className={`text-sm font-semibold ${isInCart ? "text-white/70" : "text-greySecondary"}`}
                      >
                        ккал
                      </span>
                    </p>
                    <p
                      className={`text-xs mt-1 ${isInCart ? "text-white/70" : "text-greySecondary"}`}
                    >
                      {dishesCount} {dishesWord(dishesCount)} в день
                    </p>
                    <p
                      className={`text-sm font-bold mt-0.5 ${isInCart ? "text-yellowPrimary" : "text-yellow-hover"}`}
                    >
                      {pricePerDay} BYN/день
                    </p>
                    {isInCart && (
                      <p className="text-xs text-white/50 mt-1">
                        Выберите даты в корзине
                      </p>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="flex flex-col gap-2">
                  {isInCart ? (
                    <>
                      <Button
                        size="default"
                        className="w-full bg-yellowPrimary text-colorPrimary font-bold hover:bg-yellow-hover hover:text-white"
                        onClick={() => setIsBasketOpen(true)}
                      >
                        <ShoppingCart size={14} />
                        Корзина
                        {totalInCart > 0 && (
                          <span className="ml-1 bg-colorPrimary/15 text-colorPrimary rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold">
                            {totalInCart}
                          </span>
                        )}
                      </Button>
                      <button
                        onClick={handleRemove}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer text-xs font-semibold"
                        aria-label="Убрать рацион"
                      >
                        <Trash2 size={13} />
                        Убрать
                      </button>
                    </>
                  ) : (
                    <Button
                      size="default"
                      className="w-full bg-yellowPrimary text-colorPrimary font-bold hover:bg-yellow-hover hover:text-white"
                      onClick={handleAdd}
                    >
                      <ShoppingBag size={14} />В корзину
                      {totalInCart > 0 && (
                        <span className="ml-1.5 flex items-center gap-0.5 text-[11px] font-bold bg-colorPrimary/10 text-colorPrimary rounded-full px-1.5">
                          <Check size={9} strokeWidth={3} />
                          {totalInCart}
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* ── PRODUCT GRIDS ── */}
            <section>
              {rationTabs.map((tab) => {
                const tabValue = `calories-${tab.calories}`;
                const products = productsByDiet[tab.calories] ?? [];
                const allDishesForRation = realDishesByCal[tab.calories] ?? [];
                const noDishesAtAll = allDishesForRation.length === 0;
                const noDishesForDay = !noDishesAtAll && products.length === 0;

                return (
                  <TabsContent
                    key={tab.calories}
                    value={tabValue}
                    className="mt-2 font-medium text-colorPrimary"
                  >
                    {noDishesAtAll ? (
                      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-greySecondary/50 bg-whiteSecondary px-6 py-14 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-colorPrimary/8">
                          <MdOutlineRestaurantMenu
                            size={26}
                            className="text-colorPrimary/40"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-colorPrimary">
                            Блюда пока не добавлены
                          </p>
                          <p className="mt-1 text-sm text-greySecondary">
                            Блюда для этого рациона ещё не добавлены. Мы уже
                            работаем над этим!
                          </p>
                        </div>
                      </div>
                    ) : noDishesForDay ? (
                      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-greySecondary/30 bg-whiteSecondary px-6 py-14 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellowPrimary/15">
                          <CalendarDays
                            size={26}
                            className="text-yellow-hover"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-colorPrimary">
                            На этот день блюда не назначены
                          </p>
                          <p className="mt-1 text-sm text-greySecondary">
                            Выберите другой день или обратитесь
                            к&nbsp;администратору
                          </p>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        key={`${tab.calories}-${activeDay}`}
                        variants={containerV}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 items-stretch justify-start gap-3 sm:[grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]"
                      >
                        {products.map((product) => (
                          <motion.div
                            key={product.id}
                            variants={itemV}
                            style={{ willChange: "transform, opacity" }}
                            className="h-full w-full"
                          >
                            <ProductCard product={product} />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </TabsContent>
                );
              })}
            </section>
          </Tabs>
        )}
      </Container>
    </section>
  );
};
