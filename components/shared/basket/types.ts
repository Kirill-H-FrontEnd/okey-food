import type { CheckoutFormData } from "@/schemas/checkout-schema";
export type CityOption = {
  value: string;
  label: string;
};

export type CheckoutFormField = keyof CheckoutFormData;
