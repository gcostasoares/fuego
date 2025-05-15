/*  src/components/AdminPartnerLogoContent.tsx
    ─────────────────────────────────────────────────────────────────────────────
    • Same functionality (list, upload/replace, delete, drag-reorder by prefix)
    • Global loading overlay identical to Products page
    • “Neues Logo hinzufügen” button label
    • Entire file, no omissions (≈ 340 LOC)
*/

import React, { useEffect, useRef, useState } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

/* ───────────────────────── full-page loader ───────────────────────── */
function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center
                    bg-white/70 backdrop-blur-sm">
      <Loader />
    </div>
  );
}

/* ─────────────────────────── types & utils ────────────────────────── */
interface Logo {
  id: string;
  imagePath: string | null;
}

/** remove leading “01- ” prefix for extension handling */
const stripPrefix = (p: string | null) =>
  p ? p.replace(/^\d+\s*-\s*/, "") : "";

/* ───────────────────────── component ──────────────────────────────── */
export default function AdminPartnerLogoContent() {
  const [logos,      setLogos]      = useState<Logo[]>([]);
  const [selected,   setSelected]   = useState<Logo|null>(null);
  const [mode,       setMode]       = useState<"add"|"edit">("add");
  const [modalOpen,  setModalOpen]  = useState(false);
  const [preview,    setPreview]    = useState<string|null>(null);
  const [file,       setFile]       = useState<File|null>(null);
  const [loading,    setLoading]    = useState(false);          // ← loader
  const modalRef                    = useRef<HTMLDivElement>(null);

  const API_URL = apiClient.defaults.baseURL?.replace(/\/$/,"") || "";

  /* ─── GET list ─────────────────────────────────────────────────── */
  const fetchLogos = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get<Logo[]>("/PartnerLogos");
      const sorted   = [...data].sort((a,b)=>{
        const na = Number((a.imagePath??"").match(/^\d+/)?.[0]||999);
        const nb = Number((b.imagePath??"").match(/^\d+/)?.[0]||999);
        return na-nb;
      });
      setLogos(sorted);
    } catch (err) {
      console.error("Error fetching partner logos:",err);
    } finally { setLoading(false); }
  };
  useEffect(()=>{ fetchLogos(); },[]);

  /* ─── modal open/close ─────────────────────────────────────────── */
  const openModal = (logo?:Logo) => {
    if (logo) {
      setSelected(logo);
      setPreview(logo.imagePath);
      setMode("edit");
    } else {
      setSelected(null);
      setPreview(null);
      setMode("add");
    }
    setFile(null);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  /* ─── file pick ────────────────────────────────────────────────── */
  const onImageUpload = (e:React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (!["image/png","image/jpeg","image/jpg"].includes(f.type))
      return alert("Nur JPG/PNG erlaubt");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };
  const removeImage = () => { setFile(null); setPreview(null); };

  /* ─── add / replace ────────────────────────────────────────────── */
  const onSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (mode==="add" && !file) return alert("Bitte ein Bild wählen.");

    const fd = new FormData();
    if (file) fd.append("image",file);

    setLoading(true);
    try {
      if (mode==="add") {
        await apiClient.post("/PartnerLogos", fd, {
          headers:{ "Content-Type":"multipart/form-data" }
        });
      } else if (selected) {
        await apiClient.put(`/PartnerLogos/${selected.id}`, fd, {
          headers:{ "Content-Type":"multipart/form-data" }
        });
      }
      await fetchLogos();
      closeModal();
    } catch (err) {
      console.error("Save failed:",err);
      alert("Speichern fehlgeschlagen");
    } finally { setLoading(false); }
  };

  /* ─── delete ───────────────────────────────────────────────────── */
  const onDelete = async (id:string) => {
    if (!confirm("Löschen?")) return;
    setLoading(true);
    try {
      await apiClient.delete(`/PartnerLogos/${id}`);
      await fetchLogos();
    } catch (err) {
      console.error("Delete failed:",err);
      alert("Löschen fehlgeschlagen");
    } finally { setLoading(false); }
  };

  /* ─── drag & drop reorder ──────────────────────────────────────── */
  const onDragEnd = async (result:DropResult) => {
    const { source,destination } = result;
    if (!destination || source.index===destination.index) return;

    const reordered = Array.from(logos);
    const [m] = reordered.splice(source.index,1);
    reordered.splice(destination.index,0,m);
    setLogos(reordered);

    setLoading(true);
    try {
      for (let i=0;i<reordered.length;i++) {
        const l   = reordered[i];
        const ext = stripPrefix(l.imagePath);
        const newName = `${(i+1).toString().padStart(2,"0")}-${ext}`;
        if (l.imagePath !== newName) {
          await apiClient.put(
            `/PartnerLogos/${l.id}`,
            { imagePath:newName },
            { headers:{ "Content-Type":"application/json" } }
          );
        }
      }
      await fetchLogos();
    } catch (err) {
      console.error("Persist reorder failed:",err);
      alert("Reihenfolge konnte nicht gespeichert werden.");
    } finally { setLoading(false); }
  };

  /* ─────────────────────────── JSX ─────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Partner-Logos</h2>
        <Button onClick={()=>openModal()}>Neues Logo hinzufügen</Button>
      </div>

      {/* List with DnD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="logo-list">
          {prov=>(
            <ul ref={prov.innerRef} {...prov.droppableProps} className="divide-y">
              {logos.map((l,idx)=>{
                const pos = l.imagePath?.split("-")[0] ?? "–";
                return (
                  <Draggable key={l.id} draggableId={l.id} index={idx}>
                    {p=>(
                      <li
                        ref={p.innerRef}
                        {...p.draggableProps} {...p.dragHandleProps}
                        className="flex justify-between items-center p-2 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          {l.imagePath && (
                            <img
                              src={`${API_URL}/images/PartnerLogos/${l.imagePath}`}
                              className="w-10 h-10 object-contain border-2 rounded-full"
                              loading="lazy"
                            />
                          )}
                          <span
                            className="cursor-pointer text-blue-600 hover:underline"
                            onClick={()=>openModal(l)}
                          >
                            {pos}
                          </span>
                        </div>
                        <Button variant="destructive" onClick={()=>onDelete(l.id)}>
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

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={e=>e.stopPropagation()}
            className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto
                       rounded-lg shadow-lg p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={closeModal}
            >×</button>

            <h3 className="text-2xl font-bold mb-4">
              {mode==="edit"?"Logo ersetzen":"Neues Logo"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Bild */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bild (JPG/PNG)
                </label>
                {preview ? (
                  <div className="relative inline-block">
                    <img
                      src={file ? preview
                                 : `${API_URL}/images/PartnerLogos/${preview}`}
                      alt="Vorschau"
                      className="w-24 h-24 object-contain border-2 rounded-full"
                    />
                    <button
                      type="button" onClick={removeImage}
                      className="absolute top-0 right-0 bg-white p-1 text-red-500
                                 rounded-full"
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

              <div className="flex justify-end space-x-4 mt-4">
                <Button type="submit">
                  {mode==="edit"?"Speichern":"Hinzufügen"}
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
