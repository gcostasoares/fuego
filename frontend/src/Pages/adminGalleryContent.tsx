/*  src/components/AdminGalleryContent.tsx
    ─────────────────────────────────────────────────────────────────────────
    Supports the new DB columns in tblGallery:
      IsButton (bit)  · ButtonLabel (nvarchar) · ButtonLink (nvarchar)
*/

import React, { useEffect, useState, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

/* ───────── loader overlay ───────── */
function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center
                    bg-white/70 backdrop-blur-sm">
      <Loader />
    </div>
  );
}

/* ───────── types ───────── */
interface Gallery {
  id: string;
  title: string;
  subTitle: string;
  isGrid: boolean;
  isSlide: boolean;
  isButton: boolean;
  buttonLabel: string;
  buttonLink: string;
}

interface Product {
  id: string;
  name: string;
  saleName: string;
  imageUrl: string[];
}

/* ───────── constants ───────── */
const defaultForm = { title: "", subTitle: "" };
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

export default function AdminGalleryContent() {
  const [galleries, setGalleries]         = useState<Gallery[]>([]);
  const [products,  setProducts]          = useState<Product[]>([]);
  const [selected,  setSelected]          = useState<Gallery | null>(null);

  const [form, setForm]                   = useState(defaultForm);
  const [isGrid, setIsGrid]               = useState(false);
  const [isSlide, setIsSlide]             = useState(false);
  const [gridIds, setGridIds]             = useState<string[]>([]);
  const [slideIds,setSlideIds]            = useState<string[]>([]);

  const [isButton, setIsButton]           = useState(false);
  const [buttonLabel, setButtonLabel]     = useState("");
  const [buttonLink,  setButtonLink]      = useState("");

  const [mode, setMode]                   = useState<"add"|"edit">("add");
  const [open, setOpen]                   = useState(false);
  const [loading, setLoading]             = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const adminKey = localStorage.getItem("adminKey") || "";
  const headers  = { "x-admin-key": adminKey };

  /* ─── fetch helpers ─────────────────────────────────────────── */
  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get<Gallery[]>("/Gallery", { headers });
      setGalleries(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const { data } = await apiClient.get<{ products: Product[] }>(
      "/products?pageSize=1000",
      { headers }
    );
    setProducts(data.products);
  };

  useEffect(() => {
    fetchGalleries();
    fetchProducts();
  }, []);

  /* ─── modal open helpers ────────────────────────────────────── */
  const openModal = async (g?: Gallery) => {
    await fetchProducts();

    if (g) {
      /* edit */
      setSelected(g);
      setForm({ title: g.title, subTitle: g.subTitle });
      setIsGrid(g.isGrid);   setIsSlide(g.isSlide);
      setIsButton(g.isButton);
      setButtonLabel(g.buttonLabel ?? "");
      setButtonLink(g.buttonLink ?? "");
      setMode("edit");

      /* load prod IDs */
      const [gridRes, slideRes] = await Promise.all([
        apiClient.get<string[]>(`/Gallery/${g.id}/grid/products`,  { headers }),
        apiClient.get<string[]>(`/Gallery/${g.id}/slide/products`, { headers }),
      ]);
      setGridIds(gridRes.data);
      setSlideIds(slideRes.data);
    } else {
      /* add */
      setSelected(null);
      setForm(defaultForm);
      setIsGrid(false);      setIsSlide(false);
      setIsButton(false);    setButtonLabel(""); setButtonLink("");
      setGridIds([]);        setSlideIds([]);
      setMode("add");
    }
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  /* ─── generic field change ─────────────────────────────────── */
  const onChange = (e:React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  /* ─── submit handler ───────────────────────────────────────── */
  const onSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload:any = {
      title:        form.title.trim() || "(Ohne Titel)",
      subTitle:     form.subTitle,
      isGrid,       isSlide,
      isButton,
      buttonLabel:  isButton ? buttonLabel.trim() : "",
      buttonLink:   isButton ? buttonLink.trim()  : "",
    };

    let galleryId = selected?.id;
    try {
      if (mode === "add") {
        const { data } = await apiClient.post<{ id:string }>("/Gallery", payload, { headers });
        galleryId = data.id;
      } else {
        await apiClient.put(`/Gallery/${galleryId}`, payload, { headers });
      }

      /* update product orders */
      if (galleryId) {
        if (isGrid) {
          await apiClient.put(
            `/Gallery/${galleryId}/grid/products/order`,
            { order: gridIds },
            { headers }
          );
        }
        if (isSlide) {
          await apiClient.put(
            `/Gallery/${galleryId}/slide/products/order`,
            { order: slideIds },
            { headers }
          );
        }
      }

      await fetchGalleries();
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Speichern fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  /* ─── delete gallery ───────────────────────────────────────── */
  const onDeleteGallery = async (id:string) => {
    if (!confirm("Löschen?")) return;
    setLoading(true);
    try {
      await apiClient.delete(`/Gallery/${id}`, { headers });
      setGalleries(gs => gs.filter(g => g.id !== id));
    } finally {
      setLoading(false);
    }
  };

  /* ─── add / remove / reorder product IDs ───────────────────── */
  const handleAdd = (type:"grid"|"slide", pid:string) => {
    if (!pid) return;
    type==="grid"
      ? setGridIds(ids => [...ids, pid])
      : setSlideIds(ids => [...ids, pid]);
  };
  const handleRemove = (type:"grid"|"slide", pid:string) => {
    type==="grid"
      ? setGridIds(ids => ids.filter(x => x !== pid))
      : setSlideIds(ids => ids.filter(x => x !== pid));
  };
  const onDragEnd = (res:DropResult) => {
    const { source, destination, type } = res;
    if (!destination || source.index === destination.index) return;
    const swap = <T,>(arr:T[]) => {
      const copy = [...arr];
      const [m] = copy.splice(source.index,1);
      copy.splice(destination.index,0,m);
      return copy;
    };
    if (type==="gallery")   setGalleries(swap);
    if (type==="grid")      setGridIds(swap);
    if (type==="slide")     setSlideIds(swap);
  };

  /* ─────────────────────────── JSX ──────────────────────────── */
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Galleries</h2>
        <Button onClick={()=>openModal()}>Neue Galerie hinzufügen</Button>
      </div>

      {/* list with drag reorder */}
      <Droppable droppableId="gallery-list" type="gallery">
        {prov=>(
          <ul ref={prov.innerRef} {...prov.droppableProps} className="divide-y">
            {galleries.map((g,i)=>(
              <Draggable key={g.id} draggableId={g.id} index={i}>
                {p=>(
                  <li ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}
                      className="flex justify-between items-center p-2 hover:bg-gray-50">
                    <span className="cursor-pointer text-blue-600 hover:underline"
                          onClick={()=>openModal(g)}>{g.title}</span>
                    <Button variant="destructive" size="sm"
                            onClick={()=>onDeleteGallery(g.id)}>Löschen</Button>
                  </li>
                )}
              </Draggable>
            ))}
            {prov.placeholder}
          </ul>
        )}
      </Droppable>

      {/* ─── modal ─────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={e=>e.target===e.currentTarget && closeModal()}
        >
          <div ref={modalRef}
               className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 text-2xl"
                    onClick={closeModal}>×</button>

            <h3 className="text-2xl font-bold mb-4">
              {mode==="edit" ? "Galerie bearbeiten" : "Neue Galerie"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* title / subtitle */}
              <div>
                <label className="block text-sm font-medium mb-1">Titel</label>
                <input name="title" value={form.title} onChange={onChange}
                       className="w-full border p-2" required/>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitel</label>
                <input name="subTitle" value={form.subTitle} onChange={onChange}
                       className="w-full border p-2"/>
              </div>

              {/* flags */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isGrid}
                         onChange={e=>setIsGrid(e.target.checked)}/> Grid aktiv
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isSlide}
                         onChange={e=>setIsSlide(e.target.checked)}/> Slide aktiv
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={isButton}
                         onChange={e=>setIsButton(e.target.checked)}/> Button aktiv
                </label>
              </div>

              {/* button label/link */}
              {isButton && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Button-Text</label>
                    <input value={buttonLabel} onChange={e=>setButtonLabel(e.target.value)}
                           className="w-full border p-2" required/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Button-Link (URL)</label>
                    <input value={buttonLink} onChange={e=>setButtonLink(e.target.value)}
                           className="w-full border p-2" placeholder="https://…"/>
                  </div>
                </>
              )}

              {/* GRID picker */}
              {isGrid && (
                <>
                  <h4 className="text-lg font-semibold mt-4">Grid Produkte</h4>
                  <select onChange={e=>handleAdd("grid",e.target.value)} value=""
                          className="border w-full p-2 mb-2">
                    <option value="">— Produkt hinzufügen —</option>
                    {products.filter(p=>!gridIds.includes(p.id)).map(p=>(
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.saleName})
                      </option>
                    ))}
                  </select>
                  <Droppable droppableId="grid-list" type="grid">
                    {prov=>(
                      <ul ref={prov.innerRef} {...prov.droppableProps}
                          className="divide-y rounded border max-h-48 overflow-auto">
                        {gridIds.length
                          ? gridIds.map((pid,i)=>{
                              const pr = products.find(x=>x.id===pid);
                              const img= pr?.imageUrl?.[0];
                              return (
                                <Draggable key={`grid-${pid}`} draggableId={`grid-${pid}`} index={i}>
                                  {p=>(
                                    <li ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}
                                        className="flex items-center justify-between p-2">
                                      <div className="flex items-center gap-2">
                                        {img && (
                                          <img src={`${API_URL}/images/Products/${img}`}
                                               className="w-8 h-8 object-cover rounded"/>
                                        )}
                                        <span>{pr?.name}</span>
                                      </div>
                                      <Button variant="destructive" size="sm" type="button"
                                              onClick={()=>handleRemove("grid",pid)}>Entfernen</Button>
                                    </li>
                                  )}
                                </Draggable>
                              );
                            })
                          : <li className="p-2 text-center text-gray-500">Keine Produkte</li>}
                        {prov.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </>
              )}

              {/* SLIDE picker */}
              {isSlide && (
                <>
                  <h4 className="text-lg font-semibold mt-4">Slide Produkte</h4>
                  <select onChange={e=>handleAdd("slide",e.target.value)} value=""
                          className="border w-full p-2 mb-2">
                    <option value="">— Produkt hinzufügen —</option>
                    {products.filter(p=>!slideIds.includes(p.id)).map(p=>(
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.saleName})
                      </option>
                    ))}
                  </select>
                  <Droppable droppableId="slide-list" type="slide">
                    {prov=>(
                      <ul ref={prov.innerRef} {...prov.droppableProps}
                          className="divide-y rounded border max-h-48 overflow-auto">
                        {slideIds.length
                          ? slideIds.map((pid,i)=>{
                              const pr = products.find(x=>x.id===pid);
                              const img= pr?.imageUrl?.[0];
                              return (
                                <Draggable key={`slide-${pid}`} draggableId={`slide-${pid}`} index={i}>
                                  {p=>(
                                    <li ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}
                                        className="flex items-center justify-between p-2">
                                      <div className="flex items-center gap-2">
                                        {img && (
                                          <img src={`${API_URL}/images/Products/${img}`}
                                               className="w-8 h-8 object-cover rounded"/>
                                        )}
                                        <span>{pr?.name}</span>
                                      </div>
                                      <Button variant="destructive" size="sm" type="button"
                                              onClick={()=>handleRemove("slide",pid)}>Entfernen</Button>
                                    </li>
                                  )}
                                </Draggable>
                              );
                            })
                          : <li className="p-2 text-center text-gray-500">Keine Produkte</li>}
                        {prov.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </>
              )}

              {/* actions */}
              <div className="flex justify-end gap-4 mt-6">
                <Button type="submit">{mode==="edit" ? "Speichern" : "Galerie anlegen"}</Button>
                <Button variant="outline" onClick={closeModal}>Abbrechen</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <FullPageLoader />}
    </DragDropContext>
  );
}
