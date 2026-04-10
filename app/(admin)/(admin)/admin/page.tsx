"use client";
import { useAdminStore } from "@/store/useAdminStore";
import {
  ShoppingCart,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
  Hash,
} from "lucide-react";
import { BsCashStack } from "react-icons/bs";
import { RiLuggageCartLine } from "react-icons/ri";
import { FiTrendingUp } from "react-icons/fi";
import { PiChefHat } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

const STATUS_CONFIG = {
  pending: {
    label: "Ожидает",
    icon: Clock,
    className: "text-amber-600 bg-amber-50",
  },
  confirmed: {
    label: "Подтверждён",
    icon: Loader2,
    className: "text-blue-600 bg-blue-50",
  },
  delivered: {
    label: "Доставлен",
    icon: CheckCircle2,
    className: "text-green-600 bg-green-50",
  },
  cancelled: {
    label: "Отменён",
    icon: XCircle,
    className: "text-red-600 bg-red-50",
  },
};

function OrderIdCell({ id }: { id: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-flex items-center gap-1">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="flex items-center gap-1.5 text-xs bg-colortext-colorPrimary/5 hover:bg-colortext-colorPrimary/10 px-2 py-1.5 rounded-lg font-mono text-colorPrimary/60 transition-colors"
      >
        <Hash size={10} />
        {id.slice(0, 8)}
      </button>
      {show && (
        <div className="absolute bottom-full left-0 mb-1.5 z-20 bg-colortext-colorPrimary text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap font-mono shadow-xl pointer-events-none">
          {id}
          <div className="absolute top-full left-3 border-4 border-transparent border-t-colortext-colorPrimary" />
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { rations, orders, loading } = useAdminStore();

  const deliveredRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((acc, o) => acc + o.amount, 0);
  const activeRations = rations.filter((r) => r.isActive).length;
  const uniqueCustomers = new Set(orders.map((o) => o.customerName)).size;

  const stats = [
    {
      label: "Всего заказов",
      value: orders.length,
      suffix: "",
      icon: RiLuggageCartLine,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-600",
      change: "+12%",
    },
    {
      label: "Выручка (BYN)",
      value: deliveredRevenue,
      suffix: " BYN",
      icon: BsCashStack,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50 text-emerald-600",
      change: "выполненные",
    },
    {
      label: "Клиентов",
      value: uniqueCustomers,
      suffix: "",
      icon: FaUsers,
      color: "bg-violet-500",
      lightColor: "bg-violet-50 text-violet-600",
      change: "+5%",
    },
    {
      label: "Активных рационов",
      value: activeRations,
      suffix: "",
      icon: PiChefHat,
      color: "bg-[#c8f135]",
      lightColor: "bg-lime-50 text-lime-700",
      change: `${rations.length} всего`,
    },
  ];

  const recentOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="p-4 md:p-8 flex flex-col" style={{ minHeight: "100%" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-colorPrimary flex items-center gap-2">
          <FiTrendingUp className="text-greySecondary" />
          <span>Статистика</span>
        </h1>
        <p className="text-greySecondary text-sm mt-1">
          Ключевые показатели заказов, клиентов и рационов Okey Food
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 border border-greySecondary/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl   ${stat.lightColor}`}>
                  <Icon size={28} />
                </div>
              </div>
              <p className="text-greySecondary text-xs font-semibold uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-colorPrimary text-2xl font-bold">
                {stat.value}
                {stat.suffix}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 flex-1 min-h-0">
        {/* Recent orders */}
        <div className="xl:col-span-2 bg-whiteSecondary rounded-2xl  border border-greySecondary/40 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-greySecondary/40 shrink-0">
            <h2 className="font-bold text-colorPrimary">Последние заказы</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-greySecondary hover:text-yellow-hover transition-colors flex items-center gap-1"
            >
              Все заказы <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            {recentOrders.length === 0 && !loading ? (
              <div className="flex items-center justify-center h-full py-16 text-colorPrimary/30 text-sm font-medium">
                Заказов пока нет
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0">
                  <tr className="bg-whitePrimary border-b border-greySecondary/40">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider hidden md:table-cell">
                      Заказ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider">
                      Клиент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider hidden md:table-cell">
                      Рацион
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider">
                      Сумма
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider">
                      Статус
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-grey-border/30">
                  {recentOrders.map((order) => {
                    const status = STATUS_CONFIG[order.status];
                    const StatusIcon = status.icon;
                    return (
                      <tr key={order.id} className=" transition-colors">
                        <td className="px-3 py-3 text-greySecondary hidden md:table-cell">
                          <OrderIdCell id={order.id} />
                        </td>
                        <td className="max-w-[100px] truncate whitespace-nowrap px-6 py-3 font-medium text-colorPrimary">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-3 text-greySecondary hidden md:table-cell">
                          {order.ration}
                        </td>
                        <td className="px-6 py-3 font-semibold text-colorPrimary">
                          {order.amount} BYN
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.className}`}
                          >
                            <StatusIcon size={11} />
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Rations */}
        <div className="bg-whiteSecondary rounded-2xl border border-grey-border/40 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-grey-border/40 shrink-0">
            <h2 className="font-bold text-colorPrimary">Рационы</h2>
            <Link
              href="/admin/rations"
              className="text-xs font-semibold text-greySecondary hover:text-yellow-hover  transition-colors flex items-center gap-1"
            >
              Управление <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {rations.length === 0 && !loading ? (
              <div className="flex items-center justify-center h-full py-8 text-colorPrimary/30 text-sm font-medium text-center">
                Рационов пока нет
              </div>
            ) : (
              rations.map((ration) => (
                <div
                  key={ration.id}
                  className="flex items-center gap-3 p-3 rounded-md bg-whitePrimary  border border-grey-border/30"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-colorPrimary truncate">
                      {ration.name}
                    </p>
                    <p className="text-xs text-greySecondary">
                      {ration.calories} ккал · {ration.dishes.length} блюд
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-colorPrimary">
                      {ration.pricePerDay} BYN
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        ration.isActive
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {ration.isActive ? "Активен" : "Скрыт"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
