"use client";

import React, { FC } from "react";
import { motion, type Transition, type Variants } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { ChefHat } from "lucide-react";

import { ProductCard } from "@/components/ui/product-card";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { SelectDate } from "@/components/ui/select-date";
import { SelectDaysButtons } from "./_components/SelectDaysButtons";
import { OrderSummary } from "./_components/order-summary";
import { CaloriesTabsList } from "./_components/calories-tabs-list";

import { listSelectableDays } from "@/lib/delivery-days";
import { genProductsForDiet } from "./lib/products-config";
import { useBasketStore } from "@/store/useStore";
import { useAdminStore } from "@/store/useAdminStore";
import type { TProduct } from "@/types/product-card-type";

const RANGE_STORAGE_KEY = "okey-food:products-range";
const DEFAULT_DISHES_COUNT = 5;

export const Products: FC = () => {
  const allRations = useAdminStore((state) => state.rations);
  const activeRations = React.useMemo(
    () => allRations.filter((r) => r.isActive),
    [allRations],
  );

  const rationTabs = React.useMemo(
    () =>
      activeRations.map((r) => ({
        calories: r.calories,
        countProduct: r.dishes?.length || DEFAULT_DISHES_COUNT,
      })),
    [activeRations],
  );

  const priceByCalMap = React.useMemo(
    () =>
      Object.fromEntries(activeRations.map((r) => [r.calories, r.pricePerDay])),
    [activeRations],
  );

  const [selectedRange, setSelectedRange] = React.useState<string | null>(null);
  const [activeCal, setActiveCal] = React.useState<string>(
    () => rationTabs[0]?.calories ?? "",
  );
  const [activeDay, setActiveDay] = React.useState<string | null>(null);

  const lastActiveCalRef = React.useRef(activeCal);

  React.useEffect(() => {
    if (!activeCal && rationTabs[0]) {
      setActiveCal(rationTabs[0].calories);
    }
  }, [rationTabs, activeCal]);

  const items = useBasketStore((state) => state.items);
  const addItem = useBasketStore((state) => state.addItem);
  const updateItem = useBasketStore((state) => state.updateItem);
  const removeItem = useBasketStore((state) => state.removeItem);
  const setIsBasketOpen = useBasketStore((state) => state.setIsBasketOpen);

  const dishesByCal = React.useMemo(
    () =>
      Object.fromEntries(
        rationTabs.map((tab) => [tab.calories, tab.countProduct] as const),
      ),
    [rationTabs],
  );

  const itemForActiveCal = React.useMemo(
    () => items.find((item) => item.calories === activeCal) ?? null,
    [items, activeCal],
  );

  const selectedDays = React.useMemo(
    () => itemForActiveCal?.selectedDays ?? [],
    [itemForActiveCal],
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

  const dishesCount = dishesByCal[activeCal] ?? 0;
  const pricePerDay = priceByCalMap[activeCal] ?? 0;
  const totalPrice = pricePerDay * selectedDays.length;

  React.useEffect(() => {
    if (!selectedRange) {
      setActiveDay(null);
      return;
    }
    const selectable = listSelectableDays(selectedRange);
    if (activeDay && !selectable.includes(activeDay)) {
      setActiveDay(null);
    }
  }, [selectedRange, activeDay]);

  React.useEffect(() => {
    if (lastActiveCalRef.current === activeCal) return;
    const nextActive =
      selectedDays.length > 0 ? [...selectedDays].sort()[0] : null;
    setActiveDay(nextActive);
    lastActiveCalRef.current = activeCal;
  }, [activeCal, selectedDays]);

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
    for (const tab of rationTabs) {
      const realDishes = realDishesByCal[tab.calories];
      if (realDishes && realDishes.length > 0) {
        map[tab.calories] = realDishes.map((d) => ({
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
  }, [activeDay, rationTabs, realDishesByCal]);

  const createCartItem = React.useCallback(
    (days: string[], range: string | null) => ({
      id: activeCal,
      calories: activeCal,
      selectedDays: days,
      range,
      pricePerDay,
      dishesCount,
    }),
    [activeCal, pricePerDay, dishesCount],
  );

  const handleRangeChange = React.useCallback(
    (value: string) => {
      setSelectedRange(value);
      const selectable = new Set(listSelectableDays(value));
      if (!itemForActiveCal) return;
      const filteredDays = itemForActiveCal.selectedDays.filter((day) =>
        selectable.has(day),
      );
      if (filteredDays.length === 0) {
        removeItem(itemForActiveCal.id);
        return;
      }
      updateItem(itemForActiveCal.id, (prev) => ({
        ...prev,
        selectedDays: filteredDays,
        range: value,
      }));
    },
    [itemForActiveCal, removeItem, updateItem],
  );

  const handleToggleDay = React.useCallback(
    (day: string) => {
      const isSelected = selectedDays.includes(day);
      if (isSelected) {
        const nextDays = selectedDays.filter((d) => d !== day);
        if (nextDays.length === 0) {
          removeItem(activeCal);
        } else {
          updateItem(activeCal, (prev) => ({
            ...prev,
            selectedDays: nextDays,
          }));
        }
        return;
      }
      const nextDays = [...selectedDays, day];
      if (itemForActiveCal) {
        updateItem(activeCal, (prev) => ({
          ...prev,
          selectedDays: nextDays,
          range: selectedRange ?? prev.range,
        }));
      } else {
        addItem(createCartItem(nextDays, selectedRange ?? null));
      }
    },
    [
      selectedDays,
      itemForActiveCal,
      updateItem,
      removeItem,
      addItem,
      createCartItem,
      selectedRange,
      activeCal,
    ],
  );

  const handleIncDays = React.useCallback(() => {
    if (!selectedRange) return;
    const selectable = listSelectableDays(selectedRange).sort();
    if (selectedDays.length >= selectable.length) return;
    const next = selectable.find((day) => !selectedDays.includes(day));
    if (!next) return;
    if (itemForActiveCal) {
      updateItem(activeCal, (prev) => ({
        ...prev,
        selectedDays: [...prev.selectedDays, next],
        range: selectedRange,
      }));
    } else {
      addItem(createCartItem([next], selectedRange));
    }
  }, [
    selectedRange,
    selectedDays,
    itemForActiveCal,
    updateItem,
    activeCal,
    addItem,
    createCartItem,
  ]);

  const handleDecDays = React.useCallback(() => {
    if (selectedDays.length === 0) return;
    const nextDays = [...selectedDays].sort().slice(0, -1);
    if (nextDays.length === 0) {
      removeItem(activeCal);
      return;
    }
    updateItem(activeCal, (prev) => ({
      ...prev,
      selectedDays: nextDays,
    }));
  }, [selectedDays, updateItem, removeItem, activeCal]);

  const handleAdd = React.useCallback(() => {
    if (!selectedRange) return;
    const daysToAdd =
      selectedDays.length > 0
        ? selectedDays
        : listSelectableDays(selectedRange);
    if (daysToAdd.length === 0) return;
    if (itemForActiveCal) {
      updateItem(activeCal, (prev) => ({
        ...prev,
        selectedDays: Array.from(new Set(daysToAdd)),
        range: selectedRange,
      }));
    } else {
      addItem(createCartItem(daysToAdd, selectedRange));
    }
    setIsBasketOpen(true);
  }, [
    selectedRange,
    selectedDays,
    itemForActiveCal,
    updateItem,
    activeCal,
    addItem,
    createCartItem,
    setIsBasketOpen,
  ]);

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

  return (
    <section id="products" className="bg-whitePrimary py-14 lg:py-20">
      <Container>
        <article className="w-full max-w-[450px] lg:max-w-full">
          <h3 className="text-[28px] font-bold text-colorPrimary lg:text-[32px]">
            Рационы питания
          </h3>
        </article>

        {activeRations.length === 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 py-20 rounded-2xl border border-dashed border-colorPrimary/20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-colorPrimary/5 flex items-center justify-center">
              <ChefHat className="w-8 h-8 text-colorPrimary/30" />
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
              setActiveDay(null);
            }}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-[18px] font-bold text-colorPrimary lg:text-[22px]">
                Выберите калорийность
              </h4>
              <ScrollLink
                className="hidden cursor-pointer text-colorPrimary transition-colors hover:text-yellow-hover md:block"
                to="calculator"
                smooth
                duration={500}
                spy
                offset={100}
              >
                Рассчитать калорийность
              </ScrollLink>
            </div>

            <CaloriesTabsList tabs={rationTabs} />

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
                  onToggleDay={handleToggleDay}
                  selectedDays={selectedDays}
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
              hasRange={!!selectedRange}
              daysCount={selectedDays.length}
              pricePerDay={pricePerDay}
              totalPrice={totalPrice}
              onInc={handleIncDays}
              onDec={handleDecDays}
              onAdd={handleAdd}
            />
          </Tabs>
        )}
      </Container>
    </section>
  );
};
