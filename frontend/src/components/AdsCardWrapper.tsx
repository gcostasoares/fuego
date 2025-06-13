// src/components/AdsCardWrapper.tsx
import React , { useEffect } from "react";
import styled from "styled-components";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "@tanstack/react-router";

import { Product } from "@/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./ui/carousel";
import { API_URL } from "@/config";

const PLACEHOLDER = `${API_URL}/images/Products/1.png`;

const toProductImgUrl = (file?: string) =>
  !file
    ? PLACEHOLDER
    : file.startsWith("http")
      ? file
      : `${API_URL}/images/Products/${file}`;

const Card = styled.div`
  display: flex;
  align-items: center;
  background-color: #333333;
  border-radius: 16px;
  padding: 10px;
  color: #ffffff;
  position: relative;
  overflow: hidden;
`;

const Image = styled.img`
  margin-bottom: 16px;
  z-index: 1;
  position: relative;
`;

interface Props {
  product?: Product[];
}

const AdsCardWrapper: React.FC<Props> = ({ product }) => {
  const list = Array.isArray(product) ? product : [];

  // **If you have zero items, bail out early**
  if (!list.length) return null;

  // **Show up to 8 slides**, in the exact order you passed in
  const slides = list.slice(0, 8);

  const autoplay = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[autoplay.current]}
      className="w-full max-w-xs my-0"
      onMouseLeave={autoplay.current.reset}
    >
      <Card className="align-items-center shadow-lg h-1/5 justify-start rounded-3xl bg-gradient-to-b from-[#333333] via-[#8e8e8e] to-[#333333]">
        <CarouselContent>
          {slides.map((p) => {
            const imgs = Array.isArray(p.imageUrl) ? p.imageUrl : [];
            const raw  =
              typeof p.defaultImageIndex === "number" &&
              imgs[p.defaultImageIndex]
                ? imgs[p.defaultImageIndex]
                : imgs[0];
            const imageUrl = toProductImgUrl(raw);

            return (
              <CarouselItem key={p.id}>
                <Link
                  href={`/detail/${p.id}`}
                  className="cursor-pointer text-white hover:text-white"
                >
                  <Image
                    src={imageUrl}
                    alt={p.name}
                    loading="lazy"
                    className="rounded-3xl"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                      e.currentTarget.onerror = null;
                    }}
                  />
                  <h2 className="text-2xl font-bold m-3">{p.name}</h2>
                  {p.saleName && (
                    <h2 className="text-xl mx-3">{p.saleName}</h2>
                  )}
                  <h2 className="text-md my-1 mx-3">
                    {p.thc}/{p.cbd}
                  </h2>
                  <h4 className="text-xs my-1 mx-3">THC/CBD TEST</h4>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Card>
    </Carousel>
  );
};

export default AdsCardWrapper;
