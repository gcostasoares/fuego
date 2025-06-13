// src/Pages/ShopDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import apiClient from "@/Apis/apiService";
import BusinessDetails from "@/components/BusinessDetails";
import { CBDShop } from "@/types/doctors";
import { API_URL } from "@/config";

export const ShopDetails: React.FC = () => {
  const params = useParams({ from: "/detailShop/$shop" });
  const shopId = params.shop;
  const [shop, setShop] = useState<CBDShop | null>(null);

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await apiClient.get<CBDShop>(`/cbdshops/${shopId}`);
        setShop(response.data);
      } catch (err: any) {
        console.error("Error fetching shop details:", err);
        if (err.response?.status === 404) {
          setShop(null);
        }
      }
    };

    if (shopId) {
      fetchShopDetails();
    }
  }, [shopId]);

  if (!shop) {
    return <div className="p-4">Loading shop details...</div>;
  }


  // normalize to "HH:mm"
  const startTime = shop.startTime?.slice(11, 16) ?? "";
  const endTime   = shop.endTime  ?.slice(11, 16) ?? "";

  return (
    <BusinessDetails
      name={shop.name}
      description={shop.description}
      imagePath={
        shop.imagePath
          ? `${API_URL}/images/CBDShops/${shop.imagePath}`
          : ""
      }
      coverImagePath={
        shop.coverImagePath
          ? `${API_URL}/images/CBDShops/${shop.coverImagePath}`
          : ""
      }
      profileUrl={shop.profileUrl}
      address={shop.address}
      email={shop.email}
      phone={shop.phone}
      lat={shop.lat}
      long={shop.long}
      startDay={shop.startDay}
      endDay={shop.endDay}
      startTime={startTime}
      endTime={endTime}
      price={shop.price}
    />
  );
};

export default ShopDetails;
