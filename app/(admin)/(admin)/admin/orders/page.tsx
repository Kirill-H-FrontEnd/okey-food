"use client";
import { useAdminStore } from "@/store/useAdminStore";
import { TOrder } from "@/types/admin";
import { Clock, CheckCircle2, Loader2, XCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

const STATUS_CONFIG: Record<TOrder["status"], { label: string; icon: React.ElementType; className: string }> = {
  pending: { label: "Ожидает", icon: Clock, className: "text-amber-600 bg-amber-50" },
  confirmed: { label: "Подтверждён", icon: Loader2, className: "text-blue-600 bg-blue-50" },
  delivered: { label: "Доставлен", icon: CheckCircle2, className: "text-green-600 bg-green-50" },
  cancelled: { label: "Отменён", icon: XCircle, className: "text-red-600 bg-red-50" },
};

const STATUS_ORDER: TOrder["status"][] = ["pending", "confirmed", "delivered", "cancelled"];

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#302a41]">Заказы</h1>
          <p className="text-[#302a41]/50 text-sm mt-1">
            Всего заказов: {orders.length}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-black/10 text-sm font-semibold text-[#302a41]/60 hover:text-[#302a41] hover:border-black/20 transition-colors"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Обновить
        </button>
      </div>

      {orders.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-bold text-[#302a41]/30 text-lg mb-1">Заказов пока нет</p>
          <p className="text-sm text-[#302a41]/30">Заявки с сайта будут появляться здесь</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2efe8]/60">
                  {["Клиент", "Телефон", "Рацион", "Дней", "Сумма", "Дата", "Статус"].map((h) => (
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
                  const StatusIcon = status.icon;
                  return (
                    <tr key={order.id} className="hover:bg-[#f2efe8]/40 transition-colors">
                      <td className="px-6 py-4 font-medium text-[#302a41]">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-[#302a41]/60">
                        {order.phone || "—"}
                      </td>
                      <td className="px-6 py-4 text-[#302a41]/70">{order.ration}</td>
                      <td className="px-6 py-4 text-[#302a41]/70">{order.days || "—"}</td>
                      <td className="px-6 py-4 font-semibold text-[#302a41]">
                        {order.amount > 0 ? `${order.amount} BYN` : "—"}
                      </td>
                      <td className="px-6 py-4 text-[#302a41]/50">{order.createdAt}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as TOrder["status"])
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:ring-2 focus:ring-[#c8f135] outline-none ${status.className}`}
                        >
                          {STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_CONFIG[s].label}
                            </option>
                          ))}
                        </select>
                        {updatingId === order.id && (
                          <span className="ml-1 text-[#302a41]/30 text-xs">...</span>
                        )}
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
