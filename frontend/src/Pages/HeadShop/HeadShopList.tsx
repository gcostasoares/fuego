// src/Pages/HeadShopList.tsx
import { Search, ChevronsUpDown, Check } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import apiClient from "@/Apis/apiService";
import { HeaderWrapper } from "@/Styles/StyledComponents";
import ShopsMap from "@/components/Map";
import ListItem from "@/components/ShopsListItem";
import { Button2 } from "@/components/ui/button2";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/iconinput";
import Loader from "@/components/ui/loader";
import { Switch } from "@/components/ui/switch";
import { HeadShop } from "@/types/doctors";
import "leaflet/dist/leaflet.css";
import { Col,  Row  } from "react-bootstrap";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "cmdk";
import { cn } from "@/lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

// unwrap JSON-encoded '["file.png"]' or return plain string
function extractFilename(path: string | string[] | null): string | null {
  if (!path) return null;
  if (Array.isArray(path)) return path[0] || null;
  const trimmed = path.trim();
  if (trimmed.startsWith("[")) {
    try {
      const arr = JSON.parse(trimmed);
      return Array.isArray(arr) && arr.length ? arr[0] : null;
    } catch {
      return null;
    }
  }
  return trimmed;
}

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
          className="justify-between uppercase rounded-full border font-bold hover:bg-[#333] hover:text-white bg-white text-[#1d4a34] text-sm px-6 py-0 h-9 truncate"
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
                    <span>{option.label}</span>
                    <Check
                      className={cn(
                        sortBy === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
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

export const HeadShopList: React.FC = () => {
  const [shops, setShops] = useState<HeadShop[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showVerified, setShowVerified] = useState(false);
  const [isAddressSearch, setIsAddressSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const shopsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalShops, setTotalShops] = useState(0);
  const [loading, setLoading] = useState(true);
  const abortController = useRef<AbortController | null>(null);

  const fetchShops = async () => {
    abortController.current?.abort();
    abortController.current = new AbortController();

    try {
      setLoading(true);
      const response = await apiClient.get("/headshops", {
        params: {
          name: isAddressSearch ? null : searchTerm,
          address: isAddressSearch ? addressSearch : null,
          pageNumber: currentPage,
          pageSize: shopsPerPage,
          isVerified: showVerified || null,
          sortBy,
        },
        signal: abortController.current.signal,
      });

      setShops(response.data.headShops || []);
      setTotalShops(response.data.totalCount);
      setTotalPages(Math.ceil(response.data.totalCount / shopsPerPage));
    } catch (err: any) {
      if (err.name !== "CanceledError") console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ← FIX: wrap in a normal effect so you don't return a Promise
  useEffect(() => {
    fetchShops();
  }, [searchTerm, showVerified, currentPage, addressSearch, sortBy]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (isAddressSearch) setAddressSearch(inputValue);
      else setSearchTerm(inputValue);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue, isAddressSearch]);

  useEffect(() => {
    setInputValue(isAddressSearch ? addressSearch : searchTerm);
  }, [isAddressSearch, addressSearch, searchTerm]);

  const handleOrtPlzClick = () => {
    setIsAddressSearch(!isAddressSearch);
    setAddressSearch("");
    setSearchTerm("");
  };
  const handlePageChange = (p: number) => setCurrentPage(p);

  const sortedShops = useMemo(() => {
    const s = [...shops];
    if (sortBy === "A-Z") s.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Z-A") s.sort((a, b) => b.name.localeCompare(a.name));
    return s;
  }, [shops, sortBy]);

  return (
    <div className="w-full h-screen flex flex-col">
      <HeaderWrapper className="text-white font-bold p-4">
        <h1 className="text-start text-xl md:text-3xl">Head Shops der Nähe</h1>
      </HeaderWrapper>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden gap-4">
        <div className="w-full md:w-1/3 p-4 overflow-y-auto">
          <Row className="pb-4 justify-center">
            <Col md={12}>
              <IconInput
                left={
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="!rounded-full"
                placeholder={isAddressSearch ? "Ort/PLZ suchen" : "Name suchen"}
              />
            </Col>
          </Row>
          <Row className="justify-center pb-4 items-center flex-nowrap mx-[-5px]">
            <Col xs="auto" className="d-flex align-items-center">
              <Switch
                checked={showVerified}
                onCheckedChange={setShowVerified}
                className="ml-2 bg-[#1d4a34]"
              />
              <span className="ml-2">Verifiziert</span>
            </Col>
            <Col xs="auto">
              <Button2 isWhite onClick={handleOrtPlzClick}>
                {isAddressSearch ? "Name" : "Ort/PLZ"}
              </Button2>
            </Col>
            <Col xs="auto">
              <DdlFilter onSortChange={setSortBy} />
            </Col>
          </Row>

          {loading ? (
            <div className="flex justify-center items-start h-full">
              <Loader />
            </div>
          ) : shops.length === 0 ? (
            <div className="flex justify-center">Keine Headshops gefunden</div>
          ) : (
            <ul className="space-y-4">
              {sortedShops.map((shop) => {
                const img = extractFilename(shop.imagePath);
                const cov = extractFilename(shop.coverImagePath);
                return (
                  <ListItem
                    key={shop.id}
                    id={shop.id}
                    name={shop.name}
                    imagePath={
                      img
                        ? `${API_URL}/images/HeadShops/${img}`
                        : ""
                    }
                    coverImagePath={
                      cov
                        ? `${API_URL}/images/HeadShops/${cov}`
                        : ""
                    }
                    address={shop.address}
                    isVerified={shop.isVerified}
                    detailsUrl={`/headShopDetail/${shop.id}`}
                  />
                );
              })}
            </ul>
          )}

          <div className="flex justify-center mt-6 space-x-2 my-3 items-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 border rounded-full ${
                  currentPage === i + 1
                    ? "bg-[#1d4a34] text-white"
                    : "bg-white text-[#1d4a34]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <span className="inline-block">Gesamt: {totalShops}</span>
          </div>
        </div>
        <ShopsMap data={shops} customIconSize={[30, 30]} />
      </div>
    </div>
  );
};

export default HeadShopList;
