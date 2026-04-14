import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Введите имя ")
    .max(50, "Имя слишком длинное"),
  phone: z
    .string()
    .trim()
    .min(1, "Укажите номер телефона")
    .regex(
      /^\+375\s?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
      "Введите телефон в формате +375 (__) ___-__-__",
    ),
  social: z.string().trim().optional().default(""),
  city: z.string().trim().min(1, "Выберите город"),
  street: z
    .string()
    .trim()
    .min(1, "Укажите улицу")
    .max(80, "Название улицы слишком длинное"),
  house: z
    .string()
    .trim()
    .min(1, "Укажите номер дома")
    .max(10, "Слишком длинный номер дома"),
  apartment: z
    .string()
    .trim()
    .min(1, "Укажите номер квартиры")
    .max(10, "Слишком длинный номер квартиры"),
  floor: z
    .string()
    .trim()
    .min(1, "Укажите этаж")
    .max(4, "Слишком большое значение этажа"),
  intercom: z
    .string()
    .trim()
    .max(20, "Слишком длинный код домофона")
    .optional()
    .default(""),
  comment: z
    .string()
    .trim()
    .max(200, "Комментарий не должен превышать 200 символов")
    .optional()
    .default(""),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
