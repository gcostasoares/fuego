
// src/Pages/ProductDetail/ProductDetail.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Row, Col } from "react-bootstrap";

import apiClient from "@/Apis/apiService";
import Loader from "@/components/ui/loader";
import { Box } from "@/Styles/StyledComponents";
import { OutlineButton } from "./ProductSidebar";
import ProductDetailSidebar from "./Detail/ProductDetailSidebar";
import ProductDetailMainContent from "./Detail/ProductDetailMainContent";

export interface ProductDetailType {
  id: string;
  name: string;
  saleName: string;
  featuredProduct: string;
  price: number;
  thc: number;
  cbd: number;
  genetics: string;
  rating: number;
  imageUrl: string[];    // JSON parsed
  isAvailable: string;
  originId: string;
  manufacturerId: string;
  rayId: string;
  aboutFlower: string | null;
  growerDescription: string | null;
  defaultImageIndex: number;
}

interface SaleEntry {
  id: string;
  productId: string;
  price: number;
  title: string;
  subTitle: string;
  createdAt: string;
}

type DescriptionTab = "Flower" | "Grower";

export const ProductDetail: React.FC = () => {
  const { product: productId } = useParams({ from: "/detail/$product" });
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

  const [product, setProduct] = useState<null | (ProductDetailType & { imagePath: string[] })>(null);
  const [sale, setSale]       = useState<SaleEntry | null>(null);
  const [saleImage, setSaleImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDescriptionTab, setSelectedDescriptionTab] = useState<DescriptionTab>("Flower");

  // 1️⃣ Fetch product details
  useEffect(() => {
    if (!productId) return;
    setLoading(true);

    apiClient
      .get<ProductDetailType>(`/api/product/${productId}`)
      .then(resp => {
        const data = resp.data;
        const imagePath = (data.imageUrl || []).map(
          f => `${API_URL}/images/Products/${f}`
        );
        setProduct({ ...data, imagePath });
      })
      .catch(err => {
        console.error("Error fetching product:", err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [productId, API_URL]);

  // 2️⃣ Fetch sale entry and its product image
  useEffect(() => {
    if (!product) return;
    apiClient
      .get<SaleEntry[]>(`/saleproducts`, { params: { productId: product.id } })
      .then(resp => {
        if (resp.data.length) {
          const entry = resp.data[0];
          setSale(entry);
          // fetch product detail to get the sale product's own images
          return apiClient.get<ProductDetailType>(`/api/product/${entry.productId}`);
        }
        return null;
      })
      .then(resp => {
        if (resp && resp.data.imageUrl.length) {
          // use the first image of the sale product
          setSaleImage(`${API_URL}/images/Products/${resp.data.imageUrl[0]}`);
        }
      })
      .catch(err => {
        console.error("Error fetching sale or sale product:", err);
        setSale(null);
      });
  }, [product, API_URL]);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}>
        <Loader />
      </div>
    );
  }

  if (!product) {
    return <p className="p-4 text-center">Produkt nicht gefunden.</p>;
  }

  // pick first image for the main product display
  const mainImg = product.imagePath[0] || "";

  return (
    <div className="px-8 py-4">
      <Row>
        <Col md={6} xs={12} className="py-10">
          <Box>
            <ProductDetailSidebar
              manufacturerId={product.manufacturerId}
              images={product.imagePath}
            />
          </Box>
        </Col>
        <Col md={6} xs={12} className="py-5">
          <ProductDetailMainContent product={product} />
        </Col>
      </Row>

      {/* Description Tabs */}
      <div className="row pb-2" style={{ margin: "auto" }}>
        <div className="col-md-6" />
        <div className="col-md-6 flex space-x-4 mt-6">
          <OutlineButton
            onClick={() => setSelectedDescriptionTab("Flower")}
            className={`px-4 py-2 rounded-full border-black text-black ${
              selectedDescriptionTab === "Flower" ? "bg-black text-white" : ""
            }`}
          >
            Über die Blüte
          </OutlineButton>
          <OutlineButton
            onClick={() => setSelectedDescriptionTab("Grower")}
            className={`px-4 py-2 rounded-full border-black text-black ${
              selectedDescriptionTab === "Grower" ? "bg-black text-white" : ""
            }`}
          >
            Anbauer
          </OutlineButton>
        </div>
      </div>

      {/* Sale Box + Description */}
      {sale && (
        <div className="row" style={{ margin: "auto" }}>
          <div className="col-md-6 relative bg-black text-white rounded-lg overflow-hidden p-4 md:flex items-center">
            <div className="flex-1">
              {/* Title */}
              <h2 className="text-xl md:text-3xl font-bold">{sale.title}</h2>
              {/* Subtitle */}
              {sale.subTitle && (
                <p className="text-sm mt-2">{sale.subTitle}</p>
              )}
            </div>
            <div className="flex-shrink-0 mt-4 md:mt-0 text-center">
              {/* Sale product image */}
              {saleImage && (
                <img
                  loading="lazy"
                  src={saleImage}
                  alt={sale.title}
                  className="w-32 h-32 rounded-lg object-cover mx-auto"
                />
              )}
              {/* Price */}
              <p className="mt-2 text-center text-green-400 font-bold">
                {sale.price.toFixed(2)} €
              </p>
            </div>
          </div>

          {/* Product description */}
          <div className="mt-8 col-md-6 flex items-start p-4">
            <p className="text-gray-700 text-sm leading-6">
              {selectedDescriptionTab === "Grower"
                ? product.growerDescription || "Keine Anbauer-Infos verfügbar."
                : product.aboutFlower || "Keine Blüten-Infos verfügbar."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
