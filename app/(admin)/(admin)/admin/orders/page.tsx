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
import { Button } from "@/components/ui/button";

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
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#302a41] flex items-center gap-2">
            <IoReceiptSharp className="text-yellow-hover" />
            <span>Заказы</span>
          </h1>
          {orders.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-xl text-greySecondary  py-2">
              <p>Всего заказов:</p>
              <span className="text-sm font-semibold text-yellow-hover">
                {orders.length}
              </span>
            </div>
          )}
        </div>{" "}
        <Button
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-white border border-grey-border/50 hover:border-grey-border text-sm font-semibold text-colorPrimary/60 hover:text-colorPrimary cursor-pointer  transition-colors "
        >
          <TbRefresh size={14} className={loading ? "animate-spin" : ""} />
          Обновить
        </Button>
      </div>

      {orders.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <IoReceiptSharp size={24} className="text-colorPrimary/25" />
          <p className="font-bold text-[#302a41]/30 text-lg mb-1">
            Заказов пока нет
          </p>
          <p className="text-sm text-[#302a41]/30">
            Заявки с сайта будут появляться здесь
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-greySecondary/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-whitePrimary border-b border-greySecondary/50 ">
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
                      className="px-6 py-4 text-left text-xs font-semibold text-greySecondary uppercase tracking-wider"
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
                      className="bg-whiteSecondary transition-colors"
                    >
                      <td className="max-w-[100px] truncate whitespace-nowrap px-6 py-3 font-medium text-colorPrimary">
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
                              className={`h-8 text-xs font-semibold rounded-md shadow border border-greySecondary/50  px-3    w-auto min-w-[130px] cursor-pointer ${STATUS_COLORS[order.status]}`}
                              style={{ backgroundColor: "rgba(48,42,65,0.06)" }}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-md border border-greySecondary/40 shadow-xl bg-whiteSecondary">
                              {STATUS_ORDER.map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className={`hover:bg-whitePrimary text-xs font-semibold rounded-sm cursor-pointer ${STATUS_COLORS[s]}`}
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
