export type CityOption = {
  value: string;
  label: string;
};

export type CheckoutFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  social: string;
  city: string;
  street: string;
  house: string;
  apartment: string;
  date: Date | null;
  comment: string;
};

export type CheckoutFormField = keyof CheckoutFormState;
