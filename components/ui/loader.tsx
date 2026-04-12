"use client";
import { FC } from "react";

type TLoader = {
  size?: "small" | "medium" | "large";
};

export const Loader: FC<TLoader> = ({ size = "large" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-10 h-10",
  };

  return (
    <div
      className={`${sizeClasses[size || "medium"]} border-3 border-t-colorPrimary border-gray-300 rounded-full animate-spin`}
    ></div>
  );
};
