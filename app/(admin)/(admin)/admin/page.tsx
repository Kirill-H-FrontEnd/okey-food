"use client";
import { useAdminStore } from "@/store/useAdminStore";
import { HyperText } from "@/components/magicui/hyper-text";
import {
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
  Hash,
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

      lightColor: "bg-blue-50 text-blue-600",
      change: "+12%",
    },
    {
      label: "Выручка (BYN)",
      value: deliveredRevenue,
      suffix: " BYN",
      icon: BsCashStack,

      lightColor: "bg-emerald-50 text-emerald-600",
      change: "выполненные",
    },
    {
      label: "Клиентов",
      value: uniqueCustomers,
      suffix: "",
      icon: FaUsers,

      lightColor: "bg-violet-50 text-violet-600",
      change: "+5%",
    },
    {
      label: "Активных рационов",
      value: activeRations,
      suffix: "",
      icon: PiChefHat,
      lightColor: "bg-lime-50 text-lime-700",
      change: `${rations.length} всего`,
    },
  ];

  const recentOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
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
    <div className="p-4 md:p-8 flex flex-col" style={{ minHeight: "100%" }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-colorPrimary flex items-center gap-2">
          <FiTrendingUp className="text-yellow-hover" />
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
              className="bg-whiteSecondary rounded-2xl p-5 border border-greySecondary/40 shadow shadow-colorPrimary/10"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-10 bg-transparent h-10 rounded-xl   ${stat.lightColor}`}
                >
                  <Icon size={28} />
                </div>
              </div>
              <p className="text-greySecondary text-xs font-semibold uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-colorPrimary text-2xl font-bold flex items-center gap-1 mt-2">
                <HyperText
                  key={stat.value}
                  duration={800}
                  startOnView={false}
                  animateOnHover={false}
                  className=" "
                >
                  {String(stat.value)}
                </HyperText>
                <span> {stat.suffix}</span>
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 flex-1 min-h-0">
        {/* Recent orders */}
        <div className="xl:col-span-2  rounded-2xl border border-greySecondary/40 flex flex-col min-h-0 overflow-hidden shadow shadow-colorPrimary/10">
          <div className="flex items-center justify-between px-6 py-4 border-b border-greySecondary/40 shrink-0 bg-whiteSecondary">
            <h2 className="font-bold text-colorPrimary">Последние заказы</h2>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-greySecondary hover:text-yellow-hover transition-colors flex items-center gap-1"
            >
              Все заказы <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto bg-whiteSecondary">
            <table className="w-full table-fixed text-sm ">
              <thead className="sticky top-0 z-10 ">
                <tr className="border-b border-greySecondary/40">
                  <th className="bg-colorPrimary px-6 py-3 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <HiOutlineHashtag className="size-3 shrink-0" />
                      <span>Заказ</span>
                    </div>
                  </th>

                  <th className="bg-colorPrimary px-6 py-3 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <HiOutlineUser className="size-3 shrink-0" />
                      <span>Клиент</span>
                    </div>
                  </th>

                  <th className="bg-colorPrimary px-6 py-3 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <HiOutlineClipboardDocumentList className="size-3 shrink-0" />
                      <span>Рацион</span>
                    </div>
                  </th>

                  <th className="bg-colorPrimary px-6 py-3 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <HiOutlineBanknotes className="size-3 shrink-0" />
                      <span>Сумма</span>
                    </div>
                  </th>

                  <th className="bg-colorPrimary px-6 py-3 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                      <HiOutlineCheckCircle className="size-3 shrink-0" />
                      <span>Статус</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr className="bg-whiteSecondary">
                    <td colSpan={5} className="px-6 py-0">
                      <div className="min-h-[260px] w-full flex items-center justify-center">
                        <Loader size="medium" />
                      </div>
                    </td>
                  </tr>
                ) : recentOrders.length === 0 ? (
                  <tr className="bg-whiteSecondary">
                    <td colSpan={5} className="px-6 py-0">
                      <div className="min-h-[260px] w-full flex flex-col items-center justify-center text-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-whitePrimary border border-greySecondary/30">
                          <IoReceiptSharp
                            size={24}
                            className="text-colorPrimary/25"
                          />
                        </div>

                        <p className="text-sm font-semibold text-colorPrimary/60">
                          Заказов пока нет
                        </p>

                        <p className="mt-1 text-xs text-greySecondary max-w-[220px]">
                          Здесь будут отображаться последние заказы после
                          появления первых покупок
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order, i) => {
                    const status = STATUS_CONFIG[order.status];
                    const StatusIcon = status.icon;

                    return (
                      <motion.tr
                        key={order.id}
                        custom={i}
                        initial="hidden"
                        animate="show"
                        variants={rowVariants}
                        className="transition-colors bg-whiteSecondary"
                      >
                        <td className="px-6 py-3 text-greySecondary hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <span>{order.id.slice(0, 8)}</span>
                          </div>
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
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rations */}
        <div className="bg-whiteSecondary rounded-2xl border border-greySecondary/40 flex flex-col min-h-0 overflow-hidden shadow shadow-colorPrimary/10 s">
          <div className="flex items-center justify-between px-6 py-4 border-b border-greySecondary/40 shrink-0">
            <h2 className="font-bold text-colorPrimary">Рационы</h2>
            <Link
              href="/admin/rations"
              className="text-xs font-semibold text-greySecondary hover:text-yellow-hover  transition-colors flex items-center gap-1"
            >
              Управление <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="min-h-full flex items-center justify-center">
                <Loader size="medium" />
              </div>
            ) : rations.length === 0 ? (
              <div className="min-h-full flex items-center justify-center">
                <div className="w-full max-w-[260px] flex flex-col items-center justify-center text-center py-10">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-whitePrimary border border-greySecondary/30">
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
              <div className="space-y-3">
                {rations.map((ration, i) => (
                  <motion.div
                    custom={i}
                    initial="hidden"
                    animate="show"
                    variants={rowVariants}
                    key={ration.id}
                    className="flex items-center gap-3 p-3 rounded-sm bg-colorPrimary/10 border border-greySecondary/30"
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
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
