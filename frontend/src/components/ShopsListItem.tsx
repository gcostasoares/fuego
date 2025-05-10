import { Link } from "@tanstack/react-router";
import { CheckCircle, MapPin } from "lucide-react";
import React from "react";
import { Button2 } from "./ui/button2";

interface ListItemProps {
  id: string | number;
  name: string;
  imagePath: string | null;
  coverImagePath: string | null;
  address: string;
  isVerified: boolean;
  detailsUrl: string;
}

const ListItem: React.FC<ListItemProps> = ({
  id,
  name,
  imagePath,
  coverImagePath,
  address,
  isVerified,
  detailsUrl,
}) => {
  return (
    <li
      key={id}
      className="border-[#b0b0b0] border-2 rounded-3xl p-4 bg-[#fbfbfc]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={`${imagePath ? imagePath : "/images/other/avatar.png"}`}
            loading="lazy"
            alt={`${name}s Profile`}
            className="w-12 h-12 sm:w-14 sm:h-14 md:w-14 md:h-14 rounded-full border-2 border-gray-300 object-cover"
          />
          <div className="flex items-center space-x-2">
            {isVerified && (
              <CheckCircle size={18} color="#3B71CA" className="inline-block" />
            )}
            <h4 className="text-lg font-bold inline-block">{name}</h4>
          </div>
        </div>
        <Link
          className="text-[#1d4a34] hover:text-white ms-2"
          href={detailsUrl}
        >
          <Button2 isWhite>ANSEHEN</Button2>
        </Link>
      </div>
      <div className="flex items-center justify-between mt-2 flex-wrap gap-2">
        <div className="flex row w-3/4">
          <div className="text-gray-600 border rounded-full px-3 py-1 flex items-center space-x-2">
            <MapPin size={20} className="text-gray-600 flex-shrink-0" />
            <span className="truncate text-ellipsis  overflow-hidden whitespace-nowrap break-words">
              {address}
            </span>
          </div>
        </div>
        <img
          src={`${coverImagePath || "/images/other/circle_icon.PNG"}`}
          alt={`${name} Additional`}
          loading="lazy"
          className="w-14 h-14 object-cover rounded-lg"
        />
      </div>
    </li>
  );
};

export default ListItem;
