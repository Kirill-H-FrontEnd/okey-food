"use client";
import { UtensilsCrossed } from "lucide-react";

export default function MenuPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#302a41]">Меню</h1>
        <p className="text-[#302a41]/50 text-sm mt-1">
          Управление отдельными блюдами
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 bg-[#f2efe8] rounded-2xl flex items-center justify-center">
          <UtensilsCrossed className="w-8 h-8 text-[#302a41]/30" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-[#302a41] mb-1">Раздел в разработке</h3>
          <p className="text-sm text-[#302a41]/40 max-w-xs">
            Здесь вы сможете добавлять и редактировать отдельные блюда, которые
            входят в рационы
          </p>
        </div>
      </div>
    </div>
  );
}
