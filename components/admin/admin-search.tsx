"use client";
import { FC } from "react";
import { Search, X } from "lucide-react";

type AdminSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const AdminSearch: FC<AdminSearchProps> = ({
  value,
  onChange,
  placeholder = "Поиск...",
}) => {
  return (
    <div className="relative w-full max-w-sm">
      <Search
        size={14}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-greySecondary"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-[6px] border border-greySecondary/50 bg-whiteSecondary pl-8 pr-8 text-sm text-colorPrimary placeholder:text-greySecondary/60 outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[1px] focus-visible:ring-colorPrimary/20"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-greySecondary transition-colors hover:text-colorPrimary"
          aria-label="Очистить поиск"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
};
