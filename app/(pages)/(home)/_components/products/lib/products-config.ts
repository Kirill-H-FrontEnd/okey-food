import { TProduct } from "@/types/product-card-type";

export const RANGE_STORAGE_KEY = "okey-food:products-range";

export const DATA_CALORIES_TABS = [
  { calories: "1000", countProduct: 3 },
  { calories: "1200", countProduct: 4 },
  { calories: "1400", countProduct: 5 },
  { calories: "1700", countProduct: 5 },
  { calories: "2000", countProduct: 5 },
  { calories: "2400", countProduct: 6 },
  { calories: "3200", countProduct: 6 },
] as const;

export const PRICE_BY_CAL: Record<string, number> = {
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

function hash32(str: string) {
  let h = 0x811c9dc5 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function pickFrom<T>(arr: readonly T[], seed: string) {
  const h = hash32(seed);
  return arr[h % arr.length];
}

function getDishNameStable(seed: string) {
  const a = pickFrom(ADJ, `${seed}-a`);
  const p = pickFrom(PROTEIN, `${seed}-p`);
  const s = pickFrom(STYLE, `${seed}-s`);
  return `${a} ${p} ${s}`;
}

export function genProductsForDiet(
  count: number,
  dietCalories: string,
  seed = "default",
): TProduct[] {
  return Array.from({ length: count }, (_, i) => {
    const weight = 300;
    const calories = Math.round(Number(dietCalories) / count) + i * 5;
    const proteins = 25 + (i % 3) * 3;
    const fats = 10 + (i % 2) * 2;
    const carbs = 30 + (i % 4) * 5;
    const meal: MealRu = MEALS[i % MEALS.length];

    const id = `${dietCalories}-${i + 1}-${seed}`;

    return {
      id,
      name: getDishNameStable(id),
      image: "/product.png",
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
}
