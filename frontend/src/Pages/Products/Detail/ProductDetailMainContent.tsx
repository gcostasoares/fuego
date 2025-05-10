// src/Pages/ProductDetail/Detail/ProductDetailMainContent.tsx
import React, { useEffect, useState } from "react";
import apiClient from "@/Apis/apiService";
import Popup from "@/components/PharmacyPopup";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { DisplayStart } from "@/Styles/StyledComponents";
import styled from "styled-components";
import {
  Origin,
  Product,
  Ray,
  Effect as ProductEffect,
  Terpene as ProductTerpene,
  Taste as ProductTaste,
} from "@/types/product";
import { Circle, IceCreamCone, Waves } from "lucide-react";

// German‐style price formatter
const priceFormatter = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ProductSection = styled.div`
  margin: 0 auto;
  font-family: Arial, sans-serif;
`;
const Title = styled.h1`
  font-size: 34px;
  font-weight: 600;
  margin: 0 0 8px;
`;
const SubTitle = styled.h2`
  font-size: 16px;
  margin: 0 0 16px;
`;
const TagContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
`;
const CardWrapper = styled.div`
  background-color: #fafafc;
  padding: 30px 20px;
  padding-left: 30px;
`;
const EffectsSection = styled.div`
  margin-bottom: 16px;
`;
const EffectsTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
`;
const EffectsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const Effect = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  text-align: center;
`;
const TerpenesSection = styled.div`
  margin-bottom: 16px;
`;
const TerpenesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const Terpene = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
`;
const AdditionalInfo = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 22px;
  margin-top: 16px;
`;
const InfoItem = styled.div`
  text-align: center;
  font-size: 14px;
  font-weight: bold;
`;
export const Divider = styled.div`
  border-bottom: 2px solid #e2e2e2;
  margin: 20px 0;
