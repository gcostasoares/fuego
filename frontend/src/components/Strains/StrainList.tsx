import React from "react";
type Strain = {
  id: number;
  name: string;
  type: "Sativa" | "Indica" | "Hybrid";
  thc: number;
  cbd: number;
  effects: string[];
  flavors: string[];
};
export const StrainList: React.FC<{ strains: Strain[] }> = ({ strains }) => (
  <ul>
    {strains.map((s) => (
      <li key={s.id}>{s.name} ({s.type})</li>
    ))}
  </ul>
);
export default StrainList;
