import type { CheckoutFormData } from "@/schemas/checkout-schema";
import { CartItem } from "@/store/useStore";
export type CityOption = {
  value: string;
  label: string;
};

export type CheckoutFormField = keyof CheckoutFormData;
export type SuccessOrderSnapshot = {
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    social: string;
    street: string;
    house: string;
    apartment: string;
    date?: Date;
  };
  items: CartItem[];
  totalPrice: number;
};
