"use client";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, ShoppingBag, ShoppingBasket } from "lucide-react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";
import {
  FieldError,
  FormProvider,
  Resolver,
  SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AnimatedAmount } from "@/components/magicui/animated-amount";
import {
  checkoutSchema,
  type CheckoutFormData,
} from "@/schemas/checkout-schema";
import { useBasketStore } from "@/store/useStore";
import { BasketItem } from "./_components/basket-item";
import { BasketEmpty } from "./_components/basket-empty";
import { BasketFooter } from "./_components/basket-footer";
import { BasketHeader } from "./_components/basket-header";
import { CheckoutFooter } from "./_components/checkout-footer";
import { CheckoutForm } from "./_components/checkout-form";
import { CheckoutSummary } from "./_components/checkout-summary";
import { listSelectableDays } from "@/lib/delivery-days";

import type { CheckoutFormField, CityOption } from "./types";

const CITIES: CityOption[] = [
  { value: "minsk", label: "Минск" },
  { value: "brest", label: "Брест" },
  { value: "gomel", label: "Гомель" },
  { value: "vitebsk", label: "Витебск" },
];

const FIELD_ID_MAP: Record<CheckoutFormField, string> = {
  firstName: "checkout-first-name",
  lastName: "checkout-last-name",
  phone: "checkout-phone",
  social: "checkout-social",
  city: "checkout-city",
  street: "checkout-street",
  house: "checkout-house",
  apartment: "checkout-apartment",
  date: "checkout-date",
  comment: "checkout-comment",
};

const FIELD_ORDER: CheckoutFormField[] = [
  "firstName",
  "lastName",
  "phone",
  "social",
  "city",
  "street",
  "house",
  "apartment",
  "date",
  "comment",
];

type CheckoutFormValues = CheckoutFormData;

const createInitialFormValues = (): Partial<CheckoutFormValues> => ({
  firstName: "",
  lastName: "",
  phone: "",
  social: "",
  city: CITIES[0]?.value ?? "",
  street: "",
  house: "",
  apartment: "",
  date: undefined,
  comment: "",
});

