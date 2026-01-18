"use client";

import * as React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type CaloriesTab = { calories: string; countProduct: number };

interface CaloriesTabsListProps {
  tabs: CaloriesTab[];
}

export const CaloriesTabsList: React.FC<CaloriesTabsListProps> = ({ tabs }) => {
  return (
    <>
      {/* MOBILE (<768): одна строка + горизонтальный скролл */}
      <div className="md:hidden w-full overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden touch-pan-x [-webkit-overflow-scrolling:touch] snap-x snap-mandatory">
        <TabsList className="flex flex-nowrap gap-3 min-w-max">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.calories}
              value={`calories-${tab.calories}`}
              className="w-[220px] min-w-[220px] max-w-[220px] shrink-0 snap-start text-colorPrimary font-medium bg-white py-4 border-[1px] border-grey-border cursor-pointer data-[state=active]:bg-colorPrimary data-[state=active]:border-colorPrimary data-[state=active]:text-whitePrimary group shadow-none"
            >
              <div>
                <p className="text-colorPrimary group-data-[state=active]:text-whitePrimary font-bold">
                  {tab.calories}
                </p>
                <p className="text-greySecondary group-data-[state=active]:text-yellowPrimary">
                  {tab.countProduct} блюд
                </p>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* DESKTOP (>=768): как раньше — равная ширина, перенос без скролла */}
      <TabsList className="hidden md:grid md:gap-2 md:[grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.calories}
            value={`calories-${tab.calories}`}
            className="w-full text-colorPrimary font-medium bg-whiteSecondary py-4 border-[1px] border-grey-border cursor-pointer data-[state=active]:bg-colorPrimary data-[state=active]:border-colorPrimary data-[state=active]:text-whitePrimary group shadow-none"
          >
            <div>
              <p className="text-colorPrimary group-data-[state=active]:text-whitePrimary font-bold">
                {tab.calories}
              </p>
              <p className="text-greySecondary group-data-[state=active]:text-yellowPrimary">
                {tab.countProduct} блюд
              </p>
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
    </>
  );
};
