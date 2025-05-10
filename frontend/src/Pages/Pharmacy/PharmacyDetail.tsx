// src/Pages/PharmacyDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import apiClient from "@/Apis/apiService";
import BusinessDetails from "@/components/BusinessDetails";
import { Pharmacy } from "@/types/doctors";

// point at your Express server
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

export const PharmacyDetail: React.FC = () => {
  const { id: pharmacyId } = useParams({ from: "/pharmacyDetail/$id" });
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);

  useEffect(() => {
    if (!pharmacyId) return;
    (async () => {
      try {
        const { data } = await apiClient.get<Pharmacy>(`/pharmacy/${pharmacyId}`);
        setPharmacy(data);
      } catch (err: any) {
        console.error("Error fetching pharmacy details:", err);
        setPharmacy(null);
      }
    })();
  }, [pharmacyId]);

  if (!pharmacy) {
    return <div className="p-4">Loading pharmacy details…</div>;
  }

  return (
    <BusinessDetails
      name={pharmacy.name}
      description={pharmacy.description}
      profileUrl={pharmacy.profileUrl}
      address={pharmacy.address}
      email={pharmacy.email}
      phone={pharmacy.phone}
      lat={pharmacy.lat}
      long={pharmacy.long}
      price={(pharmacy as any).price}      /* if your Pharmacy type has price */
      startDay={pharmacy.startDay}
      endDay={pharmacy.endDay}
      startTime={pharmacy.startTime}
      endTime={pharmacy.endTime}
      imagePath={
        pharmacy.imagePath
          ? `${API_URL}/images/Pharmacy/${pharmacy.imagePath}`
          : ""
      }
      coverImagePath={
        pharmacy.coverImagePath
          ? `${API_URL}/images/Pharmacy/${pharmacy.coverImagePath}`
          : ""
      }
    />
  );
};

export default PharmacyDetail;
