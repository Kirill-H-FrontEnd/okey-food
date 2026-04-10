"use client";
import { useAdminStore } from "@/store/useAdminStore";
import { TOrder } from "@/types/admin";
import { Clock, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { TbRefresh } from "react-icons/tb";
import { IoReceiptSharp } from "react-icons/io5";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_CONFIG: Record<
  TOrder["status"],
  { label: string; icon: React.ElementType; dot: string }
> = {
  pending: { label: "Ожидает", icon: Clock, dot: "bg-amber-400" },
  confirmed: { label: "Подтверждён", icon: Loader2, dot: "bg-blue-400" },
  delivered: { label: "Доставлен", icon: CheckCircle2, dot: "bg-emerald-400" },
  cancelled: { label: "Отменён", icon: XCircle, dot: "bg-red-400" },
};

const STATUS_COLORS: Record<TOrder["status"], string> = {
  pending: "text-amber-600",
  confirmed: "text-blue-600",
  delivered: "text-emerald-600",
  cancelled: "text-red-500",
};

const STATUS_ORDER: TOrder["status"][] = [
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
];

export default function OrdersPage() {
  const { orders, loading, fetchOrders, updateOrderStatus } = useAdminStore();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const sorted = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleStatusChange = async (id: string, status: TOrder["status"]) => {
    setUpdatingId(id);
    try {
      await updateOrderStatus(id, status);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#302a41] flex items-center gap-2">
            <IoReceiptSharp className="text-greySecondary" />
            <span>Заказы</span>
          </h1>
          <p className="text-[#302a41]/50 text-sm mt-1">
            Всего заказов: {orders.length}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-grey-border/50 hover:border-grey-border text-sm font-semibold text-colorPrimary/60 hover:text-colorPrimary cursor-pointer  transition-colors mt-2"
        >
          <TbRefresh size={14} className={loading ? "animate-spin" : ""} />
          Обновить
        </button>
      </div>

      {orders.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-bold text-[#302a41]/30 text-lg mb-1">
            Заказов пока нет
          </p>
          <p className="text-sm text-[#302a41]/30">
            Заявки с сайта будут появляться здесь
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2efe8]/60">
                  {[
                    "Клиент",
                    "Телефон",
                    "Рацион",
                    "Дней",
                    "Сумма",
                    "Дата",
                    "Статус",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-[#302a41]/50 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {sorted.map((order) => {
                  const status = STATUS_CONFIG[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#f2efe8]/40 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-[#302a41]">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-[#302a41]/60">
                        {order.phone || "—"}
                      </td>
                      <td className="px-6 py-4 text-[#302a41]/70">
                        {order.ration}
                      </td>
                      <td className="px-6 py-4 text-[#302a41]/70">
                        {order.days || "—"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#302a41]">
                        {order.amount > 0 ? `${order.amount} BYN` : "—"}
                      </td>
                      <td className="px-6 py-4 text-[#302a41]/50">
                        {order.createdAt}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Select
                            value={order.status}
                            onValueChange={(val) =>
                              handleStatusChange(
                                order.id,
                                val as TOrder["status"],
                              )
                            }
                            disabled={updatingId === order.id}
                          >
                            <SelectTrigger
                              className={`h-8 text-xs font-semibold rounded-full border-0 bg-[#302a41]/6 px-3 gap-1.5 focus:ring-1 focus:ring-[#c8f135] w-auto min-w-[130px] ${STATUS_COLORS[order.status]}`}
                              style={{ backgroundColor: "rgba(48,42,65,0.06)" }}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${status.dot}`}
                              />
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border border-black/10 shadow-xl">
                              {STATUS_ORDER.map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className={`text-xs font-semibold rounded-lg cursor-pointer ${STATUS_COLORS[s]}`}
                                >
                                  <span className="flex items-center gap-2">
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[s].dot}`}
                                    />
                                    {STATUS_CONFIG[s].label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {updatingId === order.id && (
                            <Loader2
                              size={13}
                              className="animate-spin text-[#302a41]/30"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
