import apiClient from "@/Apis/apiService";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import Loader from "@/components/ui/loader";
import { Manufacturer } from "@/types/product";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
`;

const MainImage = styled.div`
  width: 60%;
  max-width: 461px;
  height: 40%; /* Set a fixed height for the container */
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  overflow: hidden; /* Ensures any overflow is hidden */
  background-color: #f8f8f8; /* Optional: background color for padding effect */

  img {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Ensures the image scales without distortion */
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }
`;

const Thumbnail = styled.img`
  width: 80%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  transition: border 0.3s;
  display: inline-flex;

  &:hover {
    border: 2px solid #000;
  }
  &.active {
    border: 2px solid #000;
  }
`;
const CarouselContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  width: 100%;
`;


interface ProductSliderProps {
  images: string[] | undefined;
  manufacturerId: string | undefined;
}

const ProductDetailSidebar: React.FC<ProductSliderProps> = ({
  images,
  manufacturerId,
}) => {

  const defaultImage = "/images/product/1.png";
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [producer, setProducers] = useState<Manufacturer>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        if (manufacturerId) {
          const prod = await apiClient.get(
            `/Product/GetManufacturerById/${manufacturerId}`
          );
          setProducers(prod.data);
        }
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    };

    if (manufacturerId) fetchProductDetails();
  }, [manufacturerId]);

  useEffect(() => {
    if (images?.length! > 0) {
      setSelectedImage(images?.[0] || defaultImage);
    } else {
      setSelectedImage(defaultImage);
    }
  }, [images]);

  return (
    <SliderContainer>
      {/* Main Image */}
      <MainImage>
        <img src={selectedImage} alt="Product" loading="lazy" />
      </MainImage>
      {/* Thumbnail Carousel */}
      {images && (
        <Carousel className="p-3 w-2/3 mb-36">
          <CarouselContent>
            {images.map((logo, i) => (
              <CarouselItem
                className="basis-[1/1.5] sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                key={logo + i}
              >
                <Thumbnail
                  loading="lazy"
                  src={logo}
                  alt={`Thumbnail ${i + 1}`}
                  className={
                    selectedImage === logo
                      ? "active"
                      : ""
                  }
                  onClick={() => setSelectedImage(logo)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
      {loading ? (
        <Loader />
      ) : (
        <img
            src={producer?.imagePath && `/images/Manufacturer/${producer.imagePath}`}
            loading="lazy"
            alt={producer?.name}
            className="w-10/12 h-auto max-h-56 max-w-lg rounded object-contain px-3 border-y-2"
          />

      )}
    </SliderContainer>
  );
};
export default ProductDetailSidebar;
