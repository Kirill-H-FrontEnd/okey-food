"use client";

import { FC } from "react";
import { motion, Variants } from "framer-motion";
import { Container } from "@/components/ui/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "Как оформить заказ?",
    a: "Выберите подходящий рацион на сайте, укажите даты доставки и нажмите «Оформить заказ». После этого наш менеджер свяжется с вами для подтверждения.",
  },
  {
    q: "Как оплатить заказ?",
    a: "Принимаем наличные курьеру, банковскую карту через терминал (в том числе бесконтактно), а также оплату через ЕРИП — после оплаты пришлите нам чек. Оплата производится в первый день доставки. При заказе от 20 дней возможна оплата частями.",
  },
  {
    q: "В какое время осуществляется доставка?",
    a: "Доставляем ежедневно (кроме воскресенья) с 19:00 до 23:00. Если нужно изменить время или адрес — сообщите до 19:00 по телефону или в мессенджерах.",
  },
  {
    q: "Как перенести или отменить заказ?",
    a: "Позвоните или напишите нам до 19:00 в день доставки. Перенос — бесплатно. Отмена за 24 часа — полный возврат средств.",
  },
  {
    q: "Где посмотреть меню?",
    a: "Актуальное меню всегда доступно на сайте в разделе «Рационы питания». Выберите день и посмотрите, что входит в каждый рацион. Меню обновляется каждую неделю.",
  },
  {
    q: "Можно ли заменить продукты или блюда?",
    a: "Если у вас есть аллергия или непереносимость — сообщите при заказе, мы постараемся подобрать замену. Полная замена блюд недоступна — рационы составляются заранее.",
  },
  {
    q: "Какой минимальный срок заказа?",
    a: "Минимальный срок — 5 рабочих дней.",
  },
  {
    q: "Есть ли рационы для похудения?",
    a: "Да. Все рационы сбалансированы по КБЖУ. Воспользуйтесь калькулятором на сайте — он подберёт оптимальный рацион под ваши параметры и цель.",
  },
];

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemV: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const FAQ: FC = () => {
  return (
    <section id="faq" className="bg-colorPrimary py-14 lg:py-20">
      <Container>
        <div className="mb-10">
          <p className="text-xs font-semibold text-yellowPrimary uppercase tracking-widest mb-2">
            Частые вопросы
          </p>
          <h3 className="text-[28px] lg:text-[32px] font-bold text-white">
            Часто задаваемые вопросы
          </h3>
        </div>

        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <Accordion type="single" collapsible className="flex flex-col gap-2">
            {FAQ_ITEMS.map((item, index) => (
              <motion.div key={index} variants={itemV}>
                <AccordionItem
                  value={`item-${index}`}
                  className="rounded-lg overflow-hidden"
                >
                  <AccordionTrigger className="text-whitePrimary px-4 md:px-6 text-base py-3 lg:text-[18px] font-semibold bg-whitePrimary/10 data-[state=open]:bg-whiteSecondary data-[state=open]:hover:bg-whiteSecondary hover:bg-whitePrimary/20  transition-all data-[state=open]:text-colorPrimary">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-colorPrimary font-normal bg-whiteSecondary px-4 md:px-8">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </Container>
    </section>
  );
};
