"use client";
import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import {
  Controller,
  type FieldError,
  type Resolver,
  type SubmitErrorHandler,
  useForm,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  contactBannerSchema,
  type ContactBannerFormData,
} from "@/schemas/contact-banner-schema";
import { cn } from "@/lib/utils";
import { useBasketStore } from "@/store/useStore";
import { useAdminStore } from "@/store/useAdminStore";
import { getTotalPrice } from "@/lib/pricing";

export const FormBanner: FC = () => {
  const basketItems = useBasketStore((state) => state.items);
  const clearBasket = useBasketStore((state) => state.clear);
  const addOrder = useAdminStore((state) => state.addOrder);
  const rations = useAdminStore((state) => state.rations);

  const contactResolver: Resolver<ContactBannerFormData> = async (values) => {
    const parsed = contactBannerSchema.safeParse(values);

    if (parsed.success) {
      return { values: parsed.data, errors: {} };
    }

    const firstIssue = parsed.error.issues[0];
    if (!firstIssue) {
      return { values: {}, errors: {} };
    }

    const path = firstIssue.path[0];
    if (typeof path !== "string") {
      return { values: {}, errors: {} };
    }

    return {
      values: {},
      errors: {
        [path]: {
          type: firstIssue.code,
          message: firstIssue.message,
        },
      } as Record<string, FieldError>,
    };
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactBannerFormData>({
    resolver: contactResolver,
    shouldFocusError: false,
    defaultValues: {
      name: "",
      phone: "",
      accepted: false,
    },
  });

  const accepted = watch("accepted");

  const fieldHasError = (field: keyof ContactBannerFormData) =>
    Boolean(errors[field]);

  const withErrorStyles = (field: keyof ContactBannerFormData) =>
    fieldHasError(field)
      ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
      : undefined;

  const onSubmitError: SubmitErrorHandler<ContactBannerFormData> = (
    formErrors,
  ) => {
    const firstMessage = formErrors.name?.message ?? formErrors.phone?.message;
    if (firstMessage) {
      toast.error(firstMessage);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (basketItems.length > 0) {
        for (const item of basketItems) {
          const rationName =
            rations.find((r) => r.calories === item.calories)?.name ??
            `Рацион ${item.calories} ккал`;
          await addOrder({
            customerName: data.name,
            phone: data.phone,
            ration: rationName,
            days: item.selectedDays.length,
            amount: getTotalPrice(item.pricePerDay, item.selectedDays.length),
            status: "pending",
            notes: "",
          });
        }
        clearBasket();
      } else {
        await addOrder({
          customerName: data.name,
          phone: data.phone,
          ration: "Консультация",
          days: 0,
          amount: 0,
          status: "pending",
          notes: "",
        });
      }

      fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: data.name,
          phone: data.phone,
          hasBasket: basketItems.length > 0,
        }),
      }).catch((err) => console.error("[Telegram notify] contact:", err));

      toast.success(
        `Спасибо ${data.name}! Мы свяжемся с вами в ближайшее время.`,
      );
      reset({ name: "", phone: "", accepted: false });
    } catch {
      toast.error("Ошибка при отправке заявки. Попробуйте ещё раз.");
    }
  }, onSubmitError);

  return (
    <form onSubmit={onSubmit} className="m-auto mt-6 grid max-w-[450px] gap-4">
      <div className="grid gap-2 text-black md:flex">
        <Input
          {...register("name")}
          placeholder="Имя"
          aria-invalid={fieldHasError("name")}
          className={cn("h-[40px] bg-whiteSecondary", withErrorStyles("name"))}
        />
        <Input
          {...register("phone")}
          placeholder="Номер телефона"
          inputMode="tel"
          type="tel"
          aria-invalid={fieldHasError("phone")}
          className={cn("h-[40px] bg-whiteSecondary", withErrorStyles("phone"))}
        />
      </div>

      <div className="flex items-center justify-start gap-2 text-greySecondary">
        <Controller
          name="accepted"
          control={control}
          render={({ field }) => (
            <Switch
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              className={cn(
                "mt-0.5",
                fieldHasError("accepted") && "ring-1 ring-red-400",
              )}
            />
          )}
        />
        <p className="block text-left text-[12px] leading-snug">
          Ознакомьтесь с{" "}
          <Link
            href="/privacy"
            className="text-yellow-hover hover:opacity-80 md:inline-block md:text-left"
          >
            политикой конфиденциальности.
          </Link>
        </p>
      </div>

      <Button
        type="submit"
        disabled={!accepted || isSubmitting}
        className="w-full bg-yellowPrimary py-6 font-bold text-colorPrimary disabled:cursor-not-allowed disabled:opacity-50"
        variant="default"
      >
        {isSubmitting ? "Отправка..." : "Связаться с нами"}
      </Button>

      <p className="text-sm text-whitePrimary">
        Обычно мы перезваниваем в течение 15 минут
      </p>
    </form>
  );
};
