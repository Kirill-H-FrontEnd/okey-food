"use client";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar1,
  Calendar1Icon,
  CalendarDays,
  ChevronDownIcon,
  HelpCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, ShoppingBasket, XIcon } from "lucide-react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";
import { checkoutSchema } from "@/schemas/checkout-schema";
import { useBasketStore } from "@/store/useStore";
import { AnimatedAmount } from "@/components/magicui/animated-amount";
import { BasketItem } from "./_components/basket-item";
import { BasketEmpty } from "./_components/basket-empty";
import { listSelectableDays } from "@/lib/delivery-days";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

type FormState = {
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

type FormErrors = Record<keyof FormState, string | null>;

const CITIES = [
  { value: "minsk", label: "Минск" },
  { value: "brest", label: "Брест" },
  { value: "gomel", label: "Гомель" },
  { value: "vitebsk", label: "Витебск" },
];

function formatDateRange(range: string | null) {
  if (!range) return null;
  const [startStr, endStr] = range.split("_");
  if (!startStr || !endStr) return null;

  const formatPart = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "short",
    });
  };

  const start = formatPart(startStr);
  const end = formatPart(endStr);
  if (!start || !end) return null;
  return `${start} – ${end}`;
}

function daysWord(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "день";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "дня";
  return "дней";
}

const createInitialFormState = (): FormState => ({
  firstName: "",
  lastName: "",
  phone: "",
  social: "",
  city: CITIES[0]?.value ?? "",
  street: "",
  house: "",
  apartment: "",
  date: null,
  comment: "",
});

const createEmptyErrors = (): FormErrors => ({
  firstName: null,
  lastName: null,
  phone: null,
  social: null,
  city: null,
  street: null,
  house: null,
  apartment: null,
  date: null,
  comment: null,
});

const errorsAreEqual = (a: FormErrors, b: FormErrors) =>
  (Object.keys(a) as Array<keyof FormErrors>).every((key) => a[key] === b[key]);

