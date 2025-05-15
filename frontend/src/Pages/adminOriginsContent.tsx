/* --------------------------------------------------------------------------- */
/*  src/components/AdminOriginsContent.tsx                                     */
/*  Admin UI for managing “Herkunfts­länder” (Origins)                         */
/* --------------------------------------------------------------------------- */
import React, {
  useEffect,
  useState,
  useRef,
  ChangeEvent,
  FormEvent,
} from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

/* ------------------------------------------------------------------ */
/*  Types & helpers                                                   */
/* ------------------------------------------------------------------ */
interface Origin {
  id: string;
  name: string;
  imagePath: string | null;
}

const DEFAULT_FORM = { name: "" };
const API_URL      = import.meta.env.VITE_API_URL ?? "";
const HEADERS      = { "x-admin-key": localStorage.getItem("adminKey") || "" };

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function AdminOriginsContent() {
  /* ─────────────── state ─────────────── */
  const [origins,      setOrigins]      = useState<Origin[]>([]);
  const [loading,      setLoading]      = useState(true);         // list loader
  const [saving,       setSaving]       = useState(false);        // submit loader
  const [selected,     setSelected]     = useState<Origin|null>(null);
  const [form,         setForm]         = useState<{name:string}>(DEFAULT_FORM);
  const [imagePreview, setImagePreview] = useState<string|null>(null);
  const [file,         setFile]         = useState<File|null>(null);
  const [removeImg,    setRemoveImg]    = useState(false);
  const [mode,         setMode]         = useState<"add"|"edit">("add");
  const [modalOpen,    setModalOpen]    = useState(false);
  const modalRef                       = useRef<HTMLDivElement>(null);

  /* ─────────────── fetch list ─────────────── */
  const fetchOrigins = async () => {
    setLoading(true);
    try {
      // server routes (admin) are singular → "/Origins"
      const { data } = await apiClient.get<Origin[]>("/Origins", { headers: HEADERS });
      setOrigins(data);
    } catch (err) {
      console.error("Error fetching origins:", err);
      alert("Fehler beim Laden der Herkunftsländer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrigins(); }, []);

  /* ─────────────── modal helpers ─────────────── */
  const openModal = (o?:Origin) => {
    if (o) {
      setSelected(o);
      setForm({ name: o.name });
      setImagePreview(o.imagePath);
      setMode("edit");
    } else {
      setSelected(null);
      setForm(DEFAULT_FORM);
      setImagePreview(null);
      setMode("add");
    }
    setFile(null);
    setRemoveImg(false);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  /* ─────────────── form handlers ─────────────── */
  const onChange = (e:ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onFile = (e:ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!["image/png","image/jpeg","image/jpg"].includes(f.type)) {
      return alert("Nur JPG/PNG erlaubt");
    }
    setFile(f);
    setImagePreview(URL.createObjectURL(f));
    setRemoveImg(false);
  };

  const removeImage = () => {
    setFile(null);
    setImagePreview(null);
    setRemoveImg(true);               // tell server to clear existing img
  };

  /* ─────────────── submit add / edit ─────────────── */
  const onSubmit = async (e:FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    fd.append("name", form.name.trim() || "(Ohne Name)");
    if (file)        fd.append("file", file);
    else if (removeImg) fd.append("clearImage","true");

    const cfg = { headers: { "Content-Type":"multipart/form-data", ...HEADERS } };

    try {
      if (mode === "add") {
        await apiClient.post("/Origins", fd, cfg);
      } else if (selected) {
        await apiClient.put(`/Origins/${selected.id}`, fd, cfg);
      }
      await fetchOrigins();
      closeModal();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  };

  /* ─────────────── delete ─────────────── */
  const onDelete = async (id:string) => {
    if (!confirm("Löschen?")) return;
    setSaving(true);
    try {
      await apiClient.delete(`/Origins/${id}`, { headers: HEADERS });
      await fetchOrigins();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Löschen fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  render                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div className="relative">
      {/* global loader while list loads */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20">
          <Loader />
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Herkunftsland</h2>
        <Button onClick={()=>openModal()}>Neues Herkunftsland&nbsp;hinzufügen</Button>
      </div>

      <ul className="divide-y">
        {origins.map(o=>(
          <li
            key={o.id}
            className="flex justify-between items-center p-2 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {o.imagePath && (
                <img
                  src={`${API_URL}/images/Origin/${o.imagePath}`}
                  alt={o.name}
                  className="w-10 h-10 rounded-full object-cover border-2"
                  loading="lazy"
                />
              )}
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={()=>openModal(o)}
              >
                {o.name}
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={()=>onDelete(o.id)}
            >
              Löschen
            </Button>
          </li>
        ))}
      </ul>

      {/* ─────────────── modal ─────────────── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={e=>e.stopPropagation()}
            className="bg-white w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative"
          >
            {/* loader while saving */}
            {saving && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-20 rounded-lg">
                <Loader />
              </div>
            )}

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Schließen"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {mode==="edit" ? "Herkunftsland bearbeiten" : "Neues Herkunftsland"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Bild */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bild (JPG/PNG)
                </label>

                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={file ? imagePreview : `${API_URL}/images/Origin/${imagePreview}`}
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
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {/* Aktionen */}
              <div className="flex justify-end space-x-4 mt-4">
                <Button type="submit">
                  {mode==="edit" ? "Speichern" : "Hinzufügen"}
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
