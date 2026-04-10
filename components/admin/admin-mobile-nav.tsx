"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { BurgerMenu } from "@/components/ui/burger-menu/burger-menu";

const NAV_ITEMS = [
  { label: "Дашборд", href: "/admin", icon: LayoutDashboard },
  { label: "Рационы", href: "/admin/rations", icon: ChefHat },
  { label: "Меню", href: "/admin/menu", icon: UtensilsCrossed },
  { label: "Заказы", href: "/admin/orders", icon: ShoppingCart },
  { label: "Клиенты", href: "/admin/customers", icon: Users },
  { label: "Настройки", href: "/admin/settings", icon: Settings },
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
      {/* Top bar — visible only on mobile */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#302a41] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#c8f135] rounded-xl flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-[#302a41]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">
              Okey Food
            </p>
            <p className="text-white/40 text-xs">Админ панель</p>
          </div>
        </div>

        <BurgerMenu isOpen={open} onToggle={() => setOpen((v) => !v)} />
      </header>

      {/* Slide-out drawer */}
      <SheetContent
        side="left"
        className="bg-[#302a41] border-0 p-0 w-72 flex flex-col gap-0"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-[22px] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#c8f135] rounded-xl flex items-center justify-center shrink-0">
              <ChefHat className="w-4 h-4 text-[#302a41]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">
                Okey Food
              </p>
              <p className="text-white/40 text-xs">Админ панель</p>
            </div>
          </div>
          <SheetClose className="w-8 h-8 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors outline-none focus:outline-none focus-visible:outline-none">
            <X size={18} />
          </SheetClose>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#c8f135] text-[#302a41]"
                      : "text-white/60 hover:text-white hover:bg-white/10"
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
        <div className="px-2 py-3 border-t border-white/10 space-y-0.5">
          <SheetClose asChild>
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink size={17} className="shrink-0" />
              Открыть сайт
            </Link>
          </SheetClose>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={17} className="shrink-0" />
            Выйти
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
