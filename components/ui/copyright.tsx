import { FC } from "react";

type TCopyright = {};

export const Copyright: FC = ({}) => {
  const year = new Date().getFullYear();
  return (
    <div className="bg-whitePrimary py-2">
      <p className="text-center text-[13px] text-greenPrimary ">
        {year} © <span className="font-semibold">Okey Food</span>. Все права
        защищены.
      </p>
    </div>
  );
};
