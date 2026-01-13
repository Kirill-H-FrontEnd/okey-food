import { FC } from "react";
import s from "./styles/form-banner.module.scss";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TFormBanner = {};

export const FormBanner: FC = ({}) => {
  return (
    <form className="max-w-[400px] gap-4 m-auto grid mt-6">
      <div className=" flex gap-2 text-black">
        <Input
          name="name"
          placeholder="ваше имя"
          className="bg-white capitalize h-[40px]"
        />
        <Input name="phone" type="number" className="bg-white h-[40px]" />
      </div>
      <Button
        className="bg-yellowPrimary text-greenPrimary font-bold w-full py-6"
        variant="default"
      >
        Связаться с нами
      </Button>
      <p className="text-greySecondary">
        Обычно мы перезваниваем в течение 15 минут
      </p>
    </form>
  );
};
