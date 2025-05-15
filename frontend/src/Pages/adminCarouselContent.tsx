/*  src/components/AdminCarouselContent.tsx
    ─────────────────────────────────────────────────────────────────────────────
    • Keeps all original behaviour (list, DnD-reorder by prefix, add/edit/delete)
    • Adds global loading overlay identical to the Products page
    • Button text → “Neues Slide hinzufügen”
    • Full file, nothing omitted (≈ 420 LOC)
*/

import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

/* ───────────────────────── full-page loader ────────────────────────── */
function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center
                    bg-white/70 backdrop-blur-sm">
      <Loader />
    </div>
  );
}

/* ──────────────────────────── types ───────────────────────────────── */
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

/* ───────────────────────── component ──────────────────────────────── */
export default function AdminCarouselContent() {
  const [slides, setSlides]             = useState<Slide[]>([]);
  const [selected, setSelected]         = useState<Slide|null>(null);
  const [form, setForm]                 = useState(defaultFormData);
  const [imagePreview, setImagePreview] = useState<string|null>(null);
  const [selectedFile, setSelectedFile] = useState<File|null>(null);
  const [formMode, setFormMode]         = useState<"add"|"edit">("add");
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [loading, setLoading]           = useState(false);       // ← added
  const modalRef                        = useRef<HTMLDivElement>(null);

  const API_URL = apiClient.defaults.baseURL?.replace(/\/$/,"") || "";
  const token   = localStorage.getItem("token") || "";
  const headers = { Authorization: `Bearer ${token}` };

  /* strip existing numeric prefix like “01- ” */
  const stripPrefix = (t:string|null) =>
    t ? t.replace(/^\d+\s*-\s*/,"") : "";

  /* ─── GET list ──────────────────────────────────────────────────── */
  const fetchSlides = async () => {
    setLoading(true);
    try {
      const resp = await apiClient.get("/Carousel",{ headers });
      setSlides(resp.data);
    } catch (err) {
      console.error("Error fetching carousel:",err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{ fetchSlides(); },[]);

  /* ─── open modal ────────────────────────────────────────────── */
  const openModal = (slide?:Slide) => {
    if (slide) {
      setSelected(slide);
      setForm({
        title:      stripPrefix(slide.title),
        subTitle:   slide.subTitle || "",
        description:slide.description || "",
      });
      setImagePreview(slide.imagePath);
      setFormMode("edit");
    } else {
      setSelected(null);
      setForm(defaultFormData);
      setImagePreview(null);
      setFormMode("add");
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };
  const closeModal = ()=>setIsModalOpen(false);

  /* ─── form change ──────────────────────────────────────────── */
  const onChange = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(f=>({ ...f, [e.target.name]: e.target.value }));

  /* ─── image pick ───────────────────────────────────────────── */
  const onImageUpload = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png","image/jpeg","image/jpg"].includes(file.type))
      return alert("Nur JPG/PNG erlaubt");
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  /* ─── save (add / edit) ────────────────────────────────────── */
  const onSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title",       form.title.trim() || "(Ohne Titel)");
    fd.append("subTitle",    form.subTitle);
    fd.append("description", form.description);
    if (selectedFile)                    fd.append("image", selectedFile);
    else if (formMode==="edit" && imagePreview===null)
                                        fd.append("clearImage","true");

    setLoading(true);
    try {
      if (formMode==="add") {
        await apiClient.post("/Carousel", fd, {
          headers:{ "Content-Type":"multipart/form-data", ...headers }
        });
      } else if (selected) {
        await apiClient.put(`/Carousel/${selected.id}`, fd, {
          headers:{ "Content-Type":"multipart/form-data", ...headers }
        });
      }
      await fetchSlides();
      closeModal();
    } catch (err) {
      console.error("Save failed:",err);
      alert("Speichern fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  /* ─── delete ───────────────────────────────────────────────── */
  const onDelete = async (id:string) => {
    if (!confirm("Löschen?")) return;
    setLoading(true);
    try {
      await apiClient.delete(`/Carousel/${id}`,{ headers });
      await fetchSlides();
    } catch (err) {
      console.error("Delete failed:",err);
      alert("Löschen fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  /* ─── drag & drop – persist by renaming prefixes ───────────── */
  const onDragEnd = async (result:DropResult) => {
    const { source,destination } = result;
    if (!destination || source.index===destination.index) return;

    const updated = Array.from(slides);
    const [moved] = updated.splice(source.index,1);
    updated.splice(destination.index,0,moved);
    setSlides(updated);

    setLoading(true);
    try {
      for (let i=0;i<updated.length;i++) {
        const s   = updated[i];
        const num = (i+1).toString().padStart(2,"0");
        const fd  = new FormData();
        fd.append("title",       `${num}-${stripPrefix(s.title)}`);
        fd.append("subTitle",    s.subTitle || "");
        fd.append("description", s.description || "");
        await apiClient.put(`/Carousel/${s.id}`, fd, { headers });
      }
      await fetchSlides();
    } catch (err) {
      console.error("Persist reorder failed:",err);
      alert("Reihenfolge konnte nicht gespeichert werden.");
      await fetchSlides();
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────── JSX ──────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Carousel</h2>
        <Button onClick={()=>openModal()}>Neues Slide hinzufügen</Button>
      </div>

      {/* List with drag-and-drop */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="carousel-list">
          {prov=>(
            <ul ref={prov.innerRef} {...prov.droppableProps} className="divide-y">
              {slides.map((s,idx)=>(
                <Draggable key={s.id} draggableId={s.id} index={idx}>
                  {p=>(
                    <li
                      ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}
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
                          onClick={()=>openModal(s)}
                        >
                          {stripPrefix(s.title) || "(Ohne Titel)"}
                        </span>
                      </div>
                      <Button variant="destructive" onClick={()=>onDelete(s.id)}>
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
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={e=>e.stopPropagation()}
            className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg
                       shadow-lg p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={closeModal}
            >×</button>

            <h3 className="text-2xl font-bold mb-4">
              {formMode==="edit"?"Slide bearbeiten":"Neuen Slide"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Bild */}
              <div>
                <label className="block text-sm font-medium mb-1">Bild (JPG/PNG)</label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={selectedFile
                           ? imagePreview
                           : `${API_URL}/images/Carousel/${imagePreview}`}
                      alt="Vorschau"
                      className="w-24 h-24 object-cover rounded-full border-2"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 bg-white p-1 text-red-500 rounded-full"
                    >×</button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={onImageUpload}
                  />
                )}
              </div>

              {/* Titel */}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  className="w-full border p-2"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle</label>
                <input
                  name="subTitle"
                  value={form.subTitle}
                  onChange={onChange}
                  className="w-full border p-2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
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
                  {formMode==="edit"?"Speichern":"Hinzufügen"}
                </Button>
                <Button variant="outline" onClick={closeModal}>
                  Abbrechen
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <FullPageLoader />}
    </div>
  );
}
