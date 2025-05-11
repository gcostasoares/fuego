// src/Pages/GrowEquipmentDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import apiClient from "@/Apis/apiService";
import BusinessDetails from "@/components/BusinessDetails";
import { GrowEquipment } from "@/types/doctors";

export const GrowEquipmentDetail: React.FC = () => {
  const params = useParams({ from: "/growEquipmentDetail/$id" });
  const growEquipmentId = params.id;
  const [growEquipment, setGrowEquipment] = useState<GrowEquipment | null>(null);

  useEffect(() => {
    const fetchGrowEquipmentDetail = async () => {
      try {
        const response = await apiClient.get<GrowEquipment>(
          `/growequipments/${growEquipmentId}`
        );
        setGrowEquipment(response.data);
      } catch (err: any) {
        console.error("Error fetching grow equipment details:", err);
        if (err.response?.status === 404) {
          setGrowEquipment(null);
        }
      }
    };

    if (growEquipmentId) {
      fetchGrowEquipmentDetail();
    }
  }, [growEquipmentId]);

  if (!growEquipment) {
    return <div className="p-4">Loading grow equipment details...</div>;
  }

  const API_URL = "https://fuego-ombm.onrender.com";

  // slice off date portion so we only pass "HH:mm"
  const startTime = growEquipment.startTime
    ? growEquipment.startTime.slice(11, 16)
    : "";
  const endTime = growEquipment.endTime
    ? growEquipment.endTime.slice(11, 16)
    : "";

  return (
    <BusinessDetails
      name={growEquipment.name}
      description={growEquipment.description}
      imagePath={
        growEquipment.imagePath
          ? `${API_URL}/images/GrowEquipments/${growEquipment.imagePath}`
          : ""
      }
      coverImagePath={
        growEquipment.coverImagePath
          ? `${API_URL}/images/GrowEquipments/${growEquipment.coverImagePath}`
          : ""
      }
      profileUrl={growEquipment.profileUrl}
      address={growEquipment.address}
      email={growEquipment.email}
      phone={growEquipment.phone}
      lat={growEquipment.lat}
      long={growEquipment.long}
      startDay={growEquipment.startDay}
      endDay={growEquipment.endDay}
      startTime={startTime}
      endTime={endTime}
      price={growEquipment.price}
    />
  );
};

export default GrowEquipmentDetail;
