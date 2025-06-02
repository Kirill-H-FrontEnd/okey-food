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
type TNavbar = {};

export const Navbar: FC = ({}) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
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
    { href: "about", label: "Меню", offset: -100 },
    { href: "footer", label: "О нас", offset: -100 },
    { href: "/portfolio", label: "Отзывы", offset: -100 },
    { href: "/blog", label: "FAQ" },
    { href: "/contacts", label: "Доставка", offset: -100 },
  ];
  return (
    <header
      className={`${
        isScrolled || openMenu ? " shadow transition-all" : ""
      } w-full sticky top-0 left-0 py-3 z-[100] bg-white rounded-b-[15px] md:rounded-b-[20px]`}
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
                  className="text-greenPrimary hover:text-yellowSecondary transition-colors"
                  href=""
                >
                  <FaInstagram size={26} />
                </Link>
                <Link
                  className="text-greenPrimary hover:text-yellowSecondary transition-colors"
                  href=""
                >
                  <RiTelegram2Fill size={26} />
                </Link>
              </div>
            </div>
          </div>
          <nav className="flex gap-5 lg:gap-14">
            <ul className="hidden lg:flex items-center gap-4">
              {DATA_LINKS.map((link, i) => (
                <ScrollLink
                  activeClass={s.activeLink}
                  className={s.link}
                  key={i}
                  to={link.href}
                  smooth={true}
                  duration={300}
                  spy={true}
                  offset={link.offset}
                >
                  {link.label}
                </ScrollLink>
              ))}
            </ul>
            <Link
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
