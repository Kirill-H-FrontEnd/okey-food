"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, Variants } from "framer-motion";
import {
  Controller,
  FieldError,
  Resolver,
  SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import { toast } from "react-hot-toast";

import { useAdminStore } from "@/store/useAdminStore";
import type { TRation, TRationDish, TRationMeal } from "@/types/admin";

import { PiChefHat } from "react-icons/pi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";

import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  Flame,
  Beef,
  Droplets,
  Wheat,
  Scale,
} from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader } from "@/components/ui/loader";
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

import DishImageUpload from "@/components/ui/image-upload";

import {
  dishSchema,
  type DishFormValues,
  MEALS,
  WEEKS,
  DAYS_OF_WEEK,
  DAY_LABELS,
  DAY_LABELS_SHORT,
} from "@/schemas/dish-schema";
import { rationSchema, type RationFormValues } from "@/schemas/ration-schema";

const MEAL_COLORS: Record<TRationMeal, string> = {
  Завтрак: "bg-amber-100 text-amber-700",
  "Второй завтрак": "bg-orange-100 text-orange-700",
  Обед: "bg-emerald-100 text-emerald-700",
  Полдник: "bg-sky-100 text-sky-700",
  Ужин: "bg-violet-100 text-violet-700",
  Перекус: "bg-rose-100 text-rose-700",
};

const defaultRationValues: RationFormValues = {
  name: "",
  description: "",
  calories: "",
  pricePerDay: "",
  isActive: true,
};

const defaultDishValues: DishFormValues = {
  name: "",
  meal: "Завтрак",
  week: 1,
  dayOfWeek: undefined,
  calories: "",
  proteins: "",
  fats: "",
  carbs: "",
  weight: "",
  image: "",
  description: "",
};

type RationFormField =
  | "name"
  | "calories"
  | "pricePerDay"
  | "description"
  | "isActive";

type DishFormField =
  | "name"
  | "meal"
  | "calories"
  | "weight"
  | "proteins"
  | "fats"
  | "carbs"
  | "description";

const RATION_FIELD_ORDER: RationFormField[] = [
  "name",
  "calories",
  "pricePerDay",
  "description",
  "isActive",
];

const DISH_FIELD_ORDER: DishFormField[] = [
  "name",
  "meal",
  "calories",
  "weight",
  "proteins",
  "fats",
  "carbs",
  "description",
];

const RATION_FIELD_ID_MAP: Record<RationFormField, string> = {
  name: "ration-name",
  calories: "ration-calories",
  pricePerDay: "ration-price",
  description: "ration-description",
  isActive: "ration-active",
};

