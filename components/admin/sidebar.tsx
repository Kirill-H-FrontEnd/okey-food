"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  Settings,
  ChefHat,
  LogOut,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Дашборд", href: "/admin", icon: LayoutDashboard },
  { label: "Рационы", href: "/admin/rations", icon: ChefHat },
  { label: "Меню", href: "/admin/menu", icon: UtensilsCrossed },
  { label: "Заказы", href: "/admin/orders", icon: ShoppingCart },
  { label: "Клиенты", href: "/admin/customers", icon: Users },
  { label: "Настройки", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`${
        collapsed ? "w-[64px]" : "w-60"
      } relative min-h-screen bg-[#302a41] flex flex-col shrink-0 transition-all duration-300`}
    >
      {/* Toggle handle — floats on the right edge of the sidebar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Развернуть" : "Свернуть"}
        className="absolute top-5 -right-3 z-50 w-6 h-6 bg-[#302a41] border border-white/15 rounded-full flex items-center justify-center text-white/50 hover:text-white shadow-md transition-colors"
      >
        <ChevronLeft
          size={12}
          className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
        />
      </button>

      {/* Logo — icon always at the same left position, text fades in-place */}
      <div className="flex items-center px-4 py-[22px] border-b border-white/10">
        <div className="w-8 h-8 bg-[#c8f135] rounded-xl flex items-center justify-center shrink-0">
          <ChefHat className="w-4 h-4 text-[#302a41]" />
        </div>
        <div
          className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
            collapsed
              ? "max-w-0 opacity-0 ml-0"
              : "ml-3 max-w-[140px] opacity-100"
          }`}
        >
          <p className="text-white font-bold text-sm leading-tight">
            Okey Food
          </p>
          <p className="text-white/40 text-xs">Админ панель</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-[#c8f135] text-[#302a41]"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  collapsed
                    ? "max-w-0 opacity-0 ml-0"
                    : "ml-3 max-w-[140px] opacity-100"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-white/10 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          title={collapsed ? "Открыть сайт" : undefined}
          className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ExternalLink size={17} className="shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              collapsed
                ? "max-w-0 opacity-0 ml-0"
                : "ml-3 max-w-[140px] opacity-100"
            }`}
          >
            Открыть сайт
          </span>
        </Link>
        <button
          title={collapsed ? "Выйти" : undefined}
          className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={17} className="shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              collapsed
                ? "max-w-0 opacity-0 ml-0"
                : "ml-3 max-w-[140px] opacity-100"
            }`}
          >
            Выйти
          </span>
        </button>
      </div>
    </aside>
  );
}
