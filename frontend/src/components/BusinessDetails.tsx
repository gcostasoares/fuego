// src/components/BusinessDetails.tsx
import { Mail, MapPin, Phone } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button2 } from "./ui/button2";
import { Divider } from "@/Pages/Products/Detail/ProductDetailMainContent";
import apiClient from "@/Apis/apiService";

interface SaleEntry {
  id: string;
  productId: string;
  price: number;
  title: string;
  subTitle: string;
  createdAt: string;
}

interface ProductDetailType {
  imageUrl: string[]; // JSON array of filenames
}

interface BusinessDetailsProps {
  id: string;                         // ID of doctor/pharmacy
  name?: string;
  description?: string;
  imagePath?: string;
  profileUrl?: string;
  address?: string;
  email?: string;
  phone?: string;
  lat?: number;
  long?: number;
  startTime?: string;
  endTime?: string;
  startDay?: string;
  endDay?: string;
  price?: number;
  isDoctor?: boolean;
}

const BusinessDetails: React.FC<BusinessDetailsProps> = ({
  id,
  name,
  description,
  imagePath,
  address,
  phone,
  email,
  profileUrl,
  lat,
  long,
  price,
  startDay,
  endDay,
  startTime,
  endTime,
  isDoctor = false,
}) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";
  const [sale, setSale] = useState<SaleEntry | null>(null);
  const [saleImage, setSaleImage] = useState<string | null>(null);

  // fetch sale entry for this business id
  useEffect(() => {
    apiClient
      .get<SaleEntry[]>("/saleproducts", { params: { productId: id } })
      .then(resp => {
        if (resp.data.length) {
          const entry = resp.data[0];
          setSale(entry);
          // now fetch product to get its image
          return apiClient.get<ProductDetailType>(`/api/product/${entry.productId}`);
        }
      })
      .then(resp => {
        if (resp && resp.data.imageUrl.length) {
          // pick first image and build full URL
          setSaleImage(`${API_URL}/images/Products/${resp.data.imageUrl[0]}`);
        }
      })
      .catch(err => console.error("Error fetching sale or product:", err));
  }, [id, API_URL]);

  return (
    <div className="w-full min-h-screen flex flex-col ">
      <div className="flex flex-col gap-8 p-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="row md:w-1/2 items-center justify-center ">
            <div className="flex flex-col items-center space-y-5 col-md-6">
              <img
                src={imagePath || "/images/other/avatar.png"}
                alt={name}
                className="w-72 h-72 rounded-lg object-cover"
                loading="lazy"
              />
            </div>
          </div>

          <div className="flex flex-col md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-center md:text-start text-gray-800 col-md-6">
              {name}
            </h2>
            <div className="bg-[#fafafc] rounded-3xl p-6">
              {isDoctor && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Preise
                  </h3>
                  <div className="flex justify-between mt-2 text-gray-600">
                    <span>Kosten der Erstberatung</span>
                    <span>€{price?.toFixed(2)}</span>
                  </div>
                  <Divider />
                </>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Öffnungszeiten
                </h3>
                <div className="mt-2 text-gray-600 flex justify-between">
                  <p>{startDay}-{endDay}</p>
                  <p>{startTime?.substring(0, 5)}-{endTime?.substring(0, 5)}</p>
                </div>
              </div>
              <Divider />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Über</h3>
                <p className="mt-2 text-sm text-gray-600">{description}</p>
              </div>
            </div>
            {profileUrl && (
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                <Button2 isWhite>WEBSITE ANSEHEN</Button2>
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 ">
          <div className="flex flex-col bg-[#fafafc] rounded-3xl p-6 space-y-6 md:w-1/2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex justify-between items-center">
                <span className="mr-2 inline-flex">
                  <MapPin />
                  <span className="pl-2">Standort</span>
                </span>
                {lat != null && long != null && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${long}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button2 isWhite className="min-w-40">
                      Anfahrt
                    </Button2>
                  </a>
                )}
              </h3>
              <p className="mt-2 ml-9 text-gray-600">{address}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
                <span className="mr-2 inline-flex">
                  <Mail />
                  <span className="pl-2">Email</span>
                </span>
                {email && (
                  <a href={`mailto:${email}`} className="flex-shrink-0">
                    <Button2 isWhite>Email Kopieren</Button2>
                  </a>
                )}
              </h3>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="mt-2 ml-9 break-all text-gray-600 hover:text-[#333333]"
                >
                  {email}
                </a>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex justify-between">
                <span className="mr-2 inline-flex">
                  <Phone />
                  <span className="pl-2">Telefon</span>
                </span>
                {phone && (
                  <a href={`tel:${phone}`}>
                    <Button2 isWhite>Termin Buchen</Button2>
                  </a>
                )}
              </h3>
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="mt-2 ml-9 text-gray-600 hover:text-[#333333]"
                >
                  {phone}
                </a>
              )}
            </div>
          </div>

          {sale && (
            <div className="flex flex-col justify-center bg-black text-white overflow-hidden md:flex items-center p-4 rounded-lg md:w-1/2">
              <div className="flex-1">
                <h2 className="text-xl md:text-3xl font-bold">
                  {sale.title}
                </h2>
                {sale.subTitle && (
                  <p className="text-sm mt-2">{sale.subTitle}</p>
                )}
              </div>
              <div className="flex-shrink-0 mt-4 md:mt-0 text-center">
                {saleImage && (
                  <img
                    loading="lazy"
                    src={saleImage}
                    alt={sale.title}
                    className="w-32 h-32 rounded-lg object-cover mx-auto"
                  />
                )}
                <p className="mt-2 text-center text-green-400 font-bold">
                  {sale.price.toFixed(2)} €
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
