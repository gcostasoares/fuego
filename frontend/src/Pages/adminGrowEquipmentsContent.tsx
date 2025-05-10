// src/components/AdminGrowEquipmentsContent.tsx
import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";

const days = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

const times: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    times.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
  }
}

type GrowEquipment = {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  price: string;
  startDay: string;
  endDay: string;
  startTime: string;  // "HH:mm"
  endTime: string;    // "HH:mm"
  isVerified: boolean;
  imagePath: string | null;
  coverImagePath: string | null;
};

type Form = Omit<GrowEquipment, "id"> & {
  price: string;  // e.g. "42,33"
};

const defaultForm: Form = {
  name: "",
  description: "",
  phone: "",
  email: "",
  address: "",
  price: "",
  startDay: days[0],
  endDay: days[0],
  startTime: times[0],
  endTime: times[0],
  isVerified: false,
  imagePath: null,
  coverImagePath: null,
};

export default function AdminGrowEquipmentsContent() {
  const [items, setItems] = useState<GrowEquipment[]>([]);
  const [selected, setSelected] = useState<GrowEquipment | null>(null);
  const [form, setForm] = useState<Form>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";
  const headers = { "x-admin-key": localStorage.getItem("adminKey") || "" };

  const fetchItems = async () => {
    try {
      const res = await apiClient.get("/GrowEquipments", {
        params: { page: 1, pageSize: 50 },
        headers,
      });
      setItems(
        res.data.growEquipments.map((it: any) => ({
          ...it,
          startTime: it.startTime.slice(11, 16),
          endTime: it.endTime.slice(11, 16),
        }))
      );
    } catch (err) {
      console.error("Error fetching grow equipments:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openModal = (it?: GrowEquipment) => {
    if (it) {
      setSelected(it);
      setForm({
        name: it.name,
        description: it.description,
        phone: it.phone,
        email: it.email,
        address: it.address,
        price: Number(it.price).toFixed(2).replace(".", ","), // e.g. "10,20"
        startDay: it.startDay,
        endDay: it.endDay,
        startTime: it.startTime,
        endTime: it.endTime,
        isVerified: it.isVerified,
        imagePath: it.imagePath,
        coverImagePath: it.coverImagePath,
      });
      setImagePreview(
        it.imagePath
          ? `${API_URL}/images/GrowEquipments/${it.imagePath}`
          : null
      );
      setCoverPreview(
        it.coverImagePath
          ? `${API_URL}/images/GrowEquipments/${it.coverImagePath}`
          : null
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

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as any;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // normalize price
    let raw = form.price.trim().replace(",", ".");
    let num = parseFloat(raw);
    if (isNaN(num)) num = 0;
    num = Math.round(num * 100) / 100;
    const priceFixed = num.toFixed(2); // "10.20"

    const payload: any = { ...form, price: priceFixed };
    payload.startTime = `${payload.startTime}:00`;
    payload.endTime = `${payload.endTime}:00`;

    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v != null) fd.append(k, String(v));
    });
    if (imageFile) fd.append("image", imageFile);
    if (coverFile) fd.append("cover", coverFile);

    try {
      if (mode === "add") {
        await apiClient.post("/GrowEquipments", fd, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      } else if (selected) {
        await apiClient.put(`/GrowEquipments/${selected.id}`, fd, {
          headers: { ...headers, "Content-Type": "multipart/form-data" },
        });
      }
      fetchItems();
      closeModal();
    } catch (err) {
      console.error("Error saving grow equipment:", err);
      alert("Save failed");
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Löschen?")) return;
    await apiClient.delete(`/GrowEquipments/${id}`, { headers });
    fetchItems();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Grow Equipments</h2>
        <Button onClick={() => openModal()}>Neues Equipment</Button>
      </div>

      <ul className="divide-y">
        {items.map((s) => (
          <li
            key={s.id}
            className="flex justify-between items-center p-2 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {s.imagePath && (
                <img
                  src={`${API_URL}/images/GrowEquipments/${s.imagePath}`}
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
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg max-h-[80vh] overflow-auto rounded-lg shadow-lg p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {mode === "edit"
                ? "Equipment bearbeiten"
                : "Neues Equipment"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Profilbild */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profilbild
                </label>
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
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500 shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) =>
                      handleFile(e, setImageFile, setImagePreview)
                    }
                  />
                )}
              </div>

              {/* Coverbild */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Coverbild
                </label>
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
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500 shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) =>
                      handleFile(e, setCoverFile, setCoverPreview)
                    }
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
                  className="w-full border p-2"
                />
              </div>

              {/* Beschreibung */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Beschreibung
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={4}
                  className="w-full border p-2"
                />
              </div>

              {/* Telefon & E-Mail */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Telefon
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    E-Mail
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full border p-2"
                  />
                </div>
              </div>

              {/* Adresse & Preis */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Adresse
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  className="w-full border p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preis</label>
                <input
                  name="price"
                  value={form.price}
                  onChange={onChange}
                  className="w-full border p-2"
                />
              </div>

              {/* Öffnungszeiten */}
              <fieldset className="border p-4">
                <legend className="font-semibold">Öffnungszeiten</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Tag von</label>
                    <select
                      name="startDay"
                      value={form.startDay}
                      onChange={onChange}
                      className="w-full border p-2"
                    >
                      {days.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Tag bis</label>
                    <select
                      name="endDay"
                      value={form.endDay}
                      onChange={onChange}
                      className="w-full border p-2"
                    >
                      {days.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
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
                      className="w-full border p-2"
                    >
                      {times.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Zeit bis</label>
                    <select
                      name="endTime"
                      value={form.endTime}
                      onChange={onChange}
                      className="w-full border p-2"
                    >
                      {times.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Verifiziert */}
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="isVerified"
                    checked={form.isVerified}
                    onChange={onChange}
                    className="mr-2"
                  />
                  Verifiziert
                </label>
              </div>

              <div className="flex justify-end space-x-4 mt-4">
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
