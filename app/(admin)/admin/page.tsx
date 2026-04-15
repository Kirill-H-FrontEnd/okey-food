"use client";

import { useAdminStore } from "@/store/useAdminStore";
import {
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
} from "lucide-react";
import {
  HiOutlineHashtag,
  HiOutlineUser,
  HiOutlineClipboardDocumentList,
  HiOutlineBanknotes,
  HiOutlineCheckCircle,
} from "react-icons/hi2";
import { BsCashStack } from "react-icons/bs";
import { RiLuggageCartLine } from "react-icons/ri";
import { FiTrendingUp } from "react-icons/fi";
import { PiChefHat } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { IoReceiptSharp } from "react-icons/io5";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { Loader } from "@/components/ui/loader";
import { NumberTicker } from "@/components/ui/number-ticker";

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

type DayStatus = "pending" | "confirmed" | "delivered" | "cancelled";

type NotesShape = {
  deliverySlots?: Array<{ days: string[] }>;
  dayStatuses?: Record<string, DayStatus>;
};

function deriveOrderStatus(order: { status: string; notes: string }): string {
  try {
    const n: NotesShape = JSON.parse(order.notes);
    const allDays = n.deliverySlots?.flatMap((slot) => slot.days) ?? [];

    if (allDays.length === 0) {
      return order.status;
    }

    const dayStatuses = n.dayStatuses ?? {};
    const statuses = allDays.map((day) => dayStatuses[day] ?? "pending");

    if (statuses.every((status) => status === "delivered")) {
      return "delivered";
    }

    if (statuses.every((status) => status === "cancelled")) {
      return "cancelled";
    }

    if (
      statuses.some(
        (status) => status === "confirmed" || status === "delivered",
      )
    ) {
      return "confirmed";
    }

    return "pending";
  } catch {
    return order.status;
  }
}

