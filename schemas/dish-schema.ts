import { z } from "zod";

export const DAYS_OF_WEEK = [1, 2, 3, 4, 5, 6] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
export const DAY_LABELS: Record<DayOfWeek, string> = {
  1: "Понедельник",
  2: "Вторник",
  3: "Среда",
  4: "Четверг",
  5: "Пятница",
  6: "Суббота",
};

export const DAY_LABELS_SHORT: Record<DayOfWeek, string> = {
  1: "Пн",
  2: "Вт",
  3: "Ср",
  4: "Чт",
  5: "Пт",
  6: "Сб",
};

export const MEALS = [
  "Завтрак",
  "Второй завтрак",
  "Обед",
  "Полдник",
  "Ужин",
  "Перекус",
] as const;

export const WEEKS = [1, 2, 3, 4] as const;
export type WeekNumber = (typeof WEEKS)[number];

export type MealValue = (typeof MEALS)[number];

export const dishSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введите название блюда")
    .max(100, "Название слишком длинное"),

  meal: z.string().refine((value): value is MealValue => {
    return MEALS.includes(value as MealValue);
  }, "Выберите приём пищи"),

  week: z.number().int().min(1).max(4).optional().default(1),

  dayOfWeek: z.number().int().min(1).max(6).optional(),

  calories: z
    .string()
    .trim()
    .min(1, "Укажите калории")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: "Введите корректное значение",
    }),

  proteins: z
    .string()
    .trim()
    .min(1, "Укажите белки")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: "Введите корректное значение",
    }),

  fats: z
    .string()
    .trim()
    .min(1, "Укажите жиры")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: "Введите корректное значение",
    }),

  carbs: z
    .string()
    .trim()
    .min(1, "Укажите углеводы")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, {
      message: "Введите корректное значение",
    }),

  weight: z
    .string()
    .trim()
    .min(1, "Укажите вес")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: "Вес должен быть больше 0",
    }),

  image: z.string().optional().default(""),

  description: z
    .string()
    .trim()
    .max(300, "Описание слишком длинное")
    .optional()
    .or(z.literal("")),
});

export type DishFormValues = z.infer<typeof dishSchema>;
