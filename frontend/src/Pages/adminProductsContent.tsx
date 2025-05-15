// src/admin/AdminProductsContent.tsx
import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import FullPageLoader from "@/components/FullPageLoader";

/* ────────────────────────── types ────────────────────────── */
type Lookup = { id: string; title: string; name: string };
type JT = { productId: string; effectId?: string; terpeneId?: string; tasteId?: string };

type Product = {
  id: string;
  name: string;
  price: number;
  thc: number;
  cbd: number;
  genetics: string;
  imageUrl: string[];
  isAvailable: string;
  manufacturerId: string | null;
  originId: string | null;
  rayId: string | null;
};

type Form = {
  name: string;
  price: number;
  thc: number;
  cbd: number;
  genetics: string;
  isAvailable: boolean;
  manufacturerId: string;
  originId: string;
  rayId: string;
};

type GalleryItem = {
  id: string;
  src: string;
  file?: File;
  existingFilename?: string;
};

/* ───────────────────────── component ───────────────────────── */
export default function AdminProductsContent() {
  /* ---------- state ---------- */
  const [loading,        setLoading]        = useState(false);
  const [products,       setProducts]       = useState<Product[]>([]);
  const [manufacturers,  setManufacturers]  = useState<Lookup[]>([]);
  const [origins,        setOrigins]        = useState<Lookup[]>([]);
  const [rays,           setRays]           = useState<Lookup[]>([]);
  const [strains,        setStrains]        = useState<Lookup[]>([]);
  const [effects,        setEffects]        = useState<Lookup[]>([]);
  const [terpenes,       setTerpenes]       = useState<Lookup[]>([]);
  const [tastes,         setTastes]         = useState<Lookup[]>([]);
  const [prodEff,        setProdEff]        = useState<JT[]>([]);
  const [prodTerp,       setProdTerp]       = useState<JT[]>([]);
  const [prodTaste,      setProdTaste]      = useState<JT[]>([]);
  const [open,           setOpen]           = useState(false);
  const [mode,           setMode]           = useState<"add" | "edit">("add");
  const [selected,       setSelected]       = useState<Product | null>(null);
  const [form,           setForm]           = useState<Form>({
    name: "",
    price: 0,
    thc: 0,
    cbd: 0,
    genetics: "",
    isAvailable: false,
    manufacturerId: "",
    originId: "",
    rayId: "",
  });
  const [existingProfile, setExistingProfile] = useState<string | null>(null);
  const [removeProfile,   setRemoveProfile]   = useState(false);
  const [profileFile,     setProfileFile]     = useState<File | null>(null);
  const [profilePreview,  setProfilePreview]  = useState<string | null>(null);
  const [galleryItems,    setGalleryItems]    = useState<GalleryItem[]>([]);
  const [removeGallery,   setRemoveGallery]   = useState<string[]>([]);
  const [selEff,          setSelEff]          = useState<string[]>([]);
  const [selTerp,         setSelTerp]         = useState<string[]>([]);
  const [selTaste,        setSelTaste]        = useState<string[]>([]);

  /* ---------- refs & constants ---------- */
  const modalRef = useRef<HTMLDivElement>(null);
  const API_URL  = "https://fuego-ombm.onrender.com";
  const headers  = { "x-admin-key": localStorage.getItem("adminKey") || "" };

  /* ---------- lifecycle ---------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchProductFilters(), fetchJunctions()]);
      setLoading(false);
    })();
  }, []);

  /* ---------- helpers ---------- */
  const normalise = (arr: any[]): Lookup[] =>
    arr.map((o: any) => ({ id: o.id, title: o.title ?? o.name, name: o.name ?? o.title }));

  /* ---------- data fetchers ---------- */
  async function fetchProducts() {
    try {
      const { data } = await apiClient.get("/Products", { headers });
      const list: Product[] = (data as any[]).map(p => {
        let imgs: string[] = [];
        try {
          if (p.imageUrl) {
            imgs = JSON.parse(String(p.imageUrl).replace(/\\/g, ""));
            if (!Array.isArray(imgs)) imgs = [];
          }
        } catch { /* ignore */ }
        return { ...p, price: Number(p.price) || 0, imageUrl: imgs };
      });
      setProducts(list);
    } catch (err) {
      console.error("fetchProducts error:", err);
      setProducts([]);
    }
  }

  async function fetchProductFilters() {
    try {
      const { data } = await apiClient.get("/api/product-filters", { headers });
      setManufacturers(normalise(data.manufacturers));
      setOrigins(normalise(data.origins));
      setRays(normalise(data.rays));
      setStrains(normalise(data.strains));
      setEffects(normalise(data.effects));
      setTerpenes(normalise(data.terpenes));
      setTastes(normalise(data.tastes));
    } catch (err) {
      console.error("fetchProductFilters error:", err);
    }
  }

  async function fetchJunctions() {
    try {
      const [pe, pt, pu] = await Promise.all([
        apiClient.get("/producteffects",  { headers }),
        apiClient.get("/productterpenes", { headers }),
        apiClient.get("/producttastes",   { headers }),
      ]);
      setProdEff(pe.data);
      setProdTerp(pt.data);
      setProdTaste(pu.data);
    } catch (err) {
      console.error("fetchJunctions error:", err);
    }
  }

  /* ---------- modal handlers ---------- */
  function openModal(prod?: Product) {
    if (prod) {
      setMode("edit");
      setSelected(prod);
      setForm({
        name: prod.name,
        price: prod.price,
        thc: prod.thc,
        cbd: prod.cbd,
        genetics: prod.genetics,
        isAvailable: prod.isAvailable === "Available",
        manufacturerId: prod.manufacturerId || "",
        originId: prod.originId || "",
        rayId: prod.rayId || "",
      });

      const [profile, ...gallery] = prod.imageUrl;
      setExistingProfile(profile || null);
      setRemoveProfile(false);
      setProfileFile(null);
      setProfilePreview(profile ? `${API_URL}/images/Products/${profile}` : null);

      setGalleryItems(
        gallery.map(fn => ({
          id: fn,
          src: `${API_URL}/images/Products/${fn}`,
          existingFilename: fn,
        }))
      );
      setRemoveGallery([]);

      setSelEff  (prodEff .filter(r => r.productId === prod.id).map(r => r.effectId!));
      setSelTerp (prodTerp.filter(r => r.productId === prod.id).map(r => r.terpeneId!));
      setSelTaste(prodTaste.filter(r => r.productId === prod.id).map(r => r.tasteId!));
    } else {
      setMode("add");
      setSelected(null);
      setForm({
        name: "",
        price: 0,
        thc: 0,
        cbd: 0,
        genetics: "",
        isAvailable: false,
        manufacturerId: "",
        originId: "",
        rayId: "",
      });
      setExistingProfile(null);
      setRemoveProfile(false);
      setProfileFile(null);
      setProfilePreview(null);
      setGalleryItems([]);
      setRemoveGallery([]);
      setSelEff([]);
      setSelTerp([]);
      setSelTaste([]);
    }
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  /* ---------- form helpers ---------- */
  function onChangeForm(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type, checked } = e.target as any;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function onProfileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setProfileFile(file);
    setProfilePreview(file ? URL.createObjectURL(file) : null);
    if (existingProfile) setRemoveProfile(true);
  }

  function removeProfileImage() {
    setProfileFile(null);
    setProfilePreview(null);
    if (existingProfile) setRemoveProfile(true);
    setExistingProfile(null);
  }

  function handleGallery(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const arr = Array.from(e.target.files);
    setGalleryItems(prev => [
      ...prev,
      ...arr.map(file => ({
        id: URL.createObjectURL(file),
        src: URL.createObjectURL(file),
        file,
      })),
    ]);
    e.target.value = "";
  }

  function removeGalleryItem(i: number) {
    setGalleryItems(prev => {
      const item = prev[i];
      if (item.existingFilename) setRemoveGallery(r => [...r, item.existingFilename!]);
      const c = [...prev];
      c.splice(i, 1);
      return c;
    });
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) return;
    const a = Array.from(galleryItems);
    const [m] = a.splice(result.source.index, 1);
    a.splice(result.destination.index, 0, m);
    setGalleryItems(a);
  }

  function onMultiAdd(
    e: React.ChangeEvent<HTMLSelectElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    existing: string[]
  ) {
    const v = e.target.value;
    if (!v || existing.includes(v)) return;
    setter([...existing, v]);
    e.target.value = "";
  }

  function removeTag(id: string, setter: React.Dispatch<React.SetStateAction<string[]>>) {
    setter(prev => prev.filter(x => x !== id));
  }

  /* ---------- submit / delete ---------- */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", String(form.price));
    fd.append("thc",   String(form.thc));
    fd.append("cbd",   String(form.cbd));
    fd.append("genetics", form.genetics);
    fd.append("isAvailable", form.isAvailable ? "1" : "0");
    fd.append("manufacturerId", form.manufacturerId);
    fd.append("originId",       form.originId);
    fd.append("rayId",          form.rayId);
    fd.append("rating", "0");

    if (removeProfile && existingProfile) fd.append("removeImages", existingProfile);
    removeGallery.forEach(fn => fd.append("removeImages", fn));

    if (profileFile) fd.append("images", profileFile);
    galleryItems.forEach(item => item.file && fd.append("images", item.file));

    const order: string[] = [];
    if (profileFile)        order.push("__NEW__");
    else if (existingProfile) order.push(existingProfile);
    galleryItems.forEach(item => {
      if (item.file)            order.push("__NEW__");
      else if (item.existingFilename) order.push(item.existingFilename);
    });
    fd.append("imageOrder", JSON.stringify(order));

    selEff.forEach(id   => fd.append("effectFilter",   id));
    selTerp.forEach(id  => fd.append("terpeneFilter",  id));
    selTaste.forEach(id => fd.append("tasteFilter",    id));

    const cfg = { headers: { ...headers, "Content-Type": "multipart/form-data" } };

    try {
      if (mode === "add")        await apiClient.post("/Products",       fd, cfg);
      else if (selected)         await apiClient.put(`/Products/${selected.id}`, fd, cfg);
      await fetchProducts();
      await fetchJunctions();
      closeModal();
    } catch (err) {
      console.error("save error:", err);
      alert("Speichern fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Löschen?")) return;
    setLoading(true);
    try {
      await apiClient.delete(`/Products/${id}`, { headers });
      await fetchProducts();
    } catch (err) {
      console.error("deleteProduct error:", err);
      alert("Löschen fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  }

  /* ────────────────────────── render ────────────────────────── */
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produkte</h2>
        <Button onClick={() => openModal()}>Neues Produkt hinzufügen</Button>
      </div>

      <ul className="divide-y">
        {products.map(p => (
          <li
            key={p.id}
            className="flex justify-between items-center p-2 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {p.imageUrl[0] && (
                <img
                  src={`${API_URL}/images/Products/${p.imageUrl[0]}`}
                  alt={p.name}
                  className="w-10 h-10 rounded-full object-cover border-2"
                />
              )}
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => openModal(p)}
              >
                {p.name}
              </span>
            </div>
            <Button variant="destructive" onClick={() => onDelete(p.id)}>
              Löschen
            </Button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={e => e.stopPropagation()}
            className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg shadow-lg p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {mode === "edit" ? "Produkt bearbeiten" : "Neues Produkt"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-6">
              {/* Profilbild */}
              <div>
                <label className="block font-medium mb-1">Profilbild</label>
                {profilePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={profilePreview}
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={onProfileChange}
                  />
                )}
              </div>

              {/* Weitere Bilder */}
              <div>
                <label className="block font-medium mb-1">Weitere Bilder</label>
                <input
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg"
                  onChange={handleGallery}
                />
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="gallery" direction="horizontal">
                    {provided => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-wrap gap-2 mt-2"
                      >
                        {galleryItems.map((item, i) => (
                          <Draggable key={item.id} draggableId={item.id} index={i}>
                            {prov => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className="relative"
                              >
                                <img
                                  src={item.src}
                                  className="w-20 h-20 rounded object-cover border"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeGalleryItem(i)}
                                  className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              {/* Produktdetails & Tags */}
              <fieldset className="border p-4 rounded">
                <legend className="font-semibold px-2">Produktdetails</legend>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {/* Name */}
                  <div>
                    <label className="block text-sm">Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={onChangeForm}
                      required
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  {/* Preis */}
                  <div>
                    <label className="block text-sm">Preis (€)</label>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={onChangeForm}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  {/* THC */}
                  <div>
                    <label className="block text-sm">THC (%)</label>
                    <input
                      name="thc"
                      type="number"
                      step="0.01"
                      value={form.thc}
                      onChange={onChangeForm}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  {/* CBD */}
                  <div>
                    <label className="block text-sm">CBD (%)</label>
                    <input
                      name="cbd"
                      type="number"
                      step="0.01"
                      value={form.cbd}
                      onChange={onChangeForm}
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  {/* Genetik */}
                  <div>
                    <label className="block text-sm">Genetik</label>
                    <select
                      name="genetics"
                      value={form.genetics}
                      onChange={onChangeForm}
                      className="w-full border p-2 rounded"
                    >
                      <option>Indica</option>
                      <option>Hybrid</option>
                      <option>Sativa</option>
                    </select>
                  </div>
                  {/* Verfügbar */}
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={form.isAvailable}
                      onChange={onChangeForm}
                      className="mr-2"
                    />
                    <label>Verfügbar</label>
                  </div>
                  {/* Hersteller */}
                  <div>
                    <label className="block text-sm">Hersteller</label>
                    <select
                      name="manufacturerId"
                      value={form.manufacturerId}
                      onChange={onChangeForm}
                      required
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Auswählen</option>
                      {manufacturers.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Herkunft */}
                  <div>
                    <label className="block text-sm">Herkunft</label>
                    <select
                      name="originId"
                      value={form.originId}
                      onChange={onChangeForm}
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Auswählen</option>
                      {origins.map(o => (
                        <option key={o.id} value={o.id}>
                          {o.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Ray */}
                  <div>
                    <label className="block text-sm">Ray</label>
                    <select
                      name="rayId"
                      value={form.rayId}
                      onChange={onChangeForm}
                      required
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Auswählen</option>
                      {rays.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Effekte */}
                <div className="mt-4">
                  <label className="block font-medium mb-1">Effekte</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selEff.map(id => {
                      const e = effects.find(x => x.id === id);
                      return (
                        <button
                          key={id}
                          type="button"
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          {e?.title}
                          <span
                            onClick={() => removeTag(id, setSelEff)}
                            className="ml-1 cursor-pointer"
                          >
                            ×
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <select
                    value=""
                    onChange={e => onMultiAdd(e, setSelEff, selEff)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Effekt hinzufügen…</option>
                    {effects
                      .filter(x => !selEff.includes(x.id))
                      .map(x => (
                        <option key={x.id} value={x.id}>
                          {x.title}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Terpene */}
                <div className="mt-4">
                  <label className="block font-medium mb-1">Terpene</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selTerp.map(id => {
                      const t = terpenes.find(x => x.id === id);
                      return (
                        <button
                          key={id}
                          type="button"
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          {t?.title}
                          <span
                            onClick={() => removeTag(id, setSelTerp)}
                            className="ml-1 cursor-pointer"
                          >
                            ×
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <select
                    value=""
                    onChange={e => onMultiAdd(e, setSelTerp, selTerp)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Terpen hinzufügen…</option>
                    {terpenes
                      .filter(x => !selTerp.includes(x.id))
                      .map(x => (
                        <option key={x.id} value={x.id}>
                          {x.title}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Geschmäcker */}
                <div className="mt-4">
                  <label className="block font-medium mb-1">Geschmäcker</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selTaste.map(id => {
                      const t = tastes.find(x => x.id === id);
                      return (
                        <button
                          key={id}
                          type="button"
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                          {t?.title}
                          <span
                            onClick={() => removeTag(id, setSelTaste)}
                            className="ml-1 cursor-pointer"
                          >
                            ×
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <select
                    value=""
                    onChange={e => onMultiAdd(e, setSelTaste, selTaste)}
                    className="w-full border p-2 rounded"
                  >
                    <option value="">Geschmack hinzufügen…</option>
                    {tastes
                      .filter(x => !selTaste.includes(x.id))
                      .map(x => (
                        <option key={x.id} value={x.id}>
                          {x.title}
                        </option>
                      ))}
                  </select>
                </div>
              </fieldset>

              {/* ACTIONS */}
              <div className="flex justify-end space-x-4">
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

      {loading && <FullPageLoader />}
    </div>
  );
}
