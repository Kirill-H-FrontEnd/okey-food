// components/ui/product-card.tsx
"use client";

import { FC } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type TProduct = {
  id: string;
  name: string;
  image: string;
  calories: number;
  weight: number;
  proteins: number;
  fats: number;
  carbs: number;
  description?: string;
  dietCalories: string;
  meal: "Завтрак" | "Второй завтрак" | "Обед" | "Полдник" | "Ужин" | "Перекус";
};

type TProductCardProps = {
  product: TProduct;
};

export const ProductCard: FC<TProductCardProps> = ({ product }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-greyPrimary rounded-[8px] shadow-xs cursor-pointer hover:shadow-md transition-shadow duration-200 p-4 w-full flex flex-col min-h-[340px]">
          <div className="w-full flex justify-center shrink-0">
            <Image
              src={product.image}
              alt={product.name}
              width={280}
              height={180}
              sizes="(max-width: 640px) 100vw, 280px"
              className="w-full sm:w-[280px] h-auto rounded-md object-contain mix-blend-multiply"
              quality={85}
              loading="lazy"
              priority={false}
            />
          </div>

          <div className="mt-4 flex flex-col flex-1">
            <div className="mb-4 min-h-[64px]">
              <h4 className="text-[18px] text-greenPrimary font-bold">
                {product.meal}
              </h4>
              <h5 className="text-greenPrimary font-medium leading-tight line-clamp-2">
                {product.name}
              </h5>
            </div>

            {/* 3) Низ: всегда видим, прижимается книзу, но не обрезается */}
            <div className="mt-auto text-sm text-greenPrimary">
              <div className="flex gap-2 flex-wrap items-center">
                <span>{product.calories} ккал</span>/
                <span>{product.weight} г</span>
              </div>
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[640px] md:max-w-[820px]">
        <div className="flex flex-col md:flex-row gap-10 items-center text-greenPrimary sm:py-6 sm:px-6">
          <div className="w-[300px] md:w-[300px]">
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={200}
              className="w-full h-auto rounded-md object-cover mix-blend-multiply"
            />
          </div>
          <div className="flex-1">
            <div className="mb-3">
              <div className="text-xs text-greySecondary ">{product.meal}</div>
              <h5 className="text-[24px] text-greenPrimary font-bold my-1">
                {product.name}
              </h5>
              <p className="text-sm text-greySecondary">
                Вес порции: {product.weight} г
              </p>
              <div className="mt-3 mb-6">
                <span className="text-greenPrimary font-bold">Состав:</span>{" "}
                {product.description} куриная грудка, йогуртовый соус, кинза,
                томат, огурец, паприка сладкая, соевый соус.
              </div>
            </div>

            <div className="flex justify-between sm:justify-start flex-wrap gap-5 text-center">
              <div className="grid text-greenPrimary font-semibold">
                {product.calories}{" "}
                <span className="text-greySecondary font-normal text-sm">
                  ккал
                </span>
              </div>
              <div className="grid text-greenPrimary font-semibold">
                {product.proteins}{" "}
                <span className="text-greySecondary font-normal text-sm">
                  Белки
                </span>
              </div>
              <div className="grid text-greenPrimary font-semibold">
                {product.fats}{" "}
                <span className="text-greySecondary font-normal text-sm">
                  Жиры
                </span>
              </div>
              <div className="grid text-greenPrimary font-semibold">
                {product.carbs}{" "}
                <span className="text-greySecondary font-normal text-sm">
                  Углеводы
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
