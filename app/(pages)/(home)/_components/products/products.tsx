"use client";

import { FC, useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link as ScrollLink } from "react-scroll";
import { SelectDate } from "@/components/ui/select-date";
import { addDays, format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { SelectDaysButtons } from "./_components/SelectDaysButtons"; // путь по своему проекту

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

const generateProducts = (count: number) =>
  Array.from({ length: count }, (_, i) => `Блюдо ${i + 1}`);

export const Products: FC<TProducts> = () => {
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    const [start] = value.split("_");
    const monday = parseISO(start);
    const days = Array.from({ length: 6 }).map((_, i) =>
      format(addDays(monday, i), "yyyy-MM-dd")
    );
    setSelectedDays(days); // по умолчанию все выбраны
  };

  const handleToggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
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

            {DATA_CALORIES_TABS.map((tab) => (
              <TabsContent
                key={tab.calories}
                value={`calories-${tab.calories}`}
                className="text-greenPrimary font-medium mt-6"
              >
                <p className="mb-2">
                  Рацион на {tab.calories} ккал, {tab.countProduct} блюд:
                </p>
                <ul className="list-disc ml-4">
                  {generateProducts(tab.countProduct).map((product, i) => (
                    <li key={i}>{product}</li>
                  ))}
                </ul>
              </TabsContent>
            ))}
          </section>
        </Tabs>
      </Container>
    </section>
  );
};
