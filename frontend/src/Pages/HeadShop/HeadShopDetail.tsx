// src/Pages/HeadShopDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import apiClient from "@/Apis/apiService";
import BusinessDetails from "@/components/BusinessDetails";
import { HeadShop } from "@/types/doctors";
import { API_URL } from "@/config";

// helper to unwrap JSON-encoded '["file.png"]' or return plain string
function extractFilename(path: string | string[] | null): string | null {
  if (!path) return null;
  if (Array.isArray(path)) return path[0] || null;
  const trimmed = path.trim();
  if (trimmed.startsWith("[")) {
    try {
      const arr = JSON.parse(trimmed);
      return Array.isArray(arr) && arr.length ? arr[0] : null;
    } catch {
      return null;
    }
  }
  return trimmed;
}

export const HeadShopDetail: React.FC = () => {
  const params = useParams({ from: "/headShopDetail/$id" });
  const shopId = params.id;
  const [shop, setShop] = useState<HeadShop | null>(null);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await apiClient.get<HeadShop>(`/headshops/${shopId}`);
        setShop(res.data);
      } catch (err: any) {
        console.error("Error fetching head shop details:", err);
        if (err.response?.status === 404) setShop(null);
      }
    }
    if (shopId) fetchDetail();
  }, [shopId]);

  if (!shop) {
    return <div className="p-4">Loading head shop details...</div>;
  }

  // unwrap any JSON array and build correct URLs
  const imgFile = extractFilename(shop.imagePath);
  const coverFile = extractFilename(shop.coverImagePath);

  // slice off the date portion so BusinessDetails only gets "HH:mm"
  const startTime = shop.startTime?.slice(11, 16) ?? "";
  const endTime   = shop.endTime  ?.slice(11, 16) ?? "";

  return (
    <BusinessDetails
      name={shop.name}
      description={shop.description}
      imagePath={imgFile ? `${API_URL}/images/HeadShops/${imgFile}` : ""}
      coverImagePath={coverFile ? `${API_URL}/images/HeadShops/${coverFile}` : ""}
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

export default HeadShopDetail;
