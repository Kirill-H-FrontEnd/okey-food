"use client";
// > React
import React, { FC } from "react";
// > Components
import { ProductCard } from "@/components/ui/product-card";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Link as ScrollLink } from "react-scroll";
import { SelectDate } from "@/components/ui/select-date";
import { SelectDaysButtons } from "./_components/SelectDaysButtons";
import { motion, type Variants, type Transition } from "framer-motion";
import { OrderSummary } from "./_components/order-summary";
import { CaloriesTabsList } from "./_components/calories-tabs-list";
import { listSelectableDays } from "@/lib/delivery-days"; // CHANGED: берем из lib
// > Types
import { TProduct } from "@/types/product-card-type";
import { useBasketStore } from "@/store/useStore";
type TProducts = {};

const RANGE_STORAGE_KEY = "okey-food:products-range";

const DATA_CALORIES_TABS = [
  { calories: "1000", countProduct: 3 },
  { calories: "1200", countProduct: 4 },
  { calories: "1400", countProduct: 5 },
  { calories: "1700", countProduct: 5 },
  { calories: "2000", countProduct: 5 },
  { calories: "2400", countProduct: 6 },
  { calories: "3200", countProduct: 6 },
];

const PRICE_BY_CAL: Record<string, number> = {
  "1000": 250,
  "1200": 300,
  "1400": 350,
  "1700": 400,
  "2000": 450,
  "2400": 500,
  "3200": 600,
};

const MEALS = [
  "Завтрак",
  "Второй завтрак",
  "Обед",
  "Полдник",
  "Ужин",
  "Перекус",
] as const;
type MealRu = (typeof MEALS)[number];

const ADJ = [
  "Сочный",
  "Диетический",
  "Пряный",
  "Нежный",
  "Хрустящий",
  "Пикантный",
  "Сливочный",
  "Домашний",
] as const;
const PROTEIN = [
  "Курица",
  "Лосось",
  "Индейка",
  "Говядина",
  "Тофу",
  "Фалафель",
  "Треска",
  "Тунец",
  "Овощи",
] as const;
const STYLE = [
  "гриль",
  "пар",
  "рагу",
  "боул",
  "паста",
  "салат",
  "хумус",
  "стир-фрай",
  "томлёное",
] as const;

