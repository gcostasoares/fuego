import { Pharmacy } from "./doctors";

export interface ProductFilters {
  genetics?: string[];
  minCBD?: number;
  maxCBD?: number;
  minTHC?: number;
  maxTHC?: number;
  minPrice?: number;
  maxPrice?: number;
  effects?: string[];
  terpenes?: string[];
  // Add other filter parameters as needed
}

export interface Product {
  id: string;
  name: string;
  genetics: string;
  // Add other product properties
}

export interface Product {
  id: string;
  name: string;
  saleName: string;
  originId: string;
  genetics: string;
  cbd: number;
  thc: number;
  aboutFlower: string;
  growerDescription: string;
  rating: number;
  price: number;
  featuredProduct: string;
  isAvailable: string;
  manufacturerId: string;
  tastes: Taste[];
  strains: Strain[];
  terpenes: Terpene[];
  effects: Effect[];
  pharmacies: Pharmacy[];
  rayId: string;
  imageUrl: string[];
  defaultImageIndex: number;
}

export interface Terpene {
  id: string;
  title: string;
  imagePath: string;
}
export interface Effect {
  id: string;
  title: string;
  imagePath: string;
}

export interface Taste {
  id: string;
  title: string;
  imagePath: string;
}

export interface Strain {
  id: string;
  name: string;
}
export interface Origin {
  id: string;
  name: string;
  imagePath: string;
}
export interface Manufacturer {
  id: string;
  name: string;
  imagePath: string;
}

export interface Ray {
  id: string;
  name: string;
  imagePath: string;
}
