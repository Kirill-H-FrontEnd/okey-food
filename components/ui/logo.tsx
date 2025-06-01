import { FC } from "react";
import s from "./styles/logo.module.scss";
import Image from "next/image";
import { Link as ScrollLink } from "react-scroll";
type TLogo = {};

export const Logo: FC = ({}) => {
  return (
    <ScrollLink
      className="cursor-pointer"
      to={"hero"}
      smooth={true}
      duration={300}
      spy={true}
    >
      <Image
        width={50}
        height={50}
        src={"/images/OkeyFoodLogo.svg"}
        alt="Logo"
      />
    </ScrollLink>
  );
};
