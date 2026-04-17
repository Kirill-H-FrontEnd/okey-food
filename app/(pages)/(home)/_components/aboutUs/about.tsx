"use client";

import { FC } from "react";
import { motion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/container";
import {
  Leaf,
  Truck,
  ChefHat,
  Smartphone,
  ShieldCheck,
  Flame,
} from "lucide-react";

const FEATURES = [
  {
    icon: Leaf,
    title: "Натуральные продукты",
    description:
      "Только свежие ингредиенты без консервантов, усилителей вкуса и лишнего сахара. Готовим как дома.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: ChefHat,
    title: "Уникальные блюда",
    description:
      "Меню разрабатывает профессиональный нутрициолог. Каждую неделю — новые сочетания вкусов.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Smartphone,
    title: "Удобный заказ",
    description:
      "Оформите заказ за пару минут на сайте. Выберите рацион, даты доставки — и готово.",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: Truck,
    title: "Ежедневная доставка",
    description:
      "Привозим рационы прямо к вашей двери с 19:00 до 23:00 шесть дней в неделю по всему Минску.",
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Flame,
    title: "Точный калораж",
    description:
      "Каждое блюдо взвешено и рассчитано. Вы точно знаете, сколько калорий, белков, жиров и углеводов.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: ShieldCheck,
    title: "Контроль качества",
    description:
      "Строгий контроль на каждом этапе — от закупки продуктов до упаковки и доставки.",
    color: "bg-rose-50 text-rose-600",
  },
];

const containerV: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemV: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export const AboutUs: FC = () => {
  return (
    <section id="aboutUs" className="w-full bg-whitePrimary py-14 lg:py-20">
      <Container>
        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-yellow-hover">
            О компании
          </p>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <h3 className="max-w-[520px] text-[28px] font-bold leading-tight text-colorPrimary lg:text-[36px]">
              Здоровое питание —
              <br className="hidden sm:block" /> это просто и вкусно
            </h3>

            <p className="max-w-[460px] text-sm font-medium leading-relaxed text-colorPrimary/60 lg:text-base">
              Мы создаём сбалансированные рационы из натуральных продуктов,
              чтобы вы могли правильно питаться без лишних усилий. Подходит для
              спортсменов, занятых людей и всех, кто хочет заботиться о
              здоровье.
            </p>
          </div>
        </div>

        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.article
                key={feature.title}
                variants={itemV}
                className="group flex flex-col gap-4 rounded-2xl border border-greySecondary/20 bg-whiteSecondary p-6 transition-[box-shadow,border-color,transform] duration-200  hover:border-colorPrimary/20 hover:shadow-md"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${feature.color}`}
                >
                  <Icon size={22} />
                </div>

                <div>
                  <h4 className="mb-1.5 text-[15px] font-bold text-colorPrimary">
                    {feature.title}
                  </h4>

                  <p className="text-sm leading-relaxed text-colorPrimary/55">
                    {feature.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
};
