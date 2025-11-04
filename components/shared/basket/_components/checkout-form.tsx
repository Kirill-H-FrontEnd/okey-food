import { FC, useMemo, useState } from "react";
import { CalendarDays, HelpCircle } from "lucide-react";

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

import type {
  CheckoutFormField,
  CheckoutFormState,
  CityOption,
} from "../types";

type CheckoutFormProps = {
  formData: CheckoutFormState;
  highlightedField: CheckoutFormField | null;
  onFieldChange: <K extends CheckoutFormField>(
    field: K,
    value: CheckoutFormState[K]
  ) => void;
  cityOptions: CityOption[];
};

export const CheckoutForm: FC<CheckoutFormProps> = ({
  formData,
  highlightedField,
  onFieldChange,
  cityOptions,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const commentLength = useMemo(
    () => formData.comment.length,
    [formData.comment]
  );

  const handleDateSelect = (value: Date | undefined) => {
    onFieldChange("date", value ?? null);
    setIsCalendarOpen(false);
  };

  const withErrorStyles = (field: CheckoutFormField) =>
    highlightedField === field
      ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
      : undefined;

  return (
    <div className="max-w-xl space-y-6 text-greenPrimary">
      <div className="space-y-3">
        <div className="grid md:grid-cols-2 gap-x-3 gap-y-5">
          <div className="grid gap-2">
            <Label htmlFor="checkout-first-name">Имя</Label>
            <Input
              enterKeyHint="next"
              inputMode="text"
              id="checkout-first-name"
              placeholder="Введите имя"
              value={formData.firstName}
              onChange={(event) =>
                onFieldChange("firstName", event.target.value)
              }
              aria-invalid={highlightedField === "firstName"}
              className={cn(withErrorStyles("firstName"))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="checkout-last-name">Фамилия</Label>
            <Input
              enterKeyHint="next"
              inputMode="text"
              id="checkout-last-name"
              placeholder="Введите фамилию"
              value={formData.lastName}
              onChange={(event) =>
                onFieldChange("lastName", event.target.value)
              }
              aria-invalid={highlightedField === "lastName"}
              className={cn(withErrorStyles("lastName"))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="checkout-phone">Телефон</Label>
            <Input
              enterKeyHint="next"
              inputMode="tel"
              id="checkout-phone"
              type="tel"
              placeholder="+375 (__ ) ___-__-__"
              value={formData.phone}
              onChange={(event) => onFieldChange("phone", event.target.value)}
              aria-invalid={highlightedField === "phone"}
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
              enterKeyHint="done"
              inputMode="text"
              id="checkout-social"
              placeholder="Введите ник @"
              value={formData.social}
              onChange={(event) => onFieldChange("social", event.target.value)}
            />
            <p className="text-[12px] md:hidden text-greySecondary">
              Укажите ник в Telegram или Instagram — так нам будет проще
              связаться.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="checkout-city">Город</Label>
            <Select
              value={formData.city}
              onValueChange={(value) => onFieldChange("city", value)}
            >
              <SelectTrigger
                id="checkout-city"
                aria-invalid={highlightedField === "city"}
                className={cn(withErrorStyles("city"))}
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="checkout-street">Улица</Label>
            <Input
              enterKeyHint="next"
              inputMode="text"
              id="checkout-street"
              placeholder="Введите улицу"
              value={formData.street}
              onChange={(event) => onFieldChange("street", event.target.value)}
              aria-invalid={highlightedField === "street"}
              className={cn(withErrorStyles("street"))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="checkout-house">Дом</Label>
            <Input
              enterKeyHint="next"
              inputMode="text"
              id="checkout-house"
              placeholder="Введите номер дома"
              value={formData.house}
              onChange={(event) => onFieldChange("house", event.target.value)}
              aria-invalid={highlightedField === "house"}
              className={cn(withErrorStyles("house"))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="checkout-apartment">Квартира</Label>
            <Input
              enterKeyHint="next"
              inputMode="text"
              id="checkout-apartment"
              placeholder="Введите номер квартиры"
              value={formData.apartment}
              onChange={(event) =>
                onFieldChange("apartment", event.target.value)
              }
              aria-invalid={highlightedField === "apartment"}
              className={cn(withErrorStyles("apartment"))}
            />
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="checkout-date" className="px-1">
              Дата доставки
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="checkout-date"
                  className={cn(
                    "w-48 shadow-none justify-between font-normal",
                    withErrorStyles("date"),
                    highlightedField === "date" &&
                      "text-red-500 hover:bg-red-50/40 focus-visible:ring-red-400"
                  )}
                  aria-invalid={highlightedField === "date"}
                >
                  {formData.date
                    ? formData.date.toLocaleDateString("ru-RU")
                    : "Выбрать дату"}
                  <CalendarDays
                    className={`${isCalendarOpen ? "text-yellow-hover" : ""}`}
                  />
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
                  onSelect={handleDateSelect}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid gap-2 mt-5">
          <Label htmlFor="checkout-comment">Комментарий к заказу</Label>
          <div className="space-y-2">
            <Textarea
              placeholder="Напишите ваш комментарий"
              id="checkout-comment"
              maxLength={200}
              value={formData.comment}
              onChange={(event) => onFieldChange("comment", event.target.value)}
              aria-invalid={highlightedField === "comment"}
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
