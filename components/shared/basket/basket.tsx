"use client";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaCartShopping } from "react-icons/fa6";
import { ChevronRight, ShoppingCart, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useBasketStore } from "@/store/useStore";
type TBasket = {};

export const Basket: FC = ({}) => {
  const isBasketOpen = useBasketStore((state) => state.isBasketOpen);
  const setIsBasketOpen = useBasketStore((state) => state.setIsBasketOpen);
  return (
    <Sheet open={isBasketOpen} onOpenChange={setIsBasketOpen}>
      <SheetTrigger asChild>
        <Button className="relative group bg-yellowPrimary" variant={"default"}>
          <span className="text-[12px] text-greenPrimary font-bold">0 BYN</span>
          <span className="w-[1px] h-[50%] bg-greenPrimary/50"></span>
          <div className="grid grid-cols-2-auto gap-2 items-center md:group-hover:opacity-0 transition-opacity text-greenPrimary  ">
            <ShoppingCart size={10} />
          </div>

          <ChevronRight
            size={18}
            strokeWidth={2}
            className="absolute right-3 transition duration-300 -translate-x-2 opacity-0 md:group-hover:opacity-100 group-hover:translate-x-0 text-greenPrimary"
          />
        </Button>
      </SheetTrigger>

      <SheetContent
        showCloseButton={false}
        className="shadow-none border-none md:border-l-[2px] border-grey-border"
      >
        <SheetHeader className="relative mt-[80px] md:mt-0">
          <SheetTitle className="text-[24px]  text-greenPrimary font-bold">
            Корзина
          </SheetTitle>
          <SheetClose className="absolute cursor-pointer border-[1px] border-greenPrimary rounded-[6px] p-1 right-4 top-1/2 -translate-y-1/2 hover:bg-greenPrimary/5 transition-all group active:scale-[.98]">
            <XIcon className="h-4 w-4 text-greenPrimary group-hover:text-yellow-hover transition-all" />
          </SheetClose>
        </SheetHeader>
        <SheetFooter className=" bg-white py-6 ">
          <div className="w-full grid gap-4">
            <div className="flex items-center ">
              <div className="mr-2">
                <p className=" text-greenPrimary text-[20px] font-bold">
                  Итого:
                </p>
              </div>
              <p className="text-yellow-hover font-semibold text-[24px]">
                {" "}
                385 BYN
              </p>
            </div>
            <Link href="">
              <Button
                variant={"default"}
                className="w-full bg-yellowPrimary text-greenPrimary font-bold py-6"
              >
                Перейти к оформлению
              </Button>
            </Link>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
