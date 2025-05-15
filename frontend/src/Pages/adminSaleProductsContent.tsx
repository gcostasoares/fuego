/*  src/components/AdminSaleProductsContent.tsx
    ─────────────────────────────────────────────────────────────────────────────
    • Shows chosen product’s thumbnail next to each sale-entry
    • Full-page loading overlay (same pattern as other admin pages)
    • German “Neues Sale-Produkt hinzufügen” button label
    • Zero omissions – complete file
*/

import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

/* ────────────────────────── helpers ──────────────────────────── */
function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center
                    bg-white/70 backdrop-blur-sm">
      <Loader />
    </div>
  );
}

/* ────────────────────────── types ─────────────────────────────── */
interface SaleProduct {
  id: string;
  productId: string;
  price: number | string;
  title: string;
  subTitle: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  saleName: string | null;
  imageUrl: string[];              // first entry is profile image
}

const defaultForm = { productId: "", price: "", title: "", subTitle: "" };
const API_URL     = import.meta.env.VITE_API_URL ?? "";

/* ────────────────────────── component ─────────────────────────── */
export default function AdminSaleProductsContent() {
  const [items,    setItems]    = useState<SaleProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<SaleProduct|null>(null);
  const [form,     setForm]     = useState(defaultForm);
  const [modalOpen,setModalOpen]= useState(false);
  const [loading,  setLoading]  = useState(false);            // ← loader
  const modalRef               = useRef<HTMLDivElement>(null);

  const headers = { "x-admin-key": localStorage.getItem("adminKey") || "" };

  /* ─── GET /SaleProducts ─────────────────────────────────────── */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const r = await apiClient.get<SaleProduct[]>("/SaleProducts", { headers });
      setItems(r.data);
    } catch (err) {
      console.error("Error fetching sale products:", err);
    } finally { setLoading(false); }
  };

  /* ─── GET /products (with images) ───────────────────────────── */
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const r = await apiClient.get<{ products: Product[] }>(
        "/products?pageSize=1000",
        { headers }
      );
      const list = Array.isArray(r.data.products)
        ? r.data.products
        : Array.isArray(r.data) ? (r.data as Product[]) : [];
      setProducts(list);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); fetchProducts(); }, []);

  /* ─── modal open/close ──────────────────────────────────────── */
  const openModal = (it?:SaleProduct) => {
    if (it) {
      setSelected(it);
      setForm({
        productId: it.productId,
        price:     String(it.price),
        title:     it.title,
        subTitle:  it.subTitle,
      });
    } else {
      setSelected(null);
      setForm(defaultForm);
    }
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  /* ─── form change ───────────────────────────────────────────── */
  const onChange = (e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>) => {
    const { name,value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  /* ─── add / update ──────────────────────────────────────────── */
  const onSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.price || !form.title) {
      return alert("Bitte Produkt, Titel und Preis eingeben");
    }
    const payload = {
      productId: form.productId,
      price:     parseFloat(form.price.replace(",", ".")),
      title:     form.title.trim(),
      subTitle:  form.subTitle.trim(),
    };

    setLoading(true);
    try {
      if (selected) {
        await apiClient.put(`/SaleProducts/${selected.id}`, payload, { headers });
      } else {
        await apiClient.post("/SaleProducts", payload, { headers });
      }
      await fetchItems();
      closeModal();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Speichern fehlgeschlagen");
    } finally { setLoading(false); }
  };

  /* ─── delete ────────────────────────────────────────────────── */
  const onDelete = async (id:string) => {
    if (!confirm("Löschen?")) return;
    setLoading(true);
    try {
      await apiClient.delete(`/SaleProducts/${id}`, { headers });
      await fetchItems();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Löschen fehlgeschlagen");
    } finally { setLoading(false); }
  };

  /* ──────────────── helper to show product image ─────────────── */
  const productThumb = (pid:string) => {
    const p = products.find(pr => pr.id===pid);
    const img = p?.imageUrl?.[0];
    return img ? `${API_URL}/images/Products/${img}` : null;
  };

  /* ───────────────────────── JSX ─────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Sale-Produkte</h2>
        <Button onClick={()=>openModal()}>Neues Sale-Produkt hinzufügen</Button>
      </div>

      {/* List */}
      <ul className="divide-y">
        {items.map(it=>{
          const imgSrc = productThumb(it.productId);
          return (
            <li key={it.id}
                className="flex justify-between items-center p-2 hover:bg-gray-50">
              <div className="flex items-center gap-3">
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={it.title}
                    className="w-10 h-10 rounded-full object-cover border-2"
                    loading="lazy"
                  />
                )}
                <span
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={()=>openModal(it)}
                >
                  {it.title}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono">{Number(it.price).toFixed(2)} €</span>
                <Button variant="destructive" size="sm"
                        onClick={()=>onDelete(it.id)}>
                  Löschen
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/50"
          onClick={e=>e.target===e.currentTarget && closeModal()}
        >
          <div
            ref={modalRef}
            onClick={e=>e.stopPropagation()}
            className="bg-white w-full max-w-md max-h-[85vh] overflow-y-auto
                       rounded-lg p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={closeModal}
            >×</button>

            <h3 className="text-2xl font-bold mb-4">
              {selected ? "Sale-Produkt bearbeiten" : "Neues Sale-Produkt"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Produkt */}
              <div>
                <label className="block text-sm font-medium">Produkt</label>
                <select
                  name="productId"
                  value={form.productId}
                  onChange={onChange}
                  required
                  className="w-full border p-2 rounded"
                >
                  <option value="">— Produkt wählen —</option>
                  {products.map(p=>(
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Titel */}
              <div>
                <label className="block text-sm font-medium">Titel</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Untertitel */}
              <div>
                <label className="block text-sm font-medium">Untertitel</label>
                <input
                  name="subTitle"
                  value={form.subTitle}
                  onChange={onChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Preis */}
              <div>
                <label className="block text-sm font-medium">Preis (€)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={onChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 mt-4">
                <Button type="submit">
                  {selected ? "Speichern" : "Hinzufügen"}
                </Button>
                <Button variant="outline" onClick={closeModal}>Abbrechen</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <FullPageLoader />}
    </div>
  );
}
