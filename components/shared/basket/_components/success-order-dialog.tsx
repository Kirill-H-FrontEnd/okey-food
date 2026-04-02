"use client";

import { FC } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { daysWord, formatDeliveryDate } from "../utils";

import type { SuccessOrderSnapshot } from "../types";
import Image from "next/image";

type SuccessOrderDialogProps = {
  order: SuccessOrderSnapshot | null;
  onClose: () => void;
};

export const SuccessOrderDialog: FC<SuccessOrderDialogProps> = ({
  order,
  onClose,
}) => (
  <Dialog open={Boolean(order)} onOpenChange={(open) => !open && onClose()}>
    <DialogContent
      showCloseButton={false}
      className="max-w-[560px] overflow-hidden rounded-3xl border-black/10 bg-whitePrimary p-0"
    >
      {order && (
        <div className="grid">
          <div className="relative flex flex-col items-center justify-center bg-gradient-to-b from-greenPrimary/20 via-yellowPrimary/10 to-transparent px-6 pb-8 pt-8 text-center">
            <Image
              width={200}
              height={200}
              alt=""
              src={"/images/illustrations/success_order.png"}
            />
            <DialogHeader className="mt-3 items-center text-center">
              <DialogTitle className="text-2xl font-extrabold text-colorPrimary">
                Заказ успешно оформлен
              </DialogTitle>
              <DialogDescription className="max-w-[360px] text-sm text-greySecondary">
                Спасибо за заказ! Мы скоро свяжемся с вами для подтверждения и
                уточнения деталей доставки.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="space-y-3 px-6 pb-6 text-sm text-colorPrimary">
            <div className="rounded-2xl border border-black/5 bg-whiteSecondary p-4">
              <p>
                <span className="font-semibold">Клиент:</span>{" "}
                {order.customer.firstName} {order.customer.lastName}
              </p>
              <p>
                <span className="font-semibold">Телефон:</span>{" "}
                {order.customer.phone}
              </p>
              {order.customer.date && (
                <p>
                  <span className="font-semibold">Дата доставки:</span>{" "}
                  {formatDeliveryDate(order.customer.date)}
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-black/5 bg-whiteSecondary p-4">
              <p className="font-semibold">Позиции: {order.items.length}</p>
              <ul className="mt-2 space-y-1 text-xs text-greySecondary">
                {order.items.map((item) => (
                  <li key={`success-${item.id}`}>
                    Тариф {item.calories} — {item.selectedDays.length}{" "}
                    {daysWord(item.selectedDays.length)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-yellowPrimary/25 bg-yellowPrimary/10 p-4">
              <span className="text-sm font-semibold text-colorPrimary">
                Итого к оплате
              </span>
              <span className="text-xl font-extrabold text-yellow-hover">
                {order.totalPrice} BYN
              </span>
            </div>

            <Button
              type="button"
              variant="default"
              className="w-full bg-yellowPrimary font-bold text-colorPrimary"
              onClick={onClose}
            >
              Понятно
            </Button>
          </div>
        </div>
      )}
    </DialogContent>
  </Dialog>
);
