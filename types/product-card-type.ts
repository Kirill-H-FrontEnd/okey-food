export type TProduct = {
  id: string;
  name: string;
  image: string;
  calories: number;
  weight: number;
  proteins: number;
  fats: number;
  carbs: number;
  description?: string;
  dietCalories: string;
  meal: "Завтрак" | "Второй завтрак" | "Обед" | "Полдник" | "Ужин" | "Перекус";
};
