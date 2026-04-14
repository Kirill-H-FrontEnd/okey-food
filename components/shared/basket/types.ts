import type { CheckoutFormData } from "@/schemas/checkout-schema";
import { CartItem } from "@/store/useStore";

export type CityOption = {
  value: string;
  label: string;
};

export type CheckoutFormField = keyof CheckoutFormData;

export type DeliverySlotItem = {
  rationCalories: string;
  rationName: string;
  days: string[];
  range: string | null;
  timeSlot: "8-10" | "12-16";
};

export type SuccessOrderSnapshot = {
  customer: {
    firstName: string;
    phone: string;
    city: string;
    social: string;
    street: string;
    house: string;
    apartment: string;
    floor: string;
    intercom: string;
  };
  items: CartItem[];
  deliverySlots: DeliverySlotItem[];
  totalPrice: number;
};
