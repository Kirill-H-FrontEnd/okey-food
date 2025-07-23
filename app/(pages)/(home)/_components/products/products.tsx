"use client";
import { FC } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link as ScrollLink } from "react-scroll";
type TProducts = {};

export const Products: FC = ({}) => {
  const DATA_CALORIES_TABS = [
    {
      calories: "1000",
      countProduct: "3",
    },
    {
      calories: "1200",
      countProduct: "4",
    },
    {
      calories: "1400",
      countProduct: "5",
    },
    {
      calories: "1700",
      countProduct: "5",
    },
    {
      calories: "2000",
      countProduct: "5",
    },
    {
      calories: "2400",
      countProduct: "6",
    },
    {
      calories: "3200",
      countProduct: "6",
    },
  ];
  return (
    <section className="py-14 lg:py-20">
      <Container>
        <article className="w-full max-w-[450px] lg:max-w-full">
          <h3 className="text-[28px] lg:text-[32px] font-bold text-greenPrimary">
            Рационы питания
          </h3>
        </article>
        <Tabs
          defaultValue={`calories-${DATA_CALORIES_TABS[0].calories}`}
          className="grid gap-4 mt-6"
        >
          <section className="flex justify-between items-center">
            <h4 className="text-[18px] lg:text-[24px] font-semibold text-greenPrimary">
              Выберите калорийность
            </h4>
            <ScrollLink
              className="text-greenPrimary hover:text-yellow-hover transition-colors cursor-pointer"
              to={"calculator"}
              smooth={true}
              duration={300}
              spy={true}
              offset={100}
            >
              Рассчитать калорийность
            </ScrollLink>
          </section>
          <TabsList className="">
            {DATA_CALORIES_TABS.map((tab, index) => (
              <TabsTrigger
                key={index}
                value={`calories-${tab.calories}`}
                className="text-greenPrimary font-medium bg-white py-4 border-[1px] border-grey-border cursor-pointer data-[state=active]:bg-greenPrimary data-[state=active]:border-greenPrimary data-[state=active]:text-whitePrimary  group"
              >
                <div className="">
                  <p className="text-greenPrimary group-data-[state=active]:text-whitePrimary font-bold">
                    {tab.calories}
                  </p>
                  <p className="text-greySecondary group-data-[state=active]:text-yellowPrimary">
                    {tab.countProduct} блюд
                  </p>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          {DATA_CALORIES_TABS.map((tab, index) => (
            <TabsContent
              key={index}
              value={`calories-${tab.calories}`}
              className="text-greenPrimary font-medium"
            >
              <p>
                Здесь будет информация о рационе питания с {tab.calories} ккал,
                состоящем из {tab.countProduct} блюд.
              </p>
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </section>
  );
};
