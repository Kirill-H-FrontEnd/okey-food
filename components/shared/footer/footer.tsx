"use client";
import { FC } from "react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa6";
import { RiTelegram2Fill } from "react-icons/ri";
import { Copyright } from "@/components/ui/copyright";

type TFooter = {};

export const Footer: FC = ({}) => {
  const DATA_LINKS = [
    {
      title: "Навигация",
      links: [
        { title: "Меню", url: "products" },
        { title: "О нас", url: "/about" },
        { title: "FAQ", url: "/menu" },
        { title: "Отзывы", url: "/contacts" },
      ],
    },
  ];

  return (
    <footer className="bg-greenPrimary rounded-t-[24px]" id="footer">
      <Container className="">
        <section className="py-20 grid grid-cols-1 justify-center lg:grid-cols-[auto_1fr]  gap-5 lg:gap-20 ">
          <div className="flex flex-col justify-center md:justify-start text-center md:text-left">
            <div className="grid justify-center md:justify-start">
              <Logo url="/OkeyFoodLogoLight.svg" />
            </div>
            <p className="text-whitePrimary font-semibold mt-2">
              Доставка рационов питания
            </p>
          </div>
          <div className="grid text-center md:text-left  md:grid-flow-col md:auto-cols-max gap-5 md:gap-[100px] xl:gap-[200px] ">
            <nav>
              <ul className="flex flex-col gap-4 ">
                {DATA_LINKS.map((item) => (
                  <li key={item.title} className="text-whitePrimary">
                    <h3 className="font-bold mb-2 hidden md:block">
                      {item.title}
                    </h3>
                    <ul className="flex justify-center md:justify-start md:flex-col gap-4 md:gap-2">
                      {item.links.map((link) => (
                        <li key={link.title}>
                          <Link
                            href={link.url}
                            className="hover:text-yellow-hover transition-all hover:translate-x-1 font-normal text-[15px]"
                          >
                            {link.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
            <div>
              <h3 className=" mb-2 text-whitePrimary font-bold hidden md:block">
                Контакты
              </h3>
              <p className="text-whitePrimary font-normal text-[15px]">
                +375 44 725 66 66
              </p>
              <p className="text-whitePrimary font-normal text-[15px]">
                okeygood@gmail.com
              </p>
              <div className="flex justify-center md:justify-start items-center mt-4">
                <div className="flex gap-3">
                  <Link
                    aria-label="Instagram"
                    className="text-whitePrimary hover:text-yellow-hover transition-colors"
                    href=""
                  >
                    <FaInstagram size={26} />
                  </Link>
                  <Link
                    aria-label="Telegram"
                    className="text-whitePrimary hover:text-yellow-hover transition-colors"
                    href=""
                  >
                    <RiTelegram2Fill size={26} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-whitePrimary">
              <h3 className="font-bold mb-2 text-whitePrimary  hidden md:block">
                Адрес
              </h3>
              <p className="font-normal text-[15px]">г.Минск</p>
              <p className="font-normal text-[15px]">
                проспект Дзержинского 10
              </p>
              <span>10:00 - 20:00</span>
            </div>
          </div>
        </section>
      </Container>
      <Copyright />
    </footer>
  );
};