/** ====== ✅ Детерминированный генератор вместо Math.random ====== */
function hash32(str: string) {
  // простая FNV-1a
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
function pickFrom<T>(arr: readonly T[], seed: string) {
  const h = hash32(seed);
  const idx = h % arr.length;
  return arr[idx];
}
function getDishNameStable(seed: string) {
  const a = pickFrom(ADJ, seed + "-a");
  const p = pickFrom(PROTEIN, seed + "-p");
  const s = pickFrom(STYLE, seed + "-s");
  return `${a} ${p} ${s}`;
}
/** =============================================================== */

const genProductsForDiet = (
  count: number,
  dietCalories: string,
  seed: string = "default",
): TProduct[] =>
  Array.from({ length: count }, (_, i) => {
    const weight = 300;
    const calories = Math.round(Number(dietCalories) / count) + i * 5;
    const proteins = 25 + (i % 3) * 3;
    const fats = 10 + (i % 2) * 2;
    const carbs = 30 + (i % 4) * 5;
    const meal: MealRu = MEALS[i % MEALS.length];

    const id = `${dietCalories}-${i + 1}-${seed}`;
    const name = getDishNameStable(id); // 👈 детерминированное имя

    return {
      id,
      name,
      image: `/product.png`,
      calories,
      weight,
      proteins,
      fats,
      carbs,
      description: "",
      dietCalories,
      meal,
    };
  });

// ================== MAIN ==================
export const Products: FC<TProducts> = () => {
  const [selectedRange, setSelectedRange] = React.useState<string | null>(null);
  const [activeCal, setActiveCal] = React.useState<string>(
    DATA_CALORIES_TABS[0].calories,
  );

  const items = useBasketStore((state) => state.items);
  const addItem = useBasketStore((state) => state.addItem);
  const updateItem = useBasketStore((state) => state.updateItem); // CHANGED
  const removeItem = useBasketStore((state) => state.removeItem);
  const setIsBasketOpen = useBasketStore((state) => state.setIsBasketOpen);

  const dishesByCal = React.useMemo(
    () =>
      Object.fromEntries(
        DATA_CALORIES_TABS.map((t) => [t.calories, t.countProduct] as const),
      ),
    [],
  );

  // CHANGED: один item на калорийность
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
  const pricePerDay = PRICE_BY_CAL[activeCal] ?? 0;
  const totalPrice = pricePerDay * selectedDays.length;
  const [activeDay, setActiveDay] = React.useState<string | null>(null);
  const lastActiveCalRef = React.useRef(activeCal);

  // Sync activeDay with selectedRange
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

  const productsByDiet = React.useMemo(() => {
    const map: Record<string, TProduct[]> = {};
    const seedDay = activeDay || "default";
    for (const t of DATA_CALORIES_TABS) {
      map[t.calories] = genProductsForDiet(t.countProduct, t.calories, seedDay);
    }
    return map;
  }, [activeDay]);
  // CHANGED: создаём один item c массивом дней и опциональным range
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

  // CHANGED: при смене диапазона фильтруем выбранные дни и обновляем item
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
    [itemForActiveCal, removeItem, setSelectedRange, updateItem],
  );

  // CHANGED: переключатель дня — теперь обновляет массив selectedDays
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

  // Counter: +
  const handleIncDays = React.useCallback(() => {
    if (!selectedRange) return;
    const selectable = listSelectableDays(selectedRange).sort();
    if (selectedDays.length >= selectable.length) return;
    const next = selectable.find((d) => !selectedDays.includes(d));
    if (next) {
      if (itemForActiveCal) {
        updateItem(activeCal, (prev) => ({
          ...prev,
          selectedDays: [...prev.selectedDays, next],
          range: selectedRange,
        }));
      } else {
        addItem(createCartItem([next], selectedRange));
      }
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

  // Counter: -
  const handleDecDays = React.useCallback(() => {
    if (selectedDays.length === 0) return;
    const sorted = [...selectedDays].sort();
    const nextDays = sorted.slice(0, -1);
    if (nextDays.length === 0) {
      removeItem(activeCal);
      return;
    }
    updateItem(activeCal, (prev) => ({
      ...prev,
      selectedDays: nextDays,
    }));
  }, [selectedDays, updateItem, removeItem, activeCal]);

  // Добавить выбранные дни (или все допустимые из range)
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
        selectedDays: Array.from(new Set([...daysToAdd])),
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
    type: "tween",
    duration: 0.38,
    ease: [0.22, 1, 0.36, 1],
  };

  const itemV: Variants = {
    hidden: { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: itemTransition,
    },
  };

  return (
    <section id="products" className="py-14 lg:py-20 bg-whitePrimary">
      <Container>
        <article className="w-full max-w-[450px] lg:max-w-full">
          <h3 className="text-[28px] lg:text-[32px] font-bold text-greenPrimary">
            Рационы питания
          </h3>
        </article>

        <Tabs
          onValueChange={(v) => {
            const cal = v.replace("calories-", "");
            setActiveCal(cal);
          }}
          defaultValue={`calories-${DATA_CALORIES_TABS[0].calories}`}
          className="grid gap-4 mt-6"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-[18px] lg:text-[22px] font-bold text-greenPrimary">
              Выберите калорийность
            </h4>
            <ScrollLink
              className="text-greenPrimary hover:text-yellow-hover transition-colors cursor-pointer hidden md:block"
              to={"calculator"}
              smooth={true}
              duration={500}
              spy={true}
              offset={100}
            >
              Рассчитать калорийность
            </ScrollLink>
          </div>

          <CaloriesTabsList tabs={DATA_CALORIES_TABS} />

          <section>
            <h5 className="text-[16px] lg:text-[20px] font-bold text-greenPrimary">
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

            {DATA_CALORIES_TABS.map((tab) => {
              const tabValue = `calories-${tab.calories}`;
              const products = productsByDiet[tab.calories];
              return (
                <TabsContent
                  key={tab.calories}
                  value={tabValue}
                  className="text-greenPrimary font-medium mt-6"
                >
                  <motion.div
                    key={`${tab.calories}-${activeDay}`}
                    variants={containerV}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-3 items-stretch justify-start sm:[grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]"
                  >
                    {products.map((data) => (
                      <motion.div
                        key={data.id}
                        variants={itemV}
                        style={{ willChange: "transform, opacity" }}
                        className="w-full h-full"
                      >
                        <ProductCard product={data} />
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
            pricePerDay={PRICE_BY_CAL[activeCal] ?? 0}
            totalPrice={totalPrice}
            onInc={handleIncDays}
            onDec={handleDecDays}
            onAdd={handleAdd}
          />
        </Tabs>
      </Container>
    </section>
  );
};
