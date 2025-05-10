import React , { useState, useEffect } from "react";

type FilterProps = {
  onFilterChange: (filters: { type: string; search: string }) => void;
};

export const StrainFilter = ({ onFilterChange }: FilterProps) => {
  const [type, setType]     = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    onFilterChange({ type, search });
  }, [type, search, onFilterChange]);

  return (
    <div className="strain-filters">
      <select 
        value={type} 
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="Sativa">Sativa</option>
        <option value="Indica">Indica</option>
        <option value="Hybrid">Hybrid</option>
      </select>

      <input
        type="text"
        placeholder="Search strains..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};
