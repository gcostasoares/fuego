// src/components/AdminSaleProductsContent.tsx

import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";

interface SaleProduct {
  id: string;
  productId: string;
  price: string;
  title: string;
  subTitle: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  saleName: string;
}

const defaultForm = { productId: "", price: "", title: "", subTitle: "" };

export default function AdminSaleProductsContent() {
  const [items, setItems] = useState<SaleProduct[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<SaleProduct | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const headers = { "x-admin-key": localStorage.getItem("adminKey") || "" };

  // Fetch all entries via admin endpoint
  const fetchItems = async () => {
    try {
      const r = await apiClient.get<SaleProduct[]>("/SaleProducts", { headers });
      setItems(r.data);
    } catch (err) {
      console.error("Error fetching sale products:", err);
    }
  };

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const r = await apiClient.get<{ products: Product[] }>(
        "/products?pageSize=1000",
        { headers }
      );
      setProducts(r.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchProducts();
  }, []);

  const openModal = (it?: SaleProduct) => {
    if (it) {
      setSelected(it);
      setForm({
        productId: it.productId,
        price: it.price.toString(),
        title: it.title,
        subTitle: it.subTitle,
      });
    } else {
      setSelected(null);
      setForm(defaultForm);
    }
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId || !form.price || !form.title) {
      return alert("Bitte Produkt, Titel und Preis eingeben");
    }
    const payload = {
      productId: form.productId,
      price: parseFloat(form.price),
      title: form.title.trim(),
      subTitle: form.subTitle.trim(),
    };

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
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Löschen?")) return;
    try {
      await apiClient.delete(`/SaleProducts/${id}`, { headers });
      await fetchItems();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Löschen fehlgeschlagen");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Sale Products</h2>
        <Button onClick={() => openModal()}>Neues Sale-Produkt</Button>
      </div>

      <ul className="divide-y">
        {items.map((it) => (
          <li
            key={it.id}
            className="flex justify-between items-center p-2 hover:bg-gray-50"
          >
            <div
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => openModal(it)}
            >
              {it.title} — {it.price.toFixed(2)}€
            </div>
            <Button variant="destructive" size="sm" onClick={() => onDelete(it.id)}>
              Löschen
            </Button>
          </li>
        ))}
      </ul>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            ref={modalRef}
            className="bg-white w-full max-w-md rounded-lg p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4">
              {selected ? "Sale-Produkt bearbeiten" : "Neues Sale-Produkt"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
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
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Titel</label>
                <input
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={onChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Untertitel</label>
                <input
                  name="subTitle"
                  type="text"
                  value={form.subTitle}
                  onChange={onChange}
                  className="w-full border p-2 rounded"
                />
              </div>

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

              <div className="flex justify-end space-x-4 mt-4">
                <Button type="submit">{selected ? "Speichern" : "Hinzufügen"}</Button>
                <Button variant="outline" onClick={closeModal}>
                  Abbrechen
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
