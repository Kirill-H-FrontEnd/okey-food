import { FC } from "react";
import s from "./styles/logo.module.scss";
import Image from "next/image";

type TLogo = {};

export const Logo: FC = ({}) => {
  return (
    <div className="">
      <Image
        width={50}
        height={50}
        src={"/images/OkeyFoodLogo.svg"}
        alt="Logo"
      />
    </div>
  );
};
