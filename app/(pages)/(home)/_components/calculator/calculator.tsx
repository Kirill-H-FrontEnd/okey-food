import { FC } from "react";

import { Container } from "@/components/ui/container";
import CalorieCalculator from "@/components/ui/calculator";

type TCalculator = {};

export const Calculator: FC = ({}) => {
  return (
    <section id="calculator" className="py-14 lg:py-20 bg-whitePrimary">
      <Container>
        <section>
          <article className="w-full max-w-[580px] mb-10">
            <h3 className="text-[28px] lg:text-[32px] font-bold text-greenPrimary mb-4">
              Калькулятор расчета калорий
            </h3>
            <p className="text-greenPrimary font-medium">
              Рассчитайте свой рацион с калькулятором калорий. Калькулятор
              поможет подобрать рацион, который будет соответствовать вашим
              целям и предпочтениям
            </p>
          </article>
          <section className="bg-greenPrimary  rounded-[16px] p-6 md:p-10 lg:p-14">
            <CalorieCalculator />
          </section>
        </section>
      </Container>
    </section>
  );
};
