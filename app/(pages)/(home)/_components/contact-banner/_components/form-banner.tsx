import React, { FC } from "react";
import s from "./styles/form-banner.module.scss";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";

type TFormBanner = {};

export const FormBanner: FC = ({}) => {
  const [accepted, setAccepted] = React.useState(false);
  return (
    <form className="max-w-[450px] gap-4 m-auto grid mt-6">
      <div className="grid md:flex gap-2 text-black">
        <Input
          name="name"
          placeholder="Имя"
          className="bg-whiteSecondary  h-[40px]"
        />
        <Input
          placeholder="Номер телефона"
          name="phone"
          type="number"
          className="bg-whiteSecondary h-[40px]"
        />
      </div>
      <div className="flex items-center justify-start gap-2 text-greySecondary">
        <Switch
          checked={accepted}
          onCheckedChange={setAccepted}
          className="mt-0.5"
        />
        <p className="text-[12px] leading-snug block text-left">
          Ознакомьтесь с{" "}
          <Link
            href={"/privacy"}
            className="text-yellow-hover hover:opacity-80 md:text-left md:inline-block"
          >
            политикой конфиденциальности.
          </Link>
        </p>
      </div>

      <Button
        disabled={!accepted}
        className="bg-yellowPrimary text-colorPrimary font-bold w-full py-6 disabled:opacity-50 disabled:cursor-not-allowed"
        variant="default"
      >
        Связаться с нами
      </Button>
      <p className="text-whitePrimary text-sm ">
        Обычно мы перезваниваем в течение 15 минут
      </p>
    </form>
  );
};