`;

interface ProductDetailMainContentProps {
  product: Product;
}

interface PharmacyWithPrice {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  price: number;
}

export const ProductDetailMainContent: React.FC<ProductDetailMainContentProps> = ({
  product,
}) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

  const [origin, setOrigin] = useState<Origin | null>(null);
  const [ray, setRay] = useState<Ray | null>(null);
  const [effects, setEffects] = useState<ProductEffect[]>([]);
  const [terpenes, setTerpenes] = useState<ProductTerpene[]>([]);
  const [tastes, setTastes] = useState<ProductTaste[]>([]);
  const [productPharmacies, setProductPharmacies] = useState<PharmacyWithPrice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchExtraDetails = async () => {
      try {
        setLoading(true);
        const [
          originRes,
          rayRes,
          effectsRes,
          terpenesRes,
          tastesRes,
          pharmaciesRes,
        ] = await Promise.all([
          apiClient.get<Origin>(`/Product/GetOriginById/${product.originId}`),
          apiClient.get<Ray>(`/Product/GetRayById/${product.rayId}`),
          apiClient.get<ProductEffect[]>(`/Product/GetProductEffects/${product.id}`),
          apiClient.get<ProductTerpene[]>(`/Product/GetProductTerpenes/${product.id}`),
          apiClient.get<ProductTaste[]>(`/Product/GetProductTastes/${product.id}`),
          apiClient.get<PharmacyWithPrice[]>(`/Product/GetProductPharmacies/${product.id}`),
        ]);

        setOrigin(originRes.data);
        setRay(rayRes.data);
        setEffects(effectsRes.data);
        setTerpenes(terpenesRes.data);
        setTastes(tastesRes.data);
        setProductPharmacies(pharmaciesRes.data);
      } catch (error: any) {
        console.error("Error fetching extra product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (product.id) {
      fetchExtraDetails();
    }
  }, [product.id, product.originId, product.rayId]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <ProductSection>
      <TagContainer>
        <div className="bg-[#e6f7d9] py-1 px-2 rounded-md font-bold">
          {product.genetics}
        </div>
        <div className="bg-[#e6f7d9] py-1 px-2 rounded-md font-bold">
          THC/CBD {product.thc}/{product.cbd}
        </div>
      </TagContainer>

      <Title>{product.name}</Title>
      <SubTitle className="font-semibold text-black">{product.saleName}</SubTitle>

      <div className="my-7 py-6 bg-[#fafafc] rounded-2xl px-8">
        {/* price formatted to 2 decimals */}
        <p className="text-4xl font-bold text-gray-900">
          ab € {priceFormatter.format(product.price)}
        </p>
        <div className="flex flex-wrap space-x-8 justify-start">
          <Button
            onClick={() => setIsPopupOpen(true)}
            size="sm"
            className="rounded-full mt-2"
          >
            Alle Preise und Apotheken
          </Button>
          <Popup
            pharmacies={productPharmacies}
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
          />
          <Button size="sm" className="rounded-full mt-2">
            Rezept Anfordern
          </Button>
        </div>
      </div>

      <CardWrapper className="flex-wrap py-5 rounded-2xl">
        {/* Effects */}
        <EffectsSection>
          <DisplayStart>
            <Circle />
            <EffectsTitle className="pl-2">EFFEKTE</EffectsTitle>
          </DisplayStart>
          <EffectsContainer>
            {effects.map((effect) => (
              <Effect key={effect.id}>
                <img
                  loading="lazy"
                  src={`/images/Effects/${effect.imagePath}`}
                  alt={effect.title}
                  className="size-14 mb-1 object-contain"
                />
                <span className="font-semibold">{effect.title}</span>
              </Effect>
            ))}
          </EffectsContainer>
        </EffectsSection>

        <Divider />

        {/* Terpenes */}
        <TerpenesSection>
          <DisplayStart>
            <Waves size={20} />
            <EffectsTitle className="pl-2">TERPENE</EffectsTitle>
          </DisplayStart>
          <TerpenesContainer>
            {terpenes.map((terpene) => (
              <Terpene key={terpene.id}>
                <img
                  loading="lazy"
                  src={`/images/Terpenes/${terpene.imagePath}`}
                  alt={terpene.title}
                  className="size-14 mb-1 object-contain"
                />
                <span className="font-semibold">{terpene.title}</span>
              </Terpene>
            ))}
          </TerpenesContainer>
        </TerpenesSection>

        <Divider />

        {/* Tastes */}
        <TerpenesSection>
          <DisplayStart>
            <IceCreamCone size={20} />
            <EffectsTitle className="pl-2">GESCHMACK</EffectsTitle>
          </DisplayStart>
          <TerpenesContainer>
            {tastes.map((taste) => (
              <Terpene key={taste.id}>
                <img
                  loading="lazy"
                  src={`/images/Tastes/${taste.imagePath}`}
                  alt={taste.title}
                  className="size-14 mb-1 object-contain"
                />
                <span className="font-semibold">{taste.title}</span>
              </Terpene>
            ))}
          </TerpenesContainer>
        </TerpenesSection>

        <Divider />

        {/* Additional Info */}
        <AdditionalInfo>
          <InfoItem>
            {ray ? (
              <>
                <img
                  loading="lazy"
                  src={`/images/Ray/${ray.imagePath}`}
                  alt={ray.name}
                  className="size-16 mb-1"
                />
                <span>{ray.name}</span>
              </>
            ) : (
              <span>Keine Ray-Daten</span>
            )}
          </InfoItem>
          <InfoItem>
            {origin ? (
              <>
                <img
                  loading="lazy"
                  src={`${API_URL}/images/Origin/${origin.imagePath}`}
                  alt={origin.name}
                  className="size-16 mb-1"
                />
                <span>{origin.name}</span>
              </>
            ) : (
              <span>Keine Origin-Daten</span>
            )}
          </InfoItem>
        </AdditionalInfo>
      </CardWrapper>
    </ProductSection>
  );
};

export default ProductDetailMainContent;
