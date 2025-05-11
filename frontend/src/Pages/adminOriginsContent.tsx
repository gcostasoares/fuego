// src/components/AdminOriginsContent.tsx

import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";

interface Origin {
  id: string;
  name: string;
  imagePath: string | null;
}

const defaultForm = { name: "" };

export default function AdminOriginsContent() {
  const [origins, setOrigins] = useState<Origin[]>([]);
  const [selected, setSelected] = useState<Origin | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const API_URL = "https://fuego-ombm.onrender.com";
  const headers = { "x-admin-key": localStorage.getItem("adminKey") || "" };

  const fetchOrigins = async () => {
    try {
      const resp = await apiClient.get<Origin[]>("/api/origins", { headers });
      setOrigins(resp.data);
    } catch (err) {
      console.error("Error fetching origins:", err);
    }
  };

  useEffect(() => {
    fetchOrigins();
  }, []);

  const openModal = (o?: Origin) => {
    if (o) {
      setSelected(o);
      setForm({ name: o.name });
      setImagePreview(o.imagePath);
      setMode("edit");
    } else {
      setSelected(null);
      setForm(defaultForm);
      setImagePreview(null);
      setMode("add");
    }
    setFile(null);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/png", "image/jpeg"].includes(f.type)) {
      return alert("Nur JPG/PNG erlaubt");
    }
    setFile(f);
    setImagePreview(URL.createObjectURL(f));
  };
  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", form.name.trim() || "(Ohne Name)");
    if (file) fd.append("file", file);
    else if (mode === "edit" && imagePreview === null) {
      fd.append("clearImage", "true");
    }

    try {
      if (mode === "add") {
        await apiClient.post("/Origins", fd, {
          headers: { "Content-Type": "multipart/form-data", ...headers },
        });
      } else if (selected) {
        await apiClient.put(`/Origins/${selected.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data", ...headers },
        });
      }
      await fetchOrigins();
      closeModal();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Speichern fehlgeschlagen");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Löschen?")) return;
    try {
      await apiClient.delete(`/Origins/${id}`, { headers });
      await fetchOrigins();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Löschen fehlgeschlagen");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Herkünfte (Origins)</h2>
        <Button onClick={() => openModal()}>Neue Herkunft</Button>
      </div>
      <ul className="divide-y">
        {origins.map((o) => (
          <li
            key={o.id}
            className="flex justify-between items-center p-2 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {o.imagePath && (
                <img
                  key={o.imagePath}
                  src={`${API_URL}/images/Origin/${o.imagePath}`}
                  alt={o.name}
                  className="w-10 h-10 rounded-full object-cover border-2"
                  loading="lazy"
                />
              )}
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => openModal(o)}
              >
                {o.name}
              </span>
            </div>
            <Button variant="destructive" onClick={() => remove(o.id)}>
              Löschen
            </Button>
          </li>
        ))}
      </ul>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Schließen"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4">
              {mode === "edit" ? "Herkunft bearbeiten" : "Neue Herkunft"}
            </h3>
            <form onSubmit={submit} className="space-y-4">
              {/* Image */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bild (JPG/PNG)
                </label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={
                        file
                          ? imagePreview
                          : `${API_URL}/images/Origin/${imagePreview}`
                      }
                      alt="Vorschau"
                      className="w-24 h-24 object-cover rounded-full border-2"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500 shadow"
                      aria-label="Bild löschen"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={onFile}
                  />
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  className="w-full border p-2"
                  required
                />
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
