import { z } from "zod";

export const rationSchema = z.object({
  name: z.string().optional().default(""),

  description: z
    .string()
    .trim()
    .max(300, "Описание слишком длинное")
    .optional()
    .or(z.literal("")),

  calories: z
    .string()
    .trim()
    .min(1, "Укажите калорийность")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 500, {
      message: "Калорийность должна быть не меньше 500",
    }),

  pricePerDay: z
    .string()
    .trim()
    .min(1, "Укажите цену")
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: "Цена должна быть больше 0",
    }),

  isActive: z.boolean(),
});

export type RationFormValues = z.infer<typeof rationSchema>;
