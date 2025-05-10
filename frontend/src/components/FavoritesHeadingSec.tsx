import React from "react";
import { Categories } from "@/types/categories";
import { SecHeadings } from "./ui/sec-headings";
import { Button2 } from "./ui/button2";
import { Link } from "@tanstack/react-router";

interface IProps {
  title: string;
  titleTextAlign?: string;
  buttonLabels?: Categories[];
  center?: boolean;
}

export const FavoritesHeadingSec: React.FC<IProps> = ({
  title,
  buttonLabels,
  titleTextAlign,
  center = true,
}) => {
  return (
    <>
      <SecHeadings titleTextAlign={titleTextAlign}>{title}</SecHeadings>
      <div
        className={`flex flex-wrap ${center ? "justify-center" : "justify-left"} gap-3`}
      >
        {buttonLabels?.map((label, index) => (
          <Link to="/products" key={label.id}>
            <Button2 key={index}>{label.name}</Button2>
          </Link>
        ))}
      </div>
    </>
  );
};
