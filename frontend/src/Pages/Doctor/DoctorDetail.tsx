import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import apiClient from "@/Apis/apiService";
import BusinessDetails from "@/components/BusinessDetails";
import { Doctor } from "@/types/doctors";
import { API_URL } from "@/config";

export const DoctorDetail: React.FC = () => {
  const params = useParams({ from: "/doctorDetail/$id" });
  const doctorId = params.id;
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  const DEFAULT_COVER = "865b13da-61c7-4907-9d6d-584bf41aa0d6.png";

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await apiClient.get<Doctor>(`/doctors/${doctorId}`);
        setDoctor(res.data);
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setDoctor(null);
      }
    }
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  if (!doctor) {
    return <div className="p-4">Loading doctor details...</div>;
  }

  // slice out just "HH:mm"
  const startTime = doctor.startTime?.slice(11, 16) ?? "";
  const endTime   = doctor.endTime?.slice(11, 16)   ?? "";

  return (
    <BusinessDetails
      isDoctor
      name={doctor.name}
      description={doctor.description}
      imagePath={
        doctor.imagePath
          ? `${API_URL}/images/Doctors/${doctor.imagePath}`
          : ""
      }
      coverImagePath={
        `${API_URL}/images/Doctors/${(doctor.coverImagePath || DEFAULT_COVER)}`
      }
      profileUrl={doctor.profileUrl}
      address={doctor.address}
      email={doctor.email}
      phone={doctor.phone}
      lat={doctor.lat}
      long={doctor.long}
      startDay={doctor.startDay}
      endDay={doctor.endDay}
      startTime={startTime}
      endTime={endTime}
      price={doctor.price}
    />
  );
};

export default DoctorDetail;
