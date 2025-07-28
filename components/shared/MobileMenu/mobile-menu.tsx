// components/MobileMenu.tsx
"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { BurgerMenu } from "@/components/ui/burger-menu/burger-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { RemoveScroll } from "react-remove-scroll";
import { Link as ScrollLink } from "react-scroll";
import s from "./mobile-menu.module.css";

type TMobileMenu = {
  openMenu: boolean;
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
};

export const MobileMenu: FC<TMobileMenu> = ({
  openMenu,
  setOpenMenu,
  className,
}) => {
  const DATA_LINKS = [
    { title: "Меню", href: "products", offset: -50 },
    { title: "Калькулятор калорий", href: "calculator", offset: -50 },
    { title: "О нас", href: "aboutUs", offset: -50 },
    { title: "Отзывы", href: "reviews", offset: -50 },
    { title: "Часто задаваемые вопросы", href: "faq", offset: -50 },
    { title: "Доставка", href: "map", offset: -50 },
  ];

  return (
    <Sheet modal={false} open={openMenu} onOpenChange={setOpenMenu}>
      <SheetTrigger
        aria-label="Open mobile menu"
        className={className}
        style={{
          outline: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <BurgerMenu
          isOpen={openMenu}
          onToggle={() => setOpenMenu((prev) => !prev)}
        />
      </SheetTrigger>

      <SheetContent
        side="top"
        className="bg-white border-none w-full h-full shadow-none pt-[85px] px-6 flex flex-col z-[90]"
        style={{
          outline: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <RemoveScroll enabled={openMenu} className="flex-1 flex flex-col">
          <nav className="grid gap-4">
            {DATA_LINKS.map((link, i) => (
              <ScrollLink
                key={i}
                to={link.href}
                smooth
                duration={300}
                spy
                offset={link.offset}
                onClick={() => setOpenMenu(false)}
                className={s.link}
                activeClass={s.activeLink}
              >
                {link.title}
              </ScrollLink>
            ))}
          </nav>

          <div className="grid gap-4 mt-8">
            <div className="flex gap-4 items-center">
              <Link
                aria-label="Instagram"
                href="#"
                className="hover:text-greenPrimary"
              >
                <Image
                  src="/images/icons/instagram.svg"
                  width={22}
                  height={22}
                  alt="Instagram"
                />
              </Link>
              <Link href="#" className="hover:text-greenPrimary">
                <Image
                  src="/images/icons/telegram.svg"
                  width={22}
                  height={22}
                  alt="Telegram"
                />
              </Link>
            </div>
            <div className="grid">
              <Link
                href="tel:+375447256666"
                className="hover:opacity-80 font-medium text-greenPrimary"
              >
                +375 44 725 66 66
              </Link>
              <Link
                href="mailto:okeygood@gmail.com"
                className="hover:opacity-80 font-medium text-greenPrimary"
              >
                okeygood@gmail.com
              </Link>
            </div>
            <div className="text-greenPrimary">
              <h5>г.Минск</h5>
              <h4>проспект Дзержинского 10</h4>
              <p>10:00 – 20:00</p>
            </div>
          </div>
        </RemoveScroll>
        <div className="w-[45px] h-[4px] bg-yellow-hover absolute bottom-[20px] left-1/2 -translate-x-1/2 rounded-full" />
      </SheetContent>
    </Sheet>
  );
};
