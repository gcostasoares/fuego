// src/components/AdminCBDShopsContent.tsx

import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";

const days = [
  "Montag","Dienstag","Mittwoch",
  "Donnerstag","Freitag","Samstag","Sonntag",
];

const times: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    times.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
  }
}

interface CBDShop {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  price: string;            // server price formatted as "xx,yy"
  startDay: string;
  endDay: string;
  startTime: string;        // "HH:mm"
  endTime: string;          // "HH:mm"
  isVerified: boolean;
  imagePath: string | null;
  coverImagePath: string | null;
}

type Form = Omit<CBDShop, "id">;

const defaultForm: Form = {
  name: "", description: "",
  phone: "", email: "", address: "",
  price: "",
  startDay: days[0], endDay: days[0],
  startTime: times[0], endTime: times[0],
  isVerified: false,
  imagePath: null, coverImagePath: null,
};

export default function AdminCBDShopsContent() {
  const [shops, setShops]               = useState<CBDShop[]>([]);
  const [selected, setSelected]         = useState<CBDShop|null>(null);
  const [form, setForm]                 = useState<Form>(defaultForm);
  const [imageFile, setImageFile]       = useState<File|null>(null);
  const [coverFile, setCoverFile]       = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState<string|null>(null);
  const [coverPreview, setCoverPreview] = useState<string|null>(null);
  const [mode, setMode]                 = useState<"add"|"edit">("add");
  const [open, setOpen]                 = useState(false);
  const modalRef                        = useRef<HTMLDivElement>(null);

  // Admin key header for authenticated calls
  const headers = { "x-admin-key": localStorage.getItem("adminKey") ?? "" };

  // Base URL for images, derived from axios baseURL
  const API_BASE = apiClient.defaults.baseURL?.replace(/\/$/, "") || "";

  // Fetch the list of shops
  const fetchShops = async () => {
    try {
      const res = await apiClient.get<{ cbdShops: any[] }>("/CBDShops", {
        params: { pageNumber: 1, pageSize: 50 },
        headers
      });
      setShops(res.data.cbdShops.map(it => ({
        ...it,
        price: Number(it.price).toFixed(2).replace(".", ","),
        startTime: it.startTime,
        endTime: it.endTime,
      })));
    } catch (err) {
      console.error("Error fetching CBD shops:", err);
      alert("Fehler beim Laden der CBD Shops");
    }
  };
  useEffect(fetchShops, []);

  // Open modal for add/edit
  const openModal = (shop?: CBDShop) => {
    if (shop) {
      setSelected(shop);
      setForm(shop);
      setImagePreview(
        shop.imagePath ? `${API_BASE}/images/CBDShops/${shop.imagePath}` : null
      );
      setCoverPreview(
        shop.coverImagePath ? `${API_BASE}/images/CBDShops/${shop.coverImagePath}` : null
      );
      setImageFile(null);
      setCoverFile(null);
      setMode("edit");
    } else {
      setSelected(null);
      setForm(defaultForm);
      setImagePreview(null);
      setCoverPreview(null);
      setImageFile(null);
      setCoverFile(null);
      setMode("add");
    }
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  // Handle text/select/checkbox changes
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle file selection
  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFn: typeof setImageFile | typeof setCoverFile,
    setPrev: typeof setImagePreview | typeof setCoverPreview
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFn(file);
    setPrev(URL.createObjectURL(file));
  };

  // Submit add/edit form
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Normalize and format price
    let raw = form.price.replace(",", ".").trim();
    let num = parseFloat(raw);
    if (isNaN(num)) num = 0;
    num = Math.round(num * 100) / 100;
    const priceFixed = num.toFixed(2);

    const fd = new FormData();
    fd.append("name",        form.name);
    fd.append("description", form.description);
    fd.append("phone",       form.phone);
    fd.append("email",       form.email);
    fd.append("address",     form.address);
    fd.append("price",       priceFixed);
    fd.append("startDay",    form.startDay);
    fd.append("endDay",      form.endDay);
    fd.append("startTime",   `${form.startTime}:00`);
    fd.append("endTime",     `${form.endTime}:00`);
    fd.append("isVerified",  String(form.isVerified));
    if (imageFile) fd.append("image", imageFile);
    if (coverFile) fd.append("cover", coverFile);

    try {
      const cfg = { headers }; // let axios set Content-Type with boundary
      if (mode === "add") {
        await apiClient.post("/CBDShops", fd, cfg);
      } else if (selected) {
        await apiClient.put(`/CBDShops/${selected.id}`, fd, cfg);
      }
      await fetchShops();
      closeModal();
    } catch (err) {
      console.error("Error saving CBD shop:", err);
      alert("Speichern fehlgeschlagen");
    }
  };

  // Delete a shop
  const onDelete = async (id: string) => {
    if (!confirm("Löschen?")) return;
    try {
      await apiClient.delete(`/CBDShops/${id}`, { headers });
      await fetchShops();
    } catch {
      alert("Löschen fehlgeschlagen");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">CBD Shops</h2>
        <Button onClick={() => openModal()}>Neuer CBD Shop</Button>
      </div>

      <ul className="divide-y">
        {shops.map(s => (
          <li
            key={s.id}
            className="flex justify-between items-center p-2 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {s.imagePath && (
                <img
                  src={`${API_BASE}/images/CBDShops/${s.imagePath}`}
                  alt={s.name}
                  className="w-10 h-10 rounded-full object-cover border-2"
                  loading="lazy"
                />
              )}
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => openModal(s)}
              >
                {s.name}
              </span>
            </div>
            <Button variant="destructive" onClick={() => onDelete(s.id)}>
              Löschen
            </Button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={e => e.stopPropagation()}
            className="bg-white w-full max-w-lg max-h-[80vh] overflow-auto rounded-lg p-6"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {mode === "edit" ? "CBD Shop bearbeiten" : "Neuer CBD Shop"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Profilbild */}
              <div>
                <label className="block text-sm font-medium mb-1">Profilbild</label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Vorschau"
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={e => handleFile(e, setImageFile, setImagePreview)}
                  />
                )}
              </div>

              {/* Coverbild */}
              <div>
                <label className="block text-sm font-medium mb-1">Coverbild</label>
                {coverPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={coverPreview}
                      alt="Vorschau"
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);
                      }}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={e => handleFile(e, setCoverFile, setCoverPreview)}
                  />
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Beschreibung */}
              <div>
                <label className="block text-sm font-medium mb-1">Beschreibung</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={4}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Telefon & E-Mail */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Telefon</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">E-Mail</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
              </div>

              {/* Adresse & Preis */}
              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preis (€)</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Öffnungszeiten */}
              <fieldset className="border p-4 rounded">
                <legend className="font-semibold mb-2">Öffnungszeiten</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Tag von</label>
                    <select
                      name="startDay"
                      value={form.startDay}
                      onChange={onChange}
                      className="w-full border p-2 rounded"
                    >
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Tag bis</label>
                    <select
                      name="endDay"
                      value={form.endDay}
                      onChange={onChange}
                      className="w-full border p-2 rounded"
                    >
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm mb-1">Zeit von</label>
                    <select
                      name="startTime"
                      value={form.startTime}
                      onChange={onChange}
                      className="w-full border p-2 rounded"
                    >
                      {times.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Zeit bis</label>
                    <select
                      name="endTime"
                      value={form.endTime}
                      onChange={onChange}
                      className="w-full border p-2 rounded"
                    >
                      {times.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Verifiziert */}
              <div>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={form.isVerified}
                    onChange={onChange}
                  />
                  Verifiziert
                </label>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button type="submit">
                  {mode === "edit" ? "Speichern" : "Hinzufügen"}
                </Button>
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