const DISH_FIELD_ID_MAP: Record<DishFormField, string> = {
  name: "dish-name",
  meal: "dish-meal",
  calories: "dish-calories",
  weight: "dish-weight",
  proteins: "dish-proteins",
  fats: "dish-fats",
  carbs: "dish-carbs",
  description: "dish-description",
};

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function RationsPage() {
  const {
    rations,
    rationsLoading,
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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [dishPanelRationId, setDishPanelRationId] = useState<string | null>(
    null,
  );
  const [isDishFormOpen, setIsDishFormOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [dishDeleteConfirmId, setDishDeleteConfirmId] = useState<string | null>(
    null,
  );
  const [selectedWeek, setSelectedWeek] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDay, setSelectedDay] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  const editingRation = useMemo(
    () => rations.find((ration) => ration.id === editingRationId) ?? null,
    [editingRationId, rations],
  );

  const dishPanelRation = useMemo(
    () => rations.find((ration) => ration.id === dishPanelRationId) ?? null,
    [dishPanelRationId, rations],
  );

  const editingDish = useMemo(() => {
    if (!dishPanelRation || !editingDishId) return null;
    return (
      dishPanelRation.dishes.find((dish) => dish.id === editingDishId) ?? null
    );
  }, [dishPanelRation, editingDishId]);

  const rationResolver: Resolver<RationFormValues> = useCallback(
    async (values) => {
      const parsed = rationSchema.safeParse(values);

      if (parsed.success) {
        return { values: parsed.data, errors: {} };
      }

      const issues = parsed.error.issues;
      type Issue = (typeof issues)[number];

      const getFieldPosition = (field: RationFormField) => {
        const index = RATION_FIELD_ORDER.indexOf(field);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
      };

      const firstIssue = issues
        .map((issue) => {
          const path = issue.path[0];
          if (typeof path !== "string") return null;

          return {
            field: path as RationFormField,
            issue,
          };
        })
        .filter((entry): entry is { field: RationFormField; issue: Issue } =>
          Boolean(entry?.field),
        )
        .sort(
          (a, b) => getFieldPosition(a.field) - getFieldPosition(b.field),
        )[0];

      if (!firstIssue) {
        return { values: {}, errors: {} };
      }

      const { field, issue } = firstIssue;

      return {
        values: {},
        errors: {
          [field]: {
            type: issue.code,
            message: issue.message,
          },
        } as Record<string, FieldError>,
      };
    },
    [],
  );

  const dishResolver: Resolver<DishFormValues> = useCallback(async (values) => {
    const parsed = dishSchema.safeParse(values);

    if (parsed.success) {
      return { values: parsed.data, errors: {} };
    }

    const issues = parsed.error.issues;
    type Issue = (typeof issues)[number];

    const getFieldPosition = (field: DishFormField) => {
      const index = DISH_FIELD_ORDER.indexOf(field);
      return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    };

    const firstIssue = issues
      .map((issue) => {
        const path = issue.path[0];
        if (typeof path !== "string") return null;

        return {
          field: path as DishFormField,
          issue,
        };
      })
      .filter((entry): entry is { field: DishFormField; issue: Issue } =>
        Boolean(entry?.field),
      )
      .sort((a, b) => getFieldPosition(a.field) - getFieldPosition(b.field))[0];

    if (!firstIssue) {
      return { values: {}, errors: {} };
    }

    const { field, issue } = firstIssue;

    return {
      values: {},
      errors: {
        [field]: {
          type: issue.code,
          message: issue.message,
        },
      } as Record<string, FieldError>,
    };
  }, []);

  const rationForm = useForm<RationFormValues>({
    resolver: rationResolver,
    defaultValues: defaultRationValues,
    shouldFocusError: false,
  });

  const dishForm = useForm<DishFormValues>({
    resolver: dishResolver,
    defaultValues: defaultDishValues,
    shouldFocusError: false,
  });

  const {
    register: registerRation,
    control: rationControl,
    handleSubmit: handleSubmitRation,
    reset: resetRation,
    watch: watchRation,
    formState: { errors: rationErrors, isSubmitting: isRationSubmitting },
  } = rationForm;

  const {
    register: registerDish,
    control: dishControl,
    handleSubmit: handleSubmitDish,
    reset: resetDish,
    setValue: setDishValue,
    watch: watchDish,
    formState: { errors: dishErrors, isSubmitting: isDishSubmitting },
  } = dishForm;

  useEffect(() => {
    if (!isRationFormOpen) return;

    if (editingRation) {
      resetRation({
        name: editingRation.name,
        description: editingRation.description ?? "",
        calories: editingRation.calories ?? "",
        pricePerDay: String(editingRation.pricePerDay ?? ""),
        isActive: editingRation.isActive,
      });
      return;
    }

    resetRation(defaultRationValues);
  }, [editingRation, isRationFormOpen, resetRation]);

  useEffect(() => {
    if (!isDishFormOpen) return;

    if (editingDish) {
      resetDish({
        name: editingDish.name,
        meal: editingDish.meal,
        week: editingDish.week ?? 1,
        dayOfWeek: editingDish.dayOfWeek ?? undefined,
        calories: String(editingDish.calories ?? ""),
        proteins: String(editingDish.proteins ?? ""),
        fats: String(editingDish.fats ?? ""),
        carbs: String(editingDish.carbs ?? ""),
        weight: String(editingDish.weight ?? ""),
        image: editingDish.image ?? "",
        description: editingDish.description ?? "",
      });
      return;
    }

    resetDish({
      ...defaultDishValues,
      week: selectedWeek,
      dayOfWeek: selectedDay,
    });
  }, [editingDish, isDishFormOpen, resetDish, selectedWeek, selectedDay]);

  const openAddRation = () => {
    setEditingRationId(null);
    setIsRationFormOpen(true);
  };

  const openEditRation = (ration: TRation) => {
    setEditingRationId(ration.id);
    setIsRationFormOpen(true);
  };

  const closeRationForm = () => {
    setIsRationFormOpen(false);
    setEditingRationId(null);
    resetRation(defaultRationValues);
  };

  const openAddDish = () => {
    setEditingDishId(null);
    dishForm.setValue("week", selectedWeek);
    setIsDishFormOpen(true);
  };

  const openEditDish = (dish: TRationDish) => {
    setEditingDishId(dish.id);
    setIsDishFormOpen(true);
  };

  const closeDishForm = () => {
    setIsDishFormOpen(false);
    setEditingDishId(null);
    resetDish(defaultDishValues);
  };

  const scrollFieldIntoView = useCallback((fieldId: string) => {
    requestAnimationFrame(() => {
      const element = document.getElementById(fieldId);
      if (element instanceof HTMLElement) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }, []);

  const handleRationSubmitError: SubmitErrorHandler<RationFormValues> = (
    errors,
  ) => {
    const entries = Object.entries(errors) as [
      RationFormField,
      FieldError | undefined,
    ][];

    const firstErrorEntry =
      entries.find(([, error]) => Boolean(error?.message)) ?? entries[0];

    if (!firstErrorEntry) return;

    const [field, error] = firstErrorEntry;
    const message = error?.message ?? "Проверьте корректность данных";

    toast.error(message);
    scrollFieldIntoView(RATION_FIELD_ID_MAP[field]);
  };

  const handleDishSubmitError: SubmitErrorHandler<DishFormValues> = (
    errors,
  ) => {
    const entries = Object.entries(errors) as [
      DishFormField,
      FieldError | undefined,
    ][];

    const firstErrorEntry =
      entries.find(([, error]) => Boolean(error?.message)) ?? entries[0];

    if (!firstErrorEntry) return;

    const [field, error] = firstErrorEntry;
    const message = error?.message ?? "Проверьте корректность данных";

    toast.error(message);
    scrollFieldIntoView(DISH_FIELD_ID_MAP[field]);
  };

  const onSubmitRation = async (values: RationFormValues) => {
    const data = {
      name: `${values.calories.trim()} ккал`,
      description: values.description?.trim() ?? "",
      calories: values.calories.trim(),
      pricePerDay: Number(values.pricePerDay),
      image: "",
      category: "Поддержание" as const,
      isActive: values.isActive,
      dishes: editingRationId
        ? (rations.find((ration) => ration.id === editingRationId)?.dishes ??
          [])
        : [],
    };

    const toastId = toast.loading(
      editingRationId ? "Рацион сохраняется..." : "Рацион создаётся...",
    );

    try {
      if (editingRationId) {
        await updateRation(editingRationId, data);
        toast.success("Рацион успешно обновлён", { id: toastId });
      } else {
        await addRation(data);
        toast.success("Рацион успешно добавлен", { id: toastId });
      }

      closeRationForm();
    } catch {
      toast.error("Не удалось сохранить рацион", { id: toastId });
    }
  };

  const onSubmitDish = async (values: DishFormValues) => {
    if (!dishPanelRationId) return;

    const data = {
      name: values.name.trim(),
      meal: values.meal as TRationMeal,
      week: (values.week ?? selectedWeek) as 1 | 2 | 3 | 4,
      dayOfWeek: values.dayOfWeek as (1 | 2 | 3 | 4 | 5 | 6) | undefined,
      calories: Number(values.calories),
      proteins: Number(values.proteins),
      fats: Number(values.fats),
      carbs: Number(values.carbs),
      weight: Number(values.weight),
      image: values.image ?? "",
      description: values.description?.trim() ?? "",
    };

    const toastId = toast.loading(
      editingDishId ? "Блюдо сохраняется..." : "Блюдо создаётся...",
    );

    try {
      if (editingDishId) {
        await updateDish(dishPanelRationId, editingDishId, data);
        toast.success("Блюдо успешно обновлено", { id: toastId });
      } else {
        await addDish(dishPanelRationId, data);
        toast.success("Блюдо успешно добавлено", { id: toastId });
      }

      closeDishForm();
    } catch {
      toast.error("Не удалось сохранить блюдо", { id: toastId });
    }
  };

  const groupedDishes = (
    dishes: TRationDish[],
    week: 1 | 2 | 3 | 4,
    day: 1 | 2 | 3 | 4 | 5 | 6,
  ) => {
    const groups: Partial<Record<TRationMeal, TRationDish[]>> = {};
    const filtered = dishes.filter(
      (d) => (d.week ?? 1) === week && d.dayOfWeek === day,
    );

    for (const dish of filtered) {
      if (!groups[dish.meal]) {
        groups[dish.meal] = [];
      }
      groups[dish.meal]!.push(dish);
    }

    return groups;
  };

  const dishCountByWeek = (dishes: TRationDish[]) => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0 };
    for (const d of dishes) {
      const w = d.week ?? 1;
      counts[w] = (counts[w] ?? 0) + 1;
    }
    return counts;
  };

  const dishCountByDay = (dishes: TRationDish[], week: 1 | 2 | 3 | 4) => {
    const counts: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };
    for (const d of dishes) {
      if ((d.week ?? 1) === week && d.dayOfWeek) {
        counts[d.dayOfWeek] = (counts[d.dayOfWeek] ?? 0) + 1;
      }
    }
    return counts;
  };

  const rationDescriptionLength = watchRation("description")?.length ?? 0;
  const dishDescriptionLength = watchDish("description")?.length ?? 0;

  const rationFieldHasError = (field: keyof RationFormValues) =>
    Boolean(rationErrors[field]);

  const dishFieldHasError = (field: keyof DishFormValues) =>
    Boolean(dishErrors[field]);

  const withRationErrorStyles = (field: keyof RationFormValues) =>
    rationFieldHasError(field)
      ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
      : undefined;

  const withDishErrorStyles = (field: keyof DishFormValues) =>
    dishFieldHasError(field)
      ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
      : undefined;

  if (dishPanelRation) {
    const groups = groupedDishes(
      dishPanelRation.dishes,
      selectedWeek,
      selectedDay,
    );
    const weekCounts = dishCountByWeek(dishPanelRation.dishes);
    const dayCounts = dishCountByDay(dishPanelRation.dishes, selectedWeek);
    const currentViewDishCount = dayCounts[selectedDay] ?? 0;

    return (
      <div className="p-4 md:p-8">
        <div className="mb-4 flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => {
              setDishPanelRationId(null);
              setIsDishFormOpen(false);
              setEditingDishId(null);
            }}
            className="flex items-center gap-1 text-sm font-semibold text-colorPrimary/50 transition-colors hover:text-colorPrimary"
          >
            <ChevronLeft size={16} />
            Рационы
          </button>

          <span className="text-colorPrimary/20">/</span>

          <h1 className="text-md font-bold text-colorPrimary sm:text-lg md:text-xl">
            {dishPanelRation.name}
          </h1>

          <span className="text-sm font-medium text-colorPrimary/40">
            {dishPanelRation.dishes.length} блюд всего
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
            <span className="hidden sm:block">Добавить блюдо</span>
          </Button>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {WEEKS.map((w) => (
            <Button
              key={w}
              type="button"
              onClick={() => setSelectedWeek(w)}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                selectedWeek === w
                  ? "border-yellowPrimary bg-yellowPrimary text-colorPrimary shadow-sm"
                  : "border-greySecondary/40 bg-whiteSecondary text-greySecondary hover:border-yellow-hover/50 hover:text-colorPrimary"
              }`}
            >
              Неделя {w}
              {weekCounts[w] > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                    selectedWeek === w
                      ? "bg-colorPrimary/15 text-colorPrimary"
                      : "bg-greySecondary/20 text-colorPrimary/50"
                  }`}
                >
                  {weekCounts[w]}
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map((d) => (
            <Button
              key={d}
              type="button"
              onClick={() => setSelectedDay(d)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedDay === d
                  ? "border-colorPrimary bg-colorPrimary text-white shadow-sm"
                  : "border-greySecondary/40 bg-whiteSecondary text-greySecondary hover:border-colorPrimary/30 hover:text-colorPrimary"
              }`}
            >
              {DAY_LABELS_SHORT[d]}
              {dayCounts[d] > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                    selectedDay === d
                      ? "bg-white/20 text-white"
                      : "bg-greySecondary/20 text-colorPrimary/50"
                  }`}
                >
                  {dayCounts[d]}
                </span>
              )}
            </Button>
          ))}
        </div>

        {currentViewDishCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-greySecondary/30 bg-whitePrimary">
              <MdOutlineRestaurantMenu
                size={24}
                className="text-colorPrimary/25"
              />
            </div>

            <p className="mb-1 text-lg font-bold text-[#302a41]/30">
              Блюда на {DAY_LABELS[selectedDay].toLowerCase()} не добавлены
            </p>
            <p className="text-sm text-[#302a41]/30">
              Нажмите «Добавить блюдо», чтобы заполнить меню на этот день
            </p>
          </div>
        ) : (
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {MEALS.flatMap((meal) =>
              (groups[meal] ?? []).map((dish) => ({ dish, meal })),
            ).map(({ dish, meal }) => (
              <motion.div
                key={dish.id}
                variants={itemVariants}
                className="flex flex-col overflow-hidden rounded-2xl border border-greySecondary/20 bg-white shadow-sm shadow-colorPrimary/5"
              >
                {/* Image */}
                <div className="relative h-40 bg-whitePrimary">
                  {dish.image ? (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-colorPrimary/3">
                      <MdOutlineRestaurantMenu className="h-12 w-12 text-colorPrimary/10" />
                    </div>
                  )}
                  <span
                    className={`absolute bottom-2 left-2 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm ${MEAL_COLORS[meal]}`}
                  >
                    {meal}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-3">
                  <h4 className="mb-1 text-sm font-bold leading-snug text-colorPrimary">
                    {dish.name}
                  </h4>

                  {dish.description && (
                    <p className="mb-2 line-clamp-2 text-xs text-colorPrimary/50">
                      {dish.description}
                    </p>
                  )}

                  {/* Macro grid */}
                  <div className="mt-auto grid grid-cols-5 gap-1 pt-2">
                    <div className="col-span-2 flex flex-col items-center rounded-lg bg-orange-50 py-1">
                      <span className="text-[9px] font-semibold text-orange-400">
                        ккал
                      </span>
                      <span className="text-xs font-bold text-colorPrimary">
                        {dish.calories}
                      </span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-red-50 py-1">
                      <span className="text-[9px] font-semibold text-red-400">
                        Б
                      </span>
                      <span className="text-xs font-bold text-colorPrimary">
                        {dish.proteins}
                      </span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-yellow-50 py-1">
                      <span className="text-[9px] font-semibold text-yellow-500">
                        Ж
                      </span>
                      <span className="text-xs font-bold text-colorPrimary">
                        {dish.fats}
                      </span>
                    </div>
                    <div className="flex flex-col items-center rounded-lg bg-amber-50 py-1">
                      <span className="text-[9px] font-semibold text-amber-500">
                        У
                      </span>
                      <span className="text-xs font-bold text-colorPrimary">
                        {dish.carbs}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[10px] text-colorPrimary/40">
                      <Scale size={9} />
                      {dish.weight} г
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 pt-2">
                    <Button
                      onClick={() => openEditDish(dish)}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-lg bg-blue-50 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      <Pencil size={11} />
                      Изменить
                    </Button>
                    <Button
                      onClick={() => setDishDeleteConfirmId(dish.id)}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <Dialog
          open={isDishFormOpen}
          onOpenChange={(open) => {
            if (!open) closeDishForm();
          }}
        >
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className="h-full max-w-full gap-0 overflow-hidden rounded-none border-none bg-whiteSecondary p-0 sm:h-[650px] sm:max-w-2xl sm:rounded-lg"
          >
            <DialogHeader className="shrink-0 border-b border-black/5 bg-white px-6 py-4 text-left">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellowPrimary">
                  <MdOutlineRestaurantMenu
                    size={18}
                    className="text-colorPrimary"
                  />
                </div>

                <DialogTitle className="m-0 text-lg font-bold leading-none text-colorPrimary">
                  {editingDishId ? "Редактировать блюдо" : "Добавить блюдо"}
                </DialogTitle>
              </div>
            </DialogHeader>

            <form
              onSubmit={handleSubmitDish(onSubmitDish, handleDishSubmitError)}
              className="flex h-full min-h-0 flex-col"
            >
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 grid gap-2">
                    <Label htmlFor="dish-name">
                      Название блюда<span className="text-red-400">*</span>
                    </Label>
                    <Input
                      {...registerDish("name")}
                      id="dish-name"
                      placeholder="Овсянка с ягодами"
                      aria-invalid={dishFieldHasError("name")}
                      className={cn(withDishErrorStyles("name"))}
                    />
                  </div>

                  <div className="col-span-2 grid min-w-0 gap-2">
                    <Label htmlFor="dish-meal">
                      Приём пищи<span className="text-red-400">*</span>
                    </Label>

                    <Controller
                      control={dishControl}
                      name="meal"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            field.onBlur();
                          }}
                        >
                          <SelectTrigger
                            id="dish-meal"
                            aria-invalid={dishFieldHasError("meal")}
                            className={cn(
                              "w-full min-w-0 rounded-[6px] border border-greySecondary/50 bg-white px-4 text-sm text-colorPrimary shadow-none outline-none ring-0 data-[placeholder]:text-colorPrimary/30 focus:outline-none focus:ring-0",
                              withDishErrorStyles("meal"),
                            )}
                          >
                            <SelectValue placeholder="Выберите приём пищи" />
                          </SelectTrigger>

                          <SelectContent className="z-[9999] rounded-xl border border-black/10 bg-white text-sm text-colorPrimary shadow-xl">
                            {MEALS.map((meal) => (
                              <SelectItem
                                key={meal}
                                value={meal}
                                className="cursor-pointer"
                              >
                                {meal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="col-span-2 grid gap-2">
                    <Label>Неделя меню</Label>
                    <Controller
                      control={dishControl}
                      name="week"
                      render={({ field }) => (
                        <div className="flex gap-2">
                          {WEEKS.map((w) => (
                            <button
                              key={w}
                              type="button"
                              onClick={() => field.onChange(w)}
                              className={`flex-1 rounded-xl border py-2 text-sm font-semibold transition-all ${
                                field.value === w
                                  ? "border-yellowPrimary bg-yellowPrimary text-colorPrimary"
                                  : "cursor-pointer border-greySecondary/50 bg-white text-colorPrimary/50 hover:border-yellow-hover/40 hover:text-colorPrimary"
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="col-span-2 grid gap-2">
                    <Label>
                      День недели<span className="text-red-400">*</span>
                    </Label>
                    <p className="text-xs text-colorPrimary/40 -mt-1">
                      Блюдо будет отображаться только в выбранный день недели.
                    </p>
                    <Controller
                      control={dishControl}
                      name="dayOfWeek"
                      render={({ field }) => (
                        <div className="flex flex-wrap gap-2">
                          {DAYS_OF_WEEK.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => field.onChange(d)}
                              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                                field.value === d
                                  ? "border-colorPrimary bg-colorPrimary text-white"
                                  : "cursor-pointer border-greySecondary/50 bg-white text-colorPrimary/50 hover:border-colorPrimary/40 hover:text-colorPrimary"
                              }`}
                            >
                              {DAY_LABELS[d]}
                            </button>
                          ))}
                        </div>
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dish-calories">
                      Калории (ккал)<span className="text-red-400">*</span>
                    </Label>
                    <Input
                      {...registerDish("calories")}
                      id="dish-calories"
                      type="number"
                      placeholder="350"
                      aria-invalid={dishFieldHasError("calories")}
                      className={cn(withDishErrorStyles("calories"))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dish-weight">
                      Вес (г)<span className="text-red-400">*</span>
                    </Label>
                    <Input
                      {...registerDish("weight")}
                      id="dish-weight"
                      type="number"
                      placeholder="250"
                      aria-invalid={dishFieldHasError("weight")}
                      className={cn(withDishErrorStyles("weight"))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dish-proteins">
                      Белки (г)<span className="text-red-400">*</span>
                    </Label>
                    <Input
                      {...registerDish("proteins")}
                      id="dish-proteins"
                      type="number"
                      step="0.1"
                      placeholder="12"
                      aria-invalid={dishFieldHasError("proteins")}
                      className={cn(withDishErrorStyles("proteins"))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dish-fats">
                      Жиры (г)<span className="text-red-400">*</span>
                    </Label>
                    <Input
                      {...registerDish("fats")}
                      id="dish-fats"
                      type="number"
                      step="0.1"
                      placeholder="8"
                      aria-invalid={dishFieldHasError("fats")}
                      className={cn(withDishErrorStyles("fats"))}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="dish-carbs">
                      Углеводы (г)<span className="text-red-400">*</span>
                    </Label>
                    <Input
                      {...registerDish("carbs")}
                      id="dish-carbs"
                      type="number"
                      step="0.1"
                      placeholder="45"
                      aria-invalid={dishFieldHasError("carbs")}
                      className={cn(withDishErrorStyles("carbs"))}
                    />
                  </div>

                  <div className="col-span-2">
                    <DishImageUpload
                      value={watchDish("image") ?? ""}
                      onChange={(base64) =>
                        setDishValue("image", base64, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    />
                  </div>

                  <div className="col-span-2 grid gap-2">
                    <Label htmlFor="dish-description">Описание</Label>
                    <Textarea
                      {...registerDish("description")}
                      id="dish-description"
                      placeholder="Краткое описание блюда..."
                      maxLength={300}
                      aria-invalid={dishFieldHasError("description")}
                      className={cn(
                        "resize-none",
                        withDishErrorStyles("description"),
                      )}
                    />
                    <div className="flex items-center justify-between text-xs text-greySecondary">
                      <span />
                      <span>{dishDescriptionLength} / 300</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="grid shrink-0 grid-cols-2 gap-3 border-t border-black/5 bg-white px-6 py-4">
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
                  disabled={isDishSubmitting}
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
          onOpenChange={(open) => {
            if (!open) setDishDeleteConfirmId(null);
          }}
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
                onClick={async () => {
                  if (dishPanelRationId && dishDeleteConfirmId) {
                    const toastId = toast.loading("Блюдо удаляется...");
                    try {
                      await deleteDish(dishPanelRationId, dishDeleteConfirmId);
                      toast.success("Блюдо удалено", { id: toastId });
                    } catch {
                      toast.error("Не удалось удалить блюдо", { id: toastId });
                    }
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
            <MdOutlineRestaurantMenu className="text-yellow-hover" />
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

      {rationsLoading ? (
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader size="medium" />
        </div>
      ) : rations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-greySecondary/30 bg-whitePrimary">
            <MdOutlineRestaurantMenu
              size={24}
              className="text-colorPrimary/25"
            />
          </div>

          <p className="mb-1 text-lg font-bold text-colorPrimary/30">
            Рационов пока нет
          </p>
          <p className="text-sm text-colorPrimary/30">
            Добавьте первый рацион, чтобы он появился в списке
          </p>
        </div>
      ) : (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
        >
          {rations.map((ration) => (
            <motion.div
              key={ration.id}
              variants={itemVariants}
              className="flex flex-col overflow-hidden rounded-2xl border border-greySecondary/20 bg-white shadow-md shadow-colorPrimary/5"
            >
              {/* Colored header */}
              <div className="relative bg-colorPrimary px-5 pb-4 pt-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <Flame
                        size={15}
                        className="shrink-0 text-yellowPrimary"
                      />
                      <span className="text-2xl font-extrabold leading-none text-white">
                        {ration.calories}
                      </span>
                      <span className="mt-0.5 text-sm font-medium text-white/50">
                        ккал
                      </span>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      ration.isActive
                        ? "bg-emerald-400/20 text-emerald-300"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {ration.isActive ? "Активен" : "Скрыт"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col p-4">
                {ration.description && (
                  <p className="mb-3 line-clamp-2 text-sm text-colorPrimary/55">
                    {ration.description}
                  </p>
                )}

                <div className="mb-3 flex items-center justify-between rounded-xl bg-colorPrimary/5 px-4 py-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-colorPrimary/40">
                      Цена в день
                    </p>
                    <p className="text-xl font-extrabold text-colorPrimary">
                      {ration.pricePerDay}{" "}
                      <span className="text-sm font-medium text-colorPrimary/50">
                        BYN
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => setDishPanelRationId(ration.id)}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-yellowPrimary/40 bg-yellowPrimary/20 px-3 py-2 text-xs font-bold text-colorPrimary transition-colors hover:bg-yellowPrimary/40"
                  >
                    <MdOutlineRestaurantMenu size={13} />
                    Блюда
                    {ration.dishes.length > 0 && (
                      <span className="ml-0.5 rounded-full bg-colorPrimary px-1.5 py-0.5 text-[10px] font-bold leading-none text-yellowPrimary">
                        {ration.dishes.length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="mt-auto flex gap-2">
                  <button
                    onClick={async () => {
                      const toastId = toast.loading(
                        ration.isActive
                          ? "Рацион скрывается..."
                          : "Рацион публикуется...",
                      );
                      try {
                        await toggleRationActive(ration.id);
                        toast.success(
                          ration.isActive
                            ? "Рацион скрыт"
                            : "Рацион опубликован",
                          { id: toastId },
                        );
                      } catch {
                        toast.error("Не удалось изменить статус рациона", {
                          id: toastId,
                        });
                      }
                    }}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold transition-colors ${
                      ration.isActive
                        ? "text-red-400 hover:bg-red-50"
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
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(ration.id)}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-red-50 text-red-500 transition-colors hover:bg-red-100"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog
        open={isRationFormOpen}
        onOpenChange={(open) => {
          if (!open) closeRationForm();
        }}
      >
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="h-full max-w-full gap-0 overflow-hidden rounded-none border-none bg-white p-0 sm:h-[600px] sm:max-w-lg sm:rounded-lg"
        >
          <DialogHeader className="shrink-0 border-b border-black/5 bg-white px-6 py-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellowPrimary">
                <PiChefHat size={18} className="text-colorPrimary" />
              </div>

              <DialogTitle className="m-0 text-lg font-bold leading-none text-colorPrimary">
                {editingRationId ? "Редактировать рацион" : "Добавить рацион"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <form
            onSubmit={handleSubmitRation(
              onSubmitRation,
              handleRationSubmitError,
            )}
            className="flex h-full min-h-0 flex-col"
          >
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="ration-calories">
                    Калорийность (ккал)<span className="text-red-400">*</span>
                  </Label>
                  <Input
                    {...registerRation("calories")}
                    id="ration-calories"
                    type="number"
                    placeholder="1200"
                    aria-invalid={rationFieldHasError("calories")}
                    className={cn(withRationErrorStyles("calories"))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="ration-price">
                    Цена в день (BYN)<span className="text-red-400">*</span>
                  </Label>
                  <Input
                    {...registerRation("pricePerDay")}
                    id="ration-price"
                    type="number"
                    step="0.5"
                    placeholder="28"
                    aria-invalid={rationFieldHasError("pricePerDay")}
                    className={cn(withRationErrorStyles("pricePerDay"))}
                  />
                </div>

                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="ration-description">Описание</Label>
                  <Textarea
                    {...registerRation("description")}
                    id="ration-description"
                    placeholder="Краткое описание рациона..."
                    rows={4}
                    maxLength={300}
                    aria-invalid={rationFieldHasError("description")}
                    className={cn(
                      "resize-none",
                      withRationErrorStyles("description"),
                    )}
                  />
                  <div className="flex items-center justify-between text-xs text-greySecondary">
                    <span />
                    <span>{rationDescriptionLength} / 300</span>
                  </div>
                </div>

                <div
                  id="ration-active"
                  className="col-span-2 flex items-center justify-between rounded-xl border border-black/10 px-4 py-3"
                >
                  <div className="pr-4">
                    <p className="text-sm font-semibold text-colorPrimary">
                      Отображать на сайте
                    </p>
                    <p className="text-xs text-colorPrimary/40">
                      Рацион будет доступен пользователям
                    </p>
                  </div>

                  <Controller
                    control={rationControl}
                    name="isActive"
                    render={({ field }) => (
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        aria-label="Отображать рацион на сайте"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="grid shrink-0 grid-cols-2 gap-3 border-t border-black/5 bg-white px-6 py-4">
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
                disabled={isRationSubmitting}
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
        onOpenChange={(open) => {
          if (!open) setDeleteConfirmId(null);
        }}
      >
        <DialogContent className="max-w-sm rounded-md border-none bg-white p-6">
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
              onClick={async () => {
                if (deleteConfirmId) {
                  const toastId = toast.loading("Рацион удаляется...");
                  try {
                    await deleteRation(deleteConfirmId);
                    toast.success("Рацион удалён", { id: toastId });
                  } catch {
                    toast.error("Не удалось удалить рацион", { id: toastId });
                  }
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
