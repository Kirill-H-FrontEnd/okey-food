"use client";
import { ProductCard, TProduct } from "@/components/ui/product-card";
import { FC, useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link as ScrollLink } from "react-scroll";
import { SelectDate } from "@/components/ui/select-date";
import { SelectDaysButtons } from "./_components/SelectDaysButtons"; // путь по своему проекту
import { AnimatePresence, motion } from "framer-motion";

type TProducts = {};

const DATA_CALORIES_TABS = [
  { calories: "1000", countProduct: 3 },
  { calories: "1200", countProduct: 4 },
  { calories: "1400", countProduct: 5 },
  { calories: "1700", countProduct: 5 },
  { calories: "2000", countProduct: 5 },
  { calories: "2400", countProduct: 6 },
  { calories: "3200", countProduct: 6 },
];

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
];
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
];
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
];

const rand = (n: number) => Math.floor(Math.random() * n);
const getDishName3 = () =>
  `${ADJ[rand(ADJ.length)]} ${PROTEIN[rand(PROTEIN.length)]} ${
    STYLE[rand(STYLE.length)]
  }`;

const genProductsForDiet = (count: number, dietCalories: string): TProduct[] =>
  Array.from({ length: count }, (_, i) => {
    const weight = 300;
    const calories = Math.round(Number(dietCalories) / count) + i * 5;
    const proteins = 25 + (i % 3) * 3;
    const fats = 10 + (i % 2) * 2;
    const carbs = 30 + (i % 4) * 5;
    const meal: MealRu = MEALS[i % MEALS.length];

    return {
      id: `${dietCalories}-${i + 1}`,
      name: getDishName3(),
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
export const Products: FC<TProducts> = () => {
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    setSelectedDays([]);
  };

  const handleToggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const productsByDiet = useMemo(() => {
    const map: Record<string, TProduct[]> = {};
    for (const t of DATA_CALORIES_TABS) {
      map[t.calories] = genProductsForDiet(t.countProduct, t.calories);
    }
    return map;
  }, []);

  return (
    <section id="products" className="py-14 lg:py-20 bg-whitePrimary">
      <Container>
        <article className="w-full max-w-[450px] lg:max-w-full">
          <h3 className="text-[28px] lg:text-[32px] font-bold text-greenPrimary">
            Рационы питания
          </h3>
        </article>

        <Tabs
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
              duration={300}
              spy={true}
              offset={100}
            >
              Рассчитать калорийность
            </ScrollLink>
          </div>
          <TabsList>
            {DATA_CALORIES_TABS.map((tab) => (
              <TabsTrigger
                key={tab.calories}
                value={`calories-${tab.calories}`}
                className="text-greenPrimary font-medium bg-white py-4 border-[1px] border-grey-border cursor-pointer data-[state=active]:bg-greenPrimary data-[state=active]:border-greenPrimary data-[state=active]:text-whitePrimary group shadow-none"
              >
                <div>
                  <p className="text-greenPrimary group-data-[state=active]:text-whitePrimary font-bold">
                    {tab.calories}
                  </p>
                  <p className="text-greySecondary group-data-[state=active]:text-yellowPrimary">
                    {tab.countProduct} блюд
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <section>
            <h5 className="text-[16px] lg:text-[20px] font-bold text-greenPrimary">
              Меню на неделю
            </h5>
            <div className="mt-2">
              <SelectDate onChange={handleRangeChange} />
            </div>

            {selectedRange && (
              <SelectDaysButtons
                range={selectedRange}
                onToggleDay={handleToggleDay}
                selectedDays={selectedDays}
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
                  <div
                    className="
    grid grid-cols-1 gap-4 items-stretch justify-start
    sm:[grid-template-columns:repeat(auto-fill,280px)]
  "
                  >
                    {products.map((data, idx) => (
                      <motion.div
                        key={data.id}
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 160,
                          damping: 32,
                          mass: 0.7,
                          delay: idx * 0.08,
                        }}
                        className="w-full h-full"
                      >
                        <ProductCard product={data} />
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              );
            })}
          </section>
        </Tabs>
      </Container>
    </section>
  );
};
