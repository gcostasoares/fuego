import { getContentPages } from "@/Apis/userApi";
import { Content } from "@/types/content";
import { useState, useEffect } from "react";

export const useAppContent = () => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<Content | null>(null);
  useEffect(() => {
    setLoading(true);
    const fetchContent = async () => {
      try {
        const data = await getContentPages();
        setContent(data);
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);
  return { content, loading };
};
