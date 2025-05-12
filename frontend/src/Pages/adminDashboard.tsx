// src/components/AdminGalleryContent.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";

interface Gallery {
  id: string;
  title: string;
  subTitle: string;
  isGrid: boolean;
  isSlide: boolean;
}

interface Product {
  id: string;
  name: string;
  saleName: string;
  imageUrl: string[];
}

// initial empty form
const defaultForm = { title: "", subTitle: "" };

export default function AdminGalleryContent() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [products, setProducts]   = useState<Product[]>([]);
  const [selected, setSelected]   = useState<Gallery | null>(null);

  const [form, setForm]      = useState(defaultForm);
  const [isGrid, setIsGrid]  = useState(false);
  const [isSlide, setIsSlide]= useState(false);
  const [gridIds, setGridIds]= useState<string[]>([]);
  const [slideIds, setSlideIds] = useState<string[]>([]);
  const [mode, setMode]      = useState<"add"|"edit">("add");
  const [open, setOpen]      = useState(false);
  const modalRef             = useRef<HTMLDivElement>(null);

  // pull admin key from localStorage
  const adminKey = localStorage.getItem("adminKey") || "";
  const headers  = { "x-admin-key": adminKey };

  /** 1) fetch all galleries */
  const fetchGalleries = async () => {
    try {
      const resp = await apiClient.get<Gallery[]>("/Gallery", { headers });
      setGalleries(resp.data);
    } catch (err) {
      console.error("Error fetching galleries:", err);
    }
  };

  /** 2) fetch all products */
  const fetchProducts = async () => {
    try {
      const resp = await apiClient.get<{ products: Product[] }>(
        "/products?pageSize=1000",
        { headers }
      );
      setProducts(resp.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchGalleries();
    fetchProducts();
  }, []);

  /** open modal for add or edit */
  const openModal = async (g?: Gallery) => {
    await fetchProducts();

    if (g) {
      setSelected(g);
      setForm({ title: g.title, subTitle: g.subTitle });
      setIsGrid(g.isGrid);
      setIsSlide(g.isSlide);
      setMode("edit");

      try {
        const [gRes, sRes] = await Promise.all([
          apiClient.get<string[]>(`/Gallery/${g.id}/grid/products`, { headers }),
          apiClient.get<string[]>(`/Gallery/${g.id}/slide/products`, { headers }),
        ]);
        setGridIds(gRes.data);
        setSlideIds(sRes.data);
      } catch {
        setGridIds([]);
        setSlideIds([]);
      }
    } else {
      // reset for add
      setSelected(null);
      setForm(defaultForm);
      setIsGrid(false);
      setIsSlide(false);
      setGridIds([]);
      setSlideIds([]);
      setMode("add");
    }

    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  /** form field change */
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  /** submit handler */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title:   form.title.trim() || "(Ohne Titel)",
      subTitle: form.subTitle,
      isGrid,
      isSlide,
    };

    let galleryId = selected?.id;
    if (mode === "add") {
      const resp = await apiClient.post<{ id: string }>("/Gallery", payload, { headers });
      galleryId = resp.data.id;
    } else {
      await apiClient.put(`/Gallery/${galleryId}`, payload, { headers });
    }

    if (!galleryId) return alert("Missing gallery ID!");

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

    await fetchGalleries();
    closeModal();
  };

  /** delete gallery */
  const onDeleteGallery = async (id: string) => {
    if (!confirm("Löschen?")) return;
    await apiClient.delete(`/Gallery/${id}`, { headers });
    setGalleries((gs) => gs.filter((g) => g.id !== id));
  };

  /** add product to grid or slide */
  const handleAdd = (type: "grid"|"slide", pid: string) => {
    if (!pid) return;
    type === "grid"
      ? setGridIds((ids) => [...ids, pid])
      : setSlideIds((ids) => [...ids, pid]);
  };

  /** remove product */
  const handleRemove = (type: "grid"|"slide", pid: string) => {
    type === "grid"
      ? setGridIds((ids) => ids.filter((x) => x !== pid))
      : setSlideIds((ids) => ids.filter((x) => x !== pid));
  };

  /** reorder items on drag end */
  const onDragEnd = (res: DropResult) => {
    const { source, destination, type } = res;
    if (!destination || source.index === destination.index) return;

    if (type === "gallery") {
      const arr = [...galleries];
      const [m] = arr.splice(source.index, 1);
      arr.splice(destination.index, 0, m);
      setGalleries(arr);
    } else if (type === "grid") {
      const arr = [...gridIds];
      const [m] = arr.splice(source.index, 1);
      arr.splice(destination.index, 0, m);
      setGridIds(arr);
    } else if (type === "slide") {
      const arr = [...slideIds];
      const [m] = arr.splice(source.index, 1);
      arr.splice(destination.index, 0, m);
      setSlideIds(arr);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {/* — Gallery List */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Galleries</h2>
        <Button onClick={() => openModal()}>Neue Galerie hinzufügen</Button>
      </div>

      <Droppable droppableId="gallery-list" type="gallery">
        {(prov) => (
          <ul ref={prov.innerRef} {...prov.droppableProps} className="divide-y">
            {galleries.map((g, idx) => (
              <Draggable key={g.id} draggableId={g.id} index={idx}>
                {(p) => (
                  <li
                    ref={p.innerRef}
                    {...p.draggableProps}
                    {...p.dragHandleProps}
                    className="flex justify-between items-center p-2 hover:bg-gray-50"
                  >
                    <span
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => openModal(g)}
                    >
                      {g.title}
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteGallery(g.id)}
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

      {/* — Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            ref={modalRef}
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={closeModal}
              type="button"
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {mode === "edit" ? "Galerie bearbeiten" : "Neue Galerie"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium">Titel</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  className="w-full border p-2"
                  required
                />
              </div>

              {/* SubTitle */}
              <div>
                <label className="block text-sm font-medium">Subtitel</label>
                <input
                  name="subTitle"
                  value={form.subTitle}
                  onChange={onChange}
                  className="w-full border p-2"
                />
              </div>

              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isGrid}
                    onChange={(e) => setIsGrid(e.target.checked)}
                  />
                  Grid aktiv
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSlide}
                    onChange={(e) => setIsSlide(e.target.checked)}
                  />
                  Slide aktiv
                </label>
              </div>

              {/* Grid products */}
              {isGrid && (
                <>
                  <h4 className="text-lg font-semibold mt-4">Grid Produkte</h4>
                  <select
                    onChange={(e) => handleAdd("grid", e.target.value)}
                    value=""
                    className="border w-full p-2 mb-2"
                  >
                    <option value="">— Produkt hinzufügen —</option>
                    {products
                      .filter((p) => !gridIds.includes(p.id))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.saleName})
                        </option>
                      ))}
                  </select>
                  <Droppable droppableId="grid-list" type="grid">
                    {(prov) => (
                      <ul
                        ref={prov.innerRef}
                        {...prov.droppableProps}
                        className="divide-y rounded border max-h-48 overflow-auto"
                      >
                        {gridIds.length ? (
                          gridIds.map((pid, i) => {
                            const pr  = products.find((x) => x.id === pid);
                            const img = pr?.imageUrl?.[0];
                            return (
                              <Draggable
                                key={`grid-${pid}`}
                                draggableId={`grid-${pid}`}
                                index={i}
                              >
                                {(p) => (
                                  <li
                                    ref={p.innerRef}
                                    {...p.draggableProps}
                                    {...p.dragHandleProps}
                                    className="flex items-center justify-between p-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      {img && (
                                        <img
                                          src={`/images/Products/${img}`}
                                          className="w-8 h-8 object-cover rounded"
                                        />
                                      )}
                                      <span>{pr?.name}</span>
                                    </div>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      type="button"
                                      onClick={() => handleRemove("grid", pid)}
                                    >
                                      Entfernen
                                    </Button>
                                  </li>
                                )}
                              </Draggable>
                            );
                          })
                        ) : (
                          <li className="p-2 text-center text-gray-500">
                            Keine Produkte
                          </li>
                        )}
                        {prov.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </>
              )}

              {/* Slide products */}
              {isSlide && (
                <>
                  <h4 className="text-lg font-semibold mt-4">Slide Produkte</h4>
                  <select
                    onChange={(e) => handleAdd("slide", e.target.value)}
                    value=""
                    className="border w-full p-2 mb-2"
                  >
                    <option value="">— Produkt hinzufügen —</option>
                    {products
                      .filter((p) => !slideIds.includes(p.id))
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.saleName})
                        </option>
                      ))}
                  </select>
                  <Droppable droppableId="slide-list" type="slide">
                    {(prov) => (
                      <ul
                        ref={prov.innerRef}
                        {...prov.droppableProps}
                        className="divide-y rounded border max-h-48 overflow-auto"
                      >
                        {slideIds.length ? (
                          slideIds.map((pid, i) => {
                            const pr  = products.find((x) => x.id === pid);
                            const img = pr?.imageUrl?.[0];
                            return (
                              <Draggable
                                key={`slide-${pid}`}
                                draggableId={`slide-${pid}`}
                                index={i}
                              >
                                {(p) => (
                                  <li
                                    ref={p.innerRef}
                                    {...p.draggableProps}
                                    {...p.dragHandleProps}
                                    className="flex items-center justify-between p-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      {img && (
                                        <img
                                          src={`/images/Products/${img}`}
                                          className="w-8 h-8 object-cover rounded"
                                        />
                                      )}
                                      <span>{pr?.name}</span>
                                    </div>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      type="button"
                                      onClick={() => handleRemove("slide", pid)}
                                    >
                                      Entfernen
                                    </Button>
                                  </li>
                                )}
                              </Draggable>
                            );
                          })
                        ) : (
                          <li className="p-2 text-center text-gray-500">
                            Keine Produkte
                          </li>
                        )}
                        {prov.placeholder}
                      </ul>
                    )}
                  </Droppable>
                </>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-6">
                <Button type="submit">
                  {mode === "edit" ? "Speichern" : "Galerie anlegen"}
                </Button>
                <Button variant="outline" onClick={closeModal}>
                  Abbrechen
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DragDropContext>
  );
}
