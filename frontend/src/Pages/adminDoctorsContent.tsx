// src/components/AdminDoctorsContent.tsx
import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";

// public read endpoints
const LIST_API = "/doctors";
// admin write endpoints
const ADMIN_API = "/Doctors";

// your backend URL for static assets
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8081";

const days = ["Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag","Sonntag"];
const times: string[] = [];
for (let h = 0; h < 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    times.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
  }
}

type Doctor = {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  price: string;
  startDay: string;
  endDay: string;
  startTime: string;   // "HH:mm"
  endTime: string;     // "HH:mm"
  isVerified: boolean;
  imagePath: string | null;
  coverImagePath: string | null;
};

type Form = Omit<Doctor, "id" | "coverImagePath"> & { price: string };

const defaultForm: Form = {
  name:        "",
  description: "",
  phone:       "",
  email:       "",
  address:     "",
  price:       "",
  startDay:    days[0],
  endDay:      days[0],
  startTime:   times[0],
  endTime:     times[0],
  isVerified:  false,
  imagePath:   null,
};

const DEFAULT_COVER = "437b7272-6cd2-4b9e-b6ba-50e713419ad5.png";

function formatTime(value: string|null|undefined): string {
  if (!value) return times[0];
  return String(value).slice(11,16);
}

export default function AdminDoctorsContent() {
  const [doctors, setDoctors]     = useState<Doctor[]>([]);
  const [selected, setSelected]   = useState<Doctor|null>(null);
  const [form, setForm]           = useState<Form>(defaultForm);
  const [imageFile, setImageFile] = useState<File|null>(null);
  const [preview, setPreview]     = useState<string|null>(null);
  const [mode, setMode]           = useState<"add"|"edit">("add");
  const [open, setOpen]           = useState(false);
  const [removeProfile, setRemove]= useState(false);
  const modalRef                  = useRef<HTMLDivElement>(null);

  // 1) Load list
  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<{ doctors: Doctor[] }>(LIST_API, {
          params: { pageNumber: 1, pageSize: 50 }
        });
        setDoctors(res.data.doctors.map(d => ({
          ...d,
          price:          Number(d.price) || 0,
          startTime:      formatTime(d.startTime),
          endTime:        formatTime(d.endTime),
          coverImagePath: d.coverImagePath || DEFAULT_COVER,
        })));
      } catch (err) {
        console.error(err);
        alert("Fehler beim Laden der Ärzte");
      }
    })();
  }, []);

  // 2) Open modal (add or edit)
  const openModal = async (doc?: Doctor) => {
    if (doc) {
      try {
        const res = await apiClient.get<Doctor>(`${LIST_API}/${doc.id}`);
        const d   = res.data;
        const pnum = Number(d.price) || 0;
        setSelected(d);
        setForm({
          name:        d.name,
          description: d.description,
          phone:       d.phone,
          email:       d.email,
          address:     d.address,
          price:       pnum.toFixed(2).replace(".", ","),
          startDay:    d.startDay,
          endDay:      d.endDay,
          startTime:   formatTime(d.startTime),
          endTime:     formatTime(d.endTime),
          isVerified:  Boolean(d.isVerified),
          imagePath:   d.imagePath,
        });
        // **prefix** with API_URL
        setPreview(
          d.imagePath
            ? `${API_URL}/images/Doctors/${d.imagePath}`
            : null
        );
        setMode("edit");
      } catch (err) {
        console.error(err);
        alert("Fehler beim Laden des Arztes");
        return;
      }
    } else {
      setSelected(null);
      setForm(defaultForm);
      setPreview(null);
      setMode("add");
    }
    setRemove(false);
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  // 3) Handle form field changes
  const onChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ 
      ...f, 
      [name]: type === "checkbox" ? checked : value 
    }));
  };

  // 4) Handle file selection
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setRemove(false);
  };

  // 5) Submit add / edit
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // normalize price
    let raw = form.price.replace(/,/g,".");
    let num = parseFloat(raw);
    if (isNaN(num)) num = 0;
    num = Math.round(num * 100) / 100;
    const fixed = num.toFixed(2).replace(".", ",");

    const payload: any = {
      ...form,
      price:         fixed,
      startTime:     form.startTime,
      endTime:       form.endTime,
      coverImageUrl: DEFAULT_COVER,
      profileUrl:    form.imagePath  // this is only fallback if no new file
    };
    delete payload.imagePath;

    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
      if (v != null) fd.append(k, String(v));
    });
    if (imageFile)          fd.append("image", imageFile);
    else if (removeProfile) fd.append("removeProfile","true");

    try {
      if (mode === "add") {
        await apiClient.post(ADMIN_API, fd);
      } else if (selected) {
        await apiClient.put(`${ADMIN_API}/${selected.id}`, fd);
      }

      // refresh list
      const list = await apiClient.get<{ doctors: Doctor[] }>(LIST_API, {
        params: { pageNumber: 1, pageSize: 50 }
      });
      setDoctors(list.data.doctors.map(d => ({
        ...d,
        price:          Number(d.price) || 0,
        startTime:      formatTime(d.startTime),
        endTime:        formatTime(d.endTime),
        coverImagePath: d.coverImagePath || DEFAULT_COVER,
      })));
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Speichern fehlgeschlagen");
    }
  };

  // 6) Delete
  const onDelete = async (id: string) => {
    if (!confirm("Wirklich löschen?")) return;
    try {
      await apiClient.delete(`${ADMIN_API}/${id}`);
      setDoctors(curr => curr.filter(d => d.id !== id));
    } catch {
      alert("Löschen fehlgeschlagen");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Ärzte</h2>
        <Button onClick={() => openModal()}>Neuer Arzt</Button>
      </div>

      <ul className="divide-y">
        {doctors.map(d => (
          <li key={d.id} className="flex justify-between items-center p-2 hover:bg-gray-50">
            <div className="flex items-center gap-3">
              {d.imagePath && (
                // **also prefix here**
                <img
                  src={`${API_URL}/images/Doctors/${d.imagePath}`}
                  alt={d.name}
                  className="w-10 h-10 rounded-full object-cover border-2"
                />
              )}
              <span
                className="cursor-pointer text-blue-600 hover:underline"
                onClick={() => openModal(d)}
              >
                {d.name}
              </span>
            </div>
            <Button variant="destructive" onClick={() => onDelete(d.id)}>
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
            onClick={e => e.stopPropagation()}
            className="bg-white w-full max-w-lg max-h-[80vh] overflow-auto rounded-lg p-6"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={closeModal}
            >×</button>

            <h3 className="text-2xl font-bold mb-4">
              {mode === "edit" ? "Arzt bearbeiten" : "Neuer Arzt"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Profilbild */}
              <div>
                <label className="block text-sm font-medium mb-1">Profilbild</label>
                {preview ? (
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Vorschau"
                      className="w-24 h-24 rounded-full object-cover border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setPreview(null);
                        setRemove(true);
                      }}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                    >×</button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleFile}
                  />
                )}
              </div>

              {/* … the rest of your form fields (Name, Adresse, Preis, …) … */}

              <div className="flex justify-end space-x-4 mt-6">
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
