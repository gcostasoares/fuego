import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import AdsCardWrapper from "./AdsCardWrapper";
import ProductCard from "./ProductCard";
import { Box } from "../Styles/StyledComponents";
import apiClient from "@/Apis/apiService";
import { Product } from "@/types/product";
import { Categories } from "@/types/categories";

/* Row returned by /gallery */
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
  /** If present → “gallery” mode, otherwise “home/featured” mode */
  gallery?: GalleryRow;

  /* fallback props for home/featured mode */
  products?: Product[];
  categories?: Categories[];

  /** Element type for the outer section. Default: Box */
  as?: React.ElementType;
}

export const ProductSliderSection: React.FC<Props> = ({
  gallery,
  products: homeProducts,
  categories: homeCategories,
  as: Section = Box,
}) => {
  /* ─── display state ───────────────────────────────────────── */
  const [gridProducts, setGridProducts]   = useState<Product[]>([]);
  const [slideProducts, setSlideProducts] = useState<Product[]>([]);
  const [categories, setCategories]       = useState<Categories[]>([]);

  const [headingTitle, setHeadingTitle]       = useState("");
  const [headingSubTitle, setHeadingSubTitle] = useState("");

  const [showGrid,  setShowGrid]  = useState(false);
  const [showSlide, setShowSlide] = useState(false);

  const [showButton, setShowButton]     = useState(false);
  const [buttonLabel, setButtonLabel]   = useState("");
  const [buttonLink,  setButtonLink]    = useState("");

  /* helper: NVARCHAR JSON or CSV → string[] */
  const toIds = (v: string[] | string): string[] => {
    if (Array.isArray(v)) return v;
    try { return JSON.parse(v); }
    catch { return v.split(",").map(s => s.trim()).filter(Boolean); }
  };

  /* ─── populate whenever props change ───────────────────────── */
  useEffect(() => {
    /* reset all state */
    setGridProducts([]); setSlideProducts([]); setCategories([]);
    setShowGrid(false); setShowSlide(false);
    setShowButton(false); setButtonLabel(""); setButtonLink("");

    /* — HOME / FEATURED mode — */
    if (!gallery) {
      if (!homeProducts || !homeCategories) return;

      setHeadingTitle("Featured Products");
      setHeadingSubTitle("");

      setGridProducts(homeProducts.slice(0, 6));
      setSlideProducts(homeProducts.slice(0, 4));
      setCategories(homeCategories);

      setShowGrid(true);
      setShowSlide(true);
      return;
    }

    /* — GALLERY mode — */
    (async () => {
      setHeadingTitle(gallery.title);
      setHeadingSubTitle(gallery.subTitle);
      setShowGrid(!!gallery.isGrid);
      setShowSlide(!!gallery.isSlide);

      /* decide *once* whether to show the CTA
         show when:  isButton == 1 | true
                  OR buttonLabel is non-empty
                  OR buttonLink  is non-empty                      */
      const buttonEnabled =
        !!gallery.isButton ||
        !!gallery.buttonLabel?.trim() ||
        !!gallery.buttonLink?.trim();

      setShowButton(buttonEnabled);
      setButtonLabel(gallery.buttonLabel?.trim() || "");
      setButtonLink(gallery.buttonLink?.trim()  || "");

      /* fetch full product catalogue once */
      const { data } = await apiClient.get<{ products: Product[] }>(
        "/products", { params: { pageSize: 1000 } }
      );
      const all = data.products;

      if (gallery.isGrid) {
        const ids = toIds(gallery.gridProductIds);
        setGridProducts(ids.map(id => all.find(p => p.id === id)!).filter(Boolean));
      }
      if (gallery.isSlide) {
        const ids = toIds(gallery.slideProductIds);
        setSlideProducts(ids.map(id => all.find(p => p.id === id)!).filter(Boolean));
      }

      /* we only need category chips if the gallery button is OFF */
      if (!buttonEnabled) {
        const { data: h } = await apiClient.get<{ categories: Categories[] }>("/api/home");
        setCategories(h.categories);
      }
    })();
  }, [gallery, homeProducts, homeCategories]);

  /* nothing to render */
  if (!showGrid && !showSlide) return null;

  const showChips = !gallery && categories.length > 0; // chips only in home mode

  /* ─── JSX ─────────────────────────────────────────────────── */
  return (
    <Section as="section" className="container my-12 w-4/5">
      {/* Heading */}
      <div className="text-center">
        <p className="text-[3rem] font-bold py-4">{headingTitle}</p>
        {headingSubTitle && (
          <p className="text-[1.7rem] text-gray-600 mb-6">{headingSubTitle}</p>
        )}

        {/* CTA button or category chips */}
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

          {showChips &&
            categories.map(c => (
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

      {/* Grid + Slide layout */}
      <Row className="pt-5 mt-4 grid">
        {showSlide && (
          <Col xl={3} lg={4} md={4} sm={12} xs={12}>
            <Box className="mb-4">
              <AdsCardWrapper product={slideProducts} />
            </Box>
          </Col>
        )}

        {showGrid && (
          <Col
            xl={showSlide ? 9 : 12}
            lg={showSlide ? 8 : 12}
            md={showSlide ? 8 : 12}
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
