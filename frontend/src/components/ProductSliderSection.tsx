import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import AdsCardWrapper from "./AdsCardWrapper";
import ProductCard from "./ProductCard";
import { Box } from "../Styles/StyledComponents";
import apiClient from "@/Apis/apiService";
import { Product } from "@/types/product";
import { Categories } from "@/types/categories";

interface GalleryRow {
  id:               string;
  title:            string;
  subTitle:         string;
  isGrid:           boolean | number;
  isSlide:          boolean | number;
  isButton:         boolean | number;
  buttonLabel:      string;
  buttonLink:       string;
  gridProductIds:   string[] | string;
  slideProductIds:  string[] | string;
}

interface Props {
  gallery?: GalleryRow;
  products?: Product[];
  categories?: Categories[];
  as?: React.ElementType;
}

export const ProductSliderSection: React.FC<Props> = ({
  gallery,
  products: homeProducts,
  categories: homeCategories,
  as: Section = Box,
}) => {
  const [gridProducts, setGridProducts]   = useState<Product[]>([]);
  const [slideProducts, setSlideProducts] = useState<Product[]>([]);
  const [categories, setCategories]       = useState<Categories[]>([]);
  const [headingTitle, setHeadingTitle]   = useState("");
  const [headingSubTitle, setHeadingSubTitle] = useState("");

  const [showGrid,  setShowGrid]  = useState(false);
  const [showSlide, setShowSlide] = useState(false);

  const [showButton, setShowButton]     = useState(false);
  const [buttonLabel, setButtonLabel]   = useState("");
  const [buttonLink,  setButtonLink]    = useState("");

  const toIds = (v: string[] | string) =>
    Array.isArray(v) ? v
                     : (JSON.parse(v) as string[]).filter(Boolean);

  /* ─── populate ────────────────────────────────────────────── */
  useEffect(() => {
    /* clear */
    setGridProducts([]); setSlideProducts([]); setCategories([]);
    setShowGrid(false); setShowSlide(false);
    setShowButton(false); setButtonLabel(""); setButtonLink("");

    /* HOME mode ------------------------------------------------ */
    if (!gallery) {
      if (!homeProducts || !homeCategories) return;

      setHeadingTitle("Featured Products");
      setHeadingSubTitle("");
      setGridProducts(homeProducts.slice(0, 6));
      setSlideProducts(homeProducts.slice(0, 4));
      setCategories(homeCategories);
      setShowGrid(true); setShowSlide(true);
      return;
    }

    /* GALLERY mode --------------------------------------------- */
    (async () => {
      setHeadingTitle(gallery.title);
      setHeadingSubTitle(gallery.subTitle);
      setShowGrid(!!gallery.isGrid);
      setShowSlide(!!gallery.isSlide);

      /* ★ decide once, purely by isButton */
      setShowButton(!!gallery.isButton);               // ★
      setButtonLabel(gallery.buttonLabel ?? "");
      setButtonLink(gallery.buttonLink  ?? "");

      const { data } = await apiClient.get<{ products: Product[] }>(
        "/products", { params: { pageSize: 1000 } }
      );
      const all = data.products;

      if (gallery.isGrid) {
        setGridProducts(toIds(gallery.gridProductIds)
          .map(id => all.find(p => p.id === id)!)
          .filter(Boolean));
      }
      if (gallery.isSlide) {
        setSlideProducts(toIds(gallery.slideProductIds)
          .map(id => all.find(p => p.id === id)!)
          .filter(Boolean));
      }

      if (!gallery.isButton) {                        // ★
        const { data: h } = await apiClient.get<{ categories: Categories[] }>("/api/home");
        setCategories(h.categories);
      }
    })();
  }, [gallery, homeProducts, homeCategories]);

  if (!showGrid && !showSlide) return null;

  return (
    <Section as="section" className="container my-12 w-4/5">
      <div className="text-center">
        <p className="text-[3rem] font-bold py-4">{headingTitle}</p>
        {headingSubTitle && (
          <p className="text-[1.7rem] text-gray-600 mb-6">{headingSubTitle}</p>
        )}

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {showButton && (
            <a
              href={buttonLink || "#"}
              target={buttonLink ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-[#1d4a34] border-[#333] text-xl px-10 py-2.5 uppercase
                         bg-white rounded-full border font-bold transition
                         hover:bg-[#333] hover:text-white"
            >
              {buttonLabel || "Zum Shop"}
            </a>
          )}

          {!gallery && categories.map(c => (
            <button
              key={c.id}
              className="text-[#1d4a34] border-[#333] text-xl px-10 py-2.5 uppercase
                         bg-white rounded-full border font-bold transition
                         hover:bg-[#333] hover:text-white"
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <Row className="pt-5 mt-4 grid">
        {showSlide && (
          <Col xl={3} lg={4} md={4} sm={12} xs={12}>
            <Box className="mb-4">
              <AdsCardWrapper product={slideProducts} />
            </Box>
          </Col>
        )}

        {showGrid && (
          <Col xl={showSlide ? 9 : 12}
               lg={showSlide ? 8 : 12}
               md={showSlide ? 8 : 12}
               sm={12} xs={12}>
            {gridProducts.length === 0 ? (
              <p className="text-gray-400">Zur Zeit keine Produkte verfügbar.</p>
            ) : (
              <Row className="g-4">
                {gridProducts.map(p => (
                  <Col key={p.id} xxl={3} xl={4} lg={4}
                       md={6} sm={12} xs={12}
                       className="pb-4 !px-5 transition-all duration-300 hover:scale-105">
                    <ProductCard product={p} height={44} />
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
