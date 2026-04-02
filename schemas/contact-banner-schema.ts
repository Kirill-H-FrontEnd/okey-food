import { z } from "zod";

export const contactBannerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введите  имя ")
    .max(50, "Имя слишком длинное"),
  phone: z
    .string()
    .trim()
    .min(1, "Укажите номер телефона")
    .regex(
      /^\+375\s?\(?\d{2}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/,
      "Введите телефон в формате +375 (__) ___-__-__",
    ),
  accepted: z
    .boolean()
    .refine(
      (value) => value,
      "Подтвердите согласие с политикой конфиденциальности",
    ),
});

export type ContactBannerFormData = z.infer<typeof contactBannerSchema>;
