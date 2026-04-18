"use client";

import { useAdminStore } from "@/store/useAdminStore";
import { TOrder } from "@/types/admin";
import { motion, Variants } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Loader2,
  XCircle,
  MapPin,
  Phone,
  MessageSquare,
  CalendarDays,
  Copy,
  Check,
} from "lucide-react";
import { TbRefresh } from "react-icons/tb";
import { IoReceiptSharp } from "react-icons/io5";
import { FaTelegram } from "react-icons/fa";
import { useState, useCallback, useEffect, useRef } from "react";
import { AdminSearch } from "@/components/admin/admin-search";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

type DayStatus = "pending" | "confirmed" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<
  DayStatus,
  { label: string; dot: string; pill: string; icon: typeof Clock }
> = {
  pending: {
    label: "Ожидает",
    dot: "bg-amber-400",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  confirmed: {
    label: "Подтверждён",
    dot: "bg-blue-400",
    pill: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Loader2,
  },
  delivered: {
    label: "Доставлен",
    dot: "bg-emerald-400",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Отменён",
    dot: "bg-red-400",
    pill: "bg-red-50 text-red-600 border-red-200",
    icon: XCircle,
  },
};

const STATUS_ORDER: DayStatus[] = [
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
];

type ParsedNotes = {
  comment?: string;
  social?: string;
  city?: string;
  street?: string;
  house?: string;
  apartment?: string;
  floor?: string;
  intercom?: string;
  dayStatuses?: Record<string, DayStatus>;
  deliverySlots?: Array<{
    rationCalories: string;
    rationName: string;
    timeSlot: string;
    days: string[];
  }>;
};

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

function parseNotes(notes: string): ParsedNotes {
  if (!notes) return {};
  try {
    return JSON.parse(notes) as ParsedNotes;
  } catch {
    return {};
  }
}

function deriveOverallStatus(parsed: ParsedNotes): TOrder["status"] {
  const dayStatuses = parsed.dayStatuses ?? {};
  const allDays = parsed.deliverySlots?.flatMap((slot) => slot.days) ?? [];

  if (allDays.length === 0) return "pending";

  const statuses = allDays.map((day) => dayStatuses[day] ?? "pending");

  if (statuses.every((status) => status === "delivered")) return "delivered";
  if (statuses.every((status) => status === "cancelled")) return "cancelled";
  if (
    statuses.some((status) => status === "confirmed" || status === "delivered")
  ) {
    return "confirmed";
  }

  return "pending";
}

function formatDeliveryDay(iso: string): string {
  try {
    return format(new Date(`${iso}T00:00:00`), "d MMMM, EEE", { locale: ru });
  } catch {
    return iso;
  }
}

function formatCreatedAt(iso: string): string {
  if (!iso) return "—";

  try {
    return format(new Date(iso), "d MMMM yyyy, HH:mm", { locale: ru });
  } catch {
    return iso;
  }
}

export default function OrdersPage() {
  const {
    orders,
    ordersLoading,
    fetchOrders,
    updateOrderNotes,
    updateOrderStatus,
    unseenOrderIds,
    markOrderSeen,
    markAllOrdersSeen,
  } = useAdminStore();

  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openOrder, setOpenOrder] = useState<string | undefined>(undefined);
  const highlightRef = useRef<string | null>(null);

  // Сброс бейджа на сайдбаре при входе на страницу
  useEffect(() => {
    markAllOrdersSeen();
  }, [markAllOrdersSeen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order");
    if (orderId) {
      highlightRef.current = orderId;
      setOpenOrder(orderId);
      setTimeout(() => {
        document
          .getElementById(`order-item-${orderId}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  }, []);

  const handleAccordionChange = useCallback(
    (value: string | undefined) => {
      setOpenOrder(value);
      if (value) markOrderSeen(value);
    },
    [markOrderSeen],
  );

  const handleCopyId = useCallback((id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const q = search.trim().toLowerCase();
  const filtered = q
    ? sorted.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          (o.phone ?? "").toLowerCase().includes(q) ||
          o.ration.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q),
      )
    : sorted;

  const handleDayStatusChange = useCallback(
    async (order: TOrder, dayIso: string, status: DayStatus) => {
      const key = `${order.id}-${dayIso}`;
      setUpdatingKey(key);

      try {
        const parsed = parseNotes(order.notes);
        const dayStatuses = { ...(parsed.dayStatuses ?? {}), [dayIso]: status };
        const newParsed = { ...parsed, dayStatuses };
        const newNotes = JSON.stringify(newParsed);

        await updateOrderNotes(order.id, newNotes);

        const newOverall = deriveOverallStatus(newParsed);

        if (newOverall !== order.status) {
          await updateOrderStatus(order.id, newOverall);
        }
      } finally {
        setUpdatingKey(null);
      }
    },
    [updateOrderNotes, updateOrderStatus],
  );

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-colorPrimary">
            <IoReceiptSharp className="text-yellow-hover" />
            Заказы
          </h1>

          {!ordersLoading && orders.length > 0 && (
            <p className="mt-0.5 text-sm text-greySecondary">
              Всего:{" "}
              <span className="font-semibold text-yellow-hover">
                {orders.length}
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

      <div className="mb-5">
        <AdminSearch
          value={search}
          onChange={setSearch}
          placeholder="Поиск по имени, телефону, рациону..."
        />
      </div>

      {ordersLoading ? (
        <div className="flex min-h-[420px] items-center justify-center">
          <Loader size="medium" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-greySecondary/30 bg-whitePrimary">
            <IoReceiptSharp size={24} className="text-colorPrimary/25" />
          </div>

          <p className="mb-1 text-lg font-bold text-colorPrimary/30">
            {q ? "Ничего не найдено" : "Заказов пока нет"}
          </p>

          <p className="text-sm text-colorPrimary/30">
            {q
              ? "Попробуйте изменить запрос"
              : "Заявки с сайта будут появляться здесь"}
          </p>
        </div>
      ) : (
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          <Accordion
            type="single"
            collapsible
            value={openOrder}
            onValueChange={handleAccordionChange}
            className="space-y-3"
          >
            {filtered.map((order) => {
              const parsed = parseNotes(order.notes);
              const slots = parsed.deliverySlots ?? [];
              const overallStatus = deriveOverallStatus(parsed);
              const statusCfg =
                STATUS_CONFIG[overallStatus as DayStatus] ??
                STATUS_CONFIG.pending;
              const allDays = slots.flatMap((slot) => slot.days);
              const isUnseen = unseenOrderIds.includes(order.id);

              const addressParts = [
                parsed.city,
                parsed.street ? `ул. ${parsed.street}` : null,
                parsed.house ? `д. ${parsed.house}` : null,
                parsed.apartment ? `кв. ${parsed.apartment}` : null,
                parsed.floor ? `эт. ${parsed.floor}` : null,
                parsed.intercom ? `домофон ${parsed.intercom}` : null,
              ].filter(Boolean);

              return (
                <motion.div
                  key={order.id}
                  variants={itemVariants}
                  id={`order-item-${order.id}`}
                >
                  <AccordionItem
                    value={order.id}
                    className={`overflow-hidden rounded-2xl border bg-whiteSecondary shadow-sm shadow-colorPrimary/5 transition-colors ${
                      isUnseen
                        ? " ring-1 ring-green-600"
                        : "border-greySecondary/30"
                    }`}
                  >
                    <div className="px-5 pb-3 pt-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-colorPrimary text-sm font-bold text-yellowPrimary">
                            {order.customerName.charAt(0).toUpperCase()}
                            {isUnseen && (
                              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-600 ring-2 ring-white" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-bold leading-tight text-colorPrimary">
                                {order.customerName}
                              </p>
                              {isUnseen && (
                                <span className="shrink-0 rounded-full bg-green-600 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white leading-none">
                                  Новый
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 text-xs text-greySecondary">
                              {formatCreatedAt(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusCfg.pill}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`}
                          />
                          {statusCfg.label}
                        </span>
                      </div>

                      {(order.phone || parsed.social) && (
                        <div className="mb-3 flex flex-wrap gap-3">
                          {order.phone && (
                            <div className="flex items-center gap-1.5 text-sm text-colorPrimary">
                              <Phone
                                size={13}
                                className="shrink-0 text-yellow-hover"
                              />
                              <span className="font-medium">{order.phone}</span>
                            </div>
                          )}

                          {parsed.social && (
                            <div className="flex items-center gap-1.5 text-sm text-colorPrimary">
                              <FaTelegram
                                size={13}
                                className="shrink-0 text-sky-500"
                              />
                              <span className="font-medium">
                                @{parsed.social.replace(/^@/, "")}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mb-3 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleCopyId(order.id)}
                          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-colorPrimary/10 bg-colorPrimary/5 px-3 py-1.5 font-mono text-xs text-greySecondary transition-colors hover:bg-colorPrimary/10"
                          title="Нажмите, чтобы скопировать ID заказа"
                        >
                          {copiedId === order.id ? (
                            <Check
                              size={11}
                              className="shrink-0 text-emerald-500"
                            />
                          ) : (
                            <Copy size={11} className="shrink-0" />
                          )}
                          #{order.id.slice(0, 8)}
                        </button>

                        <span className="inline-flex items-center rounded-xl border border-colorPrimary/10 bg-colorPrimary/5 px-3 py-1.5 text-xs font-bold text-colorPrimary">
                          {order.ration}
                        </span>

                        <span className="inline-flex items-center rounded-xl border border-colorPrimary/10 bg-colorPrimary/5 px-3 py-1.5 text-xs text-greySecondary">
                          {order.days} дн.
                        </span>

                        {order.amount > 0 && (
                          <span className="inline-flex items-center rounded-xl border border-yellow-hover/20 bg-yellowPrimary/20 px-3 py-1.5 text-xs font-bold text-colorPrimary">
                            {order.amount} BYN
                          </span>
                        )}
                      </div>

                      {addressParts.length > 0 && (
                        <div className="mb-2 flex items-start gap-2 rounded-xl border border-colorPrimary/8 bg-colorPrimary/5 p-3">
                          <MapPin
                            size={13}
                            className="mt-0.5 shrink-0 text-yellow-hover"
                          />
                          <p className="text-xs leading-relaxed text-colorPrimary">
                            {addressParts.join(", ")}
                          </p>
                        </div>
                      )}

                      {parsed.comment && (
                        <div className="mb-2 flex items-start gap-2 rounded-xl border border-colorPrimary/8 bg-colorPrimary/5 p-3">
                          <MessageSquare
                            size={13}
                            className="mt-0.5 shrink-0 text-yellow-hover"
                          />
                          <p className="text-xs italic leading-relaxed text-colorPrimary">
                            «{parsed.comment}»
                          </p>
                        </div>
                      )}
                    </div>

                    {allDays.length > 0 && (
                      <AccordionTrigger className="border-t border-greySecondary/20 px-5 py-3 text-xs font-semibold text-greySecondary hover:text-colorPrimary hover:no-underline">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays size={13} />
                          Дни доставки ({allDays.length})
                        </span>
                      </AccordionTrigger>
                    )}

                    <AccordionContent className="border-t border-greySecondary/20 bg-colorPrimary/[0.02] px-5">
                      <div className="space-y-4 pt-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-greySecondary">
                          Статус по дням доставки
                        </p>

                        {slots.map((slot) => (
                          <div key={slot.rationCalories} className="space-y-2">
                            <p className="text-xs font-semibold text-colorPrimary">
                              {slot.rationName}{" "}
                              <span className="font-normal text-greySecondary">
                                · {slot.timeSlot}:00 (накануне)
                              </span>
                            </p>

                            <div className="space-y-1.5">
                              {slot.days.map((dayIso) => {
                                const dayStatus: DayStatus =
                                  parsed.dayStatuses?.[dayIso] ?? "pending";
                                const cfg = STATUS_CONFIG[dayStatus];
                                const key = `${order.id}-${dayIso}`;
                                const isUpdating = updatingKey === key;

                                return (
                                  <div
                                    key={dayIso}
                                    className="flex items-center justify-between gap-3 rounded-xl border border-greySecondary/20 bg-whitePrimary px-3 py-2"
                                  >
                                    <span className="text-xs font-medium text-colorPrimary">
                                      {formatDeliveryDay(dayIso)}
                                    </span>

                                    <div className="flex shrink-0 items-center gap-1.5">
                                      {isUpdating && (
                                        <Loader2
                                          size={12}
                                          className="animate-spin text-colorPrimary/30"
                                        />
                                      )}

                                      <Select
                                        value={dayStatus}
                                        onValueChange={(val) =>
                                          handleDayStatusChange(
                                            order,
                                            dayIso,
                                            val as DayStatus,
                                          )
                                        }
                                        disabled={isUpdating}
                                      >
                                        <SelectTrigger
                                          className={`h-7 min-w-[110px] w-auto cursor-pointer rounded-lg border px-2.5 text-[11px] font-semibold ${cfg.pill}`}
                                        >
                                          <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent className="z-[9999] rounded-xl border border-greySecondary/40 bg-whiteSecondary shadow-xl">
                                          {STATUS_ORDER.map((status) => {
                                            const statusConfig =
                                              STATUS_CONFIG[status];

                                            return (
                                              <SelectItem
                                                key={status}
                                                value={status}
                                                className="cursor-pointer rounded-lg text-xs font-semibold"
                                              >
                                                <span className="flex items-center gap-2">
                                                  <span
                                                    className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`}
                                                  />
                                                  {statusConfig.label}
                                                </span>
                                              </SelectItem>
                                            );
                                          })}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
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
