"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Gender = "male" | "female";
type Goal = "loss" | "tone" | "gain";
type Activity = "low" | "medium" | "high";

type ActivityValue = 1 | 2 | 3;
const activityMap: Record<ActivityValue, Activity> = {
  1: "low",
  2: "medium",
  3: "high",
};

interface Plan {
  cal: number;
  dishes: number;
  price: number;
}

const PLANS: Plan[] = [
  { cal: 1000, dishes: 3, price: 250 },
  { cal: 1200, dishes: 4, price: 300 },
  { cal: 1400, dishes: 5, price: 350 },
  { cal: 1700, dishes: 5, price: 400 },
  { cal: 2000, dishes: 5, price: 450 },
  { cal: 2400, dishes: 6, price: 500 },
  { cal: 3200, dishes: 6, price: 600 },
];

const getCalorieLevel = (cal: number) => {
  if (cal <= 1400) return "низкая";
  if (cal <= 2400) return "средняя";
  return "высокая";
};

export default function CalorieCalculator() {
  const [gender, setGender] = useState<Gender | "">("");
  const [goal, setGoal] = useState<Goal | "">("");
  const [activity, setActivity] = useState<Activity>("low");
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");
  const [activityValue, setActivityValue] = useState<ActivityValue>(1);

  const validParams = useMemo(
    () =>
      Boolean(
        gender &&
          goal &&
          activityValue !== null &&
          weight !== "" &&
          height !== "" &&
          age !== ""
      ),
    [gender, goal, activityValue, weight, height, age]
  );

  const recommended = useMemo<Plan | null>(() => {
    if (!validParams) return null;

    const w = Number(weight),
      h = Number(height),
      a = Number(age);

    const bmrBase =
      gender === "male"
        ? 88.36 + 13.4 * w + 4.8 * h - 5.7 * a
        : 447.6 + 9.2 * w + 3.1 * h - 4.3 * a;

    const activityFactorMap: Record<Activity, number> = {
      low: 1.2,
      medium: 1.55,
      high: 1.9,
    };
    const goalAdjustMap: Record<Goal, number> = {
      loss: -500,
      tone: 0,
      gain: 500,
    };

    const af = activityFactorMap[activity as Activity];
    const ga = goalAdjustMap[goal as Goal];
    const raw = bmrBase * af + ga;

    return PLANS.reduce(
      (closest, plan) =>
        Math.abs(plan.cal - raw) < Math.abs(closest.cal - raw) ? plan : closest,
      PLANS[0]
    );
  }, [gender, goal, activity, weight, height, age, validParams]);

  const columns = [
    {
      title: "Пол:",
      render: () => (
        <div className="grid grid-cols-2 md:grid-cols-[175px_175px] gap-3">
          {(["male", "female"] as Gender[]).map((g) => (
            <Button
              key={g}
              className={`py-[22px] font-semibold border-grey-border border-[1px]  ${
                gender === g
                  ? "bg-whitePrimary text-greenPrimary "
                  : "bg-transparent text-whitePrimary hover:bg-whitePrimary/5 "
              }`}
              onClick={() => setGender(g)}
            >
              {g === "male" ? "Мужчина" : "Женщина"}
            </Button>
          ))}
        </div>
      ),
    },
    {
      title: "Параметры:",
      render: () => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-whitePrimary">
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Вес, кг"
            min={30}
            max={200}
            className="py-[22px] font-semibold border-grey-border border-[1px] placeholder:text-whitePrimary hover:bg-whitePrimary/5 focus:bg-whitePrimary/5 transition-colors"
            value={weight}
            onChange={(e) =>
              setWeight(e.target.value === "" ? "" : e.target.valueAsNumber)
            }
          />
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Рост, см"
            min={100}
            max={230}
            className="py-[22px] font-semibold border-grey-border border-[1px] placeholder:text-whitePrimary hover:bg-whitePrimary/5 focus:bg-whitePrimary/5 transition-colors"
            value={height}
            onChange={(e) =>
              setHeight(e.target.value === "" ? "" : e.target.valueAsNumber)
            }
          />
          <Input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Возраст"
            min={10}
            max={100}
            className="py-[22px] font-semibold border-grey-border border-[1px] placeholder:text-whitePrimary hover:bg-whitePrimary/5 focus:bg-whitePrimary/5 transition-colors"
            value={age}
            onChange={(e) =>
              setAge(e.target.value === "" ? "" : e.target.valueAsNumber)
            }
          />
        </div>
      ),
    },
    {
      title: "Цель:",
      render: () => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {(["loss", "tone", "gain"] as Goal[]).map((g) => (
            <Button
              key={g}
              className={`py-[22px] font-semibold border-grey-border border-[1px] ${
                goal === g
                  ? "bg-whitePrimary text-greenPrimary"
                  : "bg-transparent text-whitePrimary hover:bg-whitePrimary/5"
              }`}
              onClick={() => setGoal(g)}
            >
              {g === "loss"
                ? "Похудение"
                : g === "tone"
                ? "Тонус"
                : "Набор массы"}
            </Button>
          ))}
        </div>
      ),
    },
    {
      title: "Активность:",
      render: () => (
        <div className="">
          <div className="flex items-center justify-center gap-0 px-2">
            {[1, 2, 3].map((val) => (
              <React.Fragment key={val}>
                <button
                  aria-label="Калорийность активности"
                  onClick={() => {
                    setActivityValue(val as ActivityValue);
                    setActivity(activityMap[val as ActivityValue]);
                  }}
                  className="p-[4px] border-2 border-grey-border rounded-full hover:bg-whitePrimary/10 active:scale-[0.98] transition-colors cursor-pointer "
                >
                  <span
                    className={`block w-4 h-4 rounded-full transition-colors ${
                      activityValue === val
                        ? "bg-whitePrimary"
                        : "bg-transparent"
                    }`}
                  />
                </button>
                {val < 3 && <div className="h-px flex-1 bg-grey-border" />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-semibold text-whitePrimary">
            <span>Низкая</span>
            <span>Средняя</span>
            <span>Высокая</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section>
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5 xl:gap-40 justify-between">
        <div>
          <div className="grid gap-[24px]">
            {columns.map((col) => (
              <div key={col.title} className="space-y-3">
                <h3 className="font-semibold text-whitePrimary text-[14px]">
                  {col.title}
                </h3>
                {col.render()}
              </div>
            ))}
          </div>
        </div>
        <section className="grid grid-rows-1 h-[300px] lg:h-auto gap-4">
          <div className="flex flex-col items-center justify-center rounded-[8px] bg-whitePrimary py-8">
            <h3 className="text-greenPrimary text-[18px] font-bold">
              Рекомендуемый калораж:
            </h3>
            {!recommended && (
              <p className="text-gray-500">Заполните все поля</p>
            )}
            {recommended && (
              <>
                <p className="text-[50px] my-3 text-greenPrimary font-bold">
                  {recommended.cal}
                </p>
                <div className="text-center text-greenPrimary font-semibold grid gap-1">
                  <p>• {getCalorieLevel(recommended.cal)} калорийность</p>
                  <p>• {recommended.dishes}-ти разовое питание</p>
                  <p>• от {recommended.price} BYN / день</p>
                </div>
              </>
            )}
          </div>
          <Button
            className="bg-yellowPrimary text-greenPrimary font-bold py-6"
            variant="default"
          >
            Добавить в корзину
          </Button>
        </section>
      </section>
    </section>
  );
}
