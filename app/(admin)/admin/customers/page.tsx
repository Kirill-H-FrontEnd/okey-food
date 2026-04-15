"use client";

import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Loader } from "@/components/ui/loader";
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

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export default function CustomersPage() {
  const { orders, ordersLoading, fetchOrders } = useAdminStore();

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

        if (order.createdAt > existing.lastOrder) {
          existing.lastOrder = order.createdAt;
        }

        if (!existing.phone && phone) {
          existing.phone = phone;
        }

        if (!existing.social && notes.social) {
          existing.social = notes.social;
        }

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
      .map((customer) => ({
        ...customer,
        orders: customer.orders.sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        ),
      }));
  }, [orders]);

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-colorPrimary">
            <FaUsers className="text-yellow-hover" />
            <span>Клиенты</span>
          </h1>

          {!ordersLoading && customers.length > 0 && (
            <p className="mt-0.5 text-sm text-greySecondary">
              Всего:{" "}
              <span className="font-semibold text-yellow-hover">
                {customers.length}
              </span>
            </p>
          )}
        </div>

        <button
          onClick={fetchOrders}
          disabled={ordersLoading}
          className="flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-greySecondary/40 bg-whiteSecondary px-4 text-sm font-semibold text-colorPrimary/60 transition-all hover:border-greySecondary/70 hover:text-colorPrimary disabled:cursor-not-allowed disabled:opacity-70"
        >
          <TbRefresh
            size={14}
            className={ordersLoading ? "animate-spin" : ""}
          />
          Обновить
        </button>
      </div>

      {ordersLoading ? (
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader size="medium" />
        </div>
      ) : customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-greySecondary/30 bg-whitePrimary">
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
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {customers.map((customer) => {
              const initials = customer.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <motion.div
                  key={`${customer.phone || customer.name}-${customer.lastOrder}`}
                  variants={itemVariants}
                >
                  <AccordionItem
                    value={customer.phone || customer.name}
                    className="overflow-hidden rounded-2xl border border-greySecondary/30 bg-whiteSecondary shadow-sm shadow-colorPrimary/5"
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline">
                      <div className="mr-2 flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-colorPrimary text-sm font-bold text-yellowPrimary">
                          {initials}
                        </div>

                        <div className="min-w-0 flex-1 text-left">
                          <p className="truncate font-bold leading-tight text-colorPrimary">
                            {customer.name}
                          </p>

                          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                            {customer.phone && (
                              <span className="flex items-center gap-1 text-xs text-greySecondary">
                                <Phone size={10} />
                                {customer.phone}
                              </span>
                            )}

                            {customer.social && (
                              <span className="flex items-center gap-1 text-xs text-greySecondary">
                                <FaTelegram
                                  size={10}
                                  className="text-sky-400"
                                />
                                @{customer.social.replace(/^@/, "")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="hidden shrink-0 items-center gap-2 sm:flex">
                          <span className="flex items-center gap-1.5 rounded-xl border border-colorPrimary/10 bg-colorPrimary/5 px-2.5 py-1.5 text-xs font-semibold text-colorPrimary">
                            <LuShoppingCart size={11} />
                            {customer.orderCount}
                          </span>

                          <span className="flex items-center gap-1.5 rounded-xl border border-yellow-hover/20 bg-yellowPrimary/20 px-2.5 py-1.5 text-xs font-bold text-colorPrimary">
                            <IoWalletOutline size={11} />
                            {customer.totalSpent} BYN
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="border-t border-greySecondary/30 bg-colorPrimary/[0.02] px-5">
                      <div className="space-y-4 pt-5">
                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-xl border border-greySecondary/20 bg-colorPrimary/5 shadow px-3 py-2.5">
                            <p className="mb-1 text-[10px] uppercase tracking-wide text-greySecondary">
                              Заказов
                            </p>

                            <p className="flex items-center gap-1.5 text-sm font-bold text-colorPrimary">
                              <LuShoppingCart
                                size={14}
                                className="text-yellow-hover"
                              />
                              {customer.orderCount}
                            </p>
                          </div>

                          <div className="rounded-xl border border-greySecondary/20 shadow bg-colorPrimary/5 px-3 py-2.5">
                            <p className="mb-1 text-[10px] uppercase tracking-wide text-greySecondary">
                              Потрачено
                            </p>

                            <p className="flex items-center gap-1.5 text-sm font-bold text-colorPrimary">
                              <IoWalletOutline
                                size={14}
                                className="text-yellow-hover"
                              />
                              {customer.totalSpent} BYN
                            </p>
                          </div>

                          <div className="rounded-xl border border-greySecondary/20 shadow bg-colorPrimary/5 px-3 py-2.5">
                            <p className="mb-1 text-[10px] uppercase tracking-wide text-greySecondary">
                              Последний
                            </p>

                            <p className="flex items-center gap-1.5 text-sm font-bold text-colorPrimary">
                              <FaRegClock
                                size={13}
                                className="shrink-0 text-yellow-hover"
                              />
                              <span className="truncate">
                                {formatDate(customer.lastOrder)}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-greySecondary">
                            История заказов
                          </p>

                          <div className="space-y-1.5">
                            {customer.orders.map((order) => (
                              <div
                                key={order.id}
                                className="flex items-center justify-between gap-3 rounded-sm border border-greySecondary/20 bg-colorPrimary/5 shadow px-3 py-2.5"
                              >
                                <div className="flex min-w-0 items-center gap-2">
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
                                      "border border-gray-200 bg-gray-50 text-gray-500"
                                    }`}
                                  >
                                    {STATUS_LABEL[order.status] ?? order.status}
                                  </span>

                                  <span className="whitespace-nowrap text-xs font-bold text-colorPrimary">
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
                </motion.div>
              );
            })}
          </Accordion>
        </motion.div>
      )}
    </div>
  );
}
