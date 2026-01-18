"use client";
// > React
import Image from "next/image";
import { FC } from "react";

type TAboutCard = {
  data: { title: string; icon: string };
};

export const AboutCard: FC<TAboutCard> = ({ data }) => {
  return (
    <article className="bg-colorPrimary grid gap-4 rounded-[16px] text-center py-10">
      <div className="grid justify-center">
        <Image
          src={data.icon}
          width={44}
          height={44}
          alt={`Icon: ${data.icon}`}
        />
      </div>
      <h4 className="text-whitePrimary font-medium">{data.title}</h4>
    </article>
  );
};
