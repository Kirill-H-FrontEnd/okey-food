// components/FAQ.tsx
"use client";
import { Container } from "@/components/ui/container";
import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type TFAQ = {};

export const FAQ: FC = ({}) => {
  const DATA_FAQ = [
    { title: "Как оплатить заказ?", content: "1" },
    { title: "Как перенести / отменить заказ?", content: "2" },
    { title: "Где посмотреть меню?", content: "3" },
    { title: "Как заменить продукты?", content: "4" },
    { title: "В какое время осуществляется доставка?", content: "5" },
  ];

  return (
    <section className="bg-greenPrimary py-14 lg:py-20">
      <Container>
        <section className="grid lg:grid-cols-[380px_1fr] gap-10 lg:gap-20">
          <article className="w-full max-w-[450px] lg:max-w-full">
            <h3 className="text-[28px] lg:text-[32px] font-bold text-whitePrimary">
              Часто задаваемые вопросы
            </h3>
            <p className="text-whitePrimary font-normal mt-4">
              В этом разделе вы найдете информацию о доставке, оплате и
              оформлении заказа. Если не нашли нужный ответ – свяжитесь с нами,
              и мы с радостью поможем!
            </p>
          </article>
          <section>
            <Accordion className="grid gap-4" type="single" collapsible>
              {DATA_FAQ.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-whitePrimary rounded-lg"
                >
                  <AccordionTrigger className="text-whitePrimary px-4 md:px-8 text-base lg:text-[18px] font-bold bg-[#324B4F] data-[state=open]:bg-whitePrimary data-[state=open]:md:hover:bg-whitePrimary  md:hover:bg-[#324B4F]/50 transition-all data-[state=open]:text-greenPrimary">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-greenPrimary font-normal px-4 md:px-8">
                    <p>
                      Способы оплаты: наличными курьеру, банковской картой через
                      терминал (бесконтактная оплата через телефон также
                      возможна), через ЕРИП (после оплаты выслать чек).
                    </p>
                    <p className="my-2">
                      Оплата за рационы осуществляется единовременным платежом в
                      первый день доставки.{" "}
                    </p>
                    <p>При заказе от 20 дней возможна оплата частями.</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </section>
      </Container>
    </section>
  );
};
