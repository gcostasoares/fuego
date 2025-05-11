/* ──────────────────────────────────────────────────────────── */
/*  ProductCard.tsx                                            */
/* ──────────────────────────────────────────────────────────── */
import styled from "styled-components";
import { Link }   from "@tanstack/react-router";
import { Product } from "@/types/product";
import { Box }    from "../Styles/StyledComponents";

/* ---------- helper ----------------------------------------- */

const API_URL = "https://fuego-ombm.onrender.com";
const PLACEHOLDER = `${API_URL}/images/Products/1.png`;        // make sure this exists

/** Returns a full URL for a product image or the placeholder */
const toProductImgUrl = (file?: string) =>
  !file
    ? PLACEHOLDER
    : file.startsWith("http")
      ? file
      : `${API_URL}/images/Products/${file}`;

/* ---------- component -------------------------------------- */

interface Props {
  product: Product;
  height: 44 | 52 | 56;
}

export default function ProductCard({ product, height }: Props) {
  /* 1) pick first non-empty entry from the array */
  const firstImg =
    Array.isArray(product.imageUrl) && product.imageUrl.length > 0
      ? product.imageUrl.find((s) => s && s.trim())   // skip empty strings
      : undefined;

  /* 2) turn it into a URL (or placeholder) */
  const imageUrl = toProductImgUrl(firstImg);

  return (
    <Card as={Link} to={`/detail/${product.id}`}>
      <div
        className={`bg-[#fafafc] rounded-xl ${
          height === 52 && "min-h-[317px]"
        }`}
      >
        <ImageWrapper>
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER;
              e.currentTarget.onerror = null;
            }}
            className={`w-full ${
              height === 44
                ? "h-44"
                : height === 52
                ? "h-52"
                : "h-60"
            } object-scale-down rounded-xl ${
              height === 44 ? "scale-105" : ""
            }`}
          />
        </ImageWrapper>

        <div className="p-2.5 mt-1 rounded-lg mb-3">
          <ProductTitle className="text-xl font-bold text-nowrap overflow-hidden text-ellipsis">
            {product.name}
          </ProductTitle>

          {product.saleName && (
            <h4 className="text-md text-[#000]">{product.saleName}</h4>
          )}

          <div className="flex justify-between">
            <Box>
              <RatioPrice>
                {product.thc}/{product.cbd}
              </RatioPrice>
              <RatioTag>THC/CBD</RatioTag>
            </Box>

            <Box>
              <h3 className="text-black text-xl font-semibold">
                €{" "}
                {product.price.toLocaleString("de-DE", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h3>
            </Box>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ---------- styled bits (unchanged) ------------------------ */

const Card = styled(Link)`
  overflow: hidden;
  margin-bottom: 20px;
  font-family: Arial, sans-serif;
  text-decoration: none;
`;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background-color: #333333;
`;

const ProductTitle = styled.h2`
  color: #000;
  font-weight: 600;
`;

const RatioPrice = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #000;
`;

const RatioTag = styled.div`
  font-size: 8px;
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
`;
