"use client";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  MessageCircleWarning,
  ShoppingBasket,
} from "lucide-react";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
} from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AnimatedAmount } from "@/components/magicui/animated-amount";
import { checkoutSchema } from "@/schemas/checkout-schema";
import { useBasketStore } from "@/store/useStore";
import { BasketItem } from "./_components/basket-item";
import { BasketEmpty } from "./_components/basket-empty";
import { BasketFooter } from "./_components/basket-footer";
import { BasketHeader } from "./_components/basket-header";
import { CheckoutFooter } from "./_components/checkout-footer";
import { CheckoutForm } from "./_components/checkout-form";
import { CheckoutSummary } from "./_components/checkout-summary";
import { listSelectableDays } from "@/lib/delivery-days";
import { cn } from "@/lib/utils";

import type { CheckoutFormField, CheckoutFormState, CityOption } from "./types";

type ActiveError = {
  field: CheckoutFormField;
  message: string;
};

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

const createInitialFormState = (): CheckoutFormState => ({
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

export const Basket: FC = () => {
  const isBasketOpen = useBasketStore((s) => s.isBasketOpen);
  const setIsBasketOpen = useBasketStore((s) => s.setIsBasketOpen);
  const items = useBasketStore((s) => s.items);
  const updateItem = useBasketStore((s) => s.updateItem);
  const removeItem = useBasketStore((s) => s.removeItem);

  const prefersReducedMotion = useReducedMotion();

  const [isCheckout, setIsCheckout] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormState>(() =>
    createInitialFormState()
  );
  const [activeError, setActiveError] = useState<ActiveError | null>(null);

  const handleCloseBasket = useCallback(() => {
    setIsBasketOpen(false);
  }, [setIsBasketOpen]);

  const handleReturnToBasket = useCallback(() => {
    setIsCheckout(false);
    setIsConsentGiven(false);
    setActiveError(null);
  }, [setIsCheckout, setIsConsentGiven]);

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
    setActiveError(null);
    setIsConsentGiven(false);
  }, []);

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

  const validateForm = useCallback((state: CheckoutFormState) => {
    const parsed = checkoutSchema.safeParse(state);
    if (parsed.success) {
      return { valid: true as const, data: parsed.data };
    }

    const firstIssue = parsed.error.issues.find(
      (issue) => typeof issue.path[0] === "string"
    );

    if (!firstIssue) {
      return { valid: false as const, error: null };
    }

    return {
      valid: false as const,
      error: {
        field: firstIssue.path[0] as CheckoutFormField,
        message: firstIssue.message,
      },
    };
  }, []);

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
    setActiveError(null);
  };

  const handleFieldChange = <K extends CheckoutFormField>(
    field: K,
    value: CheckoutFormState[K]
  ) => {
    const nextState = {
      ...formData,
      [field]: value,
    } as CheckoutFormState;

    setFormData(nextState);
    setActiveError((current) => {
      if (!current || current.field !== field) return current;

      const validation = checkoutSchema.safeParse(nextState);
      if (validation.success) {
        return null;
      }

      const issueForField = validation.error.issues.find(
        (issue) => issue.path[0] === field
      );

      if (!issueForField) {
        return null;
      }

      if (issueForField.message === current.message) {
        return current;
      }

      return { field, message: issueForField.message };
    });
  };

  const handleSubmit = () => {
    const validation = validateForm(formData);

    if (!validation.valid) {
      if (validation.error) {
        setActiveError(validation.error);
        // toast.error(`${validation.error.message}`);
        toast("", {
          description: validation.error.message,
          duration: 3000,
          icon: <MessageCircleWarning className="size-4 text-red-500" />,
          position: `top-center`,
          classNames: {
            content: " ml-0 ",
            description: " text-[14px] text-red-400 ",
            toast: "bg-red-500",
            default: "bg-red-500",
          },
        });

        const fieldId = FIELD_ID_MAP[validation.error.field];
        if (fieldId) {
          requestAnimationFrame(() => {
            const element = document.getElementById(fieldId);
            if (element instanceof HTMLElement) {
              element.focus();
            }
          });
        }
      }
      return;
    }

    setActiveError(null);

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

  const highlightedField = activeError?.field ?? null;

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
            className="absolute right-3 transition duration-300 -translate-x-1 opacity-0 md:group-hover:opacity-100 group-hover:translate-x-0 text-greenPrimary"
          />
        </Button>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        className="shadow-none border-none md:border-l-[2px] border-grey-border p-0 overflow-hidden"
      >
        <LazyMotion features={domAnimation}>
          <div className="flex h-full flex-col pt-[55px] md:pt-0">
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
                  className="flex-1 overflow-y-auto px-5 pt-1 md:pt-4"
                  style={{
                    willChange: prefersMotionReduction
                      ? undefined
                      : "transform",
                  }}
                >
                  <div className="mb-5">
                    <div className="max-w-xl space-y-6 text-greenPrimary">
                      <CheckoutForm
                        formData={formData}
                        highlightedField={highlightedField}
                        onFieldChange={handleFieldChange}
                        cityOptions={CITIES}
                      />
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
