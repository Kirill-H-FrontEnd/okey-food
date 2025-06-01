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
type TNavbar = {};

export const Navbar: FC = ({}) => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const DATA_LINKS = [
    { href: "about", label: "Главная", offset: -100 },
    { href: "footer", label: "Обо мне", offset: -100 },
    { href: "/portfolio", label: "Портфолио", offset: -100 },
    { href: "/blog", label: "Блог" },
    { href: "/contacts", label: "Контакты", offset: -100 },
  ];
  return (
    <header
      className={`${
        openMenu ? "border-b-[1px]" : ""
      } w-full fixed top-0 left-0 py-3  bg-white z-[100]`}
    >
      <Container>
        <section className="flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <Logo />
            <div className="hidden lg:flex  gap-4">
              <Link className="hover:opacity-80" href={"tel:+375447256666"}>
                +375 44 725 66 66
              </Link>
              <div className="flex gap-4 items-center">
                <Link className="hover:text-greenPrimary" href="">
                  <Image
                    src={"/images/icons/instagram.svg"}
                    width={22}
                    height={22}
                    alt="Instagram"
                  />
                </Link>
                <Link className="hover:text-greenPrimary" href="">
                  <Image
                    src={"/images/icons/telegram.svg"}
                    width={22}
                    height={22}
                    alt="Telegram"
                  />
                </Link>
              </div>
            </div>
          </div>
          <nav className="flex gap-5 lg:gap-6">
            <ul className="hidden lg:flex items-center gap-6">
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
            <MobileMenu openMenu={openMenu} setOpenMenu={setOpenMenu} />
          </nav>
        </section>
      </Container>
    </header>
  );
};
