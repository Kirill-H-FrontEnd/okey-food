"use client";
import { useAdminStore } from "@/store/useAdminStore";

export default function CustomersPage() {
  const { orders } = useAdminStore();

  const customerMap = new Map<
    string,
    { name: string; phone: string; orders: number; totalSpent: number; lastOrder: string }
  >();

  for (const order of orders) {
    const existing = customerMap.get(order.customerName);
    if (existing) {
      existing.orders += 1;
      existing.totalSpent += order.amount;
      if (order.createdAt > existing.lastOrder) existing.lastOrder = order.createdAt;
      if (!existing.phone && order.phone) existing.phone = order.phone;
    } else {
      customerMap.set(order.customerName, {
        name: order.customerName,
        phone: order.phone ?? "",
        orders: 1,
        totalSpent: order.amount,
        lastOrder: order.createdAt,
      });
    }
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent,
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#302a41]">Клиенты</h1>
        <p className="text-[#302a41]/50 text-sm mt-1">
          Всего клиентов: {customers.length}
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="font-bold text-[#302a41]/30 text-lg mb-1">Клиентов пока нет</p>
          <p className="text-sm text-[#302a41]/30">Клиенты появятся после первых заказов с сайта</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#f2efe8]/60">
                  {["Клиент", "Телефон", "Заказов", "Потрачено", "Последний заказ"].map((h) => (
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
                {customers.map((c) => (
                  <tr key={c.name} className="hover:bg-[#f2efe8]/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#302a41]/10 flex items-center justify-center text-xs font-bold text-[#302a41]">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#302a41]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#302a41]/60">{c.phone || "—"}</td>
                    <td className="px-6 py-4 text-[#302a41]/70">{c.orders}</td>
                    <td className="px-6 py-4 font-semibold text-[#302a41]">
                      {c.totalSpent > 0 ? `${c.totalSpent} BYN` : "—"}
                    </td>
                    <td className="px-6 py-4 text-[#302a41]/50">{c.lastOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