export const Basket: FC = () => {
  const isBasketOpen = useBasketStore((s) => s.isBasketOpen);
  const setIsBasketOpen = useBasketStore((s) => s.setIsBasketOpen);
  const items = useBasketStore((s) => s.items);
  const updateItem = useBasketStore((s) => s.updateItem);
  const removeItem = useBasketStore((s) => s.removeItem);

  const prefersReducedMotion = useReducedMotion();

  const [isCheckout, setIsCheckout] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);

  const checkoutResolver: Resolver<CheckoutFormValues> = useCallback(
    async (values) => {
      const parsed = checkoutSchema.safeParse(values);
      if (parsed.success) {
        return { values: parsed.data, errors: {} };
      }

      const issues = parsed.error.issues;
      type Issue = (typeof issues)[number];

      const getFieldPosition = (field: CheckoutFormField) => {
        const index = FIELD_ORDER.indexOf(field);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
      };

      const firstIssue = issues
        .map((issue) => {
          const path = issue.path[0];
          if (typeof path !== "string") return null;
          return {
            field: path as CheckoutFormField,
            issue,
          };
        })
        .filter((entry): entry is { field: CheckoutFormField; issue: Issue } =>
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

  const form = useForm<CheckoutFormValues>({
    resolver: checkoutResolver,
    defaultValues: createInitialFormValues(),
    shouldFocusError: false,
  });

  const handleCloseBasket = useCallback(() => {
    setIsBasketOpen(false);
  }, [setIsBasketOpen]);

  const handleReturnToBasket = useCallback(() => {
    setIsCheckout(false);
    setIsConsentGiven(false);
    form.reset(createInitialFormValues());
    form.clearErrors();
  }, [form]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => Number(a.calories) - Number(b.calories)),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.pricePerDay * item.selectedDays.length,
        0,
      ),
    [items],
  );
  const totalLabel = totalPrice ? `${totalPrice} BYN` : "0 BYN";
  const itemCount = items.length;

  const resetFormState = useCallback(() => {
    form.reset(createInitialFormValues());
    form.clearErrors();
    setIsConsentGiven(false);
  }, [form]);

  useEffect(() => {
    if (!isBasketOpen) {
      setIsCheckout(false);
      resetFormState();
    }
  }, [isBasketOpen, resetFormState]);

  useEffect(() => {
    if (sortedItems.length === 0) {
      setIsCheckout(false);
      resetFormState();
    }
  }, [sortedItems.length, resetFormState]);

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
    form.clearErrors();
  };

  const scrollFieldIntoView = (field: CheckoutFormField) => {
    const fieldId = FIELD_ID_MAP[field];
    if (!fieldId) {
      return;
    }
    requestAnimationFrame(() => {
      const element = document.getElementById(fieldId);
      if (element instanceof HTMLElement) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  };

  const handleSubmitError: SubmitErrorHandler<CheckoutFormValues> = (
    errors,
  ) => {
    const entries = Object.entries(errors) as [
      CheckoutFormField,
      FieldError | undefined,
    ][];
    const firstErrorEntry =
      entries.find(([, error]) => Boolean(error?.message)) ?? entries[0];
    if (!firstErrorEntry) return;
    const [field, error] = firstErrorEntry;
    const message = error?.message ?? "Проверьте корректность данных";
    toast.error(message);
    scrollFieldIntoView(field);
  };

  const handleSubmit = form.handleSubmit((data) => {
    console.log("Checkout data", {
      ...data,
      consent: isConsentGiven,
      orderItems: sortedItems,
      totalPrice,
    });
  }, handleSubmitError);

  const prefersMotionReduction = Boolean(prefersReducedMotion);

  const basketSectionVariants = useMemo(
    () => ({
      initial: { opacity: 0, x: prefersMotionReduction ? 0 : 32 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: prefersMotionReduction ? 0 : -24 },
    }),
    [prefersMotionReduction],
  );

  const checkoutSectionVariants = useMemo(
    () => ({
      initial: { opacity: 0, x: prefersMotionReduction ? 0 : 40 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: prefersMotionReduction ? 0 : -32 },
    }),
    [prefersMotionReduction],
  );

  const sectionTransition = useMemo(
    () =>
      prefersMotionReduction
        ? { duration: 0.18, ease: "linear" as const }
        : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
    [prefersMotionReduction],
  );

  return (
    <Sheet open={isBasketOpen} onOpenChange={setIsBasketOpen}>
      <SheetTrigger asChild>
        <Button className="relative group bg-yellowPrimary" variant="default">
          <span className="text-[12px] text-colorPrimary font-bold whitespace-nowrap">
            <AnimatedAmount value={totalLabel} durationMs={200} />
          </span>
          <span className="w-[1px] h-[50%] bg-colorPrimary" aria-hidden />
          <div className="grid grid-cols-2-auto gap-2 items-center md:group-hover:opacity-0 transition-opacity text-colorPrimary">
            <ShoppingBag size={10} />
          </div>
          <ChevronRight
            size={18}
            strokeWidth={2}
            className="absolute right-3 transition duration-300 -translate-x-1 opacity-0 md:group-hover:opacity-100 group-hover:translate-x-0 text-colorPrimary"
          />
        </Button>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        className="shadow-none border-none md:border-l-[2px] border-grey-border p-0 overflow-hidden bg-whitePrimary"
      >
        <LazyMotion features={domAnimation}>
          <div className="flex h-full flex-col pt-[55px] md:pt-0 ">
            <SheetHeader className="relative ">
              <BasketHeader
                isCheckout={isCheckout}
                onClose={handleCloseBasket}
                onReturn={handleReturnToBasket}
              />
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
                  className="flex-1 overflow-y-auto px-5"
                  style={{
                    willChange: prefersMotionReduction
                      ? undefined
                      : "transform",
                  }}
                >
                  {sortedItems.length === 0 ? (
                    <BasketEmpty />
                  ) : (
                    <ul className="grid gap-4 mt-0 md:mt-4 pb-6 overflow-hidden">
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
                  className="flex-1 overflow-y-auto px-5 pt-1 md:pt-4"
                  style={{
                    willChange: prefersMotionReduction
                      ? undefined
                      : "transform",
                  }}
                >
                  <div className="mb-5">
                    <div className="w-full space-y-6 text-whiteSecondary">
                      <FormProvider {...form}>
                        <CheckoutForm cityOptions={CITIES} />
                      </FormProvider>
                      <CheckoutSummary
                        items={sortedItems}
                        totalLabel={totalLabel}
                      />
                    </div>
                  </div>
                </m.section>
              )}
            </AnimatePresence>

            <AnimatePresence mode="sync" initial={false}>
              {!isCheckout ? (
                <BasketFooter
                  key="basket-footer"
                  totalLabel={totalLabel}
                  disabled={itemCount === 0}
                  onProceed={handleProceedToCheckout}
                />
              ) : (
                <CheckoutFooter
                  key="checkout-footer"
                  isConsentGiven={isConsentGiven}
                  onConsentChange={setIsConsentGiven}
                  onSubmit={handleSubmit}
                />
              )}
            </AnimatePresence>
          </div>
        </LazyMotion>
      </SheetContent>
    </Sheet>
  );
};
