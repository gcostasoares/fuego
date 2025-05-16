import React, { useEffect, useState } from "react";
import Col   from "react-bootstrap/Col";
import Row   from "react-bootstrap/Row";
import AdsCardWrapper from "./AdsCardWrapper";
import ProductCard   from "./ProductCard";
import { Box } from "../Styles/StyledComponents";
import apiClient from "@/Apis/apiService";
import { Product }     from "@/types/product";
import { Categories }  from "@/types/categories";

/* row from /gallery */
interface GalleryRow {
  id:               string;
  title:            string;
  subTitle:         string;
  isGrid:           boolean | number | string | null;
  isSlide:          boolean | number | string | null;
  isButton:         boolean | number | string | null;
  buttonLabel:      string | null;
  buttonLink:       string | null;
  gridProductIds:   string[] | string;
  slideProductIds:  string[] | string;
}

interface Props {
  gallery?:    GalleryRow;     // gallery mode when present
  products?:   Product[];      // home/featured fallback
  categories?: Categories[];   // home/featured fallback
  as?:         React.ElementType;
}

export const ProductSliderSection: React.FC<Props> = ({
  gallery,
  products: homeProducts,
  categories: homeCategories,
  as: Section = Box,
}) => {
  /* state */
  const [grid,   setGrid]   = useState<Product[]>([]);
  const [slide,  setSlide]  = useState<Product[]>([]);
  const [cats,   setCats]   = useState<Categories[]>([]);
  const [title,  setTitle]  = useState("");
  const [sub,    setSub]    = useState("");

  const [gridON,  setGridON]  = useState(false);
  const [slideON, setSlideON] = useState(false);

  const [btnON,   setBtnON]   = useState(false);
  const [btnLab,  setBtnLab]  = useState("");
  const [btnHref, setBtnHref] = useState("");

  /* helpers */
  const toIds = (v: string[] | string) => {
    if (Array.isArray(v)) return v;
    try { return JSON.parse(v); }
    catch { return v.split(",").map(s=>s.trim()).filter(Boolean); }
  };
  const truthy = (x: any) =>
    x === true || x === 1 || x === "1" || String(x).toLowerCase() === "true";

  /* populate */
  useEffect(() => {
    setGrid([]); setSlide([]); setCats([]);
    setGridON(false); setSlideON(false);
    setBtnON(false); setBtnLab(""); setBtnHref("");

    /* --------------- HOME / FEATURED ------------------ */
    if (!gallery) {
      if (!homeProducts || !homeCategories) return;
      setTitle("Featured Products"); setSub("");
      setGrid(homeProducts.slice(0,6));
      setSlide(homeProducts.slice(0,4));
      setCats(homeCategories);
      setGridON(true); setSlideON(true);
      return;
    }

    /* --------------- GALLERY -------------------------- */
    (async () => {
      setTitle(gallery.title); setSub(gallery.subTitle);
      setGridON( !!gallery.isGrid );
      setSlideON(!!gallery.isSlide );

      /* decide CTA */
      const enableBtn =
        truthy(gallery.isButton) ||
        !!gallery.buttonLabel?.trim() ||
        !!gallery.buttonLink?.trim();

      setBtnON(enableBtn);
      setBtnLab(gallery.buttonLabel?.trim() || "");
      setBtnHref(gallery.buttonLink?.trim()  || "");

      /* fetch catalogue */
      const { data } = await apiClient.get<{ products:Product[] }>(
        "/products", { params:{ pageSize:1000 } });
      const all = data.products;

      if (gallery.isGrid) {
        setGrid( toIds(gallery.gridProductIds)
          .map(id=>all.find(p=>p.id===id)!).filter(Boolean) );
      }
      if (gallery.isSlide) {
        setSlide( toIds(gallery.slideProductIds)
          .map(id=>all.find(p=>p.id===id)!).filter(Boolean) );
      }
    })();
  }, [gallery, homeProducts, homeCategories]);

  if (!gridON && !slideON) return null;

  /* — debug — remove after verifying — */
  console.log("[ProductSlider] title:", title,
              "| btnON:", btnON, "| label:", btnLab, "| link:", btnHref);

  return (
    <Section as="section" className="container my-12 w-4/5">
      <div className="text-center">
        <p className="text-[3rem] font-bold py-4">{title}</p>
        {sub && <p className="text-[1.7rem] text-gray-600 mb-6">{sub}</p>}

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {btnON && (
            <a
              href={btnHref || "#"}
              target={btnHref ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-[#1d4a34] border-[#333] text-xl px-10 py-2.5 uppercase
                         bg-white rounded-full border font-bold transition
                         hover:bg-[#333] hover:text-white"
            >
              {btnLab || "Zum Shop"}
            </a>
          )}

          {!gallery && cats.map(c => (
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

      {/* layout */}
      <Row className="pt-5 mt-4 grid">
        {slideON && (
          <Col xl={3} lg={4} md={4} sm={12} xs={12}>
            <Box className="mb-4">
              <AdsCardWrapper product={slide} />
            </Box>
          </Col>
        )}

        {gridON && (
          <Col xl={slideON ? 9 : 12} lg={slideON ? 8 : 12}
               md={slideON ? 8 : 12} sm={12} xs={12}>
            {grid.length === 0 ? (
              <p className="text-gray-400">Zur Zeit keine Produkte verfügbar.</p>
            ) : (
              <Row className="g-4">
                {grid.map(p => (
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
