import { z } from "zod";

export const MEALS = [
  "Завтрак",
  "Второй завтрак",
  "Обед",
  "Полдник",
  "Ужин",
  "Перекус",
] as const;

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
