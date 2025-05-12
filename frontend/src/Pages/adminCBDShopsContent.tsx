import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";

const days = [
  "Montag","Dienstag","Mittwoch",
  "Donnerstag","Freitag","Samstag","Sonntag",
];

const times: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    times.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
  }
}

type CBDShop = {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  price: string;            // e.g. "42,33"
  startDay: string;
  endDay: string;
  startTime: string;        // "HH:mm"
  endTime: string;          // "HH:mm"
  isVerified: boolean;
  imagePath: string | null;
  coverImagePath: string | null;
};

type Form = Omit<CBDShop, "id">;

const defaultForm: Form = {
  name: "", description: "",
  phone: "", email: "", address: "",
  price: "",                // start empty
  startDay: days[0], endDay: days[0],
  startTime: times[0], endTime: times[0],
  isVerified: false,
  imagePath: null, coverImagePath: null,
};

export default function AdminCBDShopsContent() {
  const [shops, setShops]               = useState<CBDShop[]>([]);
  const [selected, setSelected]         = useState<CBDShop|null>(null);
  const [form, setForm]                 = useState<Form>(defaultForm);
  const [imageFile, setImageFile]       = useState<File|null>(null);
  const [coverFile, setCoverFile]       = useState<File|null>(null);
  const [imagePreview, setImagePreview] = useState<string|null>(null);
  const [coverPreview, setCoverPreview] = useState<string|null>(null);
  const [mode, setMode]                 = useState<"add"|"edit">("add");
  const [open, setOpen]                 = useState(false);
  const modalRef                        = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://fuego-ombm.onrender.com";
  const headers = { "x-admin-key": localStorage.getItem("adminKey") || "" };

  // 1) load
  const fetchShops = async () => {
    try {
      const res = await apiClient.get<{ cbdShops: any[] }>("/CBDShops", {
        params: { page:1, pageSize:50 }, headers
      });
      setShops(
        res.data.cbdShops.map(it => ({
          ...it,
          price:           String(Number(it.price).toFixed(2).replace(".",",")),
          startTime:       it.startTime.slice(11,16),
          endTime:         it.endTime.slice(11,16),
        }))
      );
    } catch (err) {
      console.error("Error fetching CBD shops:", err);
      alert("Fehler beim Laden der CBD Shops");
    }
  };
  useEffect(fetchShops, []);

  // 2) open modal
  const openModal = (it?: CBDShop) => {
    if (it) {
      setSelected(it);
      setForm({
        name:            it.name,
        description:     it.description,
        phone:           it.phone,
        email:           it.email,
        address:         it.address,
        price:           it.price,
        startDay:        it.startDay,
        endDay:          it.endDay,
        startTime:       it.startTime,
        endTime:         it.endTime,
        isVerified:      it.isVerified,
        imagePath:       it.imagePath,
        coverImagePath:  it.coverImagePath,
      });
      setImagePreview(it.imagePath
        ? `${API_URL}/images/CBDShops/${it.imagePath}`
        : null
      );
      setCoverPreview(it.coverImagePath
        ? `${API_URL}/images/CBDShops/${it.coverImagePath}`
        : null
      );
      setImageFile(null);
      setCoverFile(null);
      setMode("edit");
    } else {
      setSelected(null);
      setForm(defaultForm);
      setImagePreview(null);
      setCoverPreview(null);
      setImageFile(null);
      setCoverFile(null);
      setMode("add");
    }
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  // 3) form change
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as any;
    setForm(f => ({ ...f, [name]: type==="checkbox" ? checked : value }));
  };

  // 4) file pick
  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFn: React.Dispatch<React.SetStateAction<File|null>>,
    setPrev: React.Dispatch<React.SetStateAction<string|null>>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFn(file);
    setPrev(URL.createObjectURL(file));
  };

  // 5) submit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // normalize price
    let raw = form.price.replace(",",".").trim(),
        num = parseFloat(raw) || 0;
    num = Math.round(num*100)/100;
    const priceFixed = num.toFixed(2);

    const fd = new FormData();
    fd.append("name",         form.name);
    fd.append("description",  form.description);
    fd.append("phone",        form.phone);
    fd.append("email",        form.email);
    fd.append("address",      form.address);
    fd.append("price",        priceFixed);
    fd.append("startDay",     form.startDay);
    fd.append("endDay",       form.endDay);
    fd.append("startTime",    `${form.startTime}:00`);
    fd.append("endTime",      `${form.endTime}:00`);
    fd.append("isVerified",   String(form.isVerified));
    if (imageFile) fd.append("image", imageFile);
    if (coverFile) fd.append("cover", coverFile);

    try {
      const cfg = { headers: { ...headers, "Content-Type":"multipart/form-data" } };
      if (mode === "add") {
        await apiClient.post("/CBDShops", fd, cfg);
      } else if (selected) {
        await apiClient.put(`/CBDShops/${selected.id}`, fd, cfg);
      }
      await fetchShops();
      closeModal();
    } catch (err) {
      console.error("Error saving CBD shop:", err);
      alert("Speichern fehlgeschlagen");
    }
  };

  // 6) delete
  const onDelete = async (id: string) => {
    if (!confirm("Löschen?")) return;
    try {
      await apiClient.delete(`/CBDShops/${id}`, { headers });
      fetchShops();
    } catch {
      alert("Löschen fehlgeschlagen");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">CBD Shops</h2>
        <Button onClick={()=>openModal()}>Neuer CBD Shop</Button>
      </div>

      <ul className="divide-y">
        {shops.map(s => (
          <li key={s.id} className="flex justify-between items-center p-2 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              {s.imagePath && (
                <img
                  src={`${API_URL}/images/CBDShops/${s.imagePath}`}
                  alt={s.name}
                  className="w-10 h-10 rounded-full object-cover border-2"
                  loading="lazy"
                />
              )}
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={()=>openModal(s)}
              >
                {s.name}
              </span>
            </div>
            <Button variant="destructive" onClick={()=>onDelete(s.id)}>
              Löschen
            </Button>
          </li>
        ))}
      </ul>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={e=>e.stopPropagation()}
            className="bg-white w-full max-w-lg max-h-[80vh] overflow-auto rounded-lg p-6"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={closeModal}
            >×</button>

            <h3 className="text-2xl font-bold mb-4">
              {mode==="edit" ? "CBD Shop bearbeiten" : "Neuer CBD Shop"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Profilbild */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Profilbild
                </label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Vorschau"
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                    <button
                      type="button"
                      onClick={()=>{setImageFile(null);setImagePreview(null)}}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={e=>handleFile(e,setImageFile,setImagePreview)}
                  />
                )}
              </div>

              {/* Coverbild */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Coverbild
                </label>
                {coverPreview ? (
                  <div className="relative inline-block">
                    <img
                      src={coverPreview}
                      alt="Vorschau"
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={()=>{setCoverFile(null);setCoverPreview(null)}}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={e=>handleFile(e,setCoverFile,setCoverPreview)}
                  />
                )}
              </div>

              {/* rest of your fields... */}
              {/* Name, Beschreibung, Telefon/E-Mail, Adresse, Preis, Öffnungszeiten, Verifiziert */}

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
