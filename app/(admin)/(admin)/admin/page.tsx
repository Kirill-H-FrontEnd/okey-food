"use client";
import { useAdminStore } from "@/store/useAdminStore";
import {
  ChefHat,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import Link from "next/link";

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

export default function AdminDashboard() {
  const { rations, orders, loading } = useAdminStore();

  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const activeRations = rations.filter((r) => r.isActive).length;
  const uniqueCustomers = new Set(orders.map((o) => o.customerName)).size;

  const stats = [
    {
      label: "Всего заказов",
      value: orders.length,
      suffix: "",
      icon: ShoppingCart,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 text-blue-600",
      change: "+12%",
    },
    {
      label: "Выручка (BYN)",
      value: totalRevenue,
      suffix: " BYN",
      icon: TrendingUp,
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50 text-emerald-600",
      change: "+8%",
    },
    {
      label: "Клиентов",
      value: uniqueCustomers,
      suffix: "",
      icon: Users,
      color: "bg-violet-500",
      lightColor: "bg-violet-50 text-violet-600",
      change: "+5%",
    },
    {
      label: "Активных рационов",
      value: activeRations,
      suffix: "",
      icon: ChefHat,
      color: "bg-[#c8f135]",
      lightColor: "bg-lime-50 text-lime-700",
      change: `${rations.length} всего`,
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#302a41]">Дашборд</h1>
        <p className="text-[#302a41]/50 text-sm mt-1">
          Добро пожаловать в панель управления Okey Food
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-black/5"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.lightColor}`}
                >
                  <Icon size={20} />
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <ArrowUpRight size={12} />
                  {stat.change}
                </span>
              </div>
              <p className="text-[#302a41]/50 text-xs font-semibold uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-[#302a41] text-2xl font-bold">
                {stat.value}
                {stat.suffix}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
            <h2 className="font-bold text-[#302a41]">Последние заказы</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#302a41]/50 hover:text-[#302a41] transition-colors flex items-center gap-1"
            >
              Все заказы <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2efe8]/60">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#302a41]/50 uppercase tracking-wider">
                    Заказ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#302a41]/50 uppercase tracking-wider">
                    Клиент
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#302a41]/50 uppercase tracking-wider">
                    Рацион
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#302a41]/50 uppercase tracking-wider">
                    Сумма
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#302a41]/50 uppercase tracking-wider">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {recentOrders.map((order) => {
                  const status = STATUS_CONFIG[order.status];
                  const StatusIcon = status.icon;
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#f2efe8]/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-[#302a41]">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-[#302a41]/70">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-[#302a41]/70">
                        {order.ration}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#302a41]">
                        {order.amount} BYN
                      </td>
                      <td className="px-6 py-4">
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
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-black/5">
          <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
            <h2 className="font-bold text-[#302a41]">Рационы</h2>
            <Link
              href="/admin/rations"
              className="text-xs font-semibold text-[#302a41]/50 hover:text-[#302a41] transition-colors flex items-center gap-1"
            >
              Управление <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {rations.map((ration) => (
              <div
                key={ration.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#f2efe8]/60"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#302a41] truncate">
                    {ration.name}
                  </p>
                  <p className="text-xs text-[#302a41]/50">{ration.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#302a41]">
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
