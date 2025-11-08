import { FC, useState } from "react";
import { CalendarDays, HelpCircle } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
    <div className=" space-y-6 text-greenPrimary">
      <div className="space-y-3">
        <div className="grid ">
          <div className="grid md:grid-cols-2 gap-4 mb-[16px]">
            <div className="grid gap-2">
              <Label htmlFor="checkout-first-name">Имя</Label>
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
              <Label htmlFor="checkout-last-name">Фамилия</Label>
              <Input
                {...register("lastName")}
                enterKeyHint="next"
                inputMode="text"
                id="checkout-last-name"
                placeholder="Введите фамилию"
                aria-invalid={fieldHasError("lastName")}
                className={cn(withErrorStyles("lastName"))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="checkout-phone">Телефон</Label>
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

            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="checkout-social">Telegram / Instagram</Label>
                <TooltipProvider delayDuration={150}>
                  <Tooltip>
                    <TooltipTrigger className="hidden md:block" asChild>
                      <button
                        type="button"
                        aria-label="Подсказка по полю «Социальные сети»"
                        className="items-center text-greySecondary hover:text-greenPrimary"
                      >
                        <HelpCircle className="h-3 w-3" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      className="max-w-[280px] bg-whitePrimary text-greenPrimary text-[13px] shadow-sm"
                      side="top"
                      sideOffset={6}
                    >
                      Укажите ник в Telegram или Instagram — так нам будет проще
                      связаться.
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
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="grid gap-2">
                <Label htmlFor="checkout-city">Город</Label>
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(value) => {
                        field.onChange(value);
                        field.onBlur();
                      }}
                    >
                      <SelectTrigger
                        id="checkout-city"
                        aria-invalid={fieldHasError("city")}
                        className={cn(withErrorStyles("city"), "w-full")}
                      >
                        <SelectValue placeholder="Выберите город" />
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
                <Label htmlFor="checkout-street">Улица</Label>
                <Input
                  {...register("street")}
                  enterKeyHint="next"
                  inputMode="text"
                  id="checkout-street"
                  placeholder="Введите улицу"
                  aria-invalid={fieldHasError("street")}
                  className={cn(withErrorStyles("street"))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="checkout-house">Дом</Label>
                <Input
                  {...register("house")}
                  enterKeyHint="next"
                  inputMode="text"
                  id="checkout-house"
                  placeholder="Номер дома"
                  aria-invalid={fieldHasError("house")}
                  className={cn(withErrorStyles("house"))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="checkout-apartment">Квартира</Label>
                <Input
                  {...register("apartment")}
                  enterKeyHint="next"
                  inputMode="text"
                  id="checkout-apartment"
                  placeholder="№ "
                  aria-invalid={fieldHasError("apartment")}
                  className={cn(withErrorStyles("apartment"))}
                />
              </div>
            </div>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <div className="flex flex-col gap-3">
                  <Label htmlFor="checkout-date" className="px-1">
                    Дата доставки
                  </Label>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="checkout-date"
                        onBlur={field.onBlur}
                        className={cn(
                          "w-48 shadow-none justify-between font-normal",
                          withErrorStyles("date"),
                          fieldHasError("date") &&
                            "text-red-500 hover:bg-red-50/40 focus-visible:ring-red-400"
                        )}
                        aria-invalid={fieldHasError("date")}
                      >
                        {field.value
                          ? field.value.toLocaleDateString("ru-RU")
                          : "Выбрать дату"}
                        <CalendarDays
                          className={
                            isCalendarOpen ? "text-yellow-hover" : undefined
                          }
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0 z-[2000]"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        captionLayout="label"
                        onSelect={(value) => {
                          field.onChange(value ?? null);
                          setIsCalendarOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            />
          </div>
        </div>

        <div className="grid gap-2 mt-5">
          <Label htmlFor="checkout-comment">Комментарий к заказу</Label>
          <div className="space-y-2">
            <Textarea
              {...register("comment")}
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
