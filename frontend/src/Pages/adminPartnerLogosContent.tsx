// src/components/AdminPartnerLogoContent.tsx
import React, { useEffect, useRef, useState } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface Logo {
  id: string;
  imagePath: string | null;
}

// Remove any leading “01- ” etc.
const stripPrefix = (p: string | null) =>
  p ? p.replace(/^\d+\s*-\s*/, "") : "";

export default function AdminPartnerLogoContent() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [selected, setSelected] = useState<Logo | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [modalOpen, setModalOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Use VITE_API_URL (falls back to localhost)
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

  // 1) Fetch current logos
  const fetchLogos = async () => {
    try {
      const r = await apiClient.get<Logo[]>("/PartnerLogos");
      // sort by numeric prefix if present
      const sorted = [...r.data].sort((a, b) => {
        const na = Number((a.imagePath ?? "").match(/^\d+/)?.[0] || 999);
        const nb = Number((b.imagePath ?? "").match(/^\d+/)?.[0] || 999);
        return na - nb;
      });
      setLogos(sorted);
    } catch (err) {
      console.error("Error fetching partner logos:", err);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  // Open “add” or “edit” modal
  const openModal = (logo?: Logo) => {
    if (logo) {
      setSelected(logo);
      setPreview(logo.imagePath);
      setFile(null);
      setMode("edit");
    } else {
      setSelected(null);
      setPreview(null);
      setFile(null);
      setMode("add");
    }
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // When user selects a file
  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/png", "image/jpeg"].includes(f.type)) {
      return alert("Nur JPG/PNG erlaubt");
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const removeImage = () => {
    setFile(null);
    setPreview(null);
  };

  // Add or replace logo
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "add" && !file) {
      return alert("Bitte ein Bild wählen.");
    }

    const fd = new FormData();
    if (file) fd.append("image", file);

    try {
      if (mode === "add") {
        await apiClient.post("/PartnerLogos", fd);
      } else if (selected) {
        await apiClient.put(`/PartnerLogos/${selected.id}`, fd);
      }
      await fetchLogos();
      closeModal();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Speichern fehlgeschlagen");
    }
  };

  // Delete logo
  const onDelete = async (id: string) => {
    if (!confirm("Löschen?")) return;
    try {
      await apiClient.delete(`/PartnerLogos/${id}`);
      await fetchLogos();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Löschen fehlgeschlagen");
    }
  };

  // Reorder on drag end, then persist new names
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const reordered = Array.from(logos);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setLogos(reordered);

    try {
      // Rename on server by updating imagePath with new numeric prefix
      for (let idx = 0; idx < reordered.length; idx++) {
        const l = reordered[idx];
        const ext = stripPrefix(l.imagePath);
        const newName = `${(idx + 1)
          .toString()
          .padStart(2, "0")}-${ext}`;
        if (l.imagePath !== newName) {
          await apiClient.put(`/PartnerLogos/${l.id}`, { imagePath: newName });
        }
      }
      await fetchLogos();
    } catch (err) {
      console.error("Persist reorder failed:", err);
      alert("Reihenfolge konnte nicht gespeichert werden.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Partner-Logos</h2>
        <Button onClick={() => openModal()}>Neues Logo</Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="logo-list">
          {(prov) => (
            <ul
              ref={prov.innerRef}
              {...prov.droppableProps}
              className="divide-y"
            >
              {logos.map((l, idx) => {
                const position = l.imagePath?.split("-")[0] ?? "";
                return (
                  <Draggable key={l.id} draggableId={l.id} index={idx}>
                    {(p) => (
                      <li
                        ref={p.innerRef}
                        {...p.draggableProps}
                        {...p.dragHandleProps}
                        className="flex justify-between items-center p-2 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {l.imagePath && (
                            <img
                              src={`${API_URL}/images/PartnerLogos/${l.imagePath}`}
                              alt=""
                              className="w-10 h-10 object-contain border-2 rounded-full"
                              loading="lazy"
                            />
                          )}
                          <span
                            className="cursor-pointer text-blue-600 hover:underline"
                            onClick={() => openModal(l)}
                          >
                            {position || "–"}
                          </span>
                        </div>
                        <Button
                          variant="destructive"
                          onClick={() => onDelete(l.id)}
                        >
                          Löschen
                        </Button>
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {prov.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {mode === "edit" ? "Logo ersetzen" : "Neues Logo"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bild (JPG/PNG)
                </label>
                {preview ? (
                  <div className="relative inline-block">
                    <img
                      src={
                        file
                          ? preview
                          : `${API_URL}/images/PartnerLogos/${preview}`
                      }
                      alt="Vorschau"
                      className="w-24 h-24 object-contain border-2 rounded-full"
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
                    onChange={onImageUpload}
                  />
                )}
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
