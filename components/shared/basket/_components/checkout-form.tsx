import { FC } from "react";
import { HelpCircle } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import type { CheckoutFormField, CityOption } from "../types";
import type { CheckoutFormData } from "@/schemas/checkout-schema";

type CheckoutFormProps = {
  cityOptions: CityOption[];
};

export const CheckoutForm: FC<CheckoutFormProps> = ({ cityOptions }) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  const commentValue = watch("comment") ?? "";
  const commentLength = commentValue.length;

  const fieldHasError = (field: CheckoutFormField) =>
    Boolean(errors[field as keyof CheckoutFormData]);

  const withErrorStyles = (field: CheckoutFormField) =>
    fieldHasError(field)
      ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
      : undefined;

  return (
    <div className="space-y-6 text-primary">
      <div className="space-y-3">
        <div className="grid gap-4 md:grid-cols-2 mb-[16px]">
          <div className="grid gap-2">
            <Label>
              Имя<span className="text-red-400">*</span>
            </Label>
            <Input
              {...register("firstName")}
              enterKeyHint="next"
              inputMode="text"
              id="checkout-first-name"
              placeholder="Введите имя"
              aria-invalid={fieldHasError("firstName")}
              className={cn(withErrorStyles("firstName"))}
            />
          </div>

          <div className="grid gap-2">
            <Label>
              Телефон<span className="text-red-400">*</span>
            </Label>
            <Input
              {...register("phone")}
              enterKeyHint="next"
              inputMode="tel"
              id="checkout-phone"
              type="tel"
              placeholder="+375 (__ ) ___-__-__"
              aria-invalid={fieldHasError("phone")}
              className={cn(withErrorStyles("phone"))}
            />
          </div>

          <div className="grid gap-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <Label>Telegram / Instagram</Label>
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger className="hidden md:block" asChild>
                    <button
                      type="button"
                      aria-label="Подсказка по полю «Социальные сети»"
                      className="items-center text-greySecondary hover:text-primary"
                    >
                      <HelpCircle className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="max-w-[280px] bg-white text-primary text-[13px] shadow-sm"
                    side="top"
                    sideOffset={6}
                  >
                    Укажите ник в{" "}
                    <span className="text-yellow-hover">Telegram</span> или
                    <span className="text-yellow-hover"> Instagram</span> — так
                    нам будет проще связаться.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              {...register("social")}
              enterKeyHint="done"
              inputMode="text"
              id="checkout-social"
              placeholder="Введите ник @"
            />
            <p className="text-[12px] md:hidden text-greySecondary">
              Укажите ник в Telegram или Instagram — так нам будет проще
              связаться.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-colorPrimary">
            Адрес доставки
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="grid gap-2 min-w-0">
              <Label>
                Город<span className="text-red-400">*</span>
              </Label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <Select
                    defaultValue={cityOptions[0]?.value}
                    value={field.value || undefined}
                    onValueChange={(value) => {
                      field.onChange(value);
                      field.onBlur();
                    }}
                  >
                    <SelectTrigger
                      defaultValue={cityOptions[0]?.value}
                      id="checkout-city"
                      aria-invalid={fieldHasError("city")}
                      className={cn(withErrorStyles("city"), "w-full min-w-0 ")}
                    >
                      <SelectValue placeholder="Город" />
                    </SelectTrigger>
                    <SelectContent>
                      {cityOptions.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-2">
              <Label>
                Улица<span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("street")}
                enterKeyHint="next"
                inputMode="text"
                id="checkout-street"
                placeholder="Ул."
                aria-invalid={fieldHasError("street")}
                className={cn(withErrorStyles("street"))}
              />
            </div>

            <div className="grid gap-2">
              <Label>
                Дом<span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("house")}
                enterKeyHint="next"
                inputMode="text"
                id="checkout-house"
                placeholder="Дом"
                aria-invalid={fieldHasError("house")}
                className={cn(withErrorStyles("house"))}
              />
            </div>

            <div className="grid gap-2">
              <Label>
                Квартира<span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("apartment")}
                enterKeyHint="next"
                inputMode="numeric"
                id="checkout-apartment"
                placeholder="№ Кв."
                aria-invalid={fieldHasError("apartment")}
                className={cn(withErrorStyles("apartment"))}
              />
            </div>

            <div className="grid gap-2">
              <Label>
                Этаж<span className="text-red-400">*</span>
              </Label>
              <Input
                {...register("floor")}
                enterKeyHint="next"
                inputMode="numeric"
                id="checkout-floor"
                placeholder="Этаж"
                aria-invalid={fieldHasError("floor")}
                className={cn(withErrorStyles("floor"))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Домофон</Label>
              <Input
                {...register("intercom")}
                enterKeyHint="done"
                inputMode="text"
                id="checkout-intercom"
                placeholder="Код домофона"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2 mt-5">
          <Label htmlFor="checkout-comment">Комментарий к заказу</Label>
          <div className="space-y-2">
            <Textarea
              {...register("comment")}
              enterKeyHint="done"
              placeholder="Напишите ваш комментарий"
              id="checkout-comment"
              maxLength={200}
              aria-invalid={fieldHasError("comment")}
              className={cn(withErrorStyles("comment"))}
            />
            <div className="flex justify-end text-xs font-medium text-greySecondary">
              <span>{commentLength} / 200</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
