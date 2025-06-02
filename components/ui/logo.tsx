import { FC } from "react";
import s from "./styles/logo.module.scss";
import Image from "next/image";
import { Link as ScrollLink } from "react-scroll";
type TLogo = { url?: string };

export const Logo: FC<TLogo> = ({ url = "/images/OkeyFoodLogo.svg" }) => {
  return (
    <ScrollLink
      className="cursor-pointer block w-[50px] h-[50px] overflow-hidden"
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
          width: "50px",
          height: "50px",
        }}
      />
    </ScrollLink>
  );
};
