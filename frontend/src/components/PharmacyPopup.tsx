// src/components/PharmacyPopup.tsx
import React, { useEffect, useState } from "react";
import apiClient from "@/Apis/apiService";
import { OutlineButton } from "@/Styles/StyledComponents";
import { Link } from "@tanstack/react-router";
import { Circle, X } from "lucide-react";

type PharmacyWithPrice = {
  id: string;
  price: number;
};

type DetailedPharmacy = PharmacyWithPrice & {
  name: string;
  address: string;
};

type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  pharmacies: PharmacyWithPrice[];
};

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, pharmacies }) => {
  const [detailed, setDetailed] = useState<DetailedPharmacy[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDetailed([]);
      return;
    }
    setLoading(true);
    Promise.all(
      pharmacies.map(async (p) => {
        try {
          const res = await apiClient.get(`/pharmacy/${p.id}`);
          return {
            id: p.id,
            price: p.price,
            name: res.data.name,
            address: res.data.address,
          };
        } catch {
          return { id: p.id, price: p.price, name: "—", address: "—" };
        }
      })
    )
      .then(setDetailed)
      .finally(() => setLoading(false));
  }, [isOpen, pharmacies]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-[70vw] max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="flex justify-between items-center pb-2 bg-[#333333] rounded-t-sm p-4">
          <img
            src="/images/home/fuego-new-logo.png"
            loading="lazy"
            className="w-1/4"
            alt="Logo"
          />
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white"
            aria-label="Close popup"
          >
            <X />
          </button>
        </div>

        {/* title */}
        <h2 className="text-2xl m-3 p-4 font-bold bg-[#f6f6f8] text-center rounded-xl border-2 border-[#3333]">
          Alle Preise und Apotheken
        </h2>

        {/* table */}
        <div className="mt-2 p-4">
          <table className="w-full border-separate" style={{ borderSpacing: "0 10px" }}>
            <thead>
              <tr>
                {["Apotheke", "Standort", "Preis"].map((h) => (
                  <th key={h} className="p-2 text-center">{h}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody className="table-bordered">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">Laden…</td>
                </tr>
              ) : (
                detailed.map((p) => (
                  <tr key={p.id} className="bg-[#f2f2f2] rounded-xl overflow-hidden">
                    <td className="border-[#3333] border-y-2 border-l-2 rounded-l-xl ps-6 text-center">
                      <p className="flex items-center justify-between">
                        <span>{p.name}</span>
                        <Circle
                          size={16}
                          fill={p.price > 0 ? "#00ff00" : "#fc0e0e"}
                          color={p.price > 0 ? "#00ff00" : "#fc0e0e"}
                        />
                      </p>
                    </td>
                    <td className="border-[#3333] border-y-2 p-2 text-center whitespace-nowrap text-ellipsis overflow-hidden max-w-xs">
                      {p.address}
                    </td>
                    <td className="border-[#3333] border-y-2 text-center">€ {p.price}</td>
                    <td className="border-[#3333] border-y-2 text-center border-r-2 p-2 rounded-r-xl">
                      <Link to={`/pharmacyDetail/${p.id}`}>
                        <OutlineButton variant="outline">Link</OutlineButton>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Popup;
