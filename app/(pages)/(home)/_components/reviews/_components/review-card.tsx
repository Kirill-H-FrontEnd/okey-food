import { FC } from "react";

import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
type TReviewCard = {
  data: { name: string; avatar: string; date: string; content: string };
};

export const ReviewCard: FC<TReviewCard> = ({ data }) => {
  return (
    <>
      <article className="w-full p-6 border-[1px] border-slate-200 rounded-[8px] bg-greyPrimary">
        <div className="grid gap-4 w-full">
          <div className="">
            <div className="flex gap-2 items-center">
              <Image
                className="rounded-full"
                src={data.avatar}
                width={45}
                height={45}
                alt="Avatar"
              />
              <div className="leading-5">
                <h4 className="text-greenPrimary font-bold text-[18px]">
                  {data.name}
                </h4>
                <span className="text-[14px] text-slate-500">{data.date}</span>
              </div>
            </div>
            <div className="flex gap-1 mt-2 ">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-[#A8C215]">
                  <FaStar />
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="line-clamp-5 text-greenPrimary">{data.content}</p>
          </div>
          <div className=" text-[14px] text-slate-500 ">
            <button className="cursor-pointer hover:text-yellow-hover">
              Читать полностью
            </button>
          </div>
        </div>
      </article>
    </>
  );
};
