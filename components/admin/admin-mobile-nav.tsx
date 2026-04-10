"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiChefHat } from "react-icons/pi";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { IoReceiptSharp, IoSettingsSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import { LuExternalLink } from "react-icons/lu";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { ChevronLeft } from "lucide-react";
import {
  ChefHat,
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  X,
} from "lucide-react";
import Image from "next/image";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { BurgerMenu } from "@/components/ui/burger-menu/burger-menu";
import { Button } from "../ui/button";

const NAV_ITEMS = [
  { label: "Дашборд", href: "/admin", icon: TbLayoutDashboardFilled },
  { label: "Рационы", href: "/admin/rations", icon: MdOutlineRestaurantMenu },
  { label: "Заказы", href: "/admin/orders", icon: IoReceiptSharp },
  { label: "Клиенты", href: "/admin/customers", icon: FaUsers },
  { label: "Настройки", href: "/admin/settings", icon: IoSettingsSharp },
];

export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-whitePrimary/10 backdrop-blur-sm border-b border-colorPrimary/10 shrink-0 z-[1000]">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px]   flex items-center justify-center ">
            <Image
              src={"/okey-food-logo.png"}
              alt="OkeyFood логотип"
              width={50}
              height={50}
              priority
              className="rounded-sm"
              sizes="(max-width: 768px) 40px, 50px"
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
                display: "block",
              }}
            />
          </div>
          <div>
            <p className="text-colorPrimary font-bold text-sm leading-tight">
              Okey Food
            </p>
            <p className="text-greySecondary 40 text-xs">Админ панель</p>
          </div>
        </div>

        <BurgerMenu isOpen={open} onToggle={() => setOpen((v) => !v)} />
      </header>

      {/* Slide-out drawer */}
      <SheetContent
        side="left"
        className="bg-colorPrimary border-0 p-0 w-72 flex flex-col gap-0"
      >
        {/* Drawer header */}

        {/* Nav items */}
        <nav className="mt-16 flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors font-semibold ${
                    active
                      ? "bg-yellowPrimary text-colorPrimary"
                      : "text-whiteSecondary hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={17} className="shrink-0" />
                  {item.label}
                </Link>
              </SheetClose>
            );
          })}
        </nav>

        {/* Bottom links */}
        <div className="px-2 py-2 border-t border-white/10 space-y-0.5">
          <SheetClose asChild>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-whiteSecondary "
            >
              <LuExternalLink size={15} className="shrink-0" />
              Открыть сайт
            </Link>
          </SheetClose>
          <Button
            variant={"default"}
            className="w-full justify-start bg-transparent text-whiteSecondary"
          >
            <IoExitOutline size={17} className="shrink-0" />
            Выйти
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