export default function AdminDashboard() {
  const { rations, orders, rationsLoading, ordersLoading } = useAdminStore();

  const deliveredRevenue = orders
    .filter((order) => deriveOrderStatus(order) === "delivered")
    .reduce((acc, order) => acc + order.amount, 0);

  const activeRations = rations.filter((ration) => ration.isActive).length;
  const uniqueCustomers = new Set(orders.map((order) => order.customerName))
    .size;

  const stats = [
    {
      label: "Всего заказов",
      value: orders.length,
      suffix: "",
      icon: RiLuggageCartLine,
      lightColor: " text-blue-600",
    },
    {
      label: "Выручка (BYN)",
      value: deliveredRevenue,
      suffix: " BYN",
      icon: BsCashStack,
      lightColor: " text-emerald-600",
    },
    {
      label: "Клиентов",
      value: uniqueCustomers,
      suffix: "",
      icon: FaUsers,
      lightColor: " text-violet-600",
    },
    {
      label: "Активных рационов",
      value: activeRations,
      suffix: "",
      icon: PiChefHat,
      lightColor: " text-lime-700",
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const rowVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 12,
    },
    show: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  return (
    <div className="flex flex-col p-4 md:p-8" style={{ minHeight: "100%" }}>
      <div className="mb-8">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-colorPrimary">
          <FiTrendingUp className="text-yellow-hover" />
          <span>Статистика</span>
        </h1>

        <p className="mt-1 text-sm text-greySecondary">
          Ключевые показатели заказов, клиентов и рационов Okey Food
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-greySecondary/40 bg-whiteSecondary p-5 shadow shadow-colorPrimary/10"
            >
              <div className="mb-3 flex items-start justify-between">
                <div
                  className={`h-10 w-10 rounded-xl bg-transparent ${stat.lightColor}`}
                >
                  <Icon size={28} />
                </div>
              </div>

              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-greySecondary">
                {stat.label}
              </p>

              <p className="mt-2 flex items-center gap-1 text-2xl font-bold text-colorPrimary">
                <NumberTicker
                  value={stat.value}
                  className="text-colorPrimary"
                />
                <span>{stat.suffix}</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid flex-1 min-h-0  gap-5 grid-cols-1">
        <div className="xl:col-span-2 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-greySecondary/40 shadow shadow-colorPrimary/10">
          <div className="flex shrink-0 items-center justify-between border-b border-greySecondary/40 bg-whiteSecondary px-6 py-4">
            <h2 className="font-bold text-colorPrimary">Последние заказы</h2>

            <Link
              href="/admin/orders"
              style={{
                outline: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              className="flex items-center gap-1 text-xs font-semibold text-greySecondary transition-colors hover:text-yellow-hover ring-0"
            >
              Все заказы <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="flex-1 overflow-y-hidden bg-whiteSecondary">
            <table className="w-full table-auto border-collapse text-sm md:table-fixed">
              <thead>
                <tr className="border-b border-greySecondary/40">
                  <th className="sticky top-0 z-20 hidden bg-colorPrimary px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-greySecondary md:table-cell">
                    <div className="flex items-center gap-2">
                      <HiOutlineHashtag className="size-3 shrink-0" />
                      <span>Заказ</span>
                    </div>
                  </th>

                  <th className="sticky top-0 z-20 bg-colorPrimary px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-greySecondary">
                    <div className="flex items-center gap-2">
                      <HiOutlineUser className="size-3 shrink-0" />
                      <span>Клиент</span>
                    </div>
                  </th>

                  <th className="sticky top-0 z-20 hidden bg-colorPrimary px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-greySecondary md:table-cell">
                    <div className="flex items-center gap-2">
                      <HiOutlineClipboardDocumentList className="size-3 shrink-0" />
                      <span>Рацион</span>
                    </div>
                  </th>

                  <th className="sticky top-0 z-20 bg-colorPrimary px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-greySecondary">
                    <div className="flex items-center gap-2">
                      <HiOutlineBanknotes className="size-3 shrink-0" />
                      <span>Сумма</span>
                    </div>
                  </th>

                  <th className="sticky top-0 z-20 bg-colorPrimary px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-greySecondary">
                    <div className="flex items-center gap-2">
                      <HiOutlineCheckCircle className="size-3 shrink-0" />
                      <span>Статус</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {ordersLoading ? (
                  <tr className="bg-whiteSecondary">
                    <td colSpan={5} className="px-6 py-0">
                      <div className="flex min-h-[260px] w-full items-center justify-center">
                        <Loader size="medium" />
                      </div>
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr className="bg-whiteSecondary">
                    <td colSpan={5} className="px-6 py-0">
                      <div className="flex min-h-[260px] w-full flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-greySecondary/30 bg-whitePrimary">
                          <IoReceiptSharp
                            size={24}
                            className="text-colorPrimary/25"
                          />
                        </div>

                        <p className="text-sm font-semibold text-colorPrimary/60">
                          Заказов пока нет
                        </p>

                        <p className="mt-1 max-w-[220px] text-xs text-greySecondary">
                          Здесь будут отображаться последние заказы после
                          появления первых покупок
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, i) => {
                    const derivedStatus = deriveOrderStatus(order);
                    const status =
                      STATUS_CONFIG[
                        derivedStatus as keyof typeof STATUS_CONFIG
                      ] ?? STATUS_CONFIG.pending;

                    const StatusIcon = status.icon;

                    return (
                      <motion.tr
                        key={order.id}
                        custom={i}
                        initial="hidden"
                        animate="show"
                        variants={rowVariants}
                        className="bg-whiteSecondary transition-colors"
                      >
                        <td className="hidden px-6 py-3 text-greySecondary md:table-cell">
                          <div className="flex items-center gap-1">
                            <span>{order.id.slice(0, 8)}</span>
                          </div>
                        </td>

                        <td className="px-6 py-3 font-medium text-colorPrimary md:max-w-[100px] md:truncate md:whitespace-nowrap">
                          <span className="block truncate">
                            {order.customerName}
                          </span>
                        </td>

                        <td className="hidden px-6 py-3 text-greySecondary md:table-cell">
                          {order.ration}
                        </td>

                        <td className="whitespace-nowrap px-6 py-3 font-semibold text-colorPrimary">
                          {order.amount} BYN
                        </td>

                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                          >
                            <StatusIcon size={11} className="shrink-0" />
                            <span className="truncate">{status.label}</span>
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-greySecondary/40 bg-whiteSecondary shadow shadow-colorPrimary/10">
          <div className="flex shrink-0 items-center justify-between border-b border-greySecondary/40 px-6 py-4">
            <h2 className="font-bold text-colorPrimary">Рационы</h2>

            <Link
              href="/admin/rations"
              style={{
                outline: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              className="flex items-center gap-1 text-xs font-semibold text-greySecondary transition-colors hover:text-yellow-hover ring-0"
            >
              Управление <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {rationsLoading ? (
              <div className="flex min-h-full items-center justify-center">
                <Loader size="medium" />
              </div>
            ) : rations.length === 0 ? (
              <div className="flex min-h-full items-center justify-center">
                <div className="flex w-full max-w-[260px] flex-col items-center justify-center py-10 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-greySecondary/30 bg-whitePrimary">
                    <MdOutlineRestaurantMenu
                      size={24}
                      className="text-colorPrimary/25"
                    />
                  </div>

                  <p className="text-sm font-semibold text-colorPrimary/60">
                    Рационов пока нет
                  </p>

                  <p className="mt-1 text-xs text-greySecondary">
                    Здесь появятся созданные рационы с калориями, блюдами и
                    ценой
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {rations.map((ration, i) => (
                  <motion.div
                    key={ration.id}
                    custom={i}
                    initial="hidden"
                    animate="show"
                    variants={rowVariants}
                    className="group relative flex items-center gap-3 rounded-md border border-greySecondary/30 bg-colorPrimary/10 p-3 transition-shadow hover:shadow-sm hover:shadow-colorPrimary/10"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-colorPrimary text-xs font-bold text-yellowPrimary">
                      {ration.calories}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold leading-tight text-colorPrimary">
                        {ration.name}
                      </p>

                      <p className="mt-0.5 text-[11px] text-greySecondary">
                        {ration.calories} ккал · {ration.dishes.length} блюд
                      </p>
                    </div>

                    <div className="shrink-0 space-y-1 text-right">
                      <p className="text-sm font-bold text-colorPrimary">
                        {ration.pricePerDay}{" "}
                        <span className="text-[10px] font-normal text-greySecondary">
                          BYN/д
                        </span>
                      </p>

                      <span
                        className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                          ration.isActive
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-gray-50 text-gray-400"
                        }`}
                      >
                        {ration.isActive ? "Активен" : "Скрыт"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
}
