
// src/Pages/DoctorList.tsx
import { Search, ChevronsUpDown, Check } from "lucide-react";
import React, { useEffect, useState, useRef, useMemo } from "react";
import apiClient from "@/Apis/apiService";
import { HeaderWrapper } from "@/Styles/StyledComponents";
import DoctorsMap from "@/components/Map";
import ListItem from "@/components/ShopsListItem";
import { Button2 } from "@/components/ui/button2";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/ui/iconinput";
import Loader from "@/components/ui/loader";
import { Switch } from "@/components/ui/switch";
import { Doctor } from "@/types/doctors";
import "leaflet/dist/leaflet.css";
import { Col,  Row  } from "react-bootstrap";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "cmdk";
import { cn } from "@/lib/utils";

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
                    <span>{option.label}</span>
                    <Check
                      className={cn(
                        "ml-auto inline-block",
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

export const DoctorList: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [addressSearch, setAddressSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [showVerified, setShowVerified] = useState(false);
  const [isAddressSearch, setIsAddressSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [loading, setLoading] = useState(true);
  const abortController = useRef<AbortController | null>(null);

  const fetchDoctors = async () => {
    if (abortController.current) abortController.current.abort();
    abortController.current = new AbortController();
    try {
      setLoading(true);
      const response = await apiClient.get("/doctors", {
        params: {
          name: isAddressSearch ? null : searchTerm,
          address: isAddressSearch ? addressSearch : null,
          isVerified: showVerified ? true : null,
          pageNumber: currentPage,
          pageSize: doctorsPerPage,
          sortBy,
        },
        signal: abortController.current.signal,
      });
      setDoctors(response.data.doctors || []);
      setTotalDoctors(response.data.totalCount);
      setTotalPages(Math.ceil(response.data.totalCount / doctorsPerPage));
    } catch (err: any) {
      if (err.name === "CanceledError") return;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
    return () => {
      abortController.current?.abort();
    };
  }, [searchTerm, addressSearch, showVerified, currentPage, sortBy]);

  // Debounce input
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

  const sortedDoctors = useMemo(() => {
    let docs = [...doctors];
    if (sortBy === "A-Z") docs.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "Z-A") docs.sort((a, b) => b.name.localeCompare(a.name));
    return docs;
  }, [doctors, sortBy]);

  return (
    <div className="w-full h-screen flex flex-col">
      <HeaderWrapper className="text-white font-bold p-4">
        <h1 className="text-start text-xl md:text-3xl">Ärzte der Nähe</h1>
      </HeaderWrapper>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden gap-4">
        <div className="w-full md:w-1/3 p-4 overflow-y-auto">
          <Row className="pb-4 justify-center">
            <Col md={12}>
              <IconInput
                left={
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" />
                }
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="!rounded-full"
                placeholder={isAddressSearch ? "Suche nach Ort/PLZ" : "Suche nach Name"}
              />
            </Col>
          </Row>

          <Row className="justify-center pb-4 items-center flex-nowrap mx-[-5px]">
            {/* Verifiziert */}
            <Col xs="auto" className="d-flex align-items-center">
              <Switch
                checked={showVerified}
                onCheckedChange={setShowVerified}
                className="ml-2 bg-[#1d4a34]"
              />
              <span className="ml-2">Verifiziert</span>
            </Col>

            {/* Ort/PLZ ↔ Name */}
            <Col xs="auto">
              <a onClick={handleOrtPlzClick} style={{ cursor: "pointer" }}>
                <Button2 isWhite>
                  {isAddressSearch ? "Name" : "Ort/PLZ"}
                </Button2>
              </a>
            </Col>

            {/* Sortierung */}
            <Col xs="auto">
              <DdlFilter onSortChange={setSortBy} />
            </Col>
          </Row>

          {loading ? (
            <div className="flex justify-center items-start h-full">
              <Loader />
            </div>
          ) : doctors.length === 0 ? (
            <div className="flex justify-center">Keine Ärzte gefunden</div>
          ) : (
            <ul className="space-y-4">
              {sortedDoctors.map((doctor) => (
                <ListItem
                  key={doctor.id}
                  id={doctor.id}
                  name={doctor.name}
                  imagePath={
                    doctor.imagePath
                      ? `${API_URL}/images/Doctors/${doctor.imagePath}`
                      : ""
                  }
                  coverImagePath={
                    doctor.coverImagePath
                      ? `${API_URL}/images/Doctors/${doctor.coverImagePath}`
                      : ""
                  }
                  address={doctor.address}
                  isVerified={doctor.isVerified}
                  detailsUrl={`/doctorDetail/${doctor.id}`}
                />
              ))}
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
            <span>Gesamt: {totalDoctors}</span>
          </div>
        </div>

        <DoctorsMap data={doctors} customIconSize={[30, 30]} />
      </div>
    </div>
  );
};

export default DoctorList;
