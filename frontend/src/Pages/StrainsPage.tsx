import React , { useState, useEffect } from "react";
import { StrainFilter } from "../components/Strains/StrainFilter";
import { StrainList } from "../components/Strains/StrainList";

export const StrainsPage = () => {
  const [strains, setStrains] = useState<Strain[]>([]);
  const [filters, setFilters] = useState({ type: '', search: '' });

  useEffect(() => {
    const fetchStrains = async () => {
      try {
        const queryParams = new URLSearchParams(
          Object.entries(filters).filter(([_, v]) => v !== '')
        );
        
        const response = await fetch(`/api/strains?${queryParams}`);
        const data = await response.json();
        setStrains(data);
      } catch (error) {
        console.error('Error fetching strains:', error);
      }
    };

    fetchStrains();
  }, [filters]);

  return (
    <div className="strains-page">
      <h1>Cannabis Strains Catalog</h1>
      <StrainFilter onFilterChange={setFilters} />
      <StrainList strains={strains} />
    </div>
  );
};

// Types

type Strain = {
  id: number;
  name: string;
  type: 'Sativa' | 'Indica' | 'Hybrid';
  thc: number;
  cbd: number;
  effects: string[];
  flavors: string[];
};
