"use client";

import React, { FC } from "react";
import { motion, type Transition, type Variants } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import toast from "react-hot-toast";

import { MdOutlineRestaurantMenu } from "react-icons/md";
import { ProductCard } from "@/components/ui/product-card";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SelectDate } from "@/components/ui/select-date";
import { SelectDaysButtons } from "./_components/SelectDaysButtons";
import { OrderSummary } from "./_components/order-summary";
import { CaloriesTabsList } from "./_components/calories-tabs-list";

import {
  listSelectableDays,
  getWeekNumberFromRange,
} from "@/lib/delivery-days";

import { genProductsForDiet } from "./lib/products-config";
import { useBasketStore } from "@/store/useStore";
import { useAdminStore } from "@/store/useAdminStore";
import type { TProduct } from "@/types/product-card-type";

function getFirstAvailableDay(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (d.getDay() === 0) d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const RANGE_STORAGE_KEY = "okey-food:products-range";
const DEFAULT_DISHES_COUNT = 5;

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
        const countForWeek =
          weekDishes.length > 0 ? weekDishes.length : allDishes.length;
        return {
          calories: r.calories,
          countProduct: countForWeek || DEFAULT_DISHES_COUNT,
          pricePerDay: r.pricePerDay,
          name: r.name,
        };
      }),
    [activeRations, currentWeek],
  );

  const [activeCal, setActiveCal] = React.useState<string>(
    () => activeRations[0]?.calories ?? "",
  );
  const [activeDay, setActiveDay] = React.useState<string | null>(() =>
    getFirstAvailableDay(),
  );

  const lastActiveCalRef = React.useRef(activeCal);

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
    rationTabs.find((t) => t.calories === activeCal)?.countProduct ??
    DEFAULT_DISHES_COUNT;
  const pricePerDay = priceByCalMap[activeCal] ?? 0;

  React.useEffect(() => {
    if (!selectedRange) {
      setActiveDay(getFirstAvailableDay());
      return;
    }
    const selectable = listSelectableDays(selectedRange);
    if (!activeDay || !selectable.includes(activeDay)) {
      setActiveDay(selectable[0] ?? getFirstAvailableDay());
    }
  }, [selectedRange, activeDay]);

  React.useEffect(() => {
    lastActiveCalRef.current = activeCal;
  }, [activeCal]);

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

    // Преобразуем выбранную дату (YYYY-MM-DD) в день недели (1=Пн..6=Сб)
    // getDay() возвращает: 0=Вс, 1=Пн, 2=Вт, 3=Ср, 4=Чт, 5=Пт, 6=Сб
    const activeDayOfWeek: number | null = (() => {
      if (!activeDay) return null;
      const dow = new Date(activeDay + "T12:00:00").getDay();
      return dow >= 1 && dow <= 6 ? dow : null;
    })();

    for (const tab of rationTabs) {
      const allDishes = realDishesByCal[tab.calories] ?? [];

      const weekDishes = allDishes.filter(
        (d) => !d.week || d.week === currentWeek,
      );

      const baseSet = weekDishes.length > 0 ? weekDishes : allDishes;

      // Если выбран конкретный день — показываем только блюда этого дня
      const dayDishes =
        activeDayOfWeek !== null
          ? baseSet.filter((d) => d.dayOfWeek === activeDayOfWeek)
          : baseSet;

      // Если для выбранного дня блюд нет — показываем всё меню недели
      const dishesToShow = dayDishes.length > 0 ? dayDishes : baseSet;

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
        map[tab.calories] = genProductsForDiet(
          tab.countProduct,
          tab.calories,
          seedDay,
        );
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
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.05,
      },
    },
  };

  const itemTransition: Transition = {
    type: "spring",
    stiffness: 260,
    damping: 20,
  };

  const itemV: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: itemTransition,
    },
  };

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2">
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
            className="mt-6 grid gap-4"
            onValueChange={(value) => {
              setActiveCal(value.replace("calories-", ""));
            }}
          >
            <CaloriesTabsList tabs={rationTabs} cartCalories={cartCalories} />

            <section>
              <h5 className="text-[16px] font-bold text-colorPrimary lg:text-[20px]">
                Меню на неделю
              </h5>
              <div className="mt-2">
                <SelectDate
                  onChange={handleRangeChange}
                  defaultValue={selectedRange ?? undefined}
                />
              </div>
              {selectedRange && (
                <SelectDaysButtons
                  range={selectedRange}
                  activeDay={activeDay}
                  onSetActiveDay={setActiveDay}
                />
              )}

              {rationTabs.map((tab) => {
                const tabValue = `calories-${tab.calories}`;
                const products = productsByDiet[tab.calories];

                return (
                  <TabsContent
                    key={tab.calories}
                    value={tabValue}
                    className="mt-6 font-medium text-colorPrimary"
                  >
                    <motion.div
                      key={`${tab.calories}-${activeDay}`}
                      variants={containerV}
                      initial="hidden"
                      animate="show"
                      className="grid grid-cols-2 items-stretch justify-start gap-3 sm:[grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]"
                    >
                      {products?.map((product) => (
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
                  </TabsContent>
                );
              })}
            </section>

            <OrderSummary
              activeCal={activeCal}
              dishesCount={dishesCount}
              pricePerDay={pricePerDay}
              isInCart={!!itemForActiveCal}
              totalInCart={items.length}
              onAdd={handleAdd}
              onRemove={handleRemove}
              onOpenBasket={() => setIsBasketOpen(true)}
            />
          </Tabs>
        )}
      </Container>
    </section>
  );
};
