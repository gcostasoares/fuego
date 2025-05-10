import React, { useState, useMemo } from "react";
import { Col, Container, Row, Accordion } from "react-bootstrap";

import LogoSliderSection from "@/components/LogoSliderSection";
import { Button } from "@/components/ui/button";
import { Command } from "@/components/ui/command";
import { IconInput } from "@/components/ui/iconinput";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CommandGroup, CommandItem, CommandList } from "cmdk";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
  ChevronDown,
  Filter,
  X,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "react-responsive";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import styled from "styled-components";
import { useHomeData } from "@/hooks/useHome";
import { useShopProduct } from "@/hooks/useShopProduct";



/* ─── SIDEBAR STYLED COMPONENTS ───────────────────────────── */

const Sidebar = styled.div`
  background-color: #f9f9fe;
  padding: 20px;
  /* Only bottom padding is used */
  padding-top: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

export const OutlineButton = styled.button`
  padding: 6px 14px;
  border: 2px solid #0e0e0e;
  border-radius: 50px;
  cursor: pointer;
  &:hover {
    background-color: #000000;
    color: #fff;
  }
`;

const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SliderValue = styled.div`
  font-weight: bold;
`;

/* ─── SIDEBAR COMPONENT INTERFACE ─────────────────────────────
   Additional optional props are added for the extra accordions.
──────────────────────────────────────────────────────────────*/

export interface IProps {
  onGeneticsChange: (newGenetics: string[]) => void;
  onIrradiatedChange: (filter: string) => void; // Not used.
  onCBDChange: (val: number | undefined) => void;
  onMaxCBDChange: (val: number | undefined) => void;
  onMaxTHCChange: (val: number | undefined) => void;
  onTHCChange: (val: number | undefined) => void;
  onStrainChange: (val: string) => void;
  onEffectChange: (effects: string[]) => void;
  onTerpeneChange: (terpenes: string[]) => void;
  onOriginChange: (origin: string) => void;
  onTasteChange: (taste: string) => void;
  onStockChange: (stock: string) => void;
  onManufacturerSelectionChange: (ids: string[]) => void;
  onPharmacyChange: (pharmacies: string[]) => void;
  onMinPriceChange: (price: number | undefined) => void;
  onMaxPriceChange: (price: number | undefined) => void;
  // Current values for controlling the UI:
  selectedGenetics: string[];
  minPrice: number;
  maxPrice: number;
  thc: number;
  maxThc: number;
  cbd: number;
  maxCbd: number;
  availableFilter: string;
  // New props for additional accordions:
  selectedTerpene?: string[];
  selectedStrains?: string;
  selectedTastes?: string;
  selectedOrigin?: string;
  selectedManufacturerIds?: string[];
  selectedPharmacies?: string[];
  // For displaying active filters and clearing them:
  activeFilters: string;
  onClearFilters?: () => void;
}

const buttonLabels = ["Sativa", "Indica", "Hybrid"];

/* ─── PRODUCT SIDEBAR COMPONENT ───────────────────────────── */

const ProductSidebar = (props: IProps) => {
  // Dummy data for additional accordions
  const dummyTerpenes = ["TEST", "TEST", "TEST"];
  const dummyStrains = ["TEST", "TEST", "TEST"];
  const dummyOrigins = ["TEST", "TEST", "TEST"];
  const dummyTastes = ["TEST", "TEST", "TEST"];
  const dummyManufacturers = ["TEST", "TEST"];
  const dummyPharmacies = ["TEST", "TEST"];
  

  return (
    <>
      {/* Active Filters Field */}
      <div className="pb-4 flex items-center justify-between space-x-2">
        <IconInput
          left={<Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />}
          className="!rounded-full"
          value={props.activeFilters}
          onChange={() => {}}
        />
        <X className="cursor-pointer" onClick={() => props.onClearFilters && props.onClearFilters()} />
      </div>
      <Sidebar className="rounded-md">
        {/* Genetic Filter Buttons */}
        <Footer>
          {buttonLabels.map((label) => {
            const isActive = props.selectedGenetics.includes(label);
            return (
              <OutlineButton
                key={label}
                onClick={() => {
                  const newGenetics = isActive
                    ? props.selectedGenetics.filter((g) => g !== label)
                    : [...props.selectedGenetics, label];
                  props.onGeneticsChange(newGenetics);
                }}
                className={`px-4 py-2 border rounded-md transition-colors ${
                  isActive ? "bg-[#000000] text-white" : "bg-transparent"
                }`}
              >
                {label}
              </OutlineButton>
            );
          })}
        </Footer>
        {/* Preis Slider */}
        <SliderWrapper className="rounded-md">
          <Label>Preis</Label>
          <Slider
            min={0}
            max={1000}
            value={[props.minPrice, props.maxPrice]}
            onValueChange={(s) => {
              props.onMinPriceChange(Number(s[0]));
              props.onMaxPriceChange(Number(s[1]));
            }}
          />
          <SliderValue>
            €{props.minPrice} - €{props.maxPrice}
          </SliderValue>
        </SliderWrapper>
        {/* THC Slider */}
        <SliderWrapper className="rounded-md">
          <Label>THC GEHALT</Label>
          <Slider
            min={0}
            max={100}
            value={[props.thc, props.maxThc]}
            onValueChange={(s) => {
              props.onTHCChange(Number(s[0]));
              props.onMaxTHCChange(Number(s[1]));
            }}
          />
          <SliderValue>
            {props.thc}% - {props.maxThc}%
          </SliderValue>
        </SliderWrapper>
        {/* CBD Slider */}
        <SliderWrapper className="rounded-md">
          <Label>CBD GEHALT</Label>
          <Slider
            min={0}
            max={100}
            value={[props.cbd, props.maxCbd]}
            onValueChange={(s) => {
              props.onCBDChange(Number(s[0]));
              props.onMaxCBDChange(Number(s[1]));
            }}
          />
          <SliderValue>
            {props.cbd}% - {props.maxCbd}%
          </SliderValue>
        </SliderWrapper>
        {/* "Auf Lager" Switch */}
        <Label htmlFor="switch">Auf Lager</Label>
        <Switch
          id="switch"
          thumbColor="black"
          checked={props.availableFilter === "Available"}
          onCheckedChange={(checked) => {
            props.onStockChange(checked ? "Available" : "");
          }}
        />
        {/* Accordions */}
        <Accordion alwaysOpen>
          {/* Effekte */}
          <Accordion.Item eventKey="0" className="rounded-md mb-2">
            <div className="flex justify-between items-center w-full py-2">
              <Accordion.Header onClick={() => {}}>
                <Label className="text-xl">Effekte</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => {}}>
                <ChevronDown />
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {["Relax", "Focus", "Energetic"].map((effect, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id={`effect-${idx}`}
                    onChange={() => props.onEffectChange([effect])}
                  />
                  <label htmlFor={`effect-${idx}`} className="text-sm font-medium">
                    {effect}
                  </label>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          {/* Terpenes */}
          <Accordion.Item eventKey="1" className="rounded-md mb-2">
            <div className="flex justify-between items-center w-full py-2">
              <Accordion.Header onClick={() => {}}>
                <Label className="text-xl">Terpenes</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => {}}>
                <ChevronDown />
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {dummyTerpenes.map((t, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id={`terpene-${idx}`}
                    checked={props.selectedTerpene ? props.selectedTerpene.includes(t) : false}
                    onChange={() => {
                      let newSelection = props.selectedTerpene ? [...props.selectedTerpene] : [];
                      if (newSelection.includes(t)) {
                        newSelection = newSelection.filter(item => item !== t);
                      } else {
                        newSelection.push(t);
                      }
                      props.onTerpeneChange(newSelection);
                    }}
                  />
                  <label htmlFor={`terpene-${idx}`} className="text-sm font-medium">
                    {t}
                  </label>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          {/* Strains */}
          <Accordion.Item eventKey="2" className="rounded-md mb-2">
            <div className="flex justify-between items-center w-full py-2">
              <Accordion.Header onClick={() => {}}>
                <Label className="text-xl">Strains</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => {}}>
                <ChevronDown />
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {dummyStrains.map((strain, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name="strains"
                    id={`strain-${idx}`}
                    value={strain}
                    checked={props.selectedStrains === strain}
                    onChange={() => props.onStrainChange(strain)}
                  />
                  <label htmlFor={`strain-${idx}`} className="text-sm font-medium">
                    {strain}
                  </label>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          {/* Herkunftsland */}
          <Accordion.Item eventKey="3" className="rounded-md mb-2">
            <div className="flex justify-between items-center w-full py-2">
              <Accordion.Header onClick={() => {}}>
                <Label className="text-xl">Herkunftsland</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => {}}>
                <ChevronDown />
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {dummyOrigins.map((origin, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name="origin"
                    id={`origin-${idx}`}
                    value={origin}
                    checked={props.selectedOrigin === origin}
                    onChange={() => props.onOriginChange(origin)}
                  />
                  <label htmlFor={`origin-${idx}`} className="text-sm font-medium">
                    {origin}
                  </label>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          {/* Geschmack */}
          <Accordion.Item eventKey="4" className="rounded-md mb-2">
            <div className="flex justify-between items-center w-full py-2">
              <Accordion.Header onClick={() => {}}>
                <Label className="text-xl">Geschmack</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => {}}>
                <ChevronDown />
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {dummyTastes.map((taste, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    name="taste"
                    id={`taste-${idx}`}
                    value={taste}
                    checked={props.selectedTastes === taste}
                    onChange={() => props.onTasteChange(taste)}
                  />
                  <label htmlFor={`taste-${idx}`} className="text-sm font-medium">
                    {taste}
                  </label>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          {/* Hersteller */}
          <Accordion.Item eventKey="5" className="rounded-md mb-2">
            <div className="flex justify-between items-center w-full py-2">
              <Accordion.Header onClick={() => {}}>
                <Label className="text-xl">Hersteller</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => {}}>
                <ChevronDown />
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {dummyManufacturers.map((manu, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id={`manufacturer-${idx}`}
                    checked={props.selectedManufacturerIds ? props.selectedManufacturerIds.includes(manu) : false}
                    onChange={() => {
                      let newSelection = props.selectedManufacturerIds ? [...props.selectedManufacturerIds] : [];
                      if (newSelection.includes(manu)) {
                        newSelection = newSelection.filter(item => item !== manu);
                      } else {
                        newSelection.push(manu);
                      }
                      props.onManufacturerSelectionChange(newSelection);
                    }}
                  />
                  <label htmlFor={`manufacturer-${idx}`} className="text-sm font-medium">
                    {manu}
                  </label>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          {/* Apotheken */}
          <Accordion.Item eventKey="6" className="rounded-md mb-2">
            <div className="flex justify-between items-center w-full py-2">
              <Accordion.Header onClick={() => {}}>
                <Label className="text-xl">Apotheken</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => {}}>
                <ChevronDown />
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {dummyPharmacies.map((pharmacy, idx) => (
                <div key={idx} className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    id={`pharmacy-${idx}`}
                    checked={props.selectedPharmacies ? props.selectedPharmacies.includes(pharmacy) : false}
                    onChange={() => {
                      let newSelection = props.selectedPharmacies ? [...props.selectedPharmacies] : [];
                      if (newSelection.includes(pharmacy)) {
                        newSelection = newSelection.filter(item => item !== pharmacy);
                      } else {
                        newSelection.push(pharmacy);
                      }
                      props.onPharmacyChange(newSelection);
                    }}
                  />
                  <label htmlFor={`pharmacy-${idx}`} className="text-sm font-medium">
                    {pharmacy}
                  </label>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Sidebar>
    </>
  );
};

export const ProductSidebarContainer = (props: IProps) => {
  const isMdDown = useMediaQuery({ query: "(max-width: 991px)" });
  if (isMdDown) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="ml-4">
            <Filter /> Filters
          </Button>
        </DialogTrigger>
        <DialogContent closebutton className="max-w-[400px] overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <ProductSidebar {...props} />
        </DialogContent>
      </Dialog>
    );
  }
  return <ProductSidebar {...props} />;
};

/* ─── MAIN PRODUCT LISTING COMPONENT ───────────────────────────── */

export const ProductListing = () => {
  const { homeData } = useHomeData();
  const {
    products,
    loading,
    hasMore,
    pagination,
    filters,
    setFilters,
    setPagination,
  } = useShopProduct();

  const isMdDown = useMediaQuery({ query: "(max-width: 991px)" });
  const [searchText, setSearchText] = useState("");
  const [sortOption, setSortOption] = useState("");

  // Clear filters function
  const clearFilters = () => {
    setFilters({
      filterName: "",
      rayid: "",
      cbd: undefined,
      maxCbd: undefined,
      thc: undefined,
      maxThc: undefined,
      genetics: [],
      effectFilter: [],
      terpeneFilter: [],
      tasteFilter: "",
      availableFilter: "",
      strains: "",
      sort: "",
      origin: undefined,
      selectedManufacturerIds: [],
      minPrice: undefined,
      maxPrice: undefined,
      pharmacy: [],
    });
  };

  // Compute active filters string including genetics, "Auf Lager" and slider values.
  const activeFilters = useMemo(() => {
    const parts = [];
    if (filters.genetics && filters.genetics.length > 0) {
      parts.push(filters.genetics.join(", "));
    }
    if (filters.availableFilter === "Available") {
      parts.push("Auf Lager");
    }
    if (
      filters.minPrice !== undefined &&
      filters.maxPrice !== undefined &&
      (filters.minPrice !== 0 || filters.maxPrice !== 1000)
    ) {
      parts.push(`Preis: €${filters.minPrice || 0} - €${filters.maxPrice || 1000}`);
    }
    if (
      filters.thc !== undefined &&
      filters.maxThc !== undefined &&
      (filters.thc !== 0 || filters.maxThc !== 100)
    ) {
      parts.push(`THC: ${filters.thc ?? 0}% - ${filters.maxThc ?? 100}%`);
    }
    if (
      filters.cbd !== undefined &&
      filters.maxCbd !== undefined &&
      (filters.cbd !== 0 || filters.maxCbd !== 100)
    ) {
      parts.push(`CBD: ${filters.cbd ?? 0}% - ${filters.maxCbd ?? 100}%`);
    }
    return parts.join(", ");
  }, [filters]);

  // Update search filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setFilters({ filterName: value });
    setPagination({ currentPage: 1 });
  };

  // Update sort filter
  const handleSortChange = (val: string) => {
    setSortOption(val);
    setFilters({ sort: val });
    setPagination({ currentPage: 1 });
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPagination({ pageSize: Number(e.target.value), currentPage: 1 });
  };
  const handleNextPage = () => {
    if (hasMore) setPagination({ currentPage: pagination.currentPage + 1 });
  };
  const handlePreviousPage = () => {
    if (pagination.currentPage > 1)
      setPagination({ currentPage: pagination.currentPage - 1 });
  };

  // Dummy sort dropdown component
  const DdlFilter = ({ onSortChange }: { onSortChange: (val: string) => void }) => {
    const [open, setOpen] = useState(false);
    const [sortBy, setSortBy] = useState("");
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between uppercase rounded-full border font-bold hover:bg-[#333] hover:text-white bg-white text-[#1d4a34] border-[#333] text-sm px-6 py-0 h-9 truncate"
          >
            Sortierung
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2">
          <Command>
            <CommandList>
              <CommandGroup>
                {[
                  { label: "Default", value: "" },
                  { label: "A-Z", value: "A-Z" },
                  { label: "Z-A", value: "Z-A" },
                ].map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      setSortBy(option.value);
                      onSortChange(option.value);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <div className="justify-between flex px-3">
                      <span className="inline-block">{option.label}</span>
                      <span>
                        <Check
                          className={cn("ml-auto inline-block", sortBy === option.value ? "opacity-100" : "opacity-0")}
                        />
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

  // Client-side sort based on sortOption
  const sortedProducts = useMemo(() => {
    if (!products) return [];
    let prods = [...products];
    if (sortOption === "A-Z") {
      prods.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Z-A") {
      prods.sort((a, b) => b.name.localeCompare(a.name));
    }
    return prods;
  }, [products, sortOption]);

  // Client-side "Auf Lager" filtering
  const availableProducts = useMemo(() => {
    if (filters.availableFilter === "Available") {
      return sortedProducts.filter(
        (product) => product.isAvailable === "Available"
      );
    }
    return sortedProducts;
  }, [sortedProducts, filters.availableFilter]);

  return (
    <Container fluid>
      {/* Header */}
      <Row>
        <Col xs={12} className="py-12">
          <h1 className="text-center text-5xl font-bold tracking-normal">
            Blüten - Cannabis
          </h1>
        </Col>
      </Row>
      <Row>
        {isMdDown ? (
          <Col xs={12} className="py-4">
            <IconInput
              left={<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />}
              className="!rounded-full"
              placeholder="Suche nach Namen"
              onChange={handleSearchChange}
            />
            <DdlFilter onSortChange={handleSortChange} />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-4 mb-4">
                  <Filter className="mr-2" /> Filter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[400px] overflow-y-scroll max-h-screen">
                <DialogHeader>
                  <DialogTitle>Filters</DialogTitle>
                </DialogHeader>
                <ProductSidebarContainer
                  onGeneticsChange={(newGenetics) => setFilters({ genetics: newGenetics })}
                  onIrradiatedChange={() => {}}
                  onCBDChange={(val) => setFilters({ cbd: val })}
                  onMaxCBDChange={(val) => setFilters({ maxCbd: val })}
                  onTHCChange={(val) => setFilters({ thc: val })}
                  onMaxTHCChange={(val) => setFilters({ maxThc: val })}
                  onStrainChange={(strain) => setFilters({ strains: strain })}
                  onEffectChange={(effects) => setFilters({ effectFilter: effects })}
                  onTerpeneChange={(terpenes) => setFilters({ terpeneFilter: terpenes })}
                  onOriginChange={(origin) => setFilters({ origin })}
                  onTasteChange={(taste) => setFilters({ tasteFilter: taste })}
                  onStockChange={(stock) => setFilters({ availableFilter: stock })}
                  onManufacturerSelectionChange={(ids) => setFilters({ selectedManufacturerIds: ids })}
                  onPharmacyChange={(pharmacies) => setFilters({ pharmacy: pharmacies })}
                  onMinPriceChange={(price) => setFilters({ minPrice: price })}
                  onMaxPriceChange={(price) => setFilters({ maxPrice: price })}
                  selectedGenetics={filters.genetics}
                  minPrice={filters.minPrice || 0}
                  maxPrice={filters.maxPrice || 1000}
                  thc={filters.thc ?? 0}
                  maxThc={filters.maxThc ?? 100}
                  cbd={filters.cbd ?? 0}
                  maxCbd={filters.maxCbd ?? 100}
                  availableFilter={filters.availableFilter || ""}
                  activeFilters={activeFilters}
                  onClearFilters={clearFilters}
                  selectedTerpene={filters.terpeneFilter}
                  selectedStrains={filters.strains}
                  selectedTastes={filters.tasteFilter}
                  selectedOrigin={filters.origin}
                  selectedManufacturerIds={filters.selectedManufacturerIds}
                  selectedPharmacies={filters.pharmacy}
                />
              </DialogContent>
            </Dialog>
            <ProductGrid products={availableProducts} loading={loading} error={""} />
          </Col>
        ) : (
          <>
            <Col lg={3} className="py-4">
              <ProductSidebarContainer
                onGeneticsChange={(newGenetics) => setFilters({ genetics: newGenetics })}
                onIrradiatedChange={() => {}}
                onCBDChange={(val) => setFilters({ cbd: val })}
                onMaxCBDChange={(val) => setFilters({ maxCbd: val })}
                onTHCChange={(val) => setFilters({ thc: val })}
                onMaxTHCChange={(val) => setFilters({ maxThc: val })}
                onStrainChange={(strain) => setFilters({ strains: strain })}
                onEffectChange={(effects) => setFilters({ effectFilter: effects })}
                onTerpeneChange={(terpenes) => setFilters({ terpeneFilter: terpenes })}
                onOriginChange={(origin) => setFilters({ origin })}
                onTasteChange={(taste) => setFilters({ tasteFilter: taste })}
                onStockChange={(stock) => setFilters({ availableFilter: stock })}
                onManufacturerSelectionChange={(ids) => setFilters({ selectedManufacturerIds: ids })}
                onPharmacyChange={(pharmacies) => setFilters({ pharmacy: pharmacies })}
                onMinPriceChange={(price) => setFilters({ minPrice: price })}
                onMaxPriceChange={(price) => setFilters({ maxPrice: price })}
                selectedGenetics={filters.genetics}
                minPrice={filters.minPrice || 0}
                maxPrice={filters.maxPrice || 1000}
                thc={filters.thc ?? 0}
                maxThc={filters.maxThc ?? 100}
                cbd={filters.cbd ?? 0}
                maxCbd={filters.maxCbd ?? 100}
                availableFilter={filters.availableFilter || ""}
                activeFilters={activeFilters}
                onClearFilters={clearFilters}
                selectedTerpene={filters.terpeneFilter}
                selectedStrains={filters.strains}
                selectedTastes={filters.tasteFilter}
                selectedOrigin={filters.origin}
                selectedManufacturerIds={filters.selectedManufacturerIds}
                selectedPharmacies={filters.pharmacy}
              />
            </Col>
            <Col lg={9} className="py-4">
              <Container fluid>
                <Row className="pb-4">
                  <Col md={9} className="mb-4">
                    <IconInput
                      left={<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />}
                      className="!rounded-full"
                      placeholder="Suche nach Namen"
                      onChange={handleSearchChange}
                    />
                  </Col>
                  <Col md={3}>
                    <DdlFilter onSortChange={handleSortChange} />
                  </Col>
                </Row>
              </Container>
              <ProductGrid products={availableProducts} loading={loading} error={""} />
            </Col>
          </>
        )}
      </Row>
      {/* Pagination Controls */}
      <div className="mt-4 flex justify-evenly items-center">
        <div>
          <label htmlFor="pageSize" className="mr-2 font-medium">
            Seitengröße:
          </label>
          <select
            id="pageSize"
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
            className="border rounded p-2 bg-white"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <button
          onClick={handlePreviousPage}
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-3xl hover:bg-gray-400 disabled:opacity-50"
        >
          <ChevronLeft />
        </button>
        <span className="font-medium">
          Seite {pagination.currentPage} {hasMore ? "" : "(Keine weiteren Seiten)"}
        </span>
        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          className="px-4 py-2 bg-gray-300 rounded-3xl hover:bg-gray-400 disabled:opacity-50"
        >
          <ChevronRight />
        </button>
        <span className="font-medium">Angezeigte Produkte: {products.length}</span>
      </div>
      {/* Logo Slider */}
      <div className="py-6">
        <LogoSliderSection logos={homeData?.logos || []} />
      </div>
    </Container>
  );
};

const ProductGrid = ({ products, loading, error }: { products: any[]; loading: boolean; error: string; }) => {
  return (
    <>
      {loading && <div className="p-4 text-center">Loading products...</div>}
      {error && (
        <div className="p-4 text-red-500 text-center">
          Error: {error}
          <br />
          Check if the backend server is running on port 8081
        </div>
      )}
      {!loading && !error && (
        <Row>
          {products.length > 0 ? (
            products.map((product) => (
              <Col
                key={product.id}
                xxl={3}
                xl={4}
                lg={6}
                md={6}
                sm={12}
                xs={12}
                className="mb-3 pb-4 !px-5 transition-all duration-300 hover:scale-105"
              >
                <ProductCard product={product} height={52} />
              </Col>
            ))
          ) : (
            <div className="p-4 text-center w-full">No products found</div>
          )}
        </Row>
      )}
    </>
  );
};

export default ProductListing;
