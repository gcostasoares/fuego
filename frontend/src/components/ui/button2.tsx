import React from "react";

interface IProps {
  children: React.ReactNode;
  isWhite?: boolean | null;
  className?: string;
}

export const Button2 = ({ children, isWhite, className }: IProps) => {
  return (
    <button
      className={`${
        isWhite
          ? "text-[#333] border-[#333] text-sm px-6 py-1.5"
          : "text-[#1d4a34] border-[#333] text-xl px-10 py-2.5"
      } uppercase bg-white rounded-full border font-bold hover:bg-[#333] hover:text-white ${className}`}
    >
      {children}
    </button>
  );
};
