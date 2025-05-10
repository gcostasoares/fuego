import { getProductFilter, getProducts } from "@/Apis/userApi"; 
import { IProps } from "@/Pages/Products/ProductSidebar";
import { Pharmacy } from "@/types/doctors";
import {
  Effect,
  Manufacturer,
  Origin,
  Ray,
  Strain,
  Taste,
  Terpene,
} from "@/types/product";

import { useCallback, useEffect, useState } from "react";

interface ProductFilter {
  terpenes: Terpene[];
  effects: Effect[];
  strains: Strain[];
  manufacturers: Manufacturer[];
  origins: Origin[];
  tastes: Taste[];
  pharmacies: Pharmacy[];
  rays: Ray[];
}

export const useProductFilter = ({
  onGeneticsChange,
  onIrradiatedChange,
  onMaxCBDChange,
  onCBDChange,
  onMaxTHCChange,
  onTHCChange,
  onMaxPriceChange,
  onMinPriceChange,
  onEffectChange,
  onTerpeneChange,
  onStrainChange,
  onOriginChange,
  onTasteChange,
  onStockChange,
  onManufacturerSelectionChange,
  onPharmacyChange,
}: IProps) => {
  const [productFilter, setProductFilter] = useState<ProductFilter | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [minTHC, setminTHC] = useState<number>(0);
  const [maxTHC, setmaxTHC] = useState<number>(100);
  const [minCBD, setminCBD] = useState<number>(0);
  const [maxCBD, setmaxCBD] = useState<number>(100);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [selectedButton, setSelectedButton] = useState<string>("");

  const [mFilter, setMFilter] = useState<string>("");
  const [orgFilter, setOrgFilter] = useState<string>("");
  const [selectedManufacturerIds, setSelectedManufacturerIds] = useState<
    string[]
  >([]);
  const [selectedTerpenes, setSelectedTerpenes] = useState<string[]>([]);
  const [selectedPharmacies, setSelectedPharmacies] = useState<string[]>([]);
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [selectedGenetics, setSelectedGenetics] = useState<string[]>([]);
  const [isStockChecked, setIsStockChecked] = useState(false);
  const [selectedTastes, setSelectedTastes] = useState<string>("");
  const [selectedStrains, setSelectedStrains] = useState<string>("");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {}
  );

  const handleManufacturerChange = (id: string) => {
    const updatedIds = selectedManufacturerIds.includes(id)
      ? selectedManufacturerIds.filter(
          (manufacturerId) => manufacturerId !== id
        )
      : [...selectedManufacturerIds, id];

    setSelectedManufacturerIds(updatedIds);
    onManufacturerSelectionChange(updatedIds);
  };
  const handleTerpeneCheckChange = (title: string) => {
    const updatedTerpenes = selectedTerpenes.includes(title)
      ? selectedTerpenes.filter((terpene) => terpene !== title)
      : [...selectedTerpenes, title];

    setSelectedTerpenes(updatedTerpenes);
    onTerpeneChange(updatedTerpenes);
  };
  const handlePharmaciesCheckChange = (title: string) => {
    const updatedPharmacies = selectedPharmacies.includes(title)
      ? selectedPharmacies.filter((pharmacy) => pharmacy !== title)
      : [...selectedPharmacies, title];

    setSelectedPharmacies(updatedPharmacies);
    onPharmacyChange(updatedPharmacies);
  };
  const handleEffectCheckChange = (title: string) => {
    const updatedEffects = selectedEffects.includes(title)
      ? selectedEffects.filter((effect) => effect !== title)
      : [...selectedEffects, title];

    setSelectedEffects(updatedEffects);
    onEffectChange(updatedEffects);
  };
  const handleGeneticCheckChange = (genetic: string) => {
    setSelectedGenetics(prev => {
      const newFilters = prev.includes(genetic)
        ? prev.filter(g => g !== genetic)
        : [...prev, genetic];
      return newFilters;
    });
  };

  const buildFilters = useCallback(() => ({
    genetics: selectedGenetics,
    minCBD,
    maxCBD,
    minTHC,
    maxTHC,
    minPrice,
    maxPrice,
    effects: selectedEffects,
    terpenes: selectedTerpenes,
    // ... add other filters ...
  }), [selectedGenetics, minCBD, maxCBD, minTHC, maxTHC, minPrice, maxPrice, selectedEffects, selectedTerpenes]);

  // Fetch products when filters change
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const filters = buildFilters();
      const data = await getProducts(filters); // Implement this API call
      setProducts(data.products);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [buildFilters]);

  // Initial fetch and filter changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const allFilters = [
    selectedTerpenes,
    selectedEffects,
    selectedGenetics,
    selectedButton,
    orgFilter,
    mFilter,
    minCBD ? `Min CBD: ${minCBD}` : "",
    maxCBD < 100 ? `Max CBD: ${maxCBD}` : "",
    minTHC ? `Min THC: ${minTHC}` : "",
    maxTHC < 100 ? `Max THC: ${maxTHC}` : "",
    minPrice ? `Min Price: ${minPrice}` : "",
    maxPrice < 100 ? `Max Price: ${maxPrice}` : "",
    isStockChecked ? "Available" : "",
    selectedStrains,
    selectedTastes,
    selectedPharmacies,
  ]
    .filter(Boolean)
    .join(" ");
  const resetFilters = () => {
    setIsStockChecked(false);
    onCBDChange(undefined),
      onMaxCBDChange(undefined),
      onTHCChange(undefined),
      onMaxTHCChange(undefined),
      onIrradiatedChange(""),
      onGeneticsChange([]);
    setSelectedGenetics([]);
    setSelectedStrains("");
    setminTHC(0);
    setmaxTHC(100);
    setminCBD(0);
    setmaxCBD(100);
    setSelectedTastes("");
    setOrgFilter("");
    setSelectedManufacturerIds([]);
    onEffectChange([]);
    onTasteChange("");
    onStrainChange("");
    onTerpeneChange([]);
    setSelectedButton("");
    setSelectedTerpenes([]);
    setSelectedEffects([]);
    onStockChange("");
    onManufacturerSelectionChange([]);
    onOriginChange("");
    setOrgFilter("");
    setMFilter("");
    onPharmacyChange([]);
    setSelectedPharmacies([]);
    onMinPriceChange(undefined);
    onMaxPriceChange(undefined);
    setMinPrice(0);
    setMaxPrice(100);
  };

  const fetchData = useCallback(async () => {
    try {
      const data = await getProductFilter();
      setProductFilter({
        terpenes: data.terpenes || [],
        effects: data.effects || [],
        tastes: data.tastes || [],
        strains: data.strains || [],
        manufacturers: data.manufacturers || [],
        origins: data.origins || [],
        pharmacies: data.pharmacies || [],
        rays: data.rays || [],
      });
    } catch (err: any) {}
  }, []);

  const toggleAccordion = useCallback((key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);
  useEffect(() => {
    fetchData();
  }, [productFilter?.terpenes.length]);

  return {
    products,
    productFilter,
    resetFilters,
    selectedGenetics,
    minCBD,
    maxCBD,
    minTHC,
    maxTHC,
    setminCBD,
    setmaxCBD,
    setminTHC,
    setmaxTHC,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    handleEffectCheckChange,
    handleGeneticCheckChange,
    handleManufacturerChange,
    handleTerpeneCheckChange,
    handlePharmaciesCheckChange,

    selectedButton,
    selectedEffects,
    setIsStockChecked,
    selectedManufacturerIds,
    selectedStrains,
    selectedTastes,
    selectedTerpenes,
    selectedPharmacies,
    setSelectedTastes,
    setSelectedGenetics,
    setSelectedManufacturerIds,
    setSelectedStrains,
    setSelectedButton,

    setMFilter,
    setOrgFilter,
    orgFilter,
    mFilter,
    setOpenAccordions,
    isStockChecked,
    toggleAccordion,
    openAccordions,
    allFilters,
  };
};