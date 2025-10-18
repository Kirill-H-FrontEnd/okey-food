"use client";
import { FC } from "react";
import s from "./navbar.module.css";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { IoCall } from "react-icons/io5";
import { Basket } from "../basket/basket";
import { Link as ScrollLink } from "react-scroll";
import { MobileMenu } from "../MobileMenu/mobile-menu";
import React from "react";
import Image from "next/image";
import { Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";
import { useBasketStore } from "@/store/useStore";
type TNavbar = {};

export const Navbar: FC = ({}) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const isBasketOpen = useBasketStore((state) => state.isBasketOpen);
  React.useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.pageYOffset > 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  const DATA_LINKS = [
    { href: "products", label: "Меню", offset: -50 },
    { href: "aboutUs", label: "О нас", offset: -50 },
    { href: "reviews", label: "Отзывы", offset: -50 },
    { href: "faq", label: "FAQ", offset: -50 },
    { href: "map", label: "Доставка", offset: -50 },
  ];
  return (
    <header
      className={`${
        isScrolled || openMenu
          ? "shadow-sm  bg-white/80 backdrop-blur-lg fixed "
          : "bg-whitePrimary"
      } ${
        isBasketOpen ? "shadow-sm md:shadow-none " : ""
      } w-full sticky  top-0 left-0 py-[10px] z-[100]  transition-[background-color, box-shadow] duration-300`}
    >
      <Container>
        <section className="w-full flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <Logo />
            <div className="hidden lg:flex  gap-4">
              <Link className="hover:opacity-80" href={"tel:+375447256666"}>
                +375 44 725 66 66
              </Link>
              <div className="flex gap-3 items-center">
                <Link
                  aria-label="Instagram"
                  className="text-greenPrimary hover:text-yellow-hover transition-colors"
                  href=""
                >
                  <FaInstagram size={26} />
                </Link>
                <Link
                  aria-label="Telegram"
                  className="text-greenPrimary hover:text-yellow-hover transition-colors"
                  href=""
                >
                  <RiTelegram2Fill size={26} />
                </Link>
              </div>
            </div>
          </div>
          <nav className="flex gap-5 lg:gap-10">
            <ul className="hidden lg:flex items-center gap-4">
              {DATA_LINKS.map((link, i) => (
                <li key={i}>
                  <ScrollLink
                    activeClass={s.activeLink}
                    className={s.link}
                    to={link.href}
                    smooth={true}
                    duration={500}
                    spy={true}
                    offset={link.offset}
                  >
                    {link.label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
            <Link
              aria-label="Телефон"
              className="items-center grid  lg:hidden"
              href={"tel:+375447256666"}
            >
              <Phone className="text-greenPrimary" size={24} />
            </Link>
            <Basket />
            <MobileMenu
              className="lg:hidden"
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
            />
          </nav>
        </section>
      </Container>
    </header>
  );
};
