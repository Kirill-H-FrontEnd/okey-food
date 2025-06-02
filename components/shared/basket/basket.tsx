"use client";
import { FC } from "react";
import s from "./styles/basket.module.scss";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FaCartShopping } from "react-icons/fa6";
import { ArrowBigRightIcon, ChevronRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { IoCloseOutline } from "react-icons/io5";
import React from "react";
type TBasket = {};

export const Basket: FC = ({}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative group bg-yellowPrimary"
          variant={"default"}
        >
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

      <SheetContent showCloseButton={true} className="">
        <SheetHeader className="relative w-full">
          <SheetTitle className="text-[24px] mt-[80px] text-greenPrimary font-bold">
            Корзина
          </SheetTitle>
          <SheetClose className=" absolute top-[95px] right-[20px]">
            <IoCloseOutline size={24} />
          </SheetClose>
        </SheetHeader>
        <SheetFooter className=" bg-white py-6 border-t-[1px] border-grey-border">
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