export const Basket: FC = () => {
  const isBasketOpen = useBasketStore((s) => s.isBasketOpen);
  const setIsBasketOpen = useBasketStore((s) => s.setIsBasketOpen);
  const items = useBasketStore((s) => s.items);
  const updateItem = useBasketStore((s) => s.updateItem);
  const removeItem = useBasketStore((s) => s.removeItem);

  const prefersReducedMotion = useReducedMotion();

  const [open, setOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [formData, setFormData] = useState<FormState>(() =>
    createInitialFormState()
  );
  const [fieldErrors, setFieldErrors] = useState<FormErrors>(() =>
    createEmptyErrors()
  );
  const [activeErrorField, setActiveErrorField] = useState<
    keyof FormState | null
  >(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => Number(a.calories) - Number(b.calories)),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.pricePerDay * item.selectedDays.length,
        0
      ),
    [items]
  );
  const totalLabel = totalPrice ? `${totalPrice} BYN` : "0 BYN";
  const itemCount = items.length;

  const resetFormState = useCallback(() => {
    setFormData(createInitialFormState());
    setFieldErrors(createEmptyErrors());
    setActiveErrorField(null);
    setHasAttemptedSubmit(false);
  }, []);

  useEffect(() => {
    if (!isBasketOpen) {
      setIsCheckout(false);
      setIsConsentGiven(false);
      resetFormState();
    }
  }, [isBasketOpen, resetFormState]);

  useEffect(() => {
    if (sortedItems.length === 0) {
      setIsCheckout(false);
      setIsConsentGiven(false);
      resetFormState();
    }
  }, [sortedItems.length, resetFormState]);

  const validateForm = useCallback((state: FormState) => {
    const parsed = checkoutSchema.safeParse(state);
    if (parsed.success) {
      setFieldErrors((prev) => {
        const empty = createEmptyErrors();
        if (errorsAreEqual(prev, empty)) return prev;
        return empty;
      });
      setActiveErrorField(null);
      return { valid: true as const, data: parsed.data };
    }

    const nextErrors = createEmptyErrors();
    let firstErrorField: keyof FormState | null = null;
    for (const issue of parsed.error.issues) {
      const pathKey = issue.path[0];
      if (typeof pathKey !== "string") continue;
      const fieldKey = pathKey as keyof FormState;
      if (!nextErrors[fieldKey]) {
        nextErrors[fieldKey] = issue.message;
        if (!firstErrorField) firstErrorField = fieldKey;
      }
    }

    setFieldErrors((prev) => {
      if (errorsAreEqual(prev, nextErrors)) return prev;
      return nextErrors;
    });
    setActiveErrorField((current) => {
      if (current && nextErrors[current]) return current;
      return firstErrorField;
    });
    return { valid: false as const, data: null };
  }, []);

  useEffect(() => {
    if (!hasAttemptedSubmit) return;
    validateForm(formData);
  }, [formData, hasAttemptedSubmit, validateForm]);

  const handleIncrementDays = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item || !item.range) return;
    const selectable = listSelectableDays(item.range).sort();
    if (item.selectedDays.length >= selectable.length) return;
    const next = selectable.find((day) => !item.selectedDays.includes(day));
    if (!next) return;
    updateItem(id, (prev) => ({
      ...prev,
      selectedDays: [...prev.selectedDays, next],
    }));
  };

  const handleDecrementDays = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;
    if (item.selectedDays.length <= 1) {
      removeItem(id);
      return;
    }
    const sortedDays = [...item.selectedDays].sort();
    const nextDays = sortedDays.slice(0, -1);
    updateItem(id, (prev) => ({
      ...prev,
      selectedDays: nextDays,
    }));
  };

  const handleProceedToCheckout = () => {
    if (itemCount === 0) return;
    setIsCheckout(true);
    setIsConsentGiven(false);
    setActiveErrorField(null);
    setHasAttemptedSubmit(false);
  };

  const handleFieldChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    setHasAttemptedSubmit(true);
    const validation = validateForm(formData);
    if (!validation.valid) return;

    // TODO: отправка на сервер
    console.log("Checkout data", {
      ...validation.data,
      consent: isConsentGiven,
      orderItems: sortedItems,
      totalPrice,
    });
  };

  const prefersMotionReduction = Boolean(prefersReducedMotion);

  const basketSectionVariants = useMemo(
    () => ({
      initial: { opacity: 0, x: prefersMotionReduction ? 0 : 32 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: prefersMotionReduction ? 0 : -24 },
    }),
    [prefersMotionReduction]
  );

  const checkoutSectionVariants = useMemo(
    () => ({
      initial: { opacity: 0, x: prefersMotionReduction ? 0 : 40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: prefersMotionReduction ? 0 : -32 },
    }),
    [prefersMotionReduction]
  );

  const sectionTransition = useMemo(
    () =>
      prefersMotionReduction
        ? { duration: 0.18, ease: "linear" as const }
        : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
    [prefersMotionReduction]
  );

  const getFieldError = (field: keyof FormState) =>
    activeErrorField === field ? fieldErrors[field] : null;

  const firstNameError = getFieldError("firstName");
  const lastNameError = getFieldError("lastName");
  const phoneError = getFieldError("phone");
  const socialError = getFieldError("social");
  const cityError = getFieldError("city");
  const streetError = getFieldError("street");
  const houseError = getFieldError("house");
  const apartmentError = getFieldError("apartment");
  const dateError = getFieldError("date");
  const commentError = getFieldError("comment");

  return (
    <Sheet open={isBasketOpen} onOpenChange={setIsBasketOpen}>
      <SheetTrigger asChild>
        <Button className="relative group bg-yellowPrimary" variant="default">
          <span className="text-[12px] text-greenPrimary font-bold whitespace-nowrap">
            <AnimatedAmount value={totalLabel} durationMs={200} />
          </span>
          <span className="w-[1px] h-[50%] bg-greenPrimary/50" aria-hidden />
          <div className="grid grid-cols-2-auto gap-2 items-center md:group-hover:opacity-0 transition-opacity text-greenPrimary">
            <ShoppingBasket size={10} />
          </div>
          <ChevronRight
            size={18}
            strokeWidth={2}
            className="absolute right-3 transition duration-300 -translate-x-2 opacity-0 md:group-hover:opacity-100 group-hover:translate-x-0 text-greenPrimary"
          />
        </Button>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        className="shadow-none border-none md:border-l-[2px] border-grey-border p-0 overflow-hidden"
      >
        <LazyMotion features={domAnimation}>
          <div className="flex h-full flex-col pt-[55px] md:pt-0">
            <SheetHeader className="relative px-4 md:px-5 pb-4 md:pt-4 p ">
              <div className="relative flex items-center justify-between">
                <SheetTitle className="flex w-full items-center  gap-2 text-center text-[20px] md:text-[24px] font-bold text-greenPrimary md:w-auto md:justify-start md:text-left">
                  <ShoppingBasket className="text-yellowPrimary w-5 h-7 md:w-7 md:h-7" />
                  <p>{isCheckout ? "Оформление заказа" : "Корзина"}</p>
                </SheetTitle>

                <button
                  type="button"
                  onClick={() => {
                    if (isCheckout) {
                      setIsCheckout(false);
                      setIsConsentGiven(false);
                      return;
                    }
                    setIsBasketOpen(false);
                  }}
                  className=" bg-greyPrimary grid md:p-2 rounded-sm group cursor-pointer"
                  aria-label={
                    isCheckout ? "Вернуться к корзине" : "Закрыть корзину"
                  }
                >
                  <span className="inline-flex">
                    {isCheckout ? (
                      <>
                        <ChevronLeft className="h-4 w-4 hidden md:block text-greenPrimary transition-colors group-hover:text-yellow-hover" />
                        <p className="text-[13px] md:hidden pl-2 pr-3 py-1 text-greenPrimary font-bold flex  items-center">
                          <ChevronLeft size={14} />
                          Назад
                        </p>
                      </>
                    ) : (
                      <>
                        <XIcon className="h-4 w-4 hidden md:block text-greenPrimary transition-colors group-hover:text-yellow-hover" />
                        <p className="text-[13px]  font-bold md:hidden px-3 py-1 text-greenPrimary">
                          Закрыть
                        </p>
                      </>
                    )}
                  </span>
                </button>
              </div>
            </SheetHeader>

            <AnimatePresence mode="wait" initial={false}>
              {!isCheckout ? (
                <m.section
                  key="basket-view"
                  variants={basketSectionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={sectionTransition}
                  className="flex-1 overflow-y-auto px-6"
                  style={{
                    willChange: prefersMotionReduction
                      ? undefined
                      : "transform",
                  }}
                >
                  {sortedItems.length === 0 ? (
                    <BasketEmpty />
                  ) : (
                    <ul className="grid gap-4 mt-0 md:mt-4 pb-6">
                      <AnimatePresence initial={false}>
                        {sortedItems.map((item) => (
                          <BasketItem
                            key={item.id}
                            item={item}
                            onRemove={removeItem}
                            onIncrement={handleIncrementDays}
                            onDecrement={handleDecrementDays}
                          />
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </m.section>
              ) : (
                <m.section
                  key="checkout-view"
                  variants={checkoutSectionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={sectionTransition}
                  className="flex-1 overflow-y-auto px-6 pt-1 md:pt-4"
                  style={{
                    willChange: prefersMotionReduction
                      ? undefined
                      : "transform",
                  }}
                >
                  <div className="mb-5">
                    <div className="max-w-xl space-y-6 text-greenPrimary">
                      <div className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-x-3 gap-y-5">
                          <div className="grid gap-2 relative">
                            <Label htmlFor="checkout-first-name">Имя</Label>
                            <Input
                              enterKeyHint="next"
                              inputMode="text"
                              id="checkout-first-name"
                              placeholder="Введите имя"
                              value={formData.firstName}
                              onChange={(e) =>
                                handleFieldChange("firstName", e.target.value)
                              }
                              aria-invalid={Boolean(firstNameError)}
                              aria-describedby={
                                firstNameError
                                  ? "checkout-first-name-error"
                                  : undefined
                              }
                              className={cn(
                                firstNameError &&
                                  "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
                              )}
                            />
                            {firstNameError && (
                              <p
                                id="checkout-first-name-error "
                                className="absolute -bottom-[17px] left-0 text-xs text-red-500"
                              >
                                {firstNameError}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-2 relative">
                            <Label htmlFor="checkout-last-name">Фамилия</Label>
                            <Input
                              enterKeyHint="next"
                              inputMode="text"
                              id="checkout-last-name"
                              placeholder="Введите фамилию"
                              value={formData.lastName}
                              onChange={(e) =>
                                handleFieldChange("lastName", e.target.value)
                              }
                              aria-invalid={Boolean(lastNameError)}
                              aria-describedby={
                                lastNameError
                                  ? "checkout-last-name-error"
                                  : undefined
                              }
                              className={cn(
                                lastNameError &&
                                  "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
                              )}
                            />
                            {lastNameError && (
                              <p
                                id="checkout-last-name-error"
                                className="absolute -bottom-[17px] left-0 text-xs text-red-500"
                              >
                                {lastNameError}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-2 relative">
                            <Label htmlFor="checkout-phone">Телефон</Label>
                            <Input
                              enterKeyHint="next"
                              inputMode="tel"
                              id="checkout-phone"
                              type="tel"
                              placeholder="+375 (__ ) ___-__-__"
                              value={formData.phone}
                              onChange={(e) =>
                                handleFieldChange("phone", e.target.value)
                              }
                              aria-invalid={Boolean(phoneError)}
                              aria-describedby={
                                phoneError ? "checkout-phone-error" : undefined
                              }
                              className={cn(
                                phoneError &&
                                  "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
                              )}
                            />
                            {phoneError && (
                              <p
                                id="checkout-phone-error"
                                className="absolute -bottom-[17px] left-0 text-xs text-red-500"
                              >
                                {phoneError}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-2">
                            <div className="flex items-center gap-2 relative">
                              <Label htmlFor="checkout-social">
                                Telegram / Instagram
                              </Label>
                              <TooltipProvider delayDuration={150}>
                                <Tooltip>
                                  <TooltipTrigger
                                    className="hidden md:block"
                                    asChild
                                  >
                                    <button
                                      type="button"
                                      aria-label="Подсказка по полю «Социальные сети»"
                                      className=" items-center text-greySecondary hover:text-greenPrimary"
                                    >
                                      <HelpCircle className="h-3 w-3" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    className="max-w-[280px] bg-whitePrimary text-greenPrimary text-[13px] shadow-sm"
                                    side="top"
                                    sideOffset={6}
                                  >
                                    Укажите ник в Telegram или Instagram — так
                                    нам будет проще связаться.
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>

                            <Input
                              enterKeyHint="done"
                              inputMode="text"
                              id="checkout-social"
                              placeholder="Введите ник @"
                              value={formData.social}
                              onChange={(e) =>
                                handleFieldChange("social", e.target.value)
                              }
                              aria-invalid={Boolean(socialError)}
                              aria-describedby={
                                socialError
                                  ? "checkout-social-error"
                                  : undefined
                              }
                              className={cn(
                                socialError &&
                                  "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
                              )}
                            />
                            {socialError && (
                              <p
                                id="checkout-social-error"
                                className="absolute -bottom-[17px] left-0 text-xs text-red-500"
                              >
                                {socialError}
                              </p>
                            )}
                            <p className="text-[12px] md:hidden text-greySecondary">
                              Укажите ник в Telegram или Instagram — так нам
                              будет проще связаться.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mt-6">
                        <h3 className="text-greenPrimary font-bold text-[18px]">
                          Адрес доставки
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="grid gap-2 relative">
                            <Label htmlFor="checkout-city">Город</Label>
                            <Select
                              value={formData.city}
                              onValueChange={(value) =>
                                handleFieldChange("city", value)
                              }
                            >
                              <SelectTrigger
                                id="checkout-city"
                                className={cn(
                                  "w-full text-greenPrimary",
                                  cityError &&
                                    "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
                                )}
                                aria-invalid={Boolean(cityError)}
                                aria-describedby={
                                  cityError ? "checkout-city-error" : undefined
                                }
                              >
                                <SelectValue placeholder="Выберите город" />
                              </SelectTrigger>
                              <SelectContent className="text-greenPrimary">
                                {CITIES.map((city) => (
                                  <SelectItem
                                    key={city.value}
                                    value={city.value}
                                  >
                                    {city.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {cityError && (
                              <p
                                id="checkout-city-error"
                                className="absolute -bottom-[17px] left-0 text-xs text-red-500"
                              >
                                {cityError}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-2 relative">
                            <Label htmlFor="checkout-street">Улица</Label>
                            <Input
                              enterKeyHint="next"
                              inputMode="text"
                              id="checkout-street"
                              placeholder="Ул."
                              value={formData.street}
                              onChange={(e) =>
                                handleFieldChange("street", e.target.value)
                              }
                              aria-invalid={Boolean(streetError)}
                              aria-describedby={
                                streetError
                                  ? "checkout-street-error"
                                  : undefined
                              }
                              className={cn(
                                streetError &&
                                  "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
                              )}
                            />
                            {streetError && (
                              <p
                                id="checkout-street-error"
                                className="absolute -bottom-[17px] left-0 text-xs text-red-500"
                              >
                                {streetError}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-2 relative">
                            <Label htmlFor="checkout-house">Дом</Label>
                            <Input
                              enterKeyHint="next"
                              inputMode="text"
                              id="checkout-house"
                              placeholder="№"
                              value={formData.house}
                              onChange={(e) =>
                                handleFieldChange("house", e.target.value)
                              }
                              aria-invalid={Boolean(houseError)}
                              aria-describedby={
                                houseError ? "checkout-house-error" : undefined
                              }
                              className={cn(
                                houseError &&
                                  "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
                              )}
                            />
                            {houseError && (
                              <p
                                id="checkout-house-error"
                                className="absolute -bottom-[17px] left-0 text-xs text-red-500"
                              >
                                {houseError}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-2 relative">
                            <Label htmlFor="checkout-apartment">Квартира</Label>
                            <Input
                              enterKeyHint="done"
                              inputMode="numeric"
                              placeholder="Кв."
                              id="checkout-apartment"
                              value={formData.apartment}
                              onChange={(e) =>
                                handleFieldChange("apartment", e.target.value)
                              }
                              aria-invalid={Boolean(apartmentError)}
                              aria-describedby={
                                apartmentError
                                  ? "checkout-apartment-error"
                                  : undefined
                              }
                              className={cn(
                                apartmentError &&
                                  "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
                              )}
                            />
                            {apartmentError && (
                              <p
                                id="checkout-apartment-error"
                                className="absolute -bottom-[17px] left-0 text-xs text-red-500"
                              >
                                {apartmentError}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col gap-3">
                            <Label htmlFor="date" className="px-1">
                              Дата доставки
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  id="date"
                                  className={cn(
                                    "w-48 shadow-none justify-between font-normal",
                                    dateError &&
                                      "border-red-400 text-red-500 hover:bg-red-50/40 focus-visible:border-red-400 focus-visible:ring-red-400"
                                  )}
                                  aria-invalid={Boolean(dateError)}
                                  aria-describedby={
                                    dateError
                                      ? "checkout-date-error"
                                      : undefined
                                  }
                                >
                                  {formData.date
                                    ? formData.date.toLocaleDateString("ru-RU")
                                    : "Выбрать дату"}
                                  <CalendarDays />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto overflow-hidden p-0 z-[2000]"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={formData.date ?? undefined}
                                  captionLayout="label"
                                  onSelect={(nextDate) => {
                                    handleFieldChange("date", nextDate ?? null);
                                    setOpen(false);
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                            {dateError && (
                              <p
                                id="checkout-date-error"
                                className="text-xs text-red-500"
                              >
                                {dateError}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="checkout-comment">
                            Комментарий к заказу
                          </Label>
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Напишите ваш комментарий"
                              id="checkout-comment"
                              maxLength={200}
                              value={formData.comment}
                              onChange={(e) =>
                                handleFieldChange("comment", e.target.value)
                              }
                              aria-invalid={Boolean(commentError)}
                              aria-describedby={
                                commentError
                                  ? "checkout-comment-error"
                                  : undefined
                              }
                              className={cn(
                                commentError &&
                                  "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
                              )}
                            />
                            {commentError && (
                              <p
                                id="checkout-comment-error"
                                className="text-xs text-red-500"
                              >
                                {commentError}
                              </p>
                            )}
                            <div className="flex justify-end text-xs font-medium text-greySecondary">
                              <span>{formData.comment.length} / 200</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mt-6">
                        <div className="rounded-[8px]  bg-greyPrimary p-4">
                          <div className="flex items-center justify-start gap-2 text-greenPrimary">
                            <p className="text-[20px] font-bold">Итого:</p>
                            <p className="text-[20px] font-bold text-yellow-hover">
                              <AnimatedAmount
                                value={totalLabel}
                                durationMs={200}
                              />
                            </p>
                          </div>
                          {sortedItems.length > 0 && (
                            <ul className="mt-4 grid gap-4 ">
                              {sortedItems.map((item) => {
                                return (
                                  <li
                                    key={`summary-${item.id}`}
                                    className="rounded-[6px] text-sm text-greenPrimary border-b pb-2 border-input"
                                  >
                                    <div className="flex items-center justify-between gap-4 text-greenPrimary">
                                      <span className="font-semibold">
                                        Тариф {item.calories} ккал
                                      </span>
                                      <span className="font-semibold ">
                                        {item.selectedDays.length}{" "}
                                        {daysWord(item.selectedDays.length)}
                                      </span>
                                    </div>
                                    <p className="mt-1 text-xs text-greySecondary">
                                      {item.dishesCount} блюд в день
                                    </p>
                                  </li>
                                );
                              })}
                              <p className="text-[12px] text-yellow-hover">
                                <span className="text-red-400">*</span> оплата
                                производится наличными или картой при получении,
                                или через систему ЕРИП
                              </p>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </m.section>
              )}
            </AnimatePresence>

            <AnimatePresence mode="sync" initial={false}>
              {!isCheckout ? (
                <div className="px-6 py-4 bg-white shadow-sm shadow-greySecondary/70">
                  <div className="w-full grid gap-4">
                    <div className="flex items-center justify-start gap-2 text-greenPrimary">
                      <p className="text-[20px] font-bold">Итого:</p>
                      <p className="text-yellow-hover font-bold text-[20px]">
                        <AnimatedAmount value={totalLabel} durationMs={200} />
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="default"
                      className="w-full bg-yellowPrimary text-greenPrimary font-bold py-6 disabled:opacity-60 disabled:select-none"
                      disabled={itemCount === 0}
                      onClick={handleProceedToCheckout}
                    >
                      Перейти к оформлению
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-4 bg-white shadow-sm shadow-greySecondary/70">
                  <div className="grid gap-4">
                    <div className="flex gap-4">
                      <Switch
                        id="consent-switch"
                        checked={isConsentGiven}
                        onCheckedChange={setIsConsentGiven}
                      />
                      <label className="flex items-center gap-3 text-greenPrimary ">
                        <span className="text-sm font-semibold select-none text-greenPrimary">
                          Я согласен на обработку персональных данных
                        </span>
                      </label>
                    </div>

                    <Button
                      type="button"
                      variant="default"
                      disabled={!isConsentGiven}
                      className={cn(
                        "w-full py-6 font-bold transition-colors",
                        !isConsentGiven &&
                          "bg-greyPrimary text-greySecondary disabled:opacity-100 disabled:cursor-not-allowed",
                        isConsentGiven && "bg-yellowPrimary text-greenPrimary"
                      )}
                      onClick={handleSubmit}
                    >
                      Оформить заказ
                    </Button>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </LazyMotion>
      </SheetContent>
    </Sheet>
  );
};
