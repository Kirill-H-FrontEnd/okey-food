"use client";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRight, ShoppingBag } from "lucide-react";
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
import { usePathname } from "next/navigation";

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
import { useAdminStore } from "@/store/useAdminStore";
import { BasketItem } from "./_components/basket-item";
import { BasketEmpty } from "./_components/basket-empty";
import { BasketFooter } from "./_components/basket-footer";
import { BasketHeader } from "./_components/basket-header";
import { CheckoutFooter } from "./_components/checkout-footer";
import { CheckoutForm } from "./_components/checkout-form";
import { CheckoutSummary } from "./_components/checkout-summary";
import { SuccessOrderDialog } from "./_components/success-order-dialog";

import type {
  CheckoutFormField,
  CityOption,
  DeliverySlotItem,
  SuccessOrderSnapshot,
} from "./types";

const CITIES: CityOption[] = [{ value: "Минск", label: "Минск" }];

const FIELD_ID_MAP: Record<CheckoutFormField, string> = {
  firstName: "checkout-first-name",
  phone: "checkout-phone",
  social: "checkout-social",
  city: "checkout-city",
  street: "checkout-street",
  house: "checkout-house",
  apartment: "checkout-apartment",
  floor: "checkout-floor",
  intercom: "checkout-intercom",
  comment: "checkout-comment",
};

const FIELD_ORDER: CheckoutFormField[] = [
  "firstName",
  "phone",
  "social",
  "city",
  "street",
  "house",
  "apartment",
  "floor",
  "intercom",
  "comment",
];

type CheckoutFormValues = CheckoutFormData;
const createInitialFormValues = (): Partial<CheckoutFormValues> => ({
  firstName: "",
  phone: "",
  social: "",
  city: "Минск",
  street: "",
  house: "",
  apartment: "",
  floor: "",
  intercom: "",
  comment: "",
});

export const Basket: FC = () => {
  const pathname = usePathname();
  const isBasketOpen = useBasketStore((s) => s.isBasketOpen);
  const setIsBasketOpen = useBasketStore((s) => s.setIsBasketOpen);
  const items = useBasketStore((s) => s.items);
  const updateItem = useBasketStore((s) => s.updateItem);
  const removeItem = useBasketStore((s) => s.removeItem);
  const addOrder = useAdminStore((s) => s.addOrder);
  const rations = useAdminStore((s) => s.rations);

  const prefersReducedMotion = useReducedMotion();

  const [isCheckout, setIsCheckout] = useState(false);
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  const [successOrder, setSuccessOrder] = useState<SuccessOrderSnapshot | null>(
    null,
  );

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
    setIsBasketOpen(false);
    setIsCheckout(false);
    resetFormState();
  }, [pathname, resetFormState, setIsBasketOpen]);

  useEffect(() => {
    if (sortedItems.length === 0) {
      setIsCheckout(false);
      resetFormState();
    }
  }, [sortedItems.length, resetFormState]);

  const handleDaysChange = useCallback(
    (id: string, days: string[]) => {
      updateItem(id, (prev) => ({
        ...prev,
        selectedDays: days.sort(),
      }));
    },
    [updateItem],
  );

  const handleNoteChange = useCallback(
    (id: string, note: string) => {
      updateItem(id, (prev) => ({ ...prev, note }));
    },
    [updateItem],
  );

  const handleProceedToCheckout = () => {
    if (itemCount === 0) return;
    const missingDays = sortedItems.some(
      (item) => item.selectedDays.length === 0,
    );
    if (missingDays) {
      toast.error("Выберите даты доставки для всех рационов");
      return;
    }
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

  const handleCloseSuccessDialog = () => {
    setSuccessOrder(null);
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    const derivedSlots: DeliverySlotItem[] = sortedItems.map((item) => ({
      rationCalories: item.calories,
      rationName:
        rations.find((r) => r.calories === item.calories)?.name ??
        `Рацион ${item.calories} ккал`,
      days: item.selectedDays,
      range: item.range,
      timeSlot: "8-10" as const,
    }));

    try {
      for (const item of sortedItems) {
        const rationName =
          rations.find((r) => r.calories === item.calories)?.name ??
          `Рацион ${item.calories} ккал`;

        const slotForItem = derivedSlots.find(
          (s) => s.rationCalories === item.calories,
        );

        await addOrder({
          customerName: data.firstName.trim(),
          phone: data.phone,
          ration: rationName,
          days: item.selectedDays.length,
          amount: item.pricePerDay * item.selectedDays.length,
          status: "pending",
          notes: JSON.stringify({
            comment: data.comment ?? "",
            social: data.social ?? "",
            city: data.city,
            street: data.street,
            house: data.house,
            apartment: data.apartment,
            floor: data.floor,
            intercom: data.intercom ?? "",
            deliverySlots: slotForItem ? [slotForItem] : derivedSlots,
          }),
        });
      }
    } catch {
      toast.error("Не удалось сохранить заказ. Попробуйте ещё раз.");
      return;
    }
    setSuccessOrder({
      customer: {
        firstName: data.firstName,
        phone: data.phone,
        city: data.city ?? "",
        social: data.social ?? "",
        street: data.street ?? "",
        house: data.house ?? "",
        apartment: data.apartment ?? "",
        floor: data.floor ?? "",
        intercom: data.intercom ?? "",
      },
      items: sortedItems,
      deliverySlots: derivedSlots,
      totalPrice,
    });
    setIsBasketOpen(false);
    setIsCheckout(false);
    setIsConsentGiven(false);
    form.reset(createInitialFormValues());
    form.clearErrors();
    useBasketStore.getState().clear();
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
    <>
      <Sheet open={isBasketOpen} onOpenChange={setIsBasketOpen}>
        <SheetTrigger asChild>
          <Button className="relative group bg-yellowPrimary" variant="default">
            <span className="text-[12px] text-colorPrimary font-bold whitespace-nowrap">
              <AnimatedAmount value={totalLabel} durationMs={300} />
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
          className="shadow-none p-0 overflow-hidden bg-whitePrimary border-none "
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
                      <ul className="grid gap-4 mt-0 md:mt-4 pb-6">
                        <AnimatePresence initial={false} mode="popLayout">
                          {sortedItems.map((item) => (
                            <BasketItem
                              key={item.id}
                              item={item}
                              onRemove={removeItem}
                              onDaysChange={handleDaysChange}
                              onNoteChange={handleNoteChange}
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
                    <div className="mb-5 space-y-6">
                      <FormProvider {...form}>
                        <CheckoutForm cityOptions={CITIES} />
                      </FormProvider>

                      <CheckoutSummary
                        items={sortedItems}
                        totalLabel={totalLabel}
                      />
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
                    isSubmitting={form.formState.isSubmitting}
                  />
                )}
              </AnimatePresence>
            </div>
          </LazyMotion>
        </SheetContent>
      </Sheet>

      <SuccessOrderDialog
        order={successOrder}
        onClose={handleCloseSuccessDialog}
      />
    </>
  );
};
