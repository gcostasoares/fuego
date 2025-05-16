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
  isButton:         boolean;
  buttonLabel:      string;
  buttonLink:       string;
  gridProductIds:   string[] | string;
  slideProductIds:  string[] | string;
}

interface Props {
  galleryId?: string;
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

  const [isButton, setIsButton]           = useState(false);
  const [buttonLabel, setButtonLabel]     = useState("");
  const [buttonLink,  setButtonLink]      = useState("");

  const parseIds = (ids: string[] | string): string[] => {
    if (Array.isArray(ids)) return ids;
    try { return JSON.parse(ids); }
    catch { return ids.split(",").map(s => s.trim()).filter(Boolean); }
  };

  useEffect(() => {
    /* reset products to avoid “random” leftovers */
    const clearDisplay = () => {
      setGridProducts([]);
      setSlideProducts([]);
      setIsGridActive(false);
      setIsSlideActive(false);
      setIsButton(false);
      setButtonLabel("");
      setButtonLink("");
    };

    /* HOME MODE ---------------------------------------------------------------- */
    const useHome = () => {
      clearDisplay();
      if (!homeProducts || !homeCategories) return;
      setGridProducts(homeProducts.slice(0, 6));
      setSlideProducts(homeProducts.slice(0, 4));
      setHeadingTitle("Featured Products");
      setHeadingSubTitle("");
      setCategories(homeCategories);
      setIsGridActive(true);
      setIsSlideActive(true);
    };

    /* GALLERY MODE -------------------------------------------------------------- */
    const loadGallery = async (id: string) => {
      clearDisplay();

      /* 1) meta row */
      const { data: gal } = await apiClient.get<Gallery>(`/gallery/${id}`);

      setHeadingTitle(gal.title);
      setHeadingSubTitle(gal.subTitle);
      setIsGridActive(gal.isGrid);
      setIsSlideActive(gal.isSlide);

      /* handle button even if isButton is missing */
      const buttonEnabled =
        "isButton" in gal
          ? !!gal.isButton
          : !!gal.buttonLabel || !!gal.buttonLink;

      setIsButton(buttonEnabled);
      setButtonLabel(gal.buttonLabel ?? "");
      setButtonLink(gal.buttonLink  ?? "");

      /* 2) full product catalogue once */
      const { data: prodPage } = await apiClient.get<{ products: Product[] }>(
        "/products", { params: { pageSize: 1000 } }
      );
      const all = prodPage.products;

      /* 3) map IDs */
      if (gal.isGrid) {
        const ids = parseIds(gal.gridProductIds);
        setGridProducts(ids.map(id => all.find(p => p.id === id)!).filter(Boolean));
      }
      if (gal.isSlide) {
        const ids = parseIds(gal.slideProductIds);
        setSlideProducts(ids.map(id => all.find(p => p.id === id)!).filter(Boolean));
      }

      /* 4) categories (fallback only) */
      if (!buttonEnabled) {
        const { data: h } = await apiClient.get<{ categories: Categories[] }>("/api/home");
        setCategories(h.categories);
      }
    };

    galleryId ? loadGallery(galleryId) : useHome();
  }, [galleryId, homeProducts, homeCategories]);

  /* hide section if literally nothing is active */
  if (!isGridActive && !isSlideActive) return null;

  /* ─────────────────────────── JSX ──────────────────────────── */
  return (
    <Section as="section" className="container my-12 w-4/5">
      {/* heading */}
      <div className="text-center">
        <p className="text-[3rem] font-bold py-4">{headingTitle}</p>
        {headingSubTitle && (
          <p className="text-[1.7rem] text-gray-600 mb-6">{headingSubTitle}</p>
        )}

        {/* CTA button or category chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {isButton ? (
            <a
              href={buttonLink || "#"}
              target={buttonLink ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-[#1d4a34] border-[#333] text-xl px-10 py-2.5 uppercase
                         bg-white rounded-full border font-bold transition
                         hover:bg-[#333] hover:text-white"
            >
              {buttonLabel || "Mehr Produkte"}
            </a>
          ) : (
            categories.map(c => (
              <button
                key={c.id}
                className="text-[#1d4a34] border-[#333] text-xl px-10 py-2.5 uppercase
                           bg-white rounded-full border font-bold transition
                           hover:bg-[#333] hover:text-white"
              >
                {c.name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* layout */}
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
                {gridProducts.map(prod => (
                  <Col
                    key={prod.id}
                    xxl={3}
                    xl={4}
                    lg={4}
                    md={6}
                    sm={12}
                    xs={12}
                    className="pb-4 !px-5 transition-all duration-300 hover:scale-105"
                  >
                    <ProductCard product={prod} height={44} />
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
