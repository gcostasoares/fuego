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
import { API_URL } from "@/config";

interface HomeData {
  products: Product[];
  categories: Categories[];
  articles: Articles[];
  carousels: Carousel[];
  shopSectionTitle: string;
  shopSectionDescription: string;
}

interface GalleryRow {
  id: string;
  title: string;
  subTitle: string;
  isGrid: boolean;
  isSlide: boolean;
  isButton: boolean;
  buttonLabel: string;
  buttonLink: string;
  gridProductIds: string[] | string;
  slideProductIds: string[] | string;
}


export const Home: React.FC = () => {
  const [homeData, setHomeData]         = useState<HomeData | null>(null);
  const [shopDescriptions, setSD]       = useState<ShopDescription[]>([]);
  const [partnerLogos, setPartnerLogos] = useState<Logos[]>([]);
  const [galleries, setGalleries]       = useState<GalleryRow[] | null>(null); // ← null = still loading
  const [loading, setLoading]           = useState(true);

  /* ── load once ─────────────────────────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        /* 1) home basics */
        const { data: h } = await axios.get<Partial<HomeData>>(`${API_URL}/api/home`);

        const products: Product[] = (h.products ?? []).map((p: any) => {
          let imgs: string[] = [];
          try { imgs = JSON.parse((p.imageUrl || "").replace(/\\/g, "")); } catch {}
          return { ...p, imageUrl: imgs };
        });

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

        const carousels: Carousel[] = (h.carousels ?? []).map((c: any) => ({
          id: c.id,
          title: c.title,
          subTitle: c.subTitle,
          description: c.description,
          imagePath: `${API_URL}/images/Carousel/${c.imagePath ?? c.imageUrl}`,
        }));

        /* 2) shop descriptions */
        const { data: sd } = await axios.get<ShopDescription[]>(
          `${API_URL}/api/shopdescriptions`
        );
        const sdList = sd.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          imagePath: `${API_URL}/images/ShopDescriptions/${s.imagePath}`,
        }));

        /* 3) partner logos */
        const { data: pl } = await axios.get<{ id:string; imagePath:string }[]>(
          `${API_URL}/api/partnerlogos`
        );
        const logoList: Logos[] = pl.map(l => ({
          id: l.id,
          imagePath: `${API_URL}/images/PartnerLogos/${l.imagePath}`,
        }));

        /* 4) galleries */
        const { data: gal } = await axios.get<GalleryRow[]>(`${API_URL}/gallery`);

        setHomeData({
          products,
          categories: h.categories || [],
          articles,
          carousels,
          shopSectionTitle: h.shopSectionTitle || "",
          shopSectionDescription: h.shopSectionDescription || "",
        });
        setSD(sdList);
        setPartnerLogos(logoList);
        setGalleries(gal);                 // ← now non-null
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* still boot-loading galleries → just show big spinner */
  if (!homeData || galleries === null) {
    return <CenterDiv><Loader /></CenterDiv>;
  }

  const hasGalleries   = galleries.length > 0;
  const firstGallery   = hasGalleries ? galleries[0] : undefined;
  const otherGalleries = hasGalleries ? galleries.slice(1) : [];

  return (
    <>
      {/* hero carousel */}
      <CarouselSlider loading={loading} carousels={homeData.carousels} />

      {/* partner logos */}
      <LogoSliderWrapper>
        {loading ? <CenterDiv><Loader/></CenterDiv>
                  : <LogoSliderSection logos={partnerLogos} />}
      </LogoSliderWrapper>

      {/* FIRST product-slider */}
      {hasGalleries ? (
        <ProductSliderSection gallery={firstGallery} as="section" />
      ) : (
        <ProductSliderSection
          products={homeData.products}
          categories={homeData.categories}
          as="section"
        />
      )}

      {/* feature section */}
      <FeatureSection
        shopSectionTitle={homeData.shopSectionTitle}
        shopSectionDescription={homeData.shopSectionDescription}
        logos={partnerLogos}
        shopDescriptions={shopDescriptions}
      />

      {/* remaining galleries */}
      {otherGalleries.map(g => (
        <GallerySection key={g.id}>
          <ProductSliderSection gallery={g} />
        </GallerySection>
      ))}

      {/* news */}
      {loading ? <CenterDiv><Loader/></CenterDiv>
               : <NewsSection articles={homeData.articles} />}
    </>
  );
};

/* ───── styled helpers ────────────────────────────────────────── */
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
