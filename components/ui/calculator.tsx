"use client";

import { useState, useMemo, useCallback } from "react";
import React from "react";
import { HyperText } from "@/components/magicui/hyper-text";
import { useBasketStore } from "@/store/useStore";
import { useAdminStore } from "@/store/useAdminStore";
import toast from "react-hot-toast";
import { IoWarningOutline } from "react-icons/io5";
type Gender = "male" | "female";
type Goal = "loss" | "tone" | "gain";
type Activity = "low" | "medium" | "high";

type ActivityValue = 1 | 2 | 3;
const activityMap: Record<ActivityValue, Activity> = {
  1: "low",
  2: "medium",
  3: "high",
};

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
  ageY: number,
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

function dishesWord(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "блюдо";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "блюда";
  return "блюд";
}

export default function CalorieCalculator() {
  const [gender, setGender] = useState<Gender | "">("");
  const [goal, setGoal] = useState<Goal | "">("");
  const [activity, setActivity] = useState<Activity>("low");
  const [activityValue, setActivityValue] = useState<ActivityValue>(1);
  const [weight, setWeight] = useState<number | "">("");
  const [height, setHeight] = useState<number | "">("");
  const [age, setAge] = useState<number | "">("");

  const addItem = useBasketStore((state) => state.addItem);
  const allRations = useAdminStore((state) => state.rations);
  const activeRations = useMemo(
    () => allRations.filter((r) => r.isActive),
    [allRations],
  );

  const validParams = useMemo(
    () =>
      Boolean(
        gender &&
        goal &&
        isValidNum(weight, 30, 250) &&
        isValidNum(height, 120, 230) &&
        isValidNum(age, 14, 100),
      ),
    [gender, goal, weight, height, age],
  );

  const targetCalories = useMemo<number | null>(() => {
    if (!validParams) return null;
    const bmr = calcBMR(
      gender as Gender,
      Number(weight),
      Number(height),
      Number(age),
    );
    const maintenance = bmr * ACTIVITY_FACTORS[activity];
    const adjusted = maintenance + GOAL_ADJUSTMENTS[goal as Goal];
    return clamp(Math.round(adjusted), MIN_TARGET_CAL, MAX_TARGET_CAL);
  }, [gender, goal, activity, weight, height, age, validParams]);

  const maintenanceCalories = useMemo<number | null>(() => {
    if (!validParams) return null;
    const bmr = calcBMR(
      gender as Gender,
      Number(weight),
      Number(height),
      Number(age),
    );
    return Math.round(bmr * ACTIVITY_FACTORS[activity]);
  }, [gender, goal, activity, weight, height, age, validParams]);

  // Рационы, отсортированные по близости к цели
  const sortedRations = useMemo(() => {
    if (targetCalories === null || activeRations.length === 0) return [];
    return [...activeRations].sort((a, b) => {
      const aDiff = Math.abs(Number(a.calories) - targetCalories);
      const bDiff = Math.abs(Number(b.calories) - targetCalories);
      return aDiff - bDiff;
    });
  }, [targetCalories, activeRations]);

  const [selectedRationCalories, setSelectedRationCalories] = useState<
    string | null
  >(null);

  // При пересчёте автоматически выбираем ближайший
  const selectedRation = useMemo(() => {
    if (sortedRations.length === 0) return null;
    if (selectedRationCalories) {
      const found = sortedRations.find(
        (r) => String(r.calories) === selectedRationCalories,
      );
      if (found) return found;
    }
    return sortedRations[0];
  }, [sortedRations, selectedRationCalories]);

  // Разница между целью и ближайшим рационом
  const MATCH_THRESHOLD = 350; // ккал — максимально допустимая разница
  const bestDiff = useMemo(() => {
    if (!targetCalories || sortedRations.length === 0) return null;
    return Math.abs(Number(sortedRations[0].calories) - targetCalories);
  }, [targetCalories, sortedRations]);
  const hasNoSuitableRation = bestDiff !== null && bestDiff > MATCH_THRESHOLD;

  // Сбрасываем выбор при пересчёте
  React.useEffect(() => {
    setSelectedRationCalories(null);
  }, [targetCalories]);

  const handleAddToCart = useCallback(() => {
    if (!selectedRation) {
      toast.error("Рационов пока нет. Загляните позже!", { duration: 4000 });
      return;
    }
    addItem({
      id: `calculator-${selectedRation.calories}`,
      calories: String(selectedRation.calories),
      selectedDays: [],
      range: null,
      pricePerDay: selectedRation.pricePerDay,
      dishesCount: selectedRation.dishes?.length ?? 0,
    });
    toast.success(`Рацион ${selectedRation.calories} ккал добавлен в корзину`, {
      duration: 2000,
    });
  }, [selectedRation, addItem]);

  const ACTIVITY_LABELS = ["Низкая", "Средняя", "Высокая"];

  const GOAL_OPTIONS: {
    key: Goal;
    label: string;
    icon: string;
    desc: string;
  }[] = [
    { key: "loss", label: "Похудение", icon: "🔥", desc: "-450 ккал" },
    { key: "tone", label: "Тонус", icon: "⚡", desc: "-200 ккал" },
    { key: "gain", label: "Набор массы", icon: "💪", desc: "+300 ккал" },
  ];

  const hasResult = targetCalories !== null && maintenanceCalories !== null;

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 xl:gap-16">
      {/* ── Left: form ── */}
      <div className="space-y-7">
        {/* Gender */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-whitePrimary/50">
            Пол
          </p>
          <div className="grid grid-cols-2 gap-3">
            {(["male", "female"] as Gender[]).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer border ${
                  gender === g
                    ? "bg-yellowPrimary text-colorPrimary border-transparent shadow-md shadow-yellowPrimary/20"
                    : "bg-whitePrimary/5 text-whitePrimary border-whitePrimary/10 hover:bg-whitePrimary/10"
                }`}
              >
                <span className="text-base">{g === "male" ? "👨" : "👩"}</span>
                {g === "male" ? "Мужчина" : "Женщина"}
              </button>
            ))}
          </div>
        </div>

        {/* Params */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-whitePrimary/50">
            Параметры
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                {
                  placeholder: "Вес",
                  unit: "кг",
                  val: weight,
                  set: setWeight,
                  min: 30,
                  max: 250,
                },
                {
                  placeholder: "Рост",
                  unit: "см",
                  val: height,
                  set: setHeight,
                  min: 120,
                  max: 230,
                },
                {
                  placeholder: "Возраст",
                  unit: "лет",
                  val: age,
                  set: setAge,
                  min: 14,
                  max: 100,
                },
              ] as const
            ).map(({ placeholder, unit, val, set, min, max }) => (
              <div key={placeholder} className="relative">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder={placeholder}
                  min={min}
                  max={max}
                  value={val}
                  onChange={(e) =>
                    (set as (v: number | "") => void)(
                      e.target.value === "" ? "" : e.target.valueAsNumber,
                    )
                  }
                  className="w-full bg-whitePrimary/5 border border-whitePrimary/10 rounded-2xl pt-3 pb-3 pl-4 pr-10 text-sm font-semibold text-whitePrimary placeholder:text-whitePrimary/30 focus:outline-none focus:border-yellowPrimary/60 focus:bg-whitePrimary/10 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-whitePrimary/30 pointer-events-none">
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-whitePrimary/50">
            Цель
          </p>
          <div className="grid grid-cols-3 gap-3">
            {GOAL_OPTIONS.map(({ key, label, icon, desc }) => (
              <button
                key={key}
                onClick={() => setGoal(key)}
                className={`flex flex-col items-center gap-1 py-4 rounded-2xl font-medium text-sm transition-all duration-200 cursor-pointer border ${
                  goal === key
                    ? "bg-yellowPrimary text-colorPrimary border-transparent shadow-md shadow-yellowPrimary/20"
                    : "bg-whitePrimary/5 text-whitePrimary border-whitePrimary/10 hover:bg-whitePrimary/10"
                }`}
              >
                <span className="text-xl leading-none">{icon}</span>
                <span className="font-semibold leading-tight">{label}</span>
                <span
                  className={`text-[10px] font-medium ${goal === key ? "text-colorPrimary/60" : "text-whitePrimary/40"}`}
                >
                  {desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-whitePrimary/50">
            Активность
          </p>
          <div className="grid grid-cols-3 gap-3">
            {([1, 2, 3] as ActivityValue[]).map((val) => (
              <button
                key={val}
                onClick={() => {
                  setActivityValue(val);
                  setActivity(activityMap[val]);
                }}
                className={`py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer border ${
                  activityValue === val
                    ? "bg-whitePrimary text-colorPrimary border-transparent shadow-md"
                    : "bg-whitePrimary/5 text-whitePrimary border-whitePrimary/10 hover:bg-whitePrimary/10"
                }`}
              >
                {ACTIVITY_LABELS[val - 1]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: result ── */}
      <div className="flex flex-col gap-4">
        <div
          className={`flex-1 flex flex-col items-center justify-center rounded-3xl p-8 transition-all duration-300 ${
            hasResult
              ? "bg-whiteSecondary shadow-xl shadow-black/20"
              : "bg-whitePrimary/5 border border-whitePrimary/10"
          }`}
        >
          {hasResult &&
          targetCalories !== null &&
          maintenanceCalories !== null ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest text-greySecondary mb-1">
                Рекомендуемый калораж
              </p>
              <HyperText
                key={targetCalories}
                duration={400}
                startOnView={false}
                animateOnHover={false}
                className="text-[64px] font-extrabold leading-none tabular-nums text-colorPrimary my-3"
              >
                {String(targetCalories)}
              </HyperText>
              <p className="text-xs text-greySecondary mb-5">
                Поддержание: {maintenanceCalories} ккал
              </p>

              {/* Уровень калорийности */}
              <div className="w-full flex items-center justify-between rounded-2xl bg-colorPrimary/5 px-4 py-2.5 mb-3">
                <span className="text-xs text-greySecondary font-medium uppercase tracking-wide">
                  Уровень калорийности
                </span>
                <span className="text-xs font-bold text-colorPrimary">
                  {getCalorieLevel(targetCalories)}
                </span>
              </div>

              {/* Список рационов */}
              {sortedRations.length === 0 ? (
                <div className="flex items-center gap-2 rounded-md bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700 font-semibold w-full justify-center mb-3">
                  <IoWarningOutline size={18} />
                  <span>Рационов пока нет</span>
                </div>
              ) : hasNoSuitableRation ? (
                <div className="w-full rounded-lg border border-orange-200 bg-orange-50 px-2 py-3 mb-3 text-center">
                  <p className="flex items-center gap-2 justify-center text-sm font-bold text-orange-700 mb-1">
                    <IoWarningOutline size={18} />
                    <span>Подходящего рациона нет</span>
                  </p>
                </div>
              ) : (
                <div className="w-full grid gap-2 mb-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-greySecondary">
                    Выберите рацион
                  </p>
                  {sortedRations.map((r, i) => {
                    const diff = Math.abs(Number(r.calories) - targetCalories);
                    const isSelected =
                      String(r.calories) === String(selectedRation?.calories);
                    const isBest = i === 0;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() =>
                          setSelectedRationCalories(String(r.calories))
                        }
                        className={`w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-all border cursor-pointer ${
                          isSelected
                            ? "bg-colorPrimary text-white border-colorPrimary"
                            : "bg-colorPrimary/5 text-colorPrimary border-colorPrimary/10 hover:border-colorPrimary/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-extrabold ${isSelected ? "text-white" : "text-colorPrimary"}`}
                          >
                            {r.calories} ккал
                          </span>
                          {isBest && (
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-yellowPrimary text-colorPrimary"
                              }`}
                            >
                              Лучший
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-semibold ${isSelected ? "text-white/60" : "text-greySecondary"}`}
                          >
                            {diff === 0 ? "совпадение" : `±${diff} ккал`}
                          </span>
                          <span
                            className={`text-xs font-bold ${isSelected ? "text-yellowPrimary" : "text-colorPrimary"}`}
                          >
                            {r.pricePerDay} BYN/д
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="text-6xl font-extrabold text-whitePrimary/10 tabular-nums leading-none">
                —
              </div>
              <p className="text-sm font-semibold text-whitePrimary/30">
                Заполните все поля
              </p>
              <p className="text-xs text-whitePrimary/20">
                и мы подберём рацион под вас
              </p>
            </div>
          )}
        </div>

        <button
          disabled={!hasResult || !selectedRation || hasNoSuitableRation}
          onClick={handleAddToCart}
          className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 ${
            hasResult && selectedRation && !hasNoSuitableRation
              ? "bg-yellowPrimary text-colorPrimary hover:bg-yellow-hover cursor-pointer shadow-lg shadow-yellowPrimary/20"
              : "bg-whitePrimary/10 text-whitePrimary/30 cursor-not-allowed"
          }`}
        >
          {hasNoSuitableRation
            ? "Нет подходящего рациона"
            : selectedRation
              ? `Добавить ${selectedRation.calories} ккал в корзину`
              : "Добавить в корзину"}
        </button>
      </div>
    </section>
  );
}
