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
import { FaTelegram } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import { LuShoppingCart } from "react-icons/lu";
import { IoWalletOutline } from "react-icons/io5";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const STATUS_LABEL: Record<string, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждён",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

const STATUS_PILL: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border border-blue-200",
  delivered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-red-50 text-red-600 border border-red-200",
};

type ParsedNotes = {
  social?: string;
  city?: string;
  street?: string;
};

function parseNotes(notes: string): ParsedNotes {
  try {
    return JSON.parse(notes) as ParsedNotes;
  } catch {
    return {};
  }
}

function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    return format(new Date(iso), "d MMMM yyyy", { locale: ru });
  } catch {
    return iso;
  }
}

export default function CustomersPage() {
  const { orders, loading, fetchOrders } = useAdminStore();

  const customers = useMemo(() => {
    const map = new Map<
      string,
      {
        name: string;
        phone: string;
        social: string;
        orderCount: number;
        totalSpent: number;
        lastOrder: string;
        orders: typeof orders;
      }
    >();

    for (const order of orders) {
      const notes = parseNotes(order.notes);
      const phone = order.phone?.trim() ?? "";
      const key = phone || `name:${order.customerName}`;
      const existing = map.get(key);

      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += order.amount;
        if (order.createdAt > existing.lastOrder)
          existing.lastOrder = order.createdAt;
        if (!existing.phone && phone) existing.phone = phone;
        if (!existing.social && notes.social) existing.social = notes.social;
        existing.orders.push(order);
      } else {
        map.set(key, {
          name: order.customerName,
          phone,
          social: notes.social ?? "",
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
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-colorPrimary flex items-center gap-2">
            <FaUsers className="text-yellow-hover" />
            <span>Клиенты</span>
          </h1>
          {customers.length > 0 && (
            <p className="text-sm text-greySecondary mt-0.5">
              Всего:{" "}
              <span className="font-semibold text-yellow-hover">
                {customers.length}
              </span>
            </p>
          )}
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-whiteSecondary border border-greySecondary/40 text-sm font-semibold text-colorPrimary/60 hover:text-colorPrimary hover:border-greySecondary/70 transition-all cursor-pointer"
        >
          <TbRefresh size={14} className={loading ? "animate-spin" : ""} />
          Обновить
        </button>
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-whitePrimary border border-greySecondary/30">
            <FaUsers size={24} className="text-colorPrimary/25" />
          </div>
          <p className="font-bold text-colorPrimary/30 text-lg mb-1">
            Клиентов пока нет
          </p>
          <p className="text-sm text-colorPrimary/30">
            Клиенты появятся после первых заказов с сайта
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-3">
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
                className="rounded-2xl border border-greySecondary/30 bg-whiteSecondary overflow-hidden shadow-sm shadow-colorPrimary/5"
              >
                <AccordionTrigger className="px-5 py-4 hover:no-underline">
                  <div className="flex min-w-0 flex-1 items-center gap-3 mr-2">
                    {/* Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-colorPrimary text-yellowPrimary text-sm font-bold">
                      {initials}
                    </div>

                    {/* Name + contacts */}
                    <div className="min-w-0 flex-1 text-left">
                      <p className="font-bold text-colorPrimary truncate leading-tight">
                        {c.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                        {c.phone && (
                          <span className="flex items-center gap-1 text-xs text-greySecondary">
                            <Phone size={10} />
                            {c.phone}
                          </span>
                        )}
                        {c.social && (
                          <span className="flex items-center gap-1 text-xs text-greySecondary">
                            <FaTelegram size={10} className="text-sky-400" />@
                            {c.social.replace(/^@/, "")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats chips */}
                    <div className="hidden sm:flex shrink-0 items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-xl bg-colorPrimary/5 border border-colorPrimary/10 px-2.5 py-1.5 text-xs font-semibold text-colorPrimary">
                        <LuShoppingCart size={11} />
                        {c.orderCount}
                      </span>
                      <span className="flex items-center gap-1.5 rounded-xl bg-yellowPrimary/20 border border-yellow-hover/20 px-2.5 py-1.5 text-xs font-bold text-colorPrimary">
                        <IoWalletOutline size={11} />
                        {c.totalSpent} BYN
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-5 border-t border-greySecondary/20 bg-colorPrimary/[0.02]">
                  <div className="pt-1 space-y-4">
                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl bg-whitePrimary border border-greySecondary/20 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-greySecondary mb-1">
                          Заказов
                        </p>
                        <p className="text-sm font-bold text-colorPrimary flex items-center gap-1.5">
                          <LuShoppingCart
                            size={14}
                            className="text-yellow-hover"
                          />
                          {c.orderCount}
                        </p>
                      </div>
                      <div className="rounded-xl bg-whitePrimary border border-greySecondary/20 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-greySecondary mb-1">
                          Потрачено
                        </p>
                        <p className="text-sm font-bold text-colorPrimary flex items-center gap-1.5">
                          <IoWalletOutline
                            size={14}
                            className="text-yellow-hover"
                          />
                          {c.totalSpent} BYN
                        </p>
                      </div>
                      <div className="rounded-xl bg-whitePrimary border border-greySecondary/20 px-3 py-2.5">
                        <p className="text-[10px] uppercase tracking-wide text-greySecondary mb-1">
                          Последний
                        </p>
                        <p className="text-sm font-bold text-colorPrimary flex items-center gap-1.5">
                          <FaRegClock
                            size={13}
                            className="text-yellow-hover shrink-0"
                          />
                          <span className="truncate">
                            {formatDate(c.lastOrder)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Order history */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-greySecondary mb-2">
                        История заказов
                      </p>
                      <div className="space-y-1.5">
                        {c.orders.map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center justify-between gap-3 rounded-xl bg-whitePrimary border border-greySecondary/20 px-3 py-2.5"
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <span className="shrink-0 font-mono text-[10px] text-greySecondary/60">
                                #{order.id.slice(0, 8)}
                              </span>
                              <span className="truncate text-xs font-medium text-colorPrimary">
                                {order.ration}
                              </span>
                              <span className="shrink-0 text-[10px] text-greySecondary">
                                {order.days} дн.
                              </span>
                            </div>

                            <div className="ml-2 flex shrink-0 items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  STATUS_PILL[order.status] ??
                                  "bg-gray-50 text-gray-500 border border-gray-200"
                                }`}
                              >
                                {STATUS_LABEL[order.status] ?? order.status}
                              </span>
                              <span className="text-xs font-bold text-colorPrimary whitespace-nowrap">
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
