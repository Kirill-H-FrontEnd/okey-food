"use client";
import { useMemo } from "react";
import { useAdminStore } from "@/store/useAdminStore";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Phone } from "lucide-react";
import { TbRefresh } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";
import { IoWalletOutline } from "react-icons/io5";
const STATUS_LABEL: Record<string, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждён",
  preparing: "Готовится",
  delivering: "Доставляется",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  preparing: "bg-orange-100 text-orange-700",
  delivering: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CustomersPage() {
  const { orders, loading, fetchOrders, updateOrderStatus } = useAdminStore();

  const customers = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        phone: string;
        orderCount: number;
        totalSpent: number;
        lastOrder: string;
        orders: typeof orders;
      }
    >();

    for (const order of orders) {
      const key = order.customerName;
      const existing = map.get(key);

      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.amount;
        if (order.createdAt > existing.lastOrder) {
          existing.lastOrder = order.createdAt;
        }
        if (!existing.phone && order.phone) {
          existing.phone = order.phone;
        }
        existing.orders.push(order);
      } else {
        map.set(key, {
          name: order.customerName,
          phone: order.phone ?? "",
          orderCount: 1,
          totalSpent: order.amount,
          lastOrder: order.createdAt,
          orders: [order],
        });
      }
    }

    return Array.from(map.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .map((c) => ({
        ...c,
        orders: c.orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
      }));
  }, [orders]);

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-colorPrimary flex items-center gap-2">
            <FaUsers className="text-greySecondary" />
            <span>Клиенты</span>
          </h1>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-grey-border/50 hover:border-grey-border text-sm font-semibold text-colorPrimary/60 hover:text-colorPrimary cursor-pointer  transition-colors mt-2"
          >
            <TbRefresh size={14} className={loading ? "animate-spin" : ""} />
            Обновить
          </button>
        </div>

        {customers.length > 0 && (
          <div className="flex items-center gap-1.5 rounded-xl bg-colortext-colorPrimary/5 px-3 py-2">
            <FaUsers size={15} className="text-colorPrimary/50" />
            <span className="text-sm font-semibold text-colorPrimary">
              {customers.length}
            </span>
          </div>
        )}
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-colorPrimary/5">
            <FaUsers size={24} className="text-colorPrimary/25" />
          </div>
          <p className="mb-1 text-lg font-bold text-colorPrimary/30">
            Клиентов пока нет
          </p>
          <p className="text-sm text-colorPrimary/30">
            Клиенты появятся после первых заказов с сайта
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-2">
          {customers.map((c) => {
            const initials = c.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <AccordionItem
                key={c.name}
                value={c.name}
                className="overflow-hidden rounded-lg border border-greySecondary/50 bg-whiteSecondary  "
              >
                <AccordionTrigger className="bg-whiteSecondary py-4 hover:bg-whiteSecondary px-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-colorPrimary/15 text-sm font-bold shadow">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-semibold text-colorPrimary">
                        {c.name}
                      </p>
                      <p className="mt-0.5 text-xs text-greySecondary">
                        {c.phone}
                      </p>
                    </div>

                    <div className="mr-2 hidden shrink-0 items-center gap-2 sm:flex">
                      <span className="flex items-center gap-1 rounded-lg bg-colortext-colorPrimary/5 px-2.5 py-1 text-xs font-medium text-colorPrimary">
                        <LuShoppingCart size={16} />
                        {c.orderCount}
                      </span>
                      <span className="flex items-center gap-1 rounded-lg bg-green-300/50 px-2.5 py-1 text-xs font-semibold text-colorPrimary">
                        <IoWalletOutline size={11} />
                        {c.totalSpent} BYN
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="bg-whiteSecondary px-4">
                  <div className="bg-whiteSecondary pb-1">
                    <div className="mb-4  grid-cols-2 md:grid-cols-3 md:gap-3 bg-whiteSecondary grid">
                      <div className="flex items-center gap-2.5 rounded-xl bg-whiteSecondary  py-2.5">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-greySecondary">
                            Заказов
                          </p>
                          <p className="text-sm flex gap-2 items-center font-bold text-colorPrimary">
                            <LuShoppingCart
                              size={16}
                              className="shrink-0 text-yellow-hover"
                            />
                            <span>{c.orderCount}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 rounded-xl bg-whiteSecondary  py-2.5">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-greySecondary">
                            Потрачено
                          </p>
                          <p className="text-sm flex items-center gap-2 font-bold text-colorPrimary">
                            <IoWalletOutline
                              size={16}
                              className="shrink-0 text-yellow-hover"
                            />
                            <span> {c.totalSpent} BYN</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 rounded-xl bg-whiteSecondary  py-2.5">
                        <div>
                          <p className="text-[10px] uppercase tracking-wide text-greySecondary">
                            Последний заказ
                          </p>
                          <p className="text-sm font-bold flex gap-2 items-center text-colorPrimary">
                            <FaRegClock
                              size={16}
                              className="shrink-0 text-yellow-hover"
                            />
                            <span> {formatDate(c.lastOrder)}</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {c.phone && (
                      <span className="mb-4 inline-flex items-center gap-2 rounded-xl bg-whiteSecondary  py-2 text-xs text-colorPrimary transition-colors font-semibold">
                        <Phone className="text-yellow-hover" size={16} />
                        {c.phone}
                      </span>
                    )}

                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-greySecondary">
                        История заказов
                      </p>

                      <div className="space-y-1.5">
                        {c.orders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between rounded-xl bg-whiteSecondary  py-2.5"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <span className="shrink-0 font-mono text-xs text-greySecondary">
                                #{order.id.slice(0, 8)}
                              </span>
                              <span className="truncate text-xs text-colorPrimary">
                                {order.ration}
                              </span>
                              <span className="shrink-0 text-xs text-greySecondary">
                                {order.days} дн.
                              </span>
                            </div>

                            <div className="ml-2 flex shrink-0 items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  STATUS_COLOR[order.status] ??
                                  "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {STATUS_LABEL[order.status] ?? order.status}
                              </span>
                              <span className="text-xs font-bold text-colorPrimary">
                                {order.amount} BYN
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
