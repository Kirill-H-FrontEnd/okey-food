"use client";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 ">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-colorPrimary">Настройки</h1>
        <p className="text-greySecondary text-sm mt-1">Настройки сайта</p>
      </div>
      <div className="bg-white rounded-2xl  border border-grey-border/50 flex flex-col items-center justify-center py-24 gap-4 ">
        <div className="w-16 h-16 bg-[#f2efe8] shadow  rounded-2xl flex items-center justify-center">
          <Settings className="w-8 h-8 text-colorPrimary/30 animate-spin [animation-duration:10s]" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-colorPrimary mb-1">
            Раздел в разработке
          </h3>
          <p className="text-sm text-colorPrimary/40 max-w-xs">
            Здесь вы сможете управлять настройками сайта, контактной информацией
            и другими параметрами
          </p>
        </div>
      </div>
    </div>
  );
}
