/* src/Pages/adminProductsContent.tsx
   Fully-expanded component with:
   ▸ global Full-screen loader (z-[999])
   ▸ “Neues Produkt hinzufügen” button
   ▸ product list shows only the name
   ▸ About Flower & Grower Description fetched and editable
   ▸ modal opens fast (basic data first, long fields patched)
*/

import React, { useEffect, useState } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { API_URL } from "@/config";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Loader overlay                                                           */
/* ────────────────────────────────────────────────────────────────────────── */
function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center
                    bg-white/70 backdrop-blur-sm">
      <Loader />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Types                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */
type Lookup = { id: string; name?: string; title?: string };
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
  aboutFlower: string | null;
  growerDescription: string | null;
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
  aboutFlower: string;
  growerDescription: string;
};

type GalleryItem = {
  id: string;
  src: string;
  file?: File;
  existingFilename?: string;
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  Component                                                                */
/* ────────────────────────────────────────────────────────────────────────── */
export default function AdminProductsContent() {
  /* -------------  state & constants ------------- */
  const headers = { "x-admin-key": localStorage.getItem("adminKey") || "" };

  const [loading,       setLoading]       = useState(false);

  const [products,      setProducts]      = useState<Product[]>([]);
  const [manufacturers, setManufacturers] = useState<Lookup[]>([]);
  const [origins,       setOrigins]       = useState<Lookup[]>([]);
  const [rays,          setRays]          = useState<Lookup[]>([]);
  const [effects,       setEffects]       = useState<Lookup[]>([]);
  const [terpenes,      setTerpenes]      = useState<Lookup[]>([]);
  const [tastes,        setTastes]        = useState<Lookup[]>([]);
  const [prodEff,       setProdEff]       = useState<JT[]>([]);
  const [prodTerp,      setProdTerp]      = useState<JT[]>([]);
  const [prodTaste,     setProdTaste]     = useState<JT[]>([]);

  const [open,          setOpen]          = useState(false);
  const [mode,          setMode]          = useState<"add"|"edit">("add");
  const [selected,      setSelected]      = useState<Product|null>(null);

  const [form, setForm] = useState<Form>({
    name: "",
    price: 0,
    thc: 0,
    cbd: 0,
    genetics: "",
    isAvailable: false,
    manufacturerId: "",
    originId: "",
    rayId: "",
    aboutFlower: "",
    growerDescription: "",
  });

  const [existingProfile, setExistingProfile] = useState<string|null>(null);
  const [removeProfile,   setRemoveProfile]   = useState(false);
  const [profileFile,     setProfileFile]     = useState<File|null>(null);
  const [profilePreview,  setProfilePreview]  = useState<string|null>(null);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [removeGallery,setRemoveGallery]= useState<string[]>([]);

  const [selEff,   setSelEff]   = useState<string[]>([]);
  const [selTerp,  setSelTerp]  = useState<string[]>([]);
  const [selTaste, setSelTaste] = useState<string[]>([]);

  /* -------------  startup ------------- */
  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([
        fetchProducts(),
        fetchFilters(),
        fetchJunctions(),
      ]);
      setLoading(false);
    })();
  }, []);

  /* -------------  API helpers ------------- */
  const normalise = (arr: any[]): Lookup[] =>
    arr.map(({ id, name, title }: any) => ({ id, name, title }));

  async function fetchProducts() {
    try {
      const { data } = await apiClient.get("/Products", { headers });
      const list: Product[] = data.map((p: any) => {
        let images: string[] = [];
        try { images = JSON.parse(String(p.imageUrl||"[]").replace(/\\/g,"")); }
        catch {}
        return { ...p, price:Number(p.price)||0, imageUrl: images };
      });
      setProducts(list);
    } catch (err) { console.error(err); }
  }

  async function fetchFullProduct(id: string) {
    try {
      const { data } = await apiClient.get(`/api/product/${id}`, { headers });
      let images: string[] = [];
      try { images = JSON.parse(String(data.imageUrl||"[]").replace(/\\/g,"")); }
      catch {}
      return { ...data, imageUrl: images } as Product;
    } catch (err) { console.error(err); return null; }
  }

  async function fetchFilters() {
    try {
      const { data } = await apiClient.get("/api/product-filters", { headers });
      setManufacturers(normalise(data.manufacturers));
      setOrigins      (normalise(data.origins));
      setRays         (normalise(data.rays));
      setEffects      (normalise(data.effects));
      setTerpenes     (normalise(data.terpenes));
      setTastes       (normalise(data.tastes));
    } catch (err) { console.error(err); }
  }

  async function fetchJunctions() {
    try {
      const [pe, pt, pu] = await Promise.all([
        apiClient.get("/producteffects",  { headers }),
        apiClient.get("/productterpenes", { headers }),
        apiClient.get("/producttastes",   { headers }),
      ]);
      setProdEff (pe.data);
      setProdTerp(pt.data);
      setProdTaste(pu.data);
    } catch (err) { console.error(err); }
  }

  /* -------------  modal open / close ------------- */
  async function openModal(product?: Product) {
    if (product) {
      setMode("edit"); setSelected(product);

      /* quick fields */
      setForm(f => ({
        ...f,
        name: product.name,
        price: product.price,
        thc: product.thc,
        cbd: product.cbd,
        genetics: product.genetics,
        isAvailable: product.isAvailable === "Available",
        manufacturerId: product.manufacturerId || "",
        originId: product.originId || "",
        rayId: product.rayId || "",
        aboutFlower: "",
        growerDescription: "",
      }));

      /* images */
      const [profile, ...gallery] = product.imageUrl;
      setExistingProfile(profile||null);
      setProfilePreview(profile ? `${API_URL}/images/Products/${profile}` : null);
      setGalleryItems(gallery.map(fn => ({
        id: fn, src: `${API_URL}/images/Products/${fn}`, existingFilename: fn,
      })));

      /* tags */
      setSelEff  (prodEff .filter(r=>r.productId===product.id).map(r=>r.effectId!));
      setSelTerp (prodTerp.filter(r=>r.productId===product.id).map(r=>r.terpeneId!));
      setSelTaste(prodTaste.filter(r=>r.productId===product.id).map(r=>r.tasteId!));

      setOpen(true);                         // show modal immediately

      /* long fields async */
      const full = await fetchFullProduct(product.id);
      if (full) {
        setForm(f => ({
          ...f,
          aboutFlower: full.aboutFlower || "",
          growerDescription: full.growerDescription || "",
        }));
      }
    } else {
      setMode("add"); setSelected(null);
      setForm({
        name:"", price:0, thc:0, cbd:0, genetics:"",
        isAvailable:false, manufacturerId:"", originId:"",
        rayId:"", aboutFlower:"", growerDescription:""
      });
      setExistingProfile(null);
      setProfilePreview(null);
      setGalleryItems([]);
      setSelEff([]); setSelTerp([]); setSelTaste([]);
      setOpen(true);
    }
  }
  const closeModal = () => setOpen(false);

  /* -------------  generic field change ------------- */
  const onChangeForm = (e: React.ChangeEvent<
    HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement
  >) => {
    const {name,value,type,checked}=e.target as any;
    setForm(f=>({...f,[name]:type==="checkbox"?checked:value}));
  };

  /* -------------  profile & gallery helpers ------------- */
  const onProfileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file=e.target.files?.[0]||null;
    setProfileFile(file);
    setProfilePreview(file?URL.createObjectURL(file):null);
    if (existingProfile) setRemoveProfile(true);
  };
  const removeProfileImage = () => {
    setProfileFile(null); setProfilePreview(null);
    if (existingProfile) setRemoveProfile(true);
    setExistingProfile(null);
  };
  const handleGallery = (e:React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const arr=Array.from(e.target.files);
    setGalleryItems(prev=>[
      ...prev,
      ...arr.map(f=>({id:URL.createObjectURL(f),src:URL.createObjectURL(f),file:f}))
    ]);
    e.target.value="";
  };
  const removeGalleryItem = (i:number) => {
    setGalleryItems(prev=>{
      const item=prev[i];
      if(item.existingFilename) setRemoveGallery(r=>[...r,item.existingFilename!]);
      const c=[...prev]; c.splice(i,1); return c;
    });
  };
  const onDragEnd = (r:DropResult) => {
    if (!r.destination) return;
    const a=[...galleryItems];
    const [m]=a.splice(r.source.index,1);
    a.splice(r.destination.index,0,m);
    setGalleryItems(a);
  };

  /* -------------  tag helpers ------------- */
  const onMultiAdd = (
    e:React.ChangeEvent<HTMLSelectElement>,
    setter:React.Dispatch<React.SetStateAction<string[]>>,
    list:string[]
  ) => { const v=e.target.value; if(v&&!list.includes(v)) setter([...list,v]); e.target.value=""; };
  const removeTag = (id:string,setter:any)=>setter((arr:string[])=>arr.filter(x=>x!==id));

  /* -------------  save / delete ------------- */
  async function onSubmit(e:React.FormEvent) {
    e.preventDefault(); setLoading(true);

    const fd=new FormData();
    fd.append("name",form.name);
    fd.append("price",String(form.price));
    fd.append("thc",String(form.thc));
    fd.append("cbd",String(form.cbd));
    fd.append("genetics",form.genetics);
    fd.append("isAvailable",form.isAvailable?"1":"0");
    fd.append("manufacturerId",form.manufacturerId);
    fd.append("originId",form.originId);
    fd.append("rayId",form.rayId);
    fd.append("aboutFlower",form.aboutFlower);
    fd.append("growerDescription",form.growerDescription);
    fd.append("rating","0");

    if(removeProfile&&existingProfile) fd.append("removeImages",existingProfile);
    removeGallery.forEach(fn=>fd.append("removeImages",fn));

    if(profileFile) fd.append("images",profileFile);
    galleryItems.forEach(i=>i.file&&fd.append("images",i.file));

    const order:string[]=[];
    if(profileFile)                order.push("__NEW__");
    else if(existingProfile)       order.push(existingProfile);
    galleryItems.forEach(i=>{
      if(i.file)                   order.push("__NEW__");
      else if(i.existingFilename)  order.push(i.existingFilename);
    });
    fd.append("imageOrder",JSON.stringify(order));

    selEff  .forEach(id=>fd.append("effectFilter",  id));
    selTerp .forEach(id=>fd.append("terpeneFilter", id));
    selTaste.forEach(id=>fd.append("tasteFilter",   id));

    const cfg={headers:{...headers,"Content-Type":"multipart/form-data"}};
    try {
      if(mode==="add")          await apiClient.post("/Products",fd,cfg);
      else if(selected)         await apiClient.put(`/Products/${selected.id}`,fd,cfg);
      await fetchProducts(); await fetchJunctions(); closeModal();
    } catch(err){ console.error(err); alert("Speichern fehlgeschlagen"); }
    finally{ setLoading(false); }
  }

  async function onDelete(id:string) {
    if(!confirm("Löschen?")) return;
    setLoading(true);
    try { await apiClient.delete(`/Products/${id}`,{headers}); await fetchProducts();}
    catch(err){ console.error(err); alert("Löschen fehlgeschlagen"); }
    finally{ setLoading(false); }
  }

  /* ─────────────────────────────────────────────────────────────────────── */
  /*  JSX (everything after return)                                          */
  /* ─────────────────────────────────────────────────────────────────────── */
  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Produkte</h2>
        <Button onClick={()=>openModal()}>Neues Produkt hinzufügen</Button>
      </div>

      {/* list */}
      <ul className="divide-y">
        {products.map(p=>(
          <li key={p.id} className="flex justify-between items-center p-2 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              {p.imageUrl[0] &&
                <img src={`${API_URL}/images/Products/${p.imageUrl[0]}`}
                     alt={p.name}
                     className="w-10 h-10 rounded-full object-cover border-2"/>}
              <span className="cursor-pointer text-blue-600 hover:underline"
                    onClick={()=>openModal(p)}>{p.name}</span>
            </div>
            <Button variant="destructive" onClick={()=>onDelete(p.id)}>Löschen</Button>
          </li>
        ))}
      </ul>

      {/* modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
             onClick={closeModal}>
          <div onClick={e=>e.stopPropagation()}
               className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto
                          rounded-lg shadow-lg p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
                    onClick={closeModal}>×</button>

            <h3 className="text-2xl font-bold mb-4">
              {mode==="edit"?"Produkt bearbeiten":"Neues Produkt"}
            </h3>

            {/* form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* profile */}
              <div>
                <label className="block font-medium mb-1">Profilbild</label>
                {profilePreview ? (
                  <div className="relative inline-block">
                    <img src={profilePreview}
                         className="w-20 h-20 rounded-full object-cover border"/>
                    <button type="button" onClick={removeProfileImage}
                            className="absolute top-0 right-0 bg-white rounded-full
                                       p-1 text-red-500">×</button>
                  </div>
                ) : (
                  <input type="file" accept=".png,.jpg,.jpeg" onChange={onProfileChange}/>
                )}
              </div>

              {/* gallery */}
              <div>
                <label className="block font-medium mb-1">Weitere Bilder</label>
                <input type="file" multiple accept=".png,.jpg,.jpeg" onChange={handleGallery}/>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="gallery" direction="horizontal">
                    {prov=>(
                      <div ref={prov.innerRef} {...prov.droppableProps}
                           className="flex flex-wrap gap-2 mt-2">
                        {galleryItems.map((it,i)=>(
                          <Draggable key={it.id} draggableId={it.id} index={i}>
                            {p=>(
                              <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps}
                                   className="relative">
                                <img src={it.src}
                                     className="w-20 h-20 rounded object-cover border"/>
                                <button type="button"
                                        onClick={()=>removeGalleryItem(i)}
                                        className="absolute top-0 right-0 bg-white rounded-full
                                                   p-1 text-red-500">×</button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {prov.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

              {/* details */}
              <fieldset className="border p-4 rounded">
                <legend className="font-semibold px-2">Produktdetails</legend>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div><label className="block text-sm">Name</label>
                    <input name="name" value={form.name} onChange={onChangeForm}
                           required className="w-full border p-2 rounded"/></div>

                  <div><label className="block text-sm">Preis (€)</label>
                    <input name="price" type="number" step="0.01" value={form.price}
                           onChange={onChangeForm} className="w-full border p-2 rounded"/></div>

                  <div><label className="block text-sm">THC (%)</label>
                    <input name="thc" type="number" step="0.01" value={form.thc}
                           onChange={onChangeForm} className="w-full border p-2 rounded"/></div>

                  <div><label className="block text-sm">CBD (%)</label>
                    <input name="cbd" type="number" step="0.01" value={form.cbd}
                           onChange={onChangeForm} className="w-full border p-2 rounded"/></div>

                  <div><label className="block text-sm">Genetik</label>
                    <select name="genetics" value={form.genetics}
                            onChange={onChangeForm} className="w-full border p-2 rounded">
                      <option>Indica</option><option>Hybrid</option><option>Sativa</option>
                    </select></div>

                  <div className="flex items-center pt-6">
                    <input type="checkbox" name="isAvailable" checked={form.isAvailable}
                           onChange={onChangeForm} className="mr-2"/><label>Verfügbar</label></div>

                  <div><label className="block text-sm">Hersteller</label>
                    <select name="manufacturerId" value={form.manufacturerId}
                            onChange={onChangeForm} required
                            className="w-full border p-2 rounded">
                      <option value="">Auswählen</option>
                      {manufacturers.map(m=>
                        <option key={m.id} value={m.id}>{m.title||m.name}</option>)}
                    </select></div>

                  <div><label className="block text-sm">Herkunft</label>
                    <select name="originId" value={form.originId}
                            onChange={onChangeForm} className="w-full border p-2 rounded">
                      <option value="">Auswählen</option>
                      {origins.map(o=>
                        <option key={o.id} value={o.id}>{o.title||o.name}</option>)}
                    </select></div>

                  <div><label className="block text-sm">Ray</label>
                    <select name="rayId" value={form.rayId}
                            onChange={onChangeForm} required
                            className="w-full border p-2 rounded">
                      <option value="">Auswählen</option>
                      {rays.map(r=>
                        <option key={r.id} value={r.id}>{r.title||r.name}</option>)}
                    </select></div>
                </div>

                {/* about & grower */}
                <div className="mt-4">
                  <label className="block font-medium mb-1">About Flower</label>
                  <textarea name="aboutFlower" value={form.aboutFlower}
                            onChange={onChangeForm} rows={4}
                            className="w-full border p-2 rounded"/>
                </div>
                <div className="mt-4">
                  <label className="block font-medium mb-1">Grower Description</label>
                  <textarea name="growerDescription" value={form.growerDescription}
                            onChange={onChangeForm} rows={4}
                            className="w-full border p-2 rounded"/>
                </div>

                {/* tags — effects */}
                <div className="mt-4">
                  <label className="block font-medium mb-1">Effekte</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selEff.map(id=>{
                      const e=effects.find(x=>x.id===id);
                      return <button key={id} type="button"
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                        {e?.title||e?.name}
                        <span onClick={()=>removeTag(id,setSelEff)}
                              className="ml-1 cursor-pointer">×</span>
                      </button>;
                    })}
                  </div>
                  <select value="" onChange={e=>onMultiAdd(e,setSelEff,selEff)}
                          className="w-full border p-2 rounded">
                    <option value="">Effekt hinzufügen…</option>
                    {effects.filter(x=>!selEff.includes(x.id))
                            .map(x=><option key={x.id} value={x.id}>{x.title||x.name}</option>)}
                  </select>
                </div>

                {/* tags — terpenes */}
                <div className="mt-4">
                  <label className="block font-medium mb-1">Terpene</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selTerp.map(id=>{
                      const t=terpenes.find(x=>x.id===id);
                      return <button key={id} type="button"
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                        {t?.title||t?.name}
                        <span onClick={()=>removeTag(id,setSelTerp)}
                              className="ml-1 cursor-pointer">×</span>
                      </button>;
                    })}
                  </div>
                  <select value="" onChange={e=>onMultiAdd(e,setSelTerp,selTerp)}
                          className="w-full border p-2 rounded">
                    <option value="">Terpen hinzufügen…</option>
                    {terpenes.filter(x=>!selTerp.includes(x.id))
                             .map(x=><option key={x.id} value={x.id}>{x.title||x.name}</option>)}
                  </select>
                </div>

                {/* tags — tastes */}
                <div className="mt-4">
                  <label className="block font-medium mb-1">Geschmäcker</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selTaste.map(id=>{
                      const t=tastes.find(x=>x.id===id);
                      return <button key={id} type="button"
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center">
                        {t?.title||t?.name}
                        <span onClick={()=>removeTag(id,setSelTaste)}
                              className="ml-1 cursor-pointer">×</span>
                      </button>;
                    })}
                  </div>
                  <select value="" onChange={e=>onMultiAdd(e,setSelTaste,selTaste)}
                          className="w-full border p-2 rounded">
                    <option value="">Geschmack hinzufügen…</option>
                    {tastes.filter(x=>!selTaste.includes(x.id))
                           .map(x=><option key={x.id} value={x.id}>{x.title||x.name}</option>)}
                  </select>
                </div>
              </fieldset>

              {/* actions */}
              <div className="flex justify-end space-x-4">
                <Button type="submit">
                  {mode==="edit"?"Speichern":"Hinzufügen"}
                </Button>
                <Button variant="outline" onClick={closeModal}>Abbrechen</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading && <FullPageLoader/>}
    </div>
  );
}
