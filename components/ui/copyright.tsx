import { FC } from "react";

type TCopyright = {};

export const Copyright: FC = ({}) => {
  const year = new Date().getFullYear();
  return (
    <div className="bg-whitePrimary py-2">
      <p className="text-center text-[14px] text-colorPrimary font-semibold ">
        <span className="font-bold">{year}</span> ©{" "}
        <span className="font-bold">Okey Food</span>. Все права защищены.
      </p>
    </div>
  );
};
