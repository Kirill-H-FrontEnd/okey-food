import { FC } from "react";
import s from "./styles/logo.module.scss";
import Image from "next/image";
import { Link as ScrollLink } from "react-scroll";
type TLogo = { url?: string };

export const Logo: FC<TLogo> = ({ url = "/images/OkeyFoodLogo.svg" }) => {
  return (
    <ScrollLink
      className="cursor-pointer block w-[40px] h-[40px] md:w-[50px] md:h-[50px] overflow-hidden"
      to="hero"
      smooth={true}
      duration={300}
    >
      <img
        src={url}
        alt="Logo"
        width={50}
        height={50}
        style={{
          display: "block",
          objectFit: "contain",
          width: "100%",
          height: "100%",
        }}
      />
    </ScrollLink>
  );
};
