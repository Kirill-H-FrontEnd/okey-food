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
import { motion } from "framer-motion";
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
        <motion.div
          role="button"
          tabIndex={0}
          aria-haspopup="dialog"
          whileHover={{
            y: -8,
            transition: { duration: 0.3, ease: [0.33, 1, 0.68, 1] },
          }}
          whileTap={{ scale: 0.98 }}
          onKeyDown={onKeyActivate}
          className="bg-whiteSecondary rounded-2xl shadow-sm border border-black/5 cursor-pointer hover:shadow-xl hover:shadow-black/5 transition-shadow duration-300 p-4 w-full h-full grid grid-rows-[auto_1fr_auto] min-h-[300px] sm:min-h-[340px] will-change-transform"
        >
          <div className="relative w-full max-w-[300px] aspect-[3/2] shrink-0 rounded-xl overflow-hidden group">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 639px) 50vw, 280px"
              className="object-contain transition-transform duration-500 group-hover:scale-[105%]"
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
              <h4 className="text-[13px] text-colorPrimary/60 font-bold  tracking-wider mb-1">
                {product.meal}
              </h4>
              <h5 className="text-[20px] text-greenPrimary font-bold leading-tight line-clamp-2">
                {product.name}
              </h5>
            </div>
          </div>

          {/* row 3: низ карточки */}
          <div className="text-sm text-colorPrimary/80 font-medium">
            <div className="flex gap-2 flex-wrap items-center bg-white/50 w-fit  py-1 rounded-full">
              <span>{product.calories} ккал</span>
              <span className="opacity-30">•</span>
              <span>{product.weight} г</span>
            </div>
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-32px)] sm:max-w-[640px] md:max-w-[820px] rounded-3xl">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="flex flex-col md:flex-row gap-10 items-center text-colorPrimary sm:py-6 sm:px-6">
          <div className="relative w-full max-w-[300px] aspect-[3/2] shrink-0 rounded-2xl bg-white overflow-hidden p-1 shadow-inner">
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
              <div className="text-xs text-greySecondary font-bold uppercase tracking-widest">
                {product.meal}
              </div>
              <h5 className="text-[28px] text-colorPrimary font-extrabold my-2 leading-tight">
                {product.name}
              </h5>
              <p className="text-sm text-greySecondary font-medium">
                Вес порции: {product.weight} г
              </p>
              <div className="mt-4 mb-6 text-colorPrimary/80 leading-relaxed">
                <span className="text-colorPrimary font-bold">Состав:</span>{" "}
                {product.description} куриная грудка, йогуртовый соус, кинза,
                томат, огурец, паприка сладкая, соевый соус.
              </div>
            </div>

            <div className="flex justify-between sm:justify-start flex-wrap gap-5 text-center">
              <div className="grid text-colorPrimary font-bold text-lg">
                {product.calories}{" "}
                <span className="text-greySecondary font-medium text-xs uppercase tracking-tighter">
                  ккал
                </span>
              </div>
              <div className="grid text-colorPrimary font-bold text-lg">
                {product.proteins}{" "}
                <span className="text-greySecondary font-medium text-xs uppercase tracking-tighter">
                  Белки
                </span>
              </div>
              <div className="grid text-colorPrimary font-bold text-lg">
                {product.fats}{" "}
                <span className="text-greySecondary font-medium text-xs uppercase tracking-tighter">
                  Жиры
                </span>
              </div>
              <div className="grid text-colorPrimary font-bold text-lg">
                {product.carbs}{" "}
                <span className="text-greySecondary font-medium text-xs uppercase tracking-tighter">
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
