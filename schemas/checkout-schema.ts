import { z } from "zod";

/**
 * Схема оформления заказа
 */
export const checkoutSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Введите имя (минимум 2 символа)")
    .max(50, "Имя слишком длинное"),
  lastName: z
    .string()
    .trim()
    .min(2, "Введите фамилию (минимум 2 символа)")
    .max(50, "Фамилия слишком длинная"),
  phone: z
    .string()
    .trim()
    .min(1, "Укажите номер телефона")
    .regex(
      /^\+375\s?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
      "Введите телефон в формате +375 (__) ___-__-__"
    ),
  social: z
    .string()
    .trim()
    .max(64, "Ник слишком длинный")
    .refine(
      (value) => value === "" || /^@[\w.]{3,30}$/i.test(value),
      "Укажите ник в формате @username или оставьте поле пустым"
    ),
  city: z.string().trim().min(1, "Выберите город доставки"),
  street: z
    .string()
    .trim()
    .min(2, "Укажите улицу")
    .max(80, "Название улицы слишком длинное"),
  house: z
    .string()
    .trim()
    .min(1, "Укажите номер дома")
    .max(10, "Слишком длинный номер дома"),
  apartment: z
    .string()
    .trim()
    .min(1, "Укажите квартиру")
    .max(10, "Слишком длинный номер квартиры"),
  date: z.preprocess((value) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value;
    }
    return undefined;
  }, z.date({ error: "Укажите дату" })),
  comment: z
    .string()
    .trim()
    .max(200, "Комментарий не должен превышать 200 символов"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
