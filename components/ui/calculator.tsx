"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { HyperText } from "@/components/magicui/hyper-text";
import { useBasketStore } from "@/store/useStore";

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

const ACTIVITY_FACTORS: Record<Activity, number> = {
  low: 1.375,
  medium: 1.55,
  high: 1.725,
};

// Фиксированные корректировки под цель (в ккал)
const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  loss: -450,
  tone: -200,
  gain: 300,
};

const MIN_TARGET_CAL = 1200;
const MAX_TARGET_CAL = 4000;

function calcBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  ageY: number
) {
  return gender === "male"
    ? 10 * weightKg + 6.25 * heightCm - 5 * ageY + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * ageY - 161;
}

function isValidNum(n: unknown, min: number, max: number) {
  return typeof n === "number" && Number.isFinite(n) && n >= min && n <= max;
}
function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

interface Recommendation {
  targetCalories: number;
  maintenanceCalories: number;
  plan: Plan;
}

function formatTodayISO() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CalorieCalculator() {
  const [gender, setGender] = useState<Gender | "">("");
  const [goal, setGoal] = useState<Goal | "">("");
  const [activity, setActivity] = useState<Activity>("low");
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");
  const [activityValue, setActivityValue] = useState<ActivityValue>(1);

  const addItem = useBasketStore((state) => state.addItem);
  const setIsBasketOpen = useBasketStore((state) => state.setIsBasketOpen);

  const validParams = useMemo(
    () =>
      Boolean(
        gender &&
          goal &&
          activityValue !== null &&
          isValidNum(weight, 30, 250) &&
          isValidNum(height, 120, 230) &&
          isValidNum(age, 14, 100)
      ),
    [gender, goal, activityValue, weight, height, age]
  );

  const recommendation = useMemo<Recommendation | null>(() => {
    if (!validParams) return null;

    const w = Number(weight);
    const h = Number(height);
    const a = Number(age);

    const bmr = calcBMR(gender as Gender, w, h, a);
    const maintenance = bmr * ACTIVITY_FACTORS[activity as Activity];
    const adjusted = maintenance + GOAL_ADJUSTMENTS[goal as Goal];
    const target = clamp(Math.round(adjusted), MIN_TARGET_CAL, MAX_TARGET_CAL);

    const plan = PLANS.reduce(
      (closest, candidate) =>
        Math.abs(candidate.cal - target) < Math.abs(closest.cal - target)
          ? candidate
          : closest,
      PLANS[0]
    );

    return {
      plan,
      targetCalories: target,
      maintenanceCalories: Math.round(maintenance),
    };
  }, [gender, goal, activity, weight, height, age, validParams]);

  const handleAddToCart = useCallback(() => {
    if (!recommendation) return;
    const { plan } = recommendation;
    const today = formatTodayISO();

    addItem({
      id: `calculator-${plan.cal}`,
      calories: String(plan.cal),
      selectedDays: [today],
      range: null,
      pricePerDay: plan.price,
      dishesCount: plan.dishes,
    });
    setIsBasketOpen(true);
  }, [recommendation, addItem, setIsBasketOpen]);

  // правильные склонения «блюдо/блюда/блюд»
  function dishesWord(n: number) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return "блюдо";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
      return "блюда";
    return "блюд";
  }

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
            enterKeyHint="next"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Вес, кг"
            min={30}
            max={250}
            className="py-[22px] font-semibold border-grey-border border-[1px] placeholder:text-whitePrimary hover:bg-whitePrimary/5 focus:bg-whitePrimary focus:text-greenPrimary transition-colors"
            value={weight}
            onChange={(e) =>
              setWeight(e.target.value === "" ? "" : e.target.valueAsNumber)
            }
          />
          <Input
            enterKeyHint="next"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Рост, см"
            min={120}
            max={230}
            className="py-[22px] font-semibold border-grey-border border-[1px] placeholder:text-whitePrimary hover:bg-whitePrimary/5 focus:bg-whitePrimary focus:text-greenPrimary transition-colors"
            value={height}
            onChange={(e) =>
              setHeight(e.target.value === "" ? "" : e.target.valueAsNumber)
            }
          />
          <Input
            enterKeyHint="done"
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Возраст"
            min={14}
            max={100}
            className="py-[22px] font-semibold border-grey-border border-[1px] placeholder:text-whitePrimary hover:bg-whitePrimary/5 focus:bg-whitePrimary focus:text-greenPrimary transition-colors"
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

        <section className="grid grid-rows-1 min-h-[260px] lg:minh-0 gap-4">
          <div className="flex flex-col items-center justify-center rounded-[8px] bg-whitePrimary py-8">
            <h3 className="text-greenPrimary text-[18px] font-bold">
              Рекомендуемый калораж:
            </h3>

            {!recommendation && (
              <p className="text-gray-500">Заполните все поля</p>
            )}

            {recommendation && (
              <>
                <HyperText
                  key={recommendation.targetCalories}
                  duration={400}
                  startOnView={false}
                  animateOnHover={false}
                  className="text-[50px] my-3 text-greenPrimary font-bold leading-none tabular-nums"
                >
                  {String(recommendation.targetCalories)}
                </HyperText>

                <div className="text-center text-greenPrimary font-semibold grid gap-1">
                  <p>
                    • {getCalorieLevel(recommendation.targetCalories)}{" "}
                    калорийность
                  </p>
                  <p className="text-xs text-greySecondary">
                    (Поддержание: {recommendation.maintenanceCalories} ккал)
                  </p>
                  <p>
                    • {recommendation.plan.dishes}{" "}
                    {dishesWord(recommendation.plan.dishes)} в день
                  </p>
                  <p>• от {recommendation.plan.price} BYN / день</p>
                </div>
              </>
            )}
          </div>

          <Button
            className="bg-yellowPrimary text-greenPrimary font-bold py-6"
            variant="default"
            disabled={!recommendation}
            onClick={handleAddToCart}
          >
            Добавить в корзину
          </Button>
        </section>
      </section>
    </section>
  );
}
