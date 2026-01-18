"use client";
import { FC, KeyboardEvent, useCallback } from "react";
import Image from "next/image";
import { TProduct } from "@/types/product-card-type";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";

type TProductCardProps = { product: TProduct };

export const ProductCard: FC<TProductCardProps> = ({ product }) => {
  const BLUR_14x9 =
    "data:image/svg+xml;base64," +
    btoa(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 14 9'>
         <rect width='14' height='9' fill='#f3f4f6'/>
       </svg>`,
    );

  const BLUR_3x2 =
    "data:image/svg+xml;base64," +
    btoa(
      `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 2'>
         <rect width='3' height='2' fill='#f3f4f6'/>
       </svg>`,
    );

  // Позволяем открывать диалог клавишами Enter/Space на div[role=button]
  const onKeyActivate = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // Radix передаёт onClick на child; синтетически триггерим "click"
      (e.currentTarget as HTMLDivElement).click();
    }
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          onKeyDown={onKeyActivate}
          className="bg-whiteSecondary rounded-[8px] shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 p-4 w-full h-full grid grid-rows-[auto_1fr_auto] min-h-[300px] sm:min-h-[340px]"
        >
          <div className="relative w-full max-w-[300px] aspect-[3/2] shrink-0 rounded-md overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 639px) 50vw, 280px"
              className="object-contain"
              placeholder="empty"
              blurDataURL={BLUR_14x9}
              priority={false}
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* row 2: текст */}
          <div className="mt-4">
            <div className="mb-4 min-h-[64px]">
              <h4 className="text-[18px] text-colorPrimary font-bold">
                {product.meal}
              </h4>
              <h5 className="text-colorPrimary font-medium leading-tight line-clamp-2">
                {product.name}
              </h5>
            </div>
          </div>

          {/* row 3: низ карточки */}
          <div className="text-sm text-colorPrimary">
            <div className="flex gap-2 flex-wrap items-center">
              <span>{product.calories} ккал</span>/
              <span>{product.weight} г</span>
            </div>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[640px] md:max-w-[820px]">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="flex flex-col md:flex-row gap-10 items-center text-colorPrimary sm:py-6 sm:px-6">
          <div className="relative w-full max-w-[300px] aspect-[3/2] shrink-0 rounded-md bg-white overflow-hidden p-1">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 767px) 90vw, 300px"
              className="object-contain"
              placeholder="blur"
              blurDataURL={BLUR_3x2}
              priority={false}
            />
          </div>

          <div className="flex-1">
            <div className="mb-3">
              <div className="text-xs text-greySecondary ">{product.meal}</div>
              <h5 className="text-[24px] text-colorPrimary font-bold my-1">
                {product.name}
              </h5>
              <p className="text-sm text-greySecondary">
                Вес порции: {product.weight} г
              </p>
              <div className="mt-3 mb-6">
                <span className="text-colorPrimary font-bold">Состав:</span>{" "}
                {product.description} куриная грудка, йогуртовый соус, кинза,
                томат, огурец, паприка сладкая, соевый соус.
              </div>
            </div>

            <div className="flex justify-between sm:justify-start flex-wrap gap-5 text-center">
              <div className="grid text-colorPrimary font-semibold">
                {product.calories}{" "}
                <span className="text-greySecondary font-normal text-sm">
                  ккал
                </span>
              </div>
              <div className="grid text-colorPrimary font-semibold">
                {product.proteins}{" "}
                <span className="text-greySecondary font-normal text-sm">
                  Белки
                </span>
              </div>
              <div className="grid text-colorPrimary font-semibold">
                {product.fats}{" "}
                <span className="text-greySecondary font-normal text-sm">
                  Жиры
                </span>
              </div>
              <div className="grid text-colorPrimary font-semibold">
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
