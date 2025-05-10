// src/components/ProductSliderSection.tsx

import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import AdsCardWrapper from "./AdsCardWrapper";
import ProductCard from "./ProductCard";
import { Box } from "../Styles/StyledComponents";
import apiClient from "@/Apis/apiService";
import { Product } from "@/types/product";
import { Categories } from "@/types/categories";

interface Gallery {
  id:               string;
  title:            string;
  subTitle:         string;
  isGrid:           boolean;
  isSlide:          boolean;
  gridProductIds:   string[] | string;
  slideProductIds:  string[] | string;
}

interface Props {
  // if passed, load this gallery; otherwise behave like your “home” slider
  galleryId?: string;
  // only used in “home” mode
  products?: Product[];
  categories?: Categories[];
  as?: React.ElementType;
}

export const ProductSliderSection: React.FC<Props> = ({
  galleryId,
  products: homeProducts,
  categories: homeCategories,
  as: Section = Box,
}) => {
  const [gridProducts, setGridProducts]   = useState<Product[]>([]);
  const [slideProducts, setSlideProducts] = useState<Product[]>([]);
  const [categories, setCategories]       = useState<Categories[]>([]);
  const [headingTitle, setHeadingTitle]   = useState("");
  const [headingSubTitle, setHeadingSubTitle] = useState("");
  const [isGridActive, setIsGridActive]   = useState(false);
  const [isSlideActive, setIsSlideActive] = useState(false);

  useEffect(() => {
    const loadHome = () => {
      // HOME MODE: use the passed-in props
      if (!homeProducts || !homeCategories) return;
      setGridProducts(homeProducts.slice(0, 6));
      setSlideProducts(homeProducts.slice(0, 4));
      setHeadingTitle("Featured Products");
      setHeadingSubTitle("");
      setCategories(homeCategories);
      setIsGridActive(true);
      setIsSlideActive(true);
    };

    const loadGallery = async (id: string) => {
      // GALLERY MODE: fetch exactly this gallery
      const { data: gal } = await apiClient.get<Gallery>(`/gallery/${id}`);
      setHeadingTitle(gal.title);
      setHeadingSubTitle(gal.subTitle);
      setIsGridActive(gal.isGrid);
      setIsSlideActive(gal.isSlide);

      // fetch all products
      const { data: prodPage } = await apiClient.get<{ products: Product[] }>(
        "/products",
        { params: { pageSize: 1000 } }
      );
      const all = prodPage.products;

      const parseIds = (ids: string[] | string): string[] => {
        if (Array.isArray(ids)) return ids;
        try { return JSON.parse(ids); }
        catch { return ids.split(",").map((s) => s.trim()).filter(Boolean); }
      };

      if (gal.isSlide) {
        const slideIds = parseIds(gal.slideProductIds);
        setSlideProducts(
          slideIds.map((id) => all.find((p) => p.id === id)!).filter(Boolean)
        );
      }
      if (gal.isGrid) {
        const gridIds = parseIds(gal.gridProductIds);
        setGridProducts(
          gridIds.map((id) => all.find((p) => p.id === id)!).filter(Boolean)
        );
      }

      // optional: load categories for filter buttons
      try {
        const { data: home } = await apiClient.get<{ categories: Categories[] }>(
          "/api/home"
        );
        setCategories(home.categories);
      } catch {}
    };

    if (galleryId) {
      loadGallery(galleryId);
    } else {
      loadHome();
    }
  }, [galleryId, homeProducts, homeCategories]);

  // hide if nothing active
  if (!isGridActive && !isSlideActive) return null;

  return (
    <Section as="section" className="container my-12 w-4/5">
      {/* Heading */}
      <div className="text-center">
        <p className="text-[3rem] font-bold py-4">{headingTitle}</p>
        {headingSubTitle && (
          <p className="text-[1.7rem] text-gray-600 mb-6">
            {headingSubTitle}
          </p>
        )}
        {/* category buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((c) => (
            <button
              key={c.id}
              className="text-[#1d4a34] border-[#333] text-xl px-10 py-2.5 uppercase bg-white rounded-full border font-bold hover:bg-[#333] hover:text-white"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <Row className="pt-5 mt-4 grid">
        {isSlideActive && (
          <Col xl={3} lg={4} md={4} sm={12} xs={12}>
            <Box className="mb-4">
              <AdsCardWrapper product={slideProducts} />
            </Box>
          </Col>
        )}
        {isGridActive && (
          <Col
            xl={isSlideActive ? 9 : 12}
            lg={isSlideActive ? 8 : 12}
            md={isSlideActive ? 8 : 12}
            sm={12}
            xs={12}
          >
            {gridProducts.length === 0 ? (
              <p className="text-gray-400">Zur Zeit keine Produkte verfügbar.</p>
            ) : (
              <Row className="g-4">
                {gridProducts.map((product) => (
                  <Col
                    key={product.id}
                    xxl={3}
                    xl={4}
                    lg={4}
                    md={6}
                    sm={12}
                    xs={12}
                    className="pb-4 !px-5 transition-all duration-300 hover:scale-105"
                  >
                    <ProductCard product={product} height={44} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        )}
      </Row>
    </Section>
  );
};
