// src/Pages/Home/Home.tsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

import Loader from "@/components/ui/loader";
import { CarouselSlider } from "@/components/CarouselSlider";
import LogoSliderSection from "@/components/LogoSliderSection";
import { ProductSliderSection } from "@/components/ProductSliderSection";
import { FeatureSection } from "./FeatureSection";
import { NewsSection } from "./NewsSection";

import { Articles } from "@/types/articles";
import { Carousel } from "@/types/carousel";
import { Categories } from "@/types/categories";
import { Logos } from "@/types/logos";
import { Product } from "@/types/product";
import { ShopDescription } from "@/types/shopDescription";

interface HomeData {
  products: Product[];
  categories: Categories[];
  articles: Articles[];
  carousels: Carousel[];
  shopSectionTitle: string;
  shopSectionDescription: string;
}

interface RawGallery {
  id: string;
  title: string;
  subTitle: string;
  isGrid: boolean;
  isSlide: boolean;
  gridProductIds: string[] | string;
  slideProductIds: string[] | string;
}

export const Home: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [shopDescriptions, setShopDescriptions] = useState<ShopDescription[]>([]);
  const [partnerLogos, setPartnerLogos] = useState<Logos[]>([]);
  const [galleries, setGalleries] = useState<RawGallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // 1) fetch home payload
        const { data: h } = await axios.get<Partial<HomeData>>(
          `${API_URL}/api/home`
        );

        // map products
        const products: Product[] = (h.products ?? []).map((p: any) => {
          let imgs: string[] = [];
          try {
            imgs = JSON.parse((p.imageUrl || "").replace(/\\/g, ""));
          } catch {}
          return { ...p, imageUrl: imgs };
        });

        // map carousels
        const carousels: Carousel[] = (h.carousels ?? []).map((c: any) => ({
          id: c.id,
          title: c.title,
          subTitle: c.subTitle,
          description: c.description,
          imagePath: `${API_URL}/images/Carousel/${c.imagePath ?? c.imageUrl}`,
        }));
        carousels.sort((a, b) => {
          const na = parseInt(a.title.replace(/^\D+/, ""), 10) || 0;
          const nb = parseInt(b.title.replace(/^\D+/, ""), 10) || 0;
          return na - nb;
        });

        // map articles
        const articles: Articles[] = (h.articles ?? []).map((a: any) => ({
          id: a.id,
          title: a.title.replace(/^[0-9]{2}-/, ""),
          content: a.content,
          url: a.url || a.link,
          link: a.url || a.link,
          imageUrl: `${API_URL}/images/Articles/${a.imagePath || a.imageUrl}`,
          imagePath: `${API_URL}/images/Articles/${a.imagePath || a.imageUrl}`,
          date: a.createdAt || a.date,
          tagIds: a.tagIds,
        }));

        // 2) fetch shop descriptions in DB order
        const { data: sd } = await axios.get<ShopDescription[]>(
          `${API_URL}/api/shopdescriptions`
        );
        const shopDescList = sd.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          imagePath: `${API_URL}/images/ShopDescriptions/${s.imagePath}`,
        }));

        // 3) fetch partner logos
        const { data: logos } = await axios.get<{ id: string; imagePath: string }[]>(
          `${API_URL}/api/partnerlogos`
        );
        const logosList: Logos[] = logos.map((l) => ({
          id: l.id,
          imagePath: `${API_URL}/images/PartnerLogos/${l.imagePath}`,
        }));

        // 4) fetch all galleries
        const { data: gal } = await axios.get<RawGallery[]>(`${API_URL}/gallery`);

        // set state
        setHomeData({
          products,
          categories: h.categories || [],
          articles,
          carousels,
          shopSectionTitle: h.shopSectionTitle || "",
          shopSectionDescription: h.shopSectionDescription || "",
        });
        setShopDescriptions(shopDescList);
        setPartnerLogos(logosList);
        setGalleries(gal);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!homeData) {
    return <CenterDiv><Loader /></CenterDiv>;
  }

  // Split off the first slider, keep it unchanged
  const [firstGallery, ...otherGalleries] = galleries;

  return (
    <>
      {/* Hero carousel */}
      <CarouselSlider loading={loading} carousels={homeData.carousels} />

      {/* Partner logos */}
      {loading ? (
        <CenterDiv><Loader /></CenterDiv>
      ) : (
        <LogoSliderWrapper>
          <LogoSliderSection logos={partnerLogos} />
        </LogoSliderWrapper>
      )}

      {/* First ProductSliderSection (original home view) */}
      {loading ? (
        <CenterDiv><Loader /></CenterDiv>
      ) : (
        <ProductSliderSection
          as="section"
          products={homeData.products}
          categories={homeData.categories}
        />
      )}

      {/* Feature section */}
      <FeatureSection
        shopSectionTitle={homeData.shopSectionTitle}
        shopSectionDescription={homeData.shopSectionDescription}
        logos={partnerLogos}
        shopDescriptions={shopDescriptions}
      />

      {/* Render a ProductSliderSection for each of the other galleries */}
      {otherGalleries.map((g) => (
        <GallerySection key={g.id}>
          <ProductSliderSection galleryId={g.id} />
        </GallerySection>
      ))}

      {/* News */}
      {loading ? (
        <CenterDiv><Loader /></CenterDiv>
      ) : (
        <NewsSection articles={homeData.articles} />
      )}
    </>
  );
};

const LogoSliderWrapper = styled.section`
  background-color: #333;
  padding: 16px 0;
`;
const CenterDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
`;
const GallerySection = styled.section`
  margin: 4rem auto;
  width: 80%;
`;
