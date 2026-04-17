export type TRationMeal =
  | "Завтрак"
  | "Второй завтрак"
  | "Обед"
  | "Полдник"
  | "Ужин"
  | "Перекус";

export type TRationCategory =
  | "Похудение"
  | "Набор массы"
  | "Поддержание"
  | "Спортивное питание"
  | "Вегетарианское";

export type TRationDish = {
  id: string;
  name: string;
  meal: TRationMeal;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  weight: number;
  image: string;
  description: string;
  week?: 1 | 2 | 3 | 4;
  dayOfWeek?: 1 | 2 | 3 | 4 | 5 | 6;
};

export type TRation = {
  id: string;
  name: string;
  description: string;
  calories: string;
  pricePerDay: number;
  image: string;
  category: TRationCategory;
  isActive: boolean;
  dishes: TRationDish[];
  createdAt: string;
};

export type TAdminStats = {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  activeRations: number;
};

export type TOrder = {
  id: string;
  customerName: string;
  phone: string;
  ration: string;
  days: number;
  amount: number;
  status: "pending" | "confirmed" | "delivered" | "cancelled";
  notes: string;
  createdAt: string;
};
