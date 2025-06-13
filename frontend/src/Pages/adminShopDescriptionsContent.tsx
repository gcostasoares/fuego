// src/components/AdminShopDescriptionsContent.tsx

import React, { useEffect, useState } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { API_URL } from "@/config";

interface ShopDesc {
  id: string;
  title: string;
  description: string;
  imagePath: string | null;
}

export default function AdminShopDescriptionsContent() {
  const [items, setItems] = useState<ShopDesc[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<ShopDesc | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [form, setForm] = useState({
    title: "",
    description: "",
    imagePath: "" as string | null,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const token   = localStorage.getItem("token") || "";
  const authHdr = { Authorization: `Bearer ${token}` };

  // 1) Load all descriptions
  const fetchItems = async () => {
    try {
      const res = await apiClient.get<ShopDesc[]>(
        `${API_URL}/api/shopdescriptions`,
        { headers: authHdr }
      );
      setItems(res.data);
    } catch {
      alert("Fehler beim Laden.");
    }
  };
  useEffect(() => {
    fetchItems();
  }, []);

  // 2) Open/close modal
  const openModal = (it?: ShopDesc) => {
    if (it) {
      setMode("edit");
      setSelected(it);
      setForm({ title: it.title, description: it.description, imagePath: it.imagePath });
      setPreview(it.imagePath);
    } else {
      setMode("add");
      setSelected(null);
      setForm({ title: "", description: "", imagePath: null });
      setPreview(null);
    }
    setFile(null);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // 3) Form handlers
  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };
  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/png","image/jpeg","image/jpg"].includes(f.type)) {
      return alert("Nur JPG/PNG erlaubt");
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setForm(f => ({ ...f, imagePath: null }));
  };

  // 4) Add / Edit submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "add") {
      if (!file) return alert("Bitte ein Bild wählen.");
      const fd = new FormData();
      fd.append("image", file);
      fd.append("title", form.title.trim() || "(Ohne Titel)");
      fd.append("description", form.description);

      try {
        await apiClient.post(
          `${API_URL}/api/shopdescriptions`,
          fd,
          { headers: { ...authHdr, "Content-Type": undefined } }
        );
        await fetchItems();
        closeModal();
      } catch {
        alert("Erstellen fehlgeschlagen");
      }

    } else if (selected) {
      try {
        if (file) {
          const fd = new FormData();
          fd.append("image", file);
          fd.append("title", form.title.trim() || selected.title);
          fd.append("description", form.description);

          await apiClient.put(
            `${API_URL}/api/shopdescriptions/${selected.id}`,
            fd,
            { headers: { ...authHdr, "Content-Type": undefined } }
          );
        } else {
          await apiClient.put(
            `${API_URL}/api/shopdescriptions/${selected.id}`,
            {
              title:       form.title.trim() || selected.title,
              description: form.description,
              imagePath:   form.imagePath,
            },
            { headers: { ...authHdr, "Content-Type": "application/json" } }
          );
        }
        await fetchItems();
        closeModal();
      } catch {
        alert("Speichern fehlgeschlagen");
      }
    }
  };

  // 5) Delete
  const onDelete = async (id: string) => {
    if (!confirm("Löschen?")) return;
    try {
      await apiClient.delete(
        `${API_URL}/api/shopdescriptions/${id}`,
        { headers: authHdr }
      );
      await fetchItems();
    } catch {
      alert("Löschen fehlgeschlagen");
    }
  };

  // 6) Drag & drop reorder (bulk)
  const onDragEnd = async (res: DropResult) => {
    const { source, destination } = res;
    if (!destination || source.index === destination.index) return;

    // reorder locally
    const reordered = Array.from(items);
    const [moved]   = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);
    setItems(reordered);

    // persist in DB
    try {
      await apiClient.put(
        `${API_URL}/api/shopdescriptions/order`,
        { order: reordered.map(it => it.id) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ SortOrder persisted in DB");
    } catch (err) {
      console.error("Bulk-reorder failed:", err);
      alert("Reihenfolge konnte nicht gespeichert werden.");
      fetchItems();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Shop Descriptions</h2>
        <Button onClick={() => openModal()}>Neue Beschreibung</Button>
      </div>

      {/* List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="desc-list">
          {prov => (
            <ul ref={prov.innerRef} {...prov.droppableProps} className="divide-y">
              {items.map((it, idx) => (
                <Draggable key={it.id} draggableId={it.id} index={idx}>
                  {p => (
                    <li
                      ref={p.innerRef}
                      {...p.draggableProps}
                      {...p.dragHandleProps}
                      className="flex justify-between items-center p-2 hover:bg-gray-50"
                    >
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => openModal(it)}
                      >
                        {it.imagePath && (
                          <img
                            src={`${API_URL}/images/ShopDescriptions/${it.imagePath}`}
                            alt=""
                            className="w-10 h-10 object-cover rounded-full border-2"
                            loading="lazy"
                          />
                        )}
                        <span className="font-medium">{it.title}</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(it.id)}
                      >
                        Löschen
                      </Button>
                    </li>
                  )}
                </Draggable>
              ))}
              {prov.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div
            className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4">
              {mode === "edit" ? "Beschreibung bearbeiten" : "Neue Beschreibung"}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Image */}
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
                          : `${API_URL}/images/ShopDescriptions/${preview}`
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
                    onChange={onImageUpload}
                  />
                )}
              </div>

              {/* Title */}
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

              {/* Description */}
              <div>
                <label className="block text-sm font-medium">Beschreibung</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={3}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Actions */}
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
