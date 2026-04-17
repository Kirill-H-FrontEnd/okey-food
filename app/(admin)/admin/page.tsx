"use client";

import { useAdminStore } from "@/store/useAdminStore";
import { BsCashStack } from "react-icons/bs";
import { RiLuggageCartLine } from "react-icons/ri";
import { FiTrendingUp } from "react-icons/fi";
import { PiChefHat } from "react-icons/pi";
import { FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import { Loader } from "@/components/ui/loader";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  YAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type DayStatus = "pending" | "confirmed" | "delivered" | "cancelled";

type NotesShape = {
  deliverySlots?: Array<{ days: string[] }>;
  dayStatuses?: Record<string, DayStatus>;
};

function deriveOrderStatus(order: { status: string; notes: string }): string {
  try {
    const n: NotesShape = JSON.parse(order.notes);
    const allDays = n.deliverySlots?.flatMap((slot) => slot.days) ?? [];
    if (allDays.length === 0) return order.status;
    const dayStatuses = n.dayStatuses ?? {};
    const statuses = allDays.map((day) => dayStatuses[day] ?? "pending");
    if (statuses.every((s) => s === "delivered")) return "delivered";
    if (statuses.every((s) => s === "cancelled")) return "cancelled";
    if (statuses.some((s) => s === "confirmed" || s === "delivered"))
      return "confirmed";
    return "pending";
  } catch {
    return order.status;
  }
}

const MONTH_NAMES = [
  "Янв",
  "Фев",
  "Мар",
  "Апр",
  "Май",
  "Июн",
  "Июл",
  "Авг",
  "Сен",
  "Окт",
  "Ноя",
  "Дек",
];

const customersChartConfig = {
  customers: {
    label: "Клиентов",
    color: "#f5c518",
  },
  returning: {
    label: "Повторных",
    color: "#1e2327",
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  const { rations, orders, ordersLoading } = useAdminStore();

  const deliveredRevenue = orders
    .filter((o) => deriveOrderStatus(o) === "delivered")
    .reduce((acc, o) => acc + o.amount, 0);

  const activeRations = rations.filter((r) => r.isActive).length;
  const uniqueCustomers = new Set(orders.map((o) => o.customerName)).size;

  const stats = [
    {
      label: "Всего заказов",
      value: orders.length,
      suffix: "",
      icon: RiLuggageCartLine,
      lightColor: "text-blue-600",
    },
    {
      label: "Выручка (BYN)",
      value: deliveredRevenue,
      suffix: " BYN",
      icon: BsCashStack,
      lightColor: "text-emerald-600",
    },
    {
      label: "Клиентов",
      value: uniqueCustomers,
      suffix: "",
      icon: FaUsers,
      lightColor: "text-violet-600",
    },
    {
      label: "Активных рационов",
      value: activeRations,
      suffix: "",
      icon: PiChefHat,
      lightColor: "text-lime-700",
    },
  ];

  const now = new Date();

  const revenueData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const revenue = orders
      .filter((o) => {
        if (deriveOrderStatus(o) !== "delivered") return false;
        const od = new Date(o.createdAt);
        return od.getFullYear() === year && od.getMonth() === month;
      })
      .reduce((acc, o) => acc + o.amount, 0);
    return { month: MONTH_NAMES[month], revenue };
  });

  const seenBefore = new Set<string>();
  const customersData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const monthOrders = orders.filter((o) => {
      const od = new Date(o.createdAt);
      return od.getFullYear() === year && od.getMonth() === month;
    });
    const namesThisMonth = new Set(monthOrders.map((o) => o.customerName));
    let newCount = 0;
    let returningCount = 0;
    namesThisMonth.forEach((name) => {
      if (seenBefore.has(name)) {
        returningCount++;
      } else {
        newCount++;
        seenBefore.add(name);
      }
    });
    return {
      month: MONTH_NAMES[month],
      customers: newCount,
      returning: returningCount,
    };
  });

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

      <div className="grid flex-1 gap-5 grid-cols-1 lg:grid-cols-2">
        {/* Revenue area chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col overflow-hidden rounded-2xl border border-greySecondary/40 bg-whiteSecondary shadow shadow-colorPrimary/10"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-greySecondary/40 px-6 py-4">
            <div>
              <h2 className="font-bold text-colorPrimary">
                Выручка по месяцам
              </h2>
              <p className="mt-0.5 text-xs text-greySecondary">
                Доставленные заказы за 6 мес.
              </p>
            </div>
          </div>
          <div className="flex-1 p-4">
            {ordersLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader size="medium" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart
                  data={revenueData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="revenueGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#1e2327"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#1e2327" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e5e7eb",
                      fontSize: 12,
                      background: "#fff",
                    }}
                    formatter={(value) => [
                      `${Number(value ?? 0)} BYN`,
                      "Выручка",
                    ]}
                    labelStyle={{ color: "#1e2327", fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#1e2327"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    dot={{ r: 3, fill: "#1e2327", strokeWidth: 0 }}
                    activeDot={{
                      r: 5,
                      fill: "#f5c518",
                      stroke: "#1e2327",
                      strokeWidth: 1.5,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Customers stacked bar chart — shadcn ChartContainer style */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.08,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="flex flex-col overflow-hidden rounded-2xl border border-greySecondary/40 bg-whiteSecondary shadow shadow-colorPrimary/10"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-greySecondary/40 px-6 py-4">
            <div>
              <h2 className="font-bold text-colorPrimary">
                Клиенты по месяцам
              </h2>
              <p className="mt-0.5 text-xs text-greySecondary">
                Новые и повторные клиенты за 6 мес.
              </p>
            </div>
          </div>
          <div className="flex-1 p-4">
            {ordersLoading ? (
              <div className="flex h-48 items-center justify-center">
                <Loader size="medium" />
              </div>
            ) : (
              <ChartContainer
                config={customersChartConfig}
                className="h-[220px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={customersData}
                  margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e5e7eb"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                  />
                  <Bar
                    dataKey="customers"
                    stackId="a"
                    fill="var(--color-customers)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="returning"
                    stackId="a"
                    fill="var(--color-returning)"
                    radius={[4, 4, 0, 0]}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
