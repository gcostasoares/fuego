// useShopProduct.tsx hook
import apiClient from "@/Apis/apiService";
import { Product } from "@/types/product";
import debounce from "lodash.debounce";
import qs from "qs";
import { useEffect, useState, useCallback, useMemo } from "react";

export const useShopProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    filterName: "",
    rayid: "",
    cbd: undefined as number | undefined,
    maxCbd: undefined as number | undefined,
    thc: undefined as number | undefined,
    maxThc: undefined as number | undefined,
    genetics: [] as string[],
    effectFilter: [] as string[],
    terpeneFilter: [] as string[],
    tasteFilter: "",
    availableFilter: "",
    strains: "",
    sort: "",
    origin: undefined as string | undefined,
    selectedManufacturerIds: [] as string[],
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    pharmacy: [] as string[],
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 25,
  });

  const fetchProducts = useCallback(
    debounce(async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`/products`, {
          params: {
            page: pagination.currentPage,
            pageSize: pagination.pageSize,
            ...filters
          },
          paramsSerializer: (params) => 
            qs.stringify(params, { arrayFormat: 'repeat', skipNulls: true })
        });

        const fetchedProducts = response.data.products || [];
        setProducts(fetchedProducts);
        setHasMore(fetchedProducts.length >= pagination.pageSize);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [filters, pagination]
  );

  useEffect(() => {
    fetchProducts();
    return () => fetchProducts.cancel();
  }, [fetchProducts]);

  return useMemo(() => ({
    products,
    loading,
    hasMore,
    pagination,
    filters,
    setFilters: (newFilters: Partial<typeof filters>) => 
      setFilters(prev => ({ ...prev, ...newFilters })),
    setPagination: (newPagination: Partial<typeof pagination>) => 
      setPagination(prev => ({ ...prev, ...newPagination }))
  }), [products, loading, hasMore, pagination, filters]);
};