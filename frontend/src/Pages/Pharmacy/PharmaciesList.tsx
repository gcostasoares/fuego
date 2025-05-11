// src/Pages/PharmaciesList.tsx
import { Search, ChevronsUpDown, Check } from "lucide-react";
import React, { useEffect, useState, useRef, useMemo } from "react";
import apiClient from "@/Apis/apiService";
import { HeaderWrapper } from "@/Styles/StyledComponents";
import PharmaciesMap from "@/components/Map";
import ListItem from "@/components/ShopsListItem";
import { Button2 } from "@/components/ui/button2";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/iconinput";
import Loader from "@/components/ui/loader";
import { Switch } from "@/components/ui/switch";
import { Pharmacy } from "@/types/doctors";
import "leaflet/dist/leaflet.css";
import { Col,  Row  } from "react-bootstrap";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "cmdk";
import { cn } from "@/lib/utils";

// base URL for your backend
const API_URL = "https://fuego-ombm.onrender.com";

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
                        className={cn(
                          sortBy === option.value ? "opacity-100" : "opacity-0"
                        )}
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

export const PharmaciesList: React.FC = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showVerified, setShowVerified] = useState(false);
  const [isAddressSearch, setIsAddressSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");
  const pharmaciesPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalPharmacies, setTotalPharmacies] = useState(0);
  const [loading, setLoading] = useState(true);
  const abortController = useRef<AbortController | null>(null);

  const fetchPharmacies = async () => {
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();

    try {
      setLoading(true);
      const res = await apiClient.get("/pharmacy", {
        params: {
          name: isAddressSearch ? null : searchTerm,
          address: isAddressSearch ? addressSearch : null,
          pageNumber: currentPage,
          pageSize: pharmaciesPerPage,
          isVerified: showVerified || null,
          sortBy,
        },
        signal: abortController.current.signal,
      });
      setPharmacies(res.data.pharmacies || []);
      setTotalPharmacies(res.data.totalCount || 0);
      setTotalPages(Math.ceil((res.data.totalCount || 0) / pharmaciesPerPage));
    } catch (err: any) {
      if (err.name !== "CanceledError") console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPharmacies();
  }, [searchTerm, addressSearch, showVerified, currentPage, sortBy]);

  // debounce input
  useEffect(() => {
    const h = setTimeout(() => {
      if (isAddressSearch) setAddressSearch(inputValue);
      else setSearchTerm(inputValue);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(h);
  }, [inputValue, isAddressSearch]);

  // sync input when toggling between name/addr
  useEffect(() => {
    setInputValue(isAddressSearch ? addressSearch : searchTerm);
  }, [isAddressSearch, addressSearch, searchTerm]);

  const handleOrtPlzClick = () => {
    setIsAddressSearch((f) => !f);
    setSearchTerm("");
    setAddressSearch("");
  };

  const handlePageChange = (n: number) => setCurrentPage(n);

  const sortedPharmacies = useMemo(() => {
    const arr = [...pharmacies];
    if (sortBy === "A-Z") return arr.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Z-A") return arr.sort((a, b) => b.name.localeCompare(a.name));
    return arr;
  }, [pharmacies, sortBy]);

  return (
    <div className="w-full h-screen flex flex-col">
      <HeaderWrapper className="text-white font-bold p-4">
        <h1 className="text-start text-xl md:text-3xl">Apotheken der Nähe</h1>
      </HeaderWrapper>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden gap-4">
        {/* ── left pane */}
        <div className="w-full md:w-1/3 p-4 overflow-y-auto">
          <Row className="pb-4 justify-center">
            <Col md={12}>
              <IconInput
                left={<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="!rounded-full"
                placeholder={isAddressSearch ? "Suche nach Ort/PLZ" : "Suche nach Name"}
              />
            </Col>
          </Row>

          <Row className="justify-center pb-4 items-center" style={{ flexWrap: "nowrap", marginRight: 5, marginLeft: -5 }}>
            <Col xs="auto" sm="auto" className="d-flex align-items-center">
              <Switch checked={showVerified} onCheckedChange={setShowVerified} className="ml-2 bg-[#1d4a34]" />
              <span className="ml-2">Verifiziert</span>
            </Col>
            <Col xs="auto" sm="auto">
              <Button2 isWhite onClick={handleOrtPlzClick}>
                {isAddressSearch ? "Name" : "Ort/PLZ"}
              </Button2>
            </Col>
            <Col xs="auto" sm="auto">
              <DdlFilter onSortChange={setSortBy} />
            </Col>
          </Row>

          {loading ? (
            <div className="flex justify-center items-start h-64">
              <Loader />
            </div>
          ) : pharmacies.length === 0 ? (
            <div className="flex justify-center">Keine Apotheken gefunden</div>
          ) : (
            <ul className="space-y-4">
              {sortedPharmacies.map((p) => (
                <ListItem
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  imagePath={
                    p.imagePath
                      ? `${API_URL}/images/Pharmacy/${p.imagePath}`
                      : ""
                  }
                  coverImagePath={
                    p.coverImagePath
                      ? `${API_URL}/images/Pharmacy/${p.coverImagePath}`
                      : ""
                  }
                  address={p.address}
                  isVerified={p.isVerified}
                  detailsUrl={`/pharmacyDetail/${p.id}`}
                />
              ))}
            </ul>
          )}

          <div className="flex justify-center mt-6 space-x-2 my-3 items-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 border rounded-full ${
                  currentPage === i + 1 ? "bg-[#1d4a34] text-white" : "bg-white text-[#1d4a34]"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <span>Gesamt: {totalPharmacies}</span>
          </div>
        </div>

        {/* ── map pane */}
        <PharmaciesMap data={pharmacies} customIconSize={[30, 30]} />
      </div>
    </div>
  );
};

export default PharmaciesList;
