"use client";

import * as React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Flame, Check } from "lucide-react";

type CaloriesTab = {
  calories: string;
  countProduct: number;
  pricePerDay?: number;
  name?: string;
};

type CaloriesTabsListProps = {
  tabs: readonly CaloriesTab[];
  cartCalories?: string[];
};

function TabItem({ tab, inCart }: { tab: CaloriesTab; inCart: boolean }) {
  return (
    <TabsTrigger
      value={`calories-${tab.calories}`}
      className="group relative rounded-2xl border border-greySecondary/50 bg-white shadow-sm cursor-pointer p-0 overflow-hidden transition-all w-full duration-200
        data-[state=active]:border-colorPrimary data-[state=active]:bg-colorPrimary data-[state=active]:shadow-md data-[state=active]:shadow-colorPrimary/15
        hover:border-greySecondary/90 hover:shadow-sm
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellowPrimary"
    >
      <div className="relative flex flex-col px-2.5 py-2 md:px-4 md:py-3 gap-0.5 w-full">
        {inCart && (
          <span className="absolute top-1.5 right-1.5 md:top-2 md:right-2  items-center justify-center w-4 h-4 rounded-full bg-greenPrimary z-10 flex">
            <Check size={9} className="text-white" strokeWidth={3} />
          </span>
        )}
        <div className="sm:flex items-baseline gap-1">
          <Flame
            size={12}
            className="text-greySecondary group-data-[state=active]:text-orange-400 transition-colors shrink-0 mb-0.5 hidden sm:block"
          />
          <span className="text-[18px] font-extrabold text-colorPrimary group-data-[state=active]:text-white leading-none tracking-tight transition-colors">
            {tab.calories}
          </span>
          <span className="text-[11px] font-semibold text-greySecondary group-data-[state=active]:text-white/70 transition-colors hidden sm:block">
            ккал
          </span>
        </div>
        {tab.pricePerDay ? (
          <span className="text-[11px] font-bold text-yellow-hover group-data-[state=active]:text-yellowPrimary transition-colors">
            {tab.pricePerDay} BYN/день
          </span>
        ) : null}
        <span className="text-[10px] text-greySecondary group-data-[state=active]:text-white/60 font-medium transition-colors">
          {tab.countProduct} блюд
        </span>
      </div>
    </TabsTrigger>
  );
}

export const CaloriesTabsList: React.FC<CaloriesTabsListProps> = ({
  tabs,
  cartCalories = [],
}) => {
  return (
    <>
      {/* Mobile (<md): single scrollable row */}
      <div className="md:hidden w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden touch-pan-x">
        <TabsList className="flex flex-nowrap gap-2 min-w-max bg-transparent p-0 h-auto">
          {tabs.map((tab) => (
            <div key={tab.calories} className="w-[140px] shrink-0">
              <TabItem tab={tab} inCart={cartCalories.includes(tab.calories)} />
            </div>
          ))}
        </TabsList>
      </div>

      {/* Desktop (≥md): wrapping grid, min 200px per tab */}
      <TabsList className="hidden md:grid gap-2 bg-transparent p-0 h-auto [grid-template-columns:repeat(auto-fill,minmax(200px,1fr))]">
        {tabs.map((tab) => (
          <TabItem
            key={tab.calories}
            tab={tab}
            inCart={cartCalories.includes(tab.calories)}
          />
        ))}
      </TabsList>
    </>
  );
};
