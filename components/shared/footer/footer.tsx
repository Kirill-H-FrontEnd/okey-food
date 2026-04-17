"use client";
import { FC } from "react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { FaInstagram, FaViber } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";
import { Link as ScrollLink } from "react-scroll";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaPhoneAlt } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FaMapMarkedAlt } from "react-icons/fa";
const NAV_LINKS = [
  { href: "products", label: "Рационы питания", offset: -50 },
  { href: "aboutUs", label: "О нас", offset: -50 },
  { href: "calculator", label: "Калькулятор калорий", offset: -50 },
  { href: "faq", label: "Частые вопросы", offset: -50 },
  { href: "map", label: "Зона доставки", offset: -50 },
];

const CONTACTS = [
  { icon: FaPhoneAlt, label: "+375 44 725 66 66", href: "tel:+375447256666" },
  {
    icon: IoMail,
    label: "okeygood@gmail.com",
    href: "mailto:okeygood@gmail.com",
  },
  { icon: FaMapMarkedAlt, label: "г. Минск, пр. Дзержинского 10", href: null },
];

const SOCIALS = [
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: RiTelegram2Fill, label: "Telegram", href: "https://t.me" },
  { icon: FaViber, label: "Viber", href: "viber://chat?number=375447256666" },
];

export const Footer: FC = () => {
  return (
    <footer className="bg-colorPrimary rounded-t-[24px]" id="footer">
      {/* CTA-полоска */}
      <div className="border-b border-greySecondary/20">
        <Container>
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-greySecondary text-sm font-medium">
              Есть вопросы? Звоните — ответим быстро!
            </p>
            <Button
              className="bg-yellowPrimary text-colorPrimary font-semibold"
              variant={"default"}
            >
              {" "}
              +375 44 725 66 66
            </Button>
          </div>
        </Container>
      </div>

      {/* Основной блок */}
      <Container>
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-8">
          {/* Колонка 1: лого + описание + соцсети */}
          <div className="flex flex-col gap-5">
            <Logo width={60} height={60} url="/okey-food-logo.png" />
            <p className="text-greySecondary text-sm leading-relaxed max-w-[260px]">
              Доставка сбалансированных рационов питания по Минску. Здоровая еда
              без хлопот каждый день.
            </p>
            <div>
              <p className="text-greySecondary text-xs font-semibold uppercase tracking-widest mb-3">
                Мы в соцсетях
              </p>
              <div className="flex gap-3">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    aria-label={label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-yellowPrimary hover:text-colorPrimary text-greySecondary  transition-all duration-200"
                  >
                    <Icon size={18} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Колонка 2: навигация */}
          <div>
            <p className="text-whiteSecondary text-xs font-semibold uppercase tracking-widest mb-4">
              Навигация
            </p>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <ScrollLink
                    to={link.href}
                    smooth
                    duration={500}
                    spy
                    offset={link.offset}
                    className="group flex items-center gap-1.5 text-greySecondary  hover:text-yellowPrimary text-sm font-medium cursor-pointer  hover:translate-x-1 transition-all"
                  >
                    {link.label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка 3: контакты */}
          <div>
            <p className="text-whiteSecondary text-xs font-semibold uppercase tracking-widest mb-4">
              Контакты
            </p>
            <ul className="flex flex-col gap-3.5">
              {CONTACTS.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      className="flex items-start gap-2.5 text-greySecondary  hover:text-yellowPrimary text-sm font-medium transition-colors group"
                    >
                      <Icon
                        size={15}
                        className="mt-0.5 shrink-0 text-text-greySecondary group-hover:text-yellowPrimary transition-colors"
                      />
                      {label}
                    </a>
                  ) : (
                    <span className="flex items-start gap-2.5 text-greySecondary  text-sm font-medium">
                      <Icon
                        size={15}
                        className="mt-0.5 shrink-0 text-text-greySecondary"
                      />
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Колонка 4: график */}
          <div>
            <p className="text-whiteSecondary text-xs font-semibold uppercase tracking-widest mb-4">
              График работы
            </p>
            <ul className="flex flex-col gap-2.5 text-sm">
              {[{ days: "Пн — Сб", time: "10:00 – 20:00" }].map(
                ({ days, time }) => (
                  <li key={days} className="flex flex-col gap-0.5">
                    <span className="text-white/50 text-xs">{days}</span>
                    <span
                      className={`font-semibold ${time === "Выходной" ? "text-text-greySecondary" : "text-white"}`}
                    >
                      {time}
                    </span>
                  </li>
                ),
              )}
              <li className="mt-2 flex items-start gap-2 rounded-xl bg-yellowPrimary/10 border border-yellowPrimary/20 px-3 py-2.5">
                <Clock
                  size={14}
                  className="mt-0.5 shrink-0 text-yellowPrimary"
                />
                <div>
                  <p className="text-yellowPrimary font-semibold text-xs">
                    Доставка
                  </p>
                  <p className="text-greySecondary  text-xs">
                    19:00 – 23:00 ежедневно
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Нижняя полоска */}
      <div className="border-t border-greySecondary/20">
        <Container>
          <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-greySecondary text-xs">
              © {new Date().getFullYear()} Okey Food. Все права защищены.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-greySecondary hover:text-greySecondary  text-xs transition-colors hover:text-yellow-hover"
              >
                Политика конфиденциальности
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
