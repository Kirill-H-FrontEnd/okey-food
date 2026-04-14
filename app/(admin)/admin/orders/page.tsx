"use client";
import { useAdminStore } from "@/store/useAdminStore";
import { TOrder } from "@/types/admin";
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
import { useState, useCallback } from "react";
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
import { format } from "date-fns";
import { ru } from "date-fns/locale";

type DayStatus = "pending" | "confirmed" | "delivered" | "cancelled";

const STATUS_CONFIG: Record<
  DayStatus,
  { label: string; dot: string; pill: string }
> = {
  pending: {
    label: "Ожидает",
    dot: "bg-amber-400",
    pill: "bg-amber-50 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "Подтверждён",
    dot: "bg-blue-400",
    pill: "bg-blue-50 text-blue-700 border-blue-200",
  },
  delivered: {
    label: "Доставлен",
    dot: "bg-emerald-400",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Отменён",
    dot: "bg-red-400",
    pill: "bg-red-50 text-red-600 border-red-200",
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
  const allDays = parsed.deliverySlots?.flatMap((s) => s.days) ?? [];
  if (allDays.length === 0) return "pending";
  const statuses = allDays.map((d) => dayStatuses[d] ?? "pending");
  if (statuses.every((s) => s === "delivered")) return "delivered";
  if (statuses.every((s) => s === "cancelled")) return "cancelled";
  if (statuses.some((s) => s === "confirmed" || s === "delivered"))
    return "confirmed";
  return "pending";
}

function formatDeliveryDay(iso: string): string {
  try {
    return format(new Date(iso + "T00:00:00"), "d MMMM, EEE", { locale: ru });
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
  const { orders, loading, fetchOrders, updateOrderNotes, updateOrderStatus } =
    useAdminStore();
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyId = useCallback((id: string) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-colorPrimary flex items-center gap-2">
            <IoReceiptSharp className="text-yellow-hover" />
            Заказы
          </h1>
          {orders.length > 0 && (
            <p className="text-sm text-greySecondary mt-0.5">
              Всего:{" "}
              <span className="font-semibold text-yellow-hover">
                {orders.length}
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

      {orders.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-whitePrimary border border-greySecondary/30">
            <IoReceiptSharp size={24} className="text-colorPrimary/25" />
          </div>
          <p className="font-bold text-colorPrimary/30 text-lg mb-1">
            Заказов пока нет
          </p>
          <p className="text-sm text-colorPrimary/30">
            Заявки с сайта будут появляться здесь
          </p>
        </div>
      ) : (
        <Accordion type="single" collapsible className="space-y-3">
          {sorted.map((order) => {
            const parsed = parseNotes(order.notes);
            const slots = parsed.deliverySlots ?? [];
            const overallStatus = deriveOverallStatus(parsed);
            const statusCfg =
              STATUS_CONFIG[overallStatus] ?? STATUS_CONFIG.pending;
            const allDays = slots.flatMap((s) => s.days);

            const addressParts = [
              parsed.city,
              parsed.street ? `ул. ${parsed.street}` : null,
              parsed.house ? `д. ${parsed.house}` : null,
              parsed.apartment ? `кв. ${parsed.apartment}` : null,
              parsed.floor ? `эт. ${parsed.floor}` : null,
              parsed.intercom ? `домофон ${parsed.intercom}` : null,
            ].filter(Boolean);

            return (
              <AccordionItem
                key={order.id}
                value={order.id}
                className="rounded-2xl border border-greySecondary/30 bg-whiteSecondary overflow-hidden shadow-sm shadow-colorPrimary/5"
              >
                {/* ─── Header (always visible) ─── */}
                <div className="px-5 pt-4 pb-3">
                  {/* Top row: avatar + name + status pill */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-colorPrimary text-yellowPrimary text-sm font-bold">
                        {order.customerName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-colorPrimary leading-tight truncate">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-greySecondary mt-0.5">
                          {formatCreatedAt(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-semibold ${statusCfg.pill}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                      />
                      {statusCfg.label}
                    </span>
                  </div>

                  {/* Contact row */}
                  {(order.phone || parsed.social) && (
                    <div className="flex flex-wrap gap-3 mb-3">
                      {order.phone && (
                        <div className="flex items-center gap-1.5 text-sm text-colorPrimary">
                          <Phone
                            size={13}
                            className="text-yellow-hover shrink-0"
                          />
                          <span className="font-medium">{order.phone}</span>
                        </div>
                      )}
                      {parsed.social && (
                        <div className="flex items-center gap-1.5 text-sm text-colorPrimary">
                          <FaTelegram
                            size={13}
                            className="text-sky-500 shrink-0"
                          />
                          <span className="font-medium">
                            @{parsed.social.replace(/^@/, "")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Chips: id, ration, days, amount */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <button
                      onClick={() => handleCopyId(order.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-colorPrimary/5 border border-colorPrimary/10 px-3 py-1.5 text-xs font-mono text-greySecondary hover:bg-colorPrimary/10 transition-colors cursor-pointer"
                      title="Нажмите, чтобы скопировать ID заказа"
                    >
                      {copiedId === order.id ? (
                        <Check
                          size={11}
                          className="text-emerald-500 shrink-0"
                        />
                      ) : (
                        <Copy size={11} className="shrink-0" />
                      )}
                      #{order.id.slice(0, 8)}
                    </button>
                    <span className="inline-flex items-center rounded-xl bg-colorPrimary/5 border border-colorPrimary/10 px-3 py-1.5 text-xs font-bold text-colorPrimary">
                      {order.ration}
                    </span>
                    <span className="inline-flex items-center rounded-xl bg-colorPrimary/5 border border-colorPrimary/10 px-3 py-1.5 text-xs text-greySecondary">
                      {order.days} дн.
                    </span>
                    {order.amount > 0 && (
                      <span className="inline-flex items-center rounded-xl bg-yellowPrimary/20 border border-yellow-hover/20 px-3 py-1.5 text-xs font-bold text-colorPrimary">
                        {order.amount} BYN
                      </span>
                    )}
                  </div>

                  {/* Address */}
                  {addressParts.length > 0 && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-colorPrimary/5 border border-colorPrimary/8 mb-2">
                      <MapPin
                        size={13}
                        className="text-yellow-hover shrink-0 mt-0.5"
                      />
                      <p className="text-xs text-colorPrimary leading-relaxed">
                        {addressParts.join(", ")}
                      </p>
                    </div>
                  )}

                  {/* Comment */}
                  {parsed.comment && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-colorPrimary/5 border border-colorPrimary/8 mb-2">
                      <MessageSquare
                        size={13}
                        className="text-yellow-hover shrink-0 mt-0.5"
                      />
                      <p className="text-xs text-colorPrimary leading-relaxed italic">
                        «{parsed.comment}»
                      </p>
                    </div>
                  )}
                </div>

                {/* ─── Accordion trigger for delivery days ─── */}
                {allDays.length > 0 && (
                  <AccordionTrigger className="px-5 py-3 border-t border-greySecondary/20 text-xs font-semibold text-greySecondary hover:text-colorPrimary hover:no-underline">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={13} />
                      Дни доставки ({allDays.length})
                    </span>
                  </AccordionTrigger>
                )}

                {/* ─── Accordion content: per-day statuses ─── */}
                <AccordionContent className="px-5 border-t border-greySecondary/20 bg-colorPrimary/[0.02]">
                  <div className="space-y-4 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-greySecondary">
                      Статус по дням доставки
                    </p>
                    {slots.map((slot) => (
                      <div key={slot.rationCalories} className="space-y-2">
                        <p className="text-xs font-semibold text-colorPrimary">
                          {slot.rationName}{" "}
                          <span className="text-greySecondary font-normal">
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
                                <div className="flex items-center gap-1.5 shrink-0">
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
                                      className={`h-7 text-[11px] font-semibold rounded-lg border px-2.5 w-auto min-w-[110px] cursor-pointer ${cfg.pill}`}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border border-greySecondary/40 shadow-xl bg-whiteSecondary z-[9999]">
                                      {STATUS_ORDER.map((s) => {
                                        const sc = STATUS_CONFIG[s];
                                        return (
                                          <SelectItem
                                            key={s}
                                            value={s}
                                            className="text-xs font-semibold rounded-lg cursor-pointer"
                                          >
                                            <span className="flex items-center gap-2">
                                              <span
                                                className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}
                                              />
                                              {sc.label}
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
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
