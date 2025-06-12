import { Search, ChevronsUpDown, Check } from "lucide-react";
import React, { useEffect, useState, useRef, useMemo } from "react";
import apiClient from "@/Apis/apiService";
import { HeaderWrapper } from "@/Styles/StyledComponents";
import GrowEquipmentMap from "@/components/Map";
import ListItem from "@/components/ShopsListItem";
import { Button2 } from "@/components/ui/button2";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/iconinput";
import Loader from "@/components/ui/loader";
import { Switch } from "@/components/ui/switch";
import { GrowEquipment } from "@/types/doctors";
import "leaflet/dist/leaflet.css";
import { Col,  Row  } from "react-bootstrap";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "cmdk";
import { cn } from "@/lib/utils";

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

export const GrowEquipmentList = () => {
  const [growEquipment, setGrowEquipment] = useState<GrowEquipment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [showVerified, setShowVerified] = useState(false);
  const [isAddressSearch, setIsAddressSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const growEquipmentPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalGrowEquipment, setTotalGrowEquipment] = useState(0);
  const [loading, setLoading] = useState(true);
  const abortController = useRef<AbortController | null>(null);

  const API_URL = "https://fuego-ombm.onrender.com";

  const fetchGrowEquipment = async () => {
    if (abortController.current) {
      abortController.current.abort();
    }
    abortController.current = new AbortController();

    try {
      setLoading(true);
      const response = await apiClient.get("/growequipments", {
        params: {
          name: isAddressSearch ? null : searchTerm,
          address: isAddressSearch ? addressSearch : null,
          pageNumber: currentPage,
          pageSize: growEquipmentPerPage,
          isVerified: showVerified || null,
          sortBy: sortBy,
        },
        signal: abortController.current.signal,
      });

      setGrowEquipment(response.data.growEquipments || []);
      setTotalGrowEquipment(response.data.totalCount);
      setTotalPages(
        Math.ceil(response.data.totalCount / growEquipmentPerPage)
      );
    } catch (err) {
      if ((err as any).name === "CanceledError") return;
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowEquipment();
  }, [searchTerm, showVerified, currentPage, addressSearch, sortBy]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (isAddressSearch) {
        setAddressSearch(inputValue);
      } else {
        setSearchTerm(inputValue);
      }
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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const sortedGrowEquipment = useMemo(() => {
    let items = [...growEquipment];
    if (sortBy === "A-Z") {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Z-A") {
      items.sort((a, b) => b.name.localeCompare(a.name));
    }
    return items;
  }, [growEquipment, sortBy]);

  return (
    <div className="w-full h-screen flex flex-col">
      <HeaderWrapper className="text-start font-bold p-4">
        <h1 className="text-start text-white text-xl md:text-3xl">
          Grow Equipment der Nähe
        </h1>
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
                placeholder={
                  isAddressSearch ? "Suche nach Ort/Plz" : "Suche nach name"
                }
              />
            </Col>
          </Row>
          <Row
            className="justify-center pb-4 items-center"
            style={{ flexWrap: "nowrap", marginRight: 5, marginLeft: -5 }}
          >
            <Col xs="auto" sm="auto" className="d-flex align-items-center">
              <Switch
                checked={showVerified}
                onCheckedChange={(state) => setShowVerified(state)}
                className="ml-2 bg-[#1d4a34]"
              />
              <span className="ml-2">Verifiziert</span>
            </Col>
            <Col xs="auto" sm="auto">
              <a onClick={handleOrtPlzClick} style={{ cursor: "pointer" }}>
                <Button2 isWhite>
                  {isAddressSearch ? "Name" : "Ort/Plz"}
                </Button2>
              </a>
            </Col>
            <Col xs="auto" sm="auto">
              <DdlFilter onSortChange={setSortBy} />
            </Col>
          </Row>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                height: "100vh",
              }}
            >
              <Loader />
            </div>
          ) : (
            <>
              {sortedGrowEquipment.length === 0 ? (
                <div className="flex justify-center">
                  Keine Grow Equipment gefunden
                </div>
              ) : (
                <ul className="space-y-4">
                  {sortedGrowEquipment.map((item) => (
                    <ListItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      imagePath={
                        item.imagePath
                          ? `${API_URL}/images/GrowEquipments/${item.imagePath}`
                          : ""
                      }
                      coverImagePath={
                        item.coverImagePath
                          ? `${API_URL}/images/GrowEquipments/${item.coverImagePath}`
                          : ""
                      }
                      address={item.address}
                      isVerified={item.isVerified}
                      detailsUrl={`/growEquipmentDetail/${item.id}`}
                    />
                  ))}
                </ul>
              )}
            </>
          )}
          <div
            className="flex justify-center mt-6 space-x-2 my-3"
            style={{ alignItems: "center" }}
          >
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border rounded-full ${
                  currentPage === index + 1
                    ? "bg-[#1d4a34] text-white"
                    : "bg-white text-[#1d4a34]"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <span className="inline-block">Gesamt: {totalGrowEquipment}</span>
          </div>
        </div>
        <GrowEquipmentMap data={growEquipment} customIconSize={[30, 30]} />
      </div>
    </div>
  );
};

export default GrowEquipmentList;
