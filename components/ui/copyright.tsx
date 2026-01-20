import { cn } from "@/lib/utils";
import { FC } from "react";

type TCopyright = {
  className?: string;
};

export const Copyright: FC<TCopyright> = ({ className }) => {
  const year = new Date().getFullYear();
  return (
    <div className={cn("bg-whitePrimary py-2", className)}>
      <p className="text-center text-[14px] text-colorPrimary font-semibold ">
        <span className="font-bold">{year}</span> ©{" "}
        <span className="font-bold">Okey Food</span>. Все права защищены.
      </p>
    </div>
  );
};
