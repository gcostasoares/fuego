import { getUserHomeData } from "@/Apis/userApi";
import { Articles } from "@/types/articles";
import { Carousel } from "@/types/carousel";
import { Categories } from "@/types/categories";
import { Logos } from "@/types/logos";
import { Product } from "@/types/product";
import { ShopDescription } from "@/types/shopDescription";
import { useEffect, useState } from "react";

interface HomeData {
  products: Product[];
  logos: Logos[];
  categories: Categories[];
  articles: Articles[];
  carousels: Carousel[];
  shopDescriptions: ShopDescription[];
  shopSectionTitle: string;
  shopSectionDescription: string;
}

export const useHomeData = () => {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getUserHomeData();
        setHomeData({
          products: data.products || [],
          logos: data.logos || [],
          categories: data.categories || [],
          articles: data.articles || [],
          carousels: data.carousels || [],
          shopDescriptions: data.shopDescriptions || [],
          shopSectionTitle: data.shopSectionTitle,
          shopSectionDescription: data.shopSectionDescription,
        });
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { homeData, loading };
};
