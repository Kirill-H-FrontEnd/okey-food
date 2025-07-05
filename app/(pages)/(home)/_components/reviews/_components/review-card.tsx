// _components/review-card.tsx

import { FC } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";

type TReviewCard = {
  data: { name: string; avatar: string; date: string; content: string };
};

export const ReviewCard: FC<TReviewCard> = ({ data }) => {
  return (
    <article className="w-full h-full p-6 border border-slate-200 rounded-lg bg-greyPrimary">
      <div className="flex flex-col h-full">
        {/* Top Section: User Info & Rating */}
        <div className="flex-shrink-0">
          <div className="flex gap-3 items-center">
            <Image
              className="rounded-full"
              src={data.avatar}
              width={45}
              height={45}
              alt={`${data.name}'s avatar`}
            />
            <div className="leading-5">
              <h4 className="text-greenPrimary font-bold text-lg">
                {data.name}
              </h4>
              <span className="text-sm text-slate-500">{data.date}</span>
            </div>
          </div>
          <div className="flex gap-1 mt-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-[#A8C215]">
                <FaStar />
              </span>
            ))}
          </div>
        </div>

        {/* Middle Section: Review Content (stretches) */}
        <div className="flex-grow py-4">
          <p className="line-clamp-5 text-greenPrimary">{data.content}</p>
        </div>

        {/* Bottom Section: Read More Button */}
        <div className="flex-shrink-0 text-sm text-slate-500">
          <button className="cursor-pointer hover:text-yellow-hover">
            Читать полностью
          </button>
        </div>
      </div>
    </article>
  );
};
