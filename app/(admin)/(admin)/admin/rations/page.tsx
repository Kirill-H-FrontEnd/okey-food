"use client";
import { useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { TRation, TRationCategory, TRationDish, TRationMeal } from "@/types/admin";
import {
  Plus,
  Pencil,
  Trash2,
  ChefHat,
  Eye,
  EyeOff,
  X,
  ImageIcon,
  Save,
  Utensils,
  ArrowLeft,
  Flame,
  Beef,
  Droplets,
  Wheat,
  Scale,
} from "lucide-react";
import Image from "next/image";

const CATEGORIES: TRationCategory[] = [
  "Похудение",
  "Набор массы",
  "Поддержание",
  "Спортивное питание",
  "Вегетарианское",
];

const MEALS: TRationMeal[] = [
  "Завтрак",
  "Второй завтрак",
  "Обед",
  "Полдник",
  "Ужин",
  "Перекус",
];

type RationFormData = {
  name: string;
  description: string;
  calories: string;
  pricePerDay: string;
  image: string;
  category: TRationCategory;
  isActive: boolean;
};

type DishFormData = {
  name: string;
  meal: TRationMeal;
  calories: string;
  proteins: string;
  fats: string;
  carbs: string;
  weight: string;
  image: string;
  description: string;
};

const EMPTY_RATION_FORM: RationFormData = {
  name: "",
  description: "",
  calories: "",
  pricePerDay: "",
  image: "",
  category: "Похудение",
  isActive: true,
};

const EMPTY_DISH_FORM: DishFormData = {
  name: "",
  meal: "Завтрак",
  calories: "",
  proteins: "",
  fats: "",
  carbs: "",
  weight: "",
  image: "",
  description: "",
};

const MEAL_COLORS: Record<TRationMeal, string> = {
  "Завтрак": "bg-amber-100 text-amber-700",
  "Второй завтрак": "bg-orange-100 text-orange-700",
  "Обед": "bg-emerald-100 text-emerald-700",
  "Полдник": "bg-sky-100 text-sky-700",
  "Ужин": "bg-violet-100 text-violet-700",
  "Перекус": "bg-rose-100 text-rose-700",
};

export default function RationsPage() {
  const {
    rations,
    addRation,
    updateRation,
    deleteRation,
    toggleRationActive,
    addDish,
    updateDish,
    deleteDish,
  } = useAdminStore();

  const [isRationFormOpen, setIsRationFormOpen] = useState(false);
  const [editingRationId, setEditingRationId] = useState<string | null>(null);
  const [rationForm, setRationForm] = useState<RationFormData>(EMPTY_RATION_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const [dishPanelRationId, setDishPanelRationId] = useState<string | null>(null);
  const [isDishFormOpen, setIsDishFormOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [dishForm, setDishForm] = useState<DishFormData>(EMPTY_DISH_FORM);
  const [dishDeleteConfirmId, setDishDeleteConfirmId] = useState<string | null>(null);
  const [dishImagePreviewError, setDishImagePreviewError] = useState(false);

  const dishPanelRation = rations.find((r) => r.id === dishPanelRationId) ?? null;

  const openAddRation = () => {
    setEditingRationId(null);
    setRationForm(EMPTY_RATION_FORM);
    setImagePreviewError(false);
    setIsRationFormOpen(true);
  };

  const openEditRation = (ration: TRation) => {
    setEditingRationId(ration.id);
    setRationForm({
      name: ration.name,
      description: ration.description,
      calories: ration.calories,
      pricePerDay: String(ration.pricePerDay),
      image: ration.image,
      category: ration.category,
      isActive: ration.isActive,
    });
    setImagePreviewError(false);
    setIsRationFormOpen(true);
  };

  const closeRationForm = () => {
    setIsRationFormOpen(false);
    setEditingRationId(null);
    setRationForm(EMPTY_RATION_FORM);
  };

  const handleRationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: rationForm.name,
      description: rationForm.description,
      calories: rationForm.calories,
      pricePerDay: Number(rationForm.pricePerDay),
      image: rationForm.image,
      category: rationForm.category,
      isActive: rationForm.isActive,
      dishes: editingRationId
        ? (rations.find((r) => r.id === editingRationId)?.dishes ?? [])
        : [],
    };
    if (editingRationId) {
      updateRation(editingRationId, data);
    } else {
      addRation(data);
    }
    closeRationForm();
  };

  const handleRationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setRationForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (name === "image") setImagePreviewError(false);
  };

  const openAddDish = () => {
    setEditingDishId(null);
    setDishForm(EMPTY_DISH_FORM);
    setDishImagePreviewError(false);
    setIsDishFormOpen(true);
  };

  const openEditDish = (dish: TRationDish) => {
    setEditingDishId(dish.id);
    setDishForm({
      name: dish.name,
      meal: dish.meal,
      calories: String(dish.calories),
      proteins: String(dish.proteins),
      fats: String(dish.fats),
      carbs: String(dish.carbs),
      weight: String(dish.weight),
      image: dish.image,
      description: dish.description,
    });
    setDishImagePreviewError(false);
    setIsDishFormOpen(true);
  };

  const closeDishForm = () => {
    setIsDishFormOpen(false);
    setEditingDishId(null);
    setDishForm(EMPTY_DISH_FORM);
  };

  const handleDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishPanelRationId) return;
    const data = {
      name: dishForm.name,
      meal: dishForm.meal,
      calories: Number(dishForm.calories),
      proteins: Number(dishForm.proteins),
      fats: Number(dishForm.fats),
      carbs: Number(dishForm.carbs),
      weight: Number(dishForm.weight),
      image: dishForm.image,
      description: dishForm.description,
    };
    if (editingDishId) {
      updateDish(dishPanelRationId, editingDishId, data);
    } else {
      addDish(dishPanelRationId, data);
    }
    closeDishForm();
  };

  const handleDishChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setDishForm((prev) => ({ ...prev, [name]: value }));
    if (name === "image") setDishImagePreviewError(false);
  };

  const groupedDishes = (dishes: TRationDish[]) => {
    const groups: Partial<Record<TRationMeal, TRationDish[]>> = {};
    for (const dish of dishes) {
      if (!groups[dish.meal]) groups[dish.meal] = [];
      groups[dish.meal]!.push(dish);
    }
    return groups;
  };

  if (dishPanelRation) {
    const groups = groupedDishes(dishPanelRation.dishes);
    return (
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => { setDishPanelRationId(null); setIsDishFormOpen(false); }}
            className="flex items-center gap-2 text-sm font-semibold text-[#302a41]/50 hover:text-[#302a41] transition-colors"
          >
            <ArrowLeft size={16} />
            Рационы
          </button>
          <span className="text-[#302a41]/20">/</span>
          <h1 className="text-xl font-bold text-[#302a41]">
            {dishPanelRation.name}
          </h1>
          <span className="text-sm text-[#302a41]/40 font-medium">
            {dishPanelRation.dishes.length} блюд
          </span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-[#302a41]/50 text-sm">
            Управление блюдами рациона
          </p>
          <button
            onClick={openAddDish}
            className="flex items-center gap-2 bg-[#c8f135] text-[#302a41] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#b8e020] transition-colors shadow-sm"
          >
            <Plus size={16} />
            Добавить блюдо
          </button>
        </div>

        {dishPanelRation.dishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#302a41]/5 flex items-center justify-center mb-4">
              <Utensils size={28} className="text-[#302a41]/20" />
            </div>
            <p className="font-bold text-[#302a41]/30 text-lg mb-1">Блюда не добавлены</p>
            <p className="text-sm text-[#302a41]/30 mb-6">
              Добавьте блюда, чтобы они отображались в рационе на сайте
            </p>
            <button
              onClick={openAddDish}
              className="flex items-center gap-2 bg-[#c8f135] text-[#302a41] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-[#b8e020] transition-colors"
            >
              <Plus size={15} />
              Добавить первое блюдо
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {MEALS.filter((m) => groups[m]?.length).map((meal) => (
              <div key={meal}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${MEAL_COLORS[meal]}`}>
                    {meal}
                  </span>
                  <span className="text-xs text-[#302a41]/30">
                    {groups[meal]!.length} блюд{groups[meal]!.length === 1 ? "о" : "а"}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {groups[meal]!.map((dish) => (
                    <div
                      key={dish.id}
                      className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col shadow-sm"
                    >
                      <div className="relative h-36 bg-[#f2efe8]">
                        {dish.image ? (
                          <Image
                            src={dish.image}
                            alt={dish.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                            onError={() => {}}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Utensils className="w-10 h-10 text-[#302a41]/15" />
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col gap-2">
                        <h4 className="font-bold text-[#302a41] text-sm leading-snug">
                          {dish.name}
                        </h4>
                        {dish.description && (
                          <p className="text-xs text-[#302a41]/50 line-clamp-2">
                            {dish.description}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-[#302a41]/60 mt-auto pt-2 border-t border-black/5">
                          <span className="flex items-center gap-1">
                            <Flame size={11} className="text-orange-400" />
                            {dish.calories} ккал
                          </span>
                          <span className="flex items-center gap-1">
                            <Scale size={11} className="text-[#302a41]/30" />
                            {dish.weight}г
                          </span>
                          <span className="flex items-center gap-1">
                            <Beef size={11} className="text-red-400" />
                            Б{dish.proteins}
                          </span>
                          <span className="flex items-center gap-1">
                            <Droplets size={11} className="text-yellow-400" />
                            Ж{dish.fats}
                          </span>
                          <span className="flex items-center gap-1">
                            <Wheat size={11} className="text-amber-500" />
                            У{dish.carbs}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => openEditDish(dish)}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold transition-colors"
                          >
                            <Pencil size={12} /> Изменить
                          </button>
                          <button
                            onClick={() => setDishDeleteConfirmId(dish.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {isDishFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeDishForm}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 sticky top-0 bg-white z-10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#c8f135] rounded-xl flex items-center justify-center">
                    <Utensils size={18} className="text-[#302a41]" />
                  </div>
                  <h2 className="font-bold text-[#302a41] text-lg">
                    {editingDishId ? "Редактировать блюдо" : "Добавить блюдо"}
                  </h2>
                </div>
                <button
                  onClick={closeDishForm}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#302a41]/5 text-[#302a41]/40 hover:text-[#302a41] transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleDishSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                      Название блюда <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={dishForm.name}
                      onChange={handleDishChange}
                      required
                      placeholder="Овсянка с ягодами"
                      className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                      Приём пищи
                    </label>
                    <select
                      name="meal"
                      value={dishForm.meal}
                      onChange={handleDishChange}
                      className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition bg-white"
                    >
                      {MEALS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                      Калории (ккал)
                    </label>
                    <input
                      type="number"
                      name="calories"
                      value={dishForm.calories}
                      onChange={handleDishChange}
                      placeholder="350"
                      min="0"
                      className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                      Вес (г)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={dishForm.weight}
                      onChange={handleDishChange}
                      placeholder="250"
                      min="0"
                      className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                      Белки (г)
                    </label>
                    <input
                      type="number"
                      name="proteins"
                      value={dishForm.proteins}
                      onChange={handleDishChange}
                      placeholder="12"
                      min="0"
                      step="0.1"
                      className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                      Жиры (г)
                    </label>
                    <input
                      type="number"
                      name="fats"
                      value={dishForm.fats}
                      onChange={handleDishChange}
                      placeholder="8"
                      min="0"
                      step="0.1"
                      className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                      Углеводы (г)
                    </label>
                    <input
                      type="number"
                      name="carbs"
                      value={dishForm.carbs}
                      onChange={handleDishChange}
                      placeholder="45"
                      min="0"
                      step="0.1"
                      className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                      URL изображения
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={dishForm.image}
                      onChange={handleDishChange}
                      placeholder="https://..."
                      className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                    />
                    {dishForm.image && !dishImagePreviewError && (
                      <div className="mt-3 relative h-32 rounded-xl overflow-hidden bg-[#f2efe8]">
                        <Image
                          src={dishForm.image}
                          alt="Preview"
                          fill
                          sizes="672px"
                          className="object-cover"
                          onError={() => setDishImagePreviewError(true)}
                        />
                      </div>
                    )}
                    {dishForm.image && dishImagePreviewError && (
                      <p className="mt-2 text-xs text-red-500">
                        Не удалось загрузить изображение по указанному URL
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                      Описание
                    </label>
                    <textarea
                      name="description"
                      value={dishForm.description}
                      onChange={handleDishChange}
                      rows={2}
                      placeholder="Краткое описание блюда..."
                      className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeDishForm}
                    className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-semibold text-[#302a41]/60 hover:text-[#302a41] hover:border-black/20 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#c8f135] text-[#302a41] font-bold text-sm py-2.5 rounded-xl hover:bg-[#b8e020] transition-colors"
                  >
                    <Save size={15} />
                    {editingDishId ? "Сохранить" : "Добавить блюдо"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {dishDeleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDishDeleteConfirmId(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                  <Trash2 size={22} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-[#302a41]">Удалить блюдо?</h3>
                  <p className="text-sm text-[#302a41]/50">Это действие нельзя отменить</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDishDeleteConfirmId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-semibold text-[#302a41]/60 hover:text-[#302a41] transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    if (dishPanelRationId) deleteDish(dishPanelRationId, dishDeleteConfirmId);
                    setDishDeleteConfirmId(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#302a41]">Рационы</h1>
          <p className="text-[#302a41]/50 text-sm mt-1">
            Управление рационами питания на сайте
          </p>
        </div>
        <button
          onClick={openAddRation}
          className="flex items-center gap-2 bg-[#c8f135] text-[#302a41] font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#b8e020] transition-colors shadow-sm"
        >
          <Plus size={16} />
          Добавить рацион
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {rations.map((ration) => (
          <div
            key={ration.id}
            className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden flex flex-col"
          >
            <div className="relative h-44 bg-[#f2efe8]">
              {ration.image ? (
                <Image
                  src={ration.image}
                  alt={ration.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover"
                  onError={() => {}}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-[#302a41]/20" />
                </div>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                    ration.isActive
                      ? "bg-emerald-500/90 text-white"
                      : "bg-black/30 text-white"
                  }`}
                >
                  {ration.isActive ? "Активен" : "Скрыт"}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-1">
                <span className="text-xs font-bold text-[#302a41]/40 uppercase tracking-wider">
                  {ration.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#302a41] leading-tight mb-2">
                {ration.name}
              </h3>
              <p className="text-sm text-[#302a41]/60 line-clamp-2 mb-4 flex-1">
                {ration.description}
              </p>
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="text-center">
                  <p className="font-bold text-[#302a41]">{ration.calories}</p>
                  <p className="text-xs text-[#302a41]/40">ккал</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#302a41] text-lg">
                    {ration.pricePerDay} BYN
                  </p>
                  <p className="text-xs text-[#302a41]/40">в день</p>
                </div>
              </div>

              <button
                onClick={() => setDishPanelRationId(ration.id)}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#302a41]/5 hover:bg-[#302a41]/10 text-[#302a41]/70 hover:text-[#302a41] text-sm font-semibold transition-colors mb-3"
              >
                <Utensils size={14} />
                Блюда
                {ration.dishes.length > 0 && (
                  <span className="ml-1 bg-[#c8f135] text-[#302a41] text-xs font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {ration.dishes.length}
                  </span>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleRationActive(ration.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    ration.isActive
                      ? "bg-[#302a41]/5 text-[#302a41]/60 hover:bg-[#302a41]/10"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {ration.isActive ? (
                    <><EyeOff size={14} /> Скрыть</>
                  ) : (
                    <><Eye size={14} /> Показать</>
                  )}
                </button>
                <button
                  onClick={() => openEditRation(ration)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(ration.id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={openAddRation}
          className="border-2 border-dashed border-[#302a41]/20 rounded-2xl flex flex-col items-center justify-center gap-3 p-8 hover:border-[#c8f135] hover:bg-[#c8f135]/5 transition-all group min-h-[300px]"
        >
          <div className="w-12 h-12 rounded-xl bg-[#302a41]/5 group-hover:bg-[#c8f135]/20 flex items-center justify-center transition-colors">
            <Plus size={22} className="text-[#302a41]/40 group-hover:text-[#302a41]" />
          </div>
          <span className="text-sm font-semibold text-[#302a41]/40 group-hover:text-[#302a41] transition-colors">
            Добавить рацион
          </span>
        </button>
      </div>

      {isRationFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeRationForm}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#c8f135] rounded-xl flex items-center justify-center">
                  <ChefHat size={18} className="text-[#302a41]" />
                </div>
                <h2 className="font-bold text-[#302a41] text-lg">
                  {editingRationId ? "Редактировать рацион" : "Добавить рацион"}
                </h2>
              </div>
              <button
                onClick={closeRationForm}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#302a41]/5 text-[#302a41]/40 hover:text-[#302a41] transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRationSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                    Название рациона <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={rationForm.name}
                    onChange={handleRationChange}
                    required
                    placeholder="Рацион 1200 ккал"
                    className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                    Калорийность (ккал) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={rationForm.calories}
                    onChange={handleRationChange}
                    required
                    placeholder="1200"
                    min="500"
                    max="5000"
                    className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                    Цена в день (BYN) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerDay"
                    value={rationForm.pricePerDay}
                    onChange={handleRationChange}
                    required
                    placeholder="28"
                    min="1"
                    step="0.5"
                    className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                    Категория
                  </label>
                  <select
                    name="category"
                    value={rationForm.category}
                    onChange={handleRationChange}
                    className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                    URL изображения
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={rationForm.image}
                    onChange={handleRationChange}
                    placeholder="https://... или /images/..."
                    className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition"
                  />
                  {rationForm.image && !imagePreviewError && (
                    <div className="mt-3 relative h-36 rounded-xl overflow-hidden bg-[#f2efe8]">
                      <Image
                        src={rationForm.image}
                        alt="Preview"
                        fill
                        sizes="672px"
                        className="object-cover"
                        onError={() => setImagePreviewError(true)}
                      />
                    </div>
                  )}
                  {rationForm.image && imagePreviewError && (
                    <p className="mt-2 text-xs text-red-500">
                      Не удалось загрузить изображение по указанному URL
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[#302a41] mb-1.5">
                    Описание <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={rationForm.description}
                    onChange={handleRationChange}
                    required
                    rows={3}
                    placeholder="Опишите рацион питания..."
                    className="w-full border border-black/10 rounded-xl px-4 py-2.5 text-sm text-[#302a41] placeholder:text-[#302a41]/30 focus:outline-none focus:ring-2 focus:ring-[#c8f135] focus:border-transparent transition resize-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={rationForm.isActive}
                        onChange={handleRationChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#302a41]/20 rounded-full peer peer-checked:bg-[#c8f135] transition-colors" />
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
                    </div>
                    <span className="text-sm font-semibold text-[#302a41]">
                      Отображать на сайте
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeRationForm}
                  className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-semibold text-[#302a41]/60 hover:text-[#302a41] hover:border-black/20 transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#c8f135] text-[#302a41] font-bold text-sm py-2.5 rounded-xl hover:bg-[#b8e020] transition-colors"
                >
                  <Save size={15} />
                  {editingRationId ? "Сохранить изменения" : "Добавить рацион"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setDeleteConfirmId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                <Trash2 size={22} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-[#302a41]">Удалить рацион?</h3>
                <p className="text-sm text-[#302a41]/50">
                  Это действие нельзя отменить
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-xl border border-black/10 text-sm font-semibold text-[#302a41]/60 hover:text-[#302a41] transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  deleteRation(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
