"use client";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#302a41]">Настройки</h1>
        <p className="text-[#302a41]/50 text-sm mt-1">Настройки сайта</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 bg-[#f2efe8] rounded-2xl flex items-center justify-center">
          <Settings className="w-8 h-8 text-[#302a41]/30" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-[#302a41] mb-1">Раздел в разработке</h3>
          <p className="text-sm text-[#302a41]/40 max-w-xs">
            Здесь вы сможете управлять настройками сайта, контактной
            информацией и другими параметрами
          </p>
        </div>
      </div>
    </div>
  );
}
