// src/components/AdminCarouselContent.tsx
import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult
} from "react-beautiful-dnd";

interface Slide {
  id: string;
  title: string | null;
  subTitle: string | null;
  description: string | null;
  imagePath: string | null;
}

const defaultFormData = {
  title: "",
  subTitle: "",
  description: "",
};

export default function AdminCarouselContent() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selected, setSelected] = useState<Slide | null>(null);
  const [form, setForm] = useState(defaultFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const API_URL = "https://fuego-ombm.onrender.com";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // utility to strip any existing numeric prefix "01- "
  const stripPrefix = (title: string | null) =>
    title ? title.replace(/^\d+\s*-\s*/, "") : "";

  const fetchSlides = async () => {
    try {
      const resp = await apiClient.get("/Carousel", { headers });
      setSlides(resp.data);
    } catch (err) {
      console.error("Error fetching carousel:", err);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const openModal = (slide?: Slide) => {
    if (slide) {
      setSelected(slide);
      setForm({
        title: stripPrefix(slide.title),
        subTitle: slide.subTitle || "",
        description: slide.description || "",
      });
      setImagePreview(slide.imagePath);
      setSelectedFile(null);
      setFormMode("edit");
    } else {
      setSelected(null);
      setForm(defaultFormData);
      setImagePreview(null);
      setSelectedFile(null);
      setFormMode("add");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png","image/jpeg","image/jpg"].includes(file.type)) {
      return alert("Nur JPG/PNG erlaubt");
    }
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", (form.title.trim() || "(Ohne Titel)"));
    fd.append("subTitle", form.subTitle);
    fd.append("description", form.description);

    if (selectedFile) {
      fd.append("image", selectedFile);
    } else if (formMode === "edit" && imagePreview === null) {
      fd.append("clearImage", "true");
    }

    try {
      if (formMode === "add") {
        await apiClient.post("/Carousel", fd, {
          headers: { "Content-Type": "multipart/form-data", ...headers },
        });
      } else if (selected) {
        await apiClient.put(`/Carousel/${selected.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data", ...headers },
        });
      }
      await fetchSlides();
      closeModal();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Speichern fehlgeschlagen");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Löschen?")) return;
    try {
      await apiClient.delete(`/Carousel/${id}`, { headers });
      await fetchSlides();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Löschen fehlgeschlagen");
    }
  };

  // only front-end reorder; persist by renaming titles with numeric prefixes
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    // 1) reorder locally
    const updated = Array.from(slides);
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    setSlides(updated);

    // 2) persist by updating each slide's Title to "01- abc", etc.
    try {
      for (let idx = 0; idx < updated.length; idx++) {
        const s = updated[idx];
        const clean = stripPrefix(s.title);
        const newTitle = `${(idx+1).toString().padStart(2,'0')}-${clean}`;
        const fd = new FormData();
        fd.append("title", newTitle);
        fd.append("subTitle", s.subTitle || "");
        fd.append("description", s.description || "");
        // no image change
        await apiClient.put(`/Carousel/${s.id}`, fd, { headers });
      }
      // refetch to get server state
      await fetchSlides();
    } catch (err) {
      console.error("Persist reorder failed:", err);
      alert("Reihenfolge konnte nicht gespeichert werden.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Carousel</h2>
        <Button onClick={() => openModal()}>Neues Slide hinzufügen</Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="carousel-list">
          {provided => (
            <ul
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="divide-y"
            >
              {slides.map((s, index) => (
                <Draggable key={s.id} draggableId={s.id} index={index}>
                  {prov => (
                    <li
                      ref={prov.innerRef}
                      {...prov.draggableProps}
                      {...prov.dragHandleProps}
                      className="flex justify-between items-center p-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        {s.imagePath && (
                          <img
                            src={`${API_URL}/images/Carousel/${s.imagePath}`}
                            alt={stripPrefix(s.title)}
                            className="w-10 h-10 rounded-full object-cover border-2"
                            loading="lazy"
                          />
                        )}
                        <span
                          className="cursor-pointer text-blue-600 hover:underline"
                          onClick={() => openModal(s)}
                        >
                          {stripPrefix(s.title) || "(Ohne Titel)"}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => onDelete(s.id)}
                      >
                        Löschen
                      </Button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={e => e.stopPropagation()}
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
              {formMode === "edit" ? "Slide bearbeiten" : "Neuen Slide"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Image Picker */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bild (JPG/PNG)
                </label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={
                        selectedFile
                          ? imagePreview
                          : `${API_URL}/images/Carousel/${imagePreview}`
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
                <label className="block text-sm font-medium mb-1">
                  Title
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  className="w-full border p-2"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subtitle
                </label>
                <input
                  name="subTitle"
                  value={form.subTitle}
                  onChange={onChange}
                  className="w-full border p-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={3}
                  className="w-full border p-2"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-4">
                <Button type="submit">
                  {formMode === "edit" ? "Speichern" : "Hinzufügen"}
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
