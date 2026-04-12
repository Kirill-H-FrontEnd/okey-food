"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiChefHat } from "react-icons/pi";
import { LogoutButton } from "@/components/admin/logout-button";
import { IoReceiptSharp, IoSettingsSharp } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import { LuExternalLink } from "react-icons/lu";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { ChevronLeft } from "lucide-react";
import { FiTrendingUp } from "react-icons/fi";
const NAV_ITEMS = [
  { label: "Статистика", href: "/admin", icon: FiTrendingUp },
  { label: "Рационы", href: "/admin/rations", icon: MdOutlineRestaurantMenu },
  { label: "Заказы", href: "/admin/orders", icon: IoReceiptSharp },
  { label: "Клиенты", href: "/admin/customers", icon: FaUsers },
  { label: "Настройки", href: "/admin/settings", icon: IoSettingsSharp },
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
        collapsed ? "w-[64px]" : "w-70"
      } hidden lg:flex relative h-full bg-colorPrimary flex-col shrink-0 transition-all duration-300 shadow-md shadow-colorPrimary/50`}
    >
      {/* Logo */}
      <div className="flex items-center px-4 py-[22px] border-b border-white/10">
        <div className="w-8 h-8 bg-yellowPrimary rounded-xl flex items-center justify-center shrink-0">
          <PiChefHat className="w-5 h-5 text-colorPrimary" />
        </div>
        <div
          className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
            collapsed
              ? "max-w-0 opacity-0 ml-0"
              : "ml-3 max-w-[140px] opacity-100"
          }`}
        >
          <p className="text-whiteSecondary font-bold text-sm leading-tight">
            Okey Food
          </p>
          <p className="text-greySecondary text-xs">Админ панель</p>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Развернуть" : "Свернуть"}
          className="absolute -right-3 top-[26px] z-50 w-6 h-6 bg-colorPrimary border border-white/20 rounded-full flex items-center justify-center text-white/50 hover:text-yellow-hover shadow-md transition-colors cursor-pointer"
        >
          <ChevronLeft
            size={12}
            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center py-2.5 rounded-md text-sm font-medium transition-colors ${
                active
                  ? "bg-yellowPrimary text-colorPrimary"
                  : "text-whiteSecondary  hover:bg-white/10"
              }`}
            >
              <span className="w-[45px] flex items-center justify-center shrink-0">
                <Icon size={17} />
              </span>
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 font-semibold ${
                  collapsed
                    ? "max-w-0 opacity-0"
                    : "max-w-[140px] opacity-100 pr-3"
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
          className="flex items-center py-2.5 rounded-md text-sm font-medium text-greySecondary hover:text-white hover:bg-white/10 transition-colors"
        >
          <span className="w-[48px] flex items-center justify-center shrink-0">
            <LuExternalLink size={16} />
          </span>
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
              collapsed ? "max-w-0 opacity-0" : "max-w-[140px] opacity-100 pr-3"
            }`}
          >
            Открыть сайт
          </span>
        </Link>
        <LogoutButton collapsed={collapsed} />
      </div>
    </aside>
  );
}
