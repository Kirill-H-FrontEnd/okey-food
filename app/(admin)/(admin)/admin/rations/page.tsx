"use client";

import { useRef, useState } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import { TRation, TRationDish, TRationMeal } from "@/types/admin";
import { PiChefHat } from "react-icons/pi";
import { FaImages, FaRegSave } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Utensils,
  ArrowLeft,
  Flame,
  Beef,
  Droplets,
  Wheat,
  Scale,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  Завтрак: "bg-amber-100 text-amber-700",
  "Второй завтрак": "bg-orange-100 text-orange-700",
  Обед: "bg-emerald-100 text-emerald-700",
  Полдник: "bg-sky-100 text-sky-700",
  Ужин: "bg-violet-100 text-violet-700",
  Перекус: "bg-rose-100 text-rose-700",
};

function DishImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (base64: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        onChange(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="col-span-2">
      <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
        Изображение блюда
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="group relative h-36 overflow-hidden rounded-xl bg-whitePrimary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Превью"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-colorPrimary opacity-0 shadow-md transition-opacity group-hover:opacity-100"
            >
              <Upload size={13} />
              Заменить
            </button>
          </div>

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-500"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-greySecondary/50 bg-whitePrimary transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellowPrimary/20 text-colorPrimary transition-colors">
            <FaImages size={20} className="text-colorPrimary" />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-colorPrimary transition-colors">
              Загрузить фото
            </p>
            <p className="text-xs text-greySecondary">
              JPG, PNG, WebP — до 5 МБ
            </p>
          </div>
        </button>
      )}
    </div>
  );
}

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
  const [rationForm, setRationForm] =
    useState<RationFormData>(EMPTY_RATION_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [dishPanelRationId, setDishPanelRationId] = useState<string | null>(
    null,
  );
  const [isDishFormOpen, setIsDishFormOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [dishForm, setDishForm] = useState<DishFormData>(EMPTY_DISH_FORM);
  const [dishDeleteConfirmId, setDishDeleteConfirmId] = useState<string | null>(
    null,
  );

  const dishPanelRation =
    rations.find((r) => r.id === dishPanelRationId) ?? null;

  const openAddRation = () => {
    setEditingRationId(null);
    setRationForm(EMPTY_RATION_FORM);
    setIsRationFormOpen(true);
  };

  const openEditRation = (ration: TRation) => {
    setEditingRationId(ration.id);
    setRationForm({
      name: ration.name,
      description: ration.description,
      calories: ration.calories,
      pricePerDay: String(ration.pricePerDay),
      isActive: ration.isActive,
    });
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
      image: "",
      category: "Поддержание" as const,
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setRationForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const openAddDish = () => {
    setEditingDishId(null);
    setDishForm(EMPTY_DISH_FORM);
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setDishForm((prev) => ({ ...prev, [name]: value }));
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
      <div className="p-4 md:p-8">
        <div className="mb-4 flex items-center gap-4">
          <button
            onClick={() => {
              setDishPanelRationId(null);
              setIsDishFormOpen(false);
            }}
            className="flex items-center gap-2 text-sm font-semibold text-colorPrimary/50 transition-colors hover:text-colorPrimary"
          >
            <ArrowLeft size={16} />
            Рационы
          </button>

          <span className="text-colorPrimary/20">/</span>

          <h1 className="text-xl font-bold text-colorPrimary">
            {dishPanelRation.name}
          </h1>

          <span className="text-sm font-medium text-colorPrimary/40">
            {dishPanelRation.dishes.length} блюд
          </span>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-colorPrimary/50">
            Управление блюдами рациона
          </p>
          <Button
            onClick={openAddDish}
            className="flex items-center gap-2 rounded-md bg-yellowPrimary px-4 py-5 text-sm font-bold text-colorPrimary transition-colors"
          >
            <Plus size={16} />
            <span className="hidden sm:block">Добавить рацион</span>
          </Button>
        </div>

        {dishPanelRation.dishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-colortext-colorPrimary/5">
              <Utensils size={28} className="text-colorPrimary/20" />
            </div>

            <p className="mb-1 text-lg font-bold text-colorPrimary/30">
              Блюда не добавлены
            </p>

            <p className="mb-6 text-sm text-colorPrimary/30">
              Добавьте блюда, чтобы они отображались в рационе на сайте
            </p>

            <button
              onClick={openAddDish}
              className="flex items-center gap-2 rounded-xl bg-yellowPrimary px-5 py-2.5 text-sm font-bold text-colorPrimary transition-colors hover:bg-[#b8e020]"
            >
              <Plus size={15} />
              Добавить первое блюдо
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {MEALS.filter((m) => groups[m]?.length).map((meal) => (
              <div key={meal}>
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${MEAL_COLORS[meal]}`}
                  >
                    {meal}
                  </span>

                  <span className="text-xs text-colorPrimary/30">
                    {groups[meal]!.length} блюд
                    {groups[meal]!.length === 1 ? "о" : "а"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {groups[meal]!.map((dish) => (
                    <div
                      key={dish.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
                    >
                      <div className="relative h-36 bg-[#f2efe8]">
                        {dish.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Utensils className="h-10 w-10 text-colorPrimary/15" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col gap-2 p-4">
                        <h4 className="text-sm font-bold leading-snug text-colorPrimary">
                          {dish.name}
                        </h4>

                        {dish.description && (
                          <p className="line-clamp-2 text-xs text-colorPrimary/50">
                            {dish.description}
                          </p>
                        )}

                        <div className="mt-auto flex items-center gap-3 border-t border-black/5 pt-2 text-xs text-colorPrimary/60">
                          <span className="flex items-center gap-1">
                            <Flame size={11} className="text-orange-400" />
                            {dish.calories} ккал
                          </span>
                          <span className="flex items-center gap-1">
                            <Scale size={11} className="text-colorPrimary/30" />
                            {dish.weight}г
                          </span>
                          <span className="flex items-center gap-1">
                            <Beef size={11} className="text-red-400" />Б
                            {dish.proteins}
                          </span>
                          <span className="flex items-center gap-1">
                            <Droplets size={11} className="text-yellow-400" />Ж
                            {dish.fats}
                          </span>
                          <span className="flex items-center gap-1">
                            <Wheat size={11} className="text-amber-500" />У
                            {dish.carbs}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => openEditDish(dish)}
                            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-50 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                          >
                            <Pencil size={12} />
                            Изменить
                          </button>

                          <button
                            onClick={() => setDishDeleteConfirmId(dish.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100"
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

        <Dialog
          open={isDishFormOpen}
          onOpenChange={(open) => !open && closeDishForm()}
        >
          <DialogContent className="max-w-2xl overflow-hidden border-none bg-whiteSecondary p-0">
            <DialogHeader className="sticky top-0 z-10 border-b border-black/5 bg-white px-6 py-5 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellowPrimary">
                  <MdOutlineRestaurantMenu
                    size={18}
                    className="text-colorPrimary"
                  />
                </div>

                <div>
                  <DialogTitle className="text-lg font-bold text-colorPrimary">
                    {editingDishId ? "Редактировать блюдо" : "Добавить блюдо"}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Форма добавления или редактирования блюда
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form
              onSubmit={handleDishSubmit}
              className="max-h-[90vh] space-y-5 overflow-y-auto p-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
                    Название блюда <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={dishForm.name}
                    onChange={handleDishChange}
                    required
                    placeholder="Овсянка с ягодами"
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
                    Приём пищи
                  </label>

                  <Select
                    value={dishForm.meal}
                    onValueChange={(value) =>
                      setDishForm((prev) => ({
                        ...prev,
                        meal: value as TRationMeal,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full cursor-pointer rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-colorPrimary">
                      <SelectValue placeholder="Выберите приём пищи" />
                    </SelectTrigger>

                    <SelectContent>
                      {MEALS.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
                    Калории (ккал)
                  </label>
                  <input
                    type="number"
                    name="calories"
                    value={dishForm.calories}
                    onChange={handleDishChange}
                    placeholder="350"
                    min="0"
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
                    Вес (г)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={dishForm.weight}
                    onChange={handleDishChange}
                    placeholder="250"
                    min="0"
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
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
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
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
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
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
                    className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                  />
                </div>

                <DishImageUpload
                  value={dishForm.image}
                  onChange={(base64) =>
                    setDishForm((prev) => ({ ...prev, image: base64 }))
                  }
                />

                <div className="col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
                    Описание
                  </label>
                  <textarea
                    name="description"
                    value={dishForm.description}
                    onChange={handleDishChange}
                    rows={2}
                    placeholder="Краткое описание блюда..."
                    className="w-full resize-none rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                  />
                </div>
              </div>

              <DialogFooter className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDishForm}
                  className="w-full rounded-xl"
                >
                  Отмена
                </Button>

                <Button
                  type="submit"
                  className="w-full rounded-xl bg-yellowPrimary font-bold text-colorPrimary hover:bg-[#b8e020]"
                >
                  <FaRegSave size={15} />
                  {editingDishId ? "Сохранить" : "Добавить"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!dishDeleteConfirmId}
          onOpenChange={(open) => !open && setDishDeleteConfirmId(null)}
        >
          <DialogContent className="max-w-sm rounded-2xl border-none bg-white p-6">
            <DialogHeader className="text-left">
              <div className="mb-1 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                  <Trash2 size={22} className="text-red-500" />
                </div>

                <div>
                  <DialogTitle className="text-colorPrimary">
                    Удалить блюдо?
                  </DialogTitle>
                  <DialogDescription className="text-sm text-colorPrimary/50">
                    Это действие нельзя отменить
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <DialogFooter className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDishDeleteConfirmId(null)}
                className="w-full rounded-xl"
              >
                Отмена
              </Button>

              <Button
                type="button"
                onClick={() => {
                  if (dishPanelRationId && dishDeleteConfirmId) {
                    deleteDish(dishPanelRationId, dishDeleteConfirmId);
                  }
                  setDishDeleteConfirmId(null);
                }}
                className="w-full rounded-xl bg-red-500 text-white hover:bg-red-600"
              >
                Удалить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-colorPrimary">
            <MdOutlineRestaurantMenu className="text-greySecondary" />
            <span>Рационы</span>
          </h1>
          <p className="mt-1 text-sm text-colorPrimary/50">
            Управление рационами питания на сайте
          </p>
        </div>

        <Button
          onClick={openAddRation}
          className="flex items-center gap-2 rounded-md bg-yellowPrimary px-4 py-5 text-sm font-bold text-colorPrimary transition-colors"
        >
          <Plus size={16} />
          <span className="hidden sm:block">Добавить рацион</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {rations.map((ration) => (
          <div
            key={ration.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-greySecondary/50 bg-whiteSecondary"
          >
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex items-start justify-between">
                <div className="min-w-0 flex-1 pr-2">
                  <h3 className="text-lg font-bold leading-tight text-colorPrimary">
                    {ration.name}
                  </h3>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    ration.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {ration.isActive ? "Активен" : "Скрыт"}
                </span>
              </div>

              <p className="mb-4 flex-1 line-clamp-2 text-sm text-colorPrimary/60">
                {ration.description}
              </p>

              <div className="mb-4 flex items-center justify-between text-sm">
                <div className="text-center">
                  <p className="font-bold text-colorPrimary">
                    {ration.calories}
                  </p>
                  <p className="text-xs text-colorPrimary/40">ккал</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-colorPrimary">
                    {ration.pricePerDay} BYN
                  </p>
                  <p className="text-xs text-colorPrimary/40">в день</p>
                </div>
              </div>

              <button
                onClick={() => setDishPanelRationId(ration.id)}
                className="mb-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-greySecondary/40 bg-yellow-hover/15 py-2 text-sm font-semibold text-colorPrimary transition-colors hover:bg-color hover:text-yellow-hover"
              >
                <Utensils size={14} />
                Блюда
                {ration.dishes.length > 0 && (
                  <span className="ml-1 rounded-full bg-yellowPrimary px-2 py-1 text-xs font-bold leading-none text-colorPrimary">
                    {ration.dishes.length}
                  </span>
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleRationActive(ration.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold transition-colors ${
                    ration.isActive
                      ? "cursor-pointer text-red-400 hover:bg-red-400/20"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {ration.isActive ? (
                    <>
                      <EyeOff size={14} /> Скрыть
                    </>
                  ) : (
                    <>
                      <Eye size={14} /> Показать
                    </>
                  )}
                </button>

                <button
                  onClick={() => openEditRation(ration)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <Pencil size={15} />
                </button>

                <button
                  onClick={() => setDeleteConfirmId(ration.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={openAddRation}
          className="group flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-greySecondary/50 bg-whiteSecondary p-8 transition-all hover:border-yellowPrimary"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl transition-colors">
            <Plus
              size={22}
              className="text-colorPrimary/40 group-hover:text-colorPrimary"
            />
          </div>

          <span className="text-sm font-semibold text-colorPrimary/40 transition-colors group-hover:text-colorPrimary">
            Добавить рацион
          </span>
        </button>
      </div>

      <Dialog
        open={isRationFormOpen}
        onOpenChange={(open) => !open && closeRationForm()}
      >
        <DialogContent className="max-w-lg overflow-hidden border-none bg-white p-0">
          <DialogHeader className="sticky top-0 z-10 border-b border-black/5 bg-white px-6 py-5 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellowPrimary">
                <PiChefHat size={18} className="text-colorPrimary" />
              </div>

              <div>
                <DialogTitle className="text-lg font-bold text-colorPrimary">
                  {editingRationId ? "Редактировать рацион" : "Добавить рацион"}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Форма добавления или редактирования рациона
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <form
            onSubmit={handleRationSubmit}
            className="max-h-[90vh] space-y-5 overflow-y-auto p-6"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
                  Название рациона <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={rationForm.name}
                  onChange={handleRationChange}
                  required
                  placeholder="Рацион 1200 ккал"
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
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
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
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
                  className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
                  Описание
                </label>
                <textarea
                  name="description"
                  value={rationForm.description}
                  onChange={handleRationChange}
                  rows={3}
                  placeholder="Краткое описание рациона..."
                  className="w-full resize-none rounded-xl border border-black/10 px-4 py-2.5 text-sm text-colorPrimary placeholder:text-colorPrimary/30 transition focus:border-transparent focus:outline-none"
                />
              </div>

              <div className="col-span-2">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/10 px-4 py-3">
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-colorPrimary">
                      Отображать на сайте
                    </p>
                    <p className="text-xs text-colorPrimary/40">
                      Рацион будет доступен пользователям
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={rationForm.isActive}
                      onChange={handleRationChange}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-colortext-colorPrimary/20 transition-colors peer-checked:bg-yellowPrimary" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
                  </div>
                </label>
              </div>
            </div>

            <DialogFooter className="grid grid-cols-2 gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeRationForm}
                className="w-full rounded-xl"
              >
                Отмена
              </Button>

              <Button
                type="submit"
                className="w-full rounded-xl bg-yellowPrimary font-bold text-colorPrimary hover:bg-[#b8e020]"
              >
                <FaRegSave size={15} />
                {editingRationId ? "Сохранить изменения" : "Добавить"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent className="max-w-sm rounded-2xl border-none bg-white p-6">
          <DialogHeader className="text-left">
            <div className="mb-1 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                <Trash2 size={22} className="text-red-500" />
              </div>

              <div>
                <DialogTitle className="text-colorPrimary">
                  Удалить рацион?
                </DialogTitle>
                <DialogDescription className="text-sm text-colorPrimary/50">
                  Это действие нельзя отменить
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <DialogFooter className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              className="w-full rounded-xl"
            >
              Отмена
            </Button>

            <Button
              type="button"
              onClick={() => {
                if (deleteConfirmId) {
                  deleteRation(deleteConfirmId);
                }
                setDeleteConfirmId(null);
              }}
              className="w-full rounded-xl bg-red-500 text-white hover:bg-red-600"
            >
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
