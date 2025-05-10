import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconInput } from "@/components/ui/iconinput";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useProductFilter } from "@/hooks/useProductFilters";
import { ChevronDown, ChevronRight, Filter, X } from "lucide-react";
import { Col,  Accordion  } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import styled from "styled-components";

const Sidebar = styled.div`
  background-color: #f9f9fe;
  padding: 20px;
  padding-top: 10px;
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
export const ProductSidebarContainer = ({ ...props }: IProps) => {
  const isMdDown = useMediaQuery({ query: "(max-width: 991px)" });
  if (isMdDown) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="ml-4">
            <Filter /> Filters
          </Button>
        </DialogTrigger>
        <DialogContent
          closebutton
          className="max-w-[400px] overflow-y-scroll max-h-screen"
        >
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
const buttonLabels = ["Sativa", "Indica", "Hybrid"];
export interface IProps {
  onGeneticsChange: (filter: string[]) => void;
  onIrradiatedChange: (filter: string) => void;
  onCBDChange: (filter: number | undefined) => void;
  onMaxCBDChange: (filter: number | undefined) => void;
  onMaxTHCChange: (filter: number | undefined) => void;
  onTHCChange: (filter: number | undefined) => void;
  onStrainChange: (filter: string) => void;
  onEffectChange: (filter: string[]) => void;
  onTerpeneChange: (filter: string[]) => void;
  onOriginChange: (filter: string) => void;
  onTasteChange: (filter: string) => void;
  onStockChange: (filter: string) => void;
  onManufacturerSelectionChange: (filter: string[]) => void;
  onPharmacyChange: (filter: string[]) => void;
  onMinPriceChange: (filter: number | undefined) => void;
  onMaxPriceChange: (filter: number | undefined) => void;
}

const ProductSidebar = (props: IProps) => {
  const {
    productFilter,
    resetFilters,
    minCBD,
    maxCBD,
    minTHC,
    maxTHC,
    handleEffectCheckChange,
    handleGeneticCheckChange,
    handleManufacturerChange,
    handleTerpeneCheckChange,
    handlePharmaciesCheckChange,
    selectedButton,
    selectedEffects,
    selectedGenetics,
    setIsStockChecked,
    selectedManufacturerIds,
    selectedStrains,
    selectedTastes,
    selectedTerpenes,
    setMFilter,
    setOrgFilter,
    setSelectedButton,
    setminCBD,
    setmaxCBD,
    setminTHC,
    setmaxTHC,
    isStockChecked,
    toggleAccordion,
    openAccordions,
    orgFilter,
    setSelectedStrains,
    setSelectedTastes,
    allFilters,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    selectedPharmacies,
  } = useProductFilter(props);

  return (
    <>
      <div className="py-4  flex items-center justify-between space-x-2 ">
        <IconInput
          left={
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
          }
          className="!rounded-full"
          value={allFilters}
          onChange={() => { }}
        />
        <X className="cursor-pointer" onClick={resetFilters} />
      </div>
      <Sidebar className="rounded-md">
        {/* Tabs Section */}

        <div className="flex gap-2">
          {productFilter?.rays.map((ray) => (
            <OutlineButton
              key={ray.id}
              className={`rounded-full hover:text-white ${selectedButton === ray.name ? "bg-[#000000] text-white" : "bg-transparent"}`}
              onClick={() => {
                props.onIrradiatedChange(ray.id);
                setSelectedButton(ray.name);
              }}
            >
              {ray.name}
            </OutlineButton>
          ))}
        </div>

        <Footer>
          {buttonLabels.map((label) => (
            <OutlineButton
              key={label}
              onClick={() => handleGeneticCheckChange(label)}
              className={`px-4 py-2 border rounded-md transition-colors ${selectedGenetics.includes(label)
                ? "bg-[#000000] text-white"
                : "bg-transparent"
                }`}
            >
              {label}
            </OutlineButton>
          ))}
        </Footer>
        <SliderWrapper className="rounded-md ">
          <Label>Price</Label>
          <Slider
            min={0}
            max={100}
            value={[minPrice!, maxPrice!]}
            onValueChange={(s) => {
              setMinPrice(Number(s[0]));
              setMaxPrice(Number(s[1]));
            }}
            onValueCommit={(s) => {
              props.onMinPriceChange(Number(s[0]));
              props.onMaxPriceChange(Number(s[1]));
            }}
          />
          <SliderValue>
            €{minPrice} - €{maxPrice}
          </SliderValue>
        </SliderWrapper>
        <SliderWrapper className="rounded-md ">
          <Label>THC GEHALT</Label>
          <Slider
            min={0}
            max={100}
            value={[minTHC, maxTHC]}
            onValueChange={(s) => {
              setminTHC(Number(s[0]));
              setmaxTHC(Number(s[1]));
            }}
            onValueCommit={(s) => {
              props.onTHCChange(Number(s[0]));
              props.onMaxTHCChange(Number(s[1]));
            }}
          />
          <SliderValue>
            {minTHC}% - {maxTHC}%
          </SliderValue>
        </SliderWrapper>

        <SliderWrapper className="rounded-md ">
          <Label>CBD GEHALT</Label>
          <Slider
            min={0}
            max={100}
            value={[minCBD, maxCBD]}
            onValueChange={(s) => {
              setminCBD(Number(s[0]));
              setmaxCBD(Number(s[1]));
            }}
            onValueCommit={(s) => {
              props.onCBDChange(Number(s[0]));
              props.onMaxCBDChange(Number(s[1]));
            }}
          />
          <SliderValue>
            {minCBD}% - {maxCBD}%
          </SliderValue>
        </SliderWrapper>
        <Label htmlFor="switch">Auf Lager</Label>
        <Switch
          id={`switch`}
          thumbColor="black"
          checked={isStockChecked}
          onCheckedChange={(checked) => {
            setIsStockChecked(checked);
            if (checked) {
              props.onStockChange("Available");
            } else {
              props.onStockChange("");
            }
          }}
        />
        <Accordion alwaysOpen>
          <Accordion.Item eventKey="0" className="rounded-md mb-2">
            <div className="flex justify-between items-center w-full  py-2">
              <Accordion.Header onClick={() => toggleAccordion("effekte")}>
                <Label className="text-xl">Effekte</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => toggleAccordion("effekte")}>
                {openAccordions["effekte"] ? <ChevronDown /> : <ChevronRight />}
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {productFilter?.effects.map((effect) => (
                <div
                  key={effect.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Checkbox
                    id={`effect-${effect.id}`}
                    title={effect.title}
                    checked={selectedEffects.includes(effect.title)}
                    onCheckedChange={() => {
                      handleEffectCheckChange(effect.title);
                    }}
                  />
                  <label
                    htmlFor={`effect-${effect.id}`}
                    className="text-sm font-medium"
                  >
                    {effect.title}
                  </label>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="1" className="rounded-md mb-2">
            <div className="flex justify-between items-center  w-full  py-2">
              <Accordion.Header onClick={() => toggleAccordion("Terpenes")}>
                <Label className="text-xl">Terpenes</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => toggleAccordion("Terpenes")}>
                {openAccordions["Terpenes"] ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {productFilter?.terpenes.map((terpene) => (
                <div
                  key={terpene.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Checkbox
                    id={`terpene-${terpene.id}`}
                    title={terpene.title}
                    checked={selectedTerpenes.includes(terpene.title)}
                    onCheckedChange={() => {
                      handleTerpeneCheckChange(terpene.title);
                    }}
                  />
                  <label
                    htmlFor={`terpene-${terpene.id}`}
                    className="text-sm font-medium"
                  >
                    {terpene.title}
                  </label>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2" className="rounded-md mb-2">
            <div className="flex justify-between items-center  w-full  py-2">
              <Accordion.Header onClick={() => toggleAccordion("Strains")}>
                <Label className="text-xl">Strains</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => toggleAccordion("Strains")}>
                {openAccordions["Strains"] ? <ChevronDown /> : <ChevronRight />}
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              <RadioGroup value={selectedStrains}>
                {productFilter?.strains.map((strain) => (
                  <div
                    key={strain.name}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <RadioGroupItem
                      onClick={() => {
                        setSelectedStrains(strain.name);
                        props.onStrainChange(strain.name);
                      }}
                      value={strain.name}
                      id={strain.name}
                    />
                    <Label htmlFor={strain.name} className="text-gray-700">
                      {strain.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3" className="rounded-md mb-2">
            <div className="flex justify-between items-center  w-full  py-2">
              <Accordion.Header
                onClick={() => toggleAccordion("Herekunftstand")}
              >
                <Label className="text-xl">Herkunftsland</Label>
              </Accordion.Header>
              <Accordion.Header
                onClick={() => toggleAccordion("Herekunftstand")}
              >
                {openAccordions["Herekunftstand"] ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              <RadioGroup value={orgFilter}>
                {productFilter?.origins.map((origin) => (
                  <div
                    className="flex items-center space-x-2 mb-2"
                    key={origin.id}
                  >
                    <RadioGroupItem
                      value={origin.name}
                      id={origin.name}
                      onClick={() => {
                        props.onOriginChange(origin.id);
                        setOrgFilter(origin.name);
                      }}
                    />
                    <Label htmlFor={origin.name} className="text-gray-700">
                      {origin.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4" className="rounded-md mb-2">
            <div className="flex justify-between items-center  w-full  py-2">
              <Accordion.Header onClick={() => toggleAccordion("Geschmack")}>
                <Label className="text-xl">Geschmack</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => toggleAccordion("Geschmack")}>
                {openAccordions["Geschmack"] ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              <RadioGroup value={selectedTastes}>
                {productFilter?.tastes.map((taste) => (
                  <div
                    key={taste.title}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <RadioGroupItem
                      value={taste.title}
                      id={taste.title}
                      onClick={() => {
                        setSelectedTastes(taste.title);
                        props.onTasteChange(taste.title);
                      }}
                    />
                    <Label htmlFor={taste.title} className="text-gray-700">
                      {taste.title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="5" className="rounded-md mb-2">
            <div className="flex justify-between items-center  w-full  py-2">
              <Accordion.Header onClick={() => toggleAccordion("Hersteller")}>
                <Label className="text-xl">Hersteller</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => toggleAccordion("Hersteller")}>
                {openAccordions["Hersteller"] ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {productFilter?.manufacturers.map((manufacturer) => (
                <div
                  key={manufacturer.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Checkbox
                    id={`manufacturer-${manufacturer.id}`}
                    checked={selectedManufacturerIds.includes(manufacturer.id)}
                    onCheckedChange={() => {
                      handleManufacturerChange(manufacturer.id);
                      setMFilter(manufacturer.name);
                    }}
                  />
                  <label
                    htmlFor={`manufacturer-${manufacturer.id}`}
                    className="text-sm font-medium"
                  >
                    {manufacturer.name}
                  </label>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="6" className="rounded-md mb-2">
            <div className="flex justify-between items-center  w-full  py-2">
              <Accordion.Header onClick={() => toggleAccordion("Pharmacies")}>
                <Label className="text-xl">Apotheken</Label>
              </Accordion.Header>
              <Accordion.Header onClick={() => toggleAccordion("Pharmacies")}>
                {openAccordions["Pharmacies"] ? (
                  <ChevronDown />
                ) : (
                  <ChevronRight />
                )}
              </Accordion.Header>
            </div>
            <Accordion.Body className="bg-gray-50 p-4">
              {productFilter?.pharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Checkbox
                    id={`pharmacy-${pharmacy.id}`}
                    title={pharmacy.name}
                    checked={selectedPharmacies.includes(pharmacy.name)}
                    onCheckedChange={() => {
                      handlePharmaciesCheckChange(pharmacy.name);
                    }}
                  />
                  <label
                    htmlFor={`pharmacy-${pharmacy.id}`}
                    className="text-sm font-medium"
                  >
                    {pharmacy.name}
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
