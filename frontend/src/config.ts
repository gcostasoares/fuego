export const API_URL = import.meta.env.VITE_API_URL || "https://fuego-ombm.onrender.com";
export const PLACEHOLDER_IMAGE = `${API_URL}/images/Products/1.png`;

export function toProductImgUrl(file?: string): string {
  if (!file) return PLACEHOLDER_IMAGE;
  if (file.startsWith("http")) return file;
  return `${API_URL}/images/Products/${file}`;
}
