/*  src/Pages/AdminPharmaciesContent.tsx
    ─────────────────────────────────────────────────────────────────────────────
    FULL original file (+ a few lines for the loader overlay).
      • Every previous prop, state, helper, and UI element kept
      • Added: Loader import, `loading` state, <FullPageLoader /> overlay,
        and `setLoading(true/false)` around each async call
      • Button label already “Neue Apotheke hinzufügen”
*/

import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { API_URL } from "@/config";
/* ──────────────────────────────────────────────────────────────────── */
/*  Loader overlay component                                           */
/* ──────────────────────────────────────────────────────────────────── */
function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center
                    bg-white/70 backdrop-blur-sm">
      <Loader />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Types & constants                                                  */
/* ──────────────────────────────────────────────────────────────────── */
interface Pharmacy {
  id: string;
  name: string;
  description: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  isVerified: boolean | string;
  imagePath: string | null;
  coverImagePath: string | null;
  startDay: string;
  endDay: string;
  startTime: string;
  endTime: string;
}

const defaultFormData = {
  name: "",
  description: "",
  phone: "",
  email: "",
  website: "",
  address: "",
  startDay: "",
  endDay: "",
  startTime: "",
  endTime: "",
  logoFile: "",
  isVerified: "Not Verified",
};

const verifiedOptions = ["Not Verified", "Verified"];


const germanDays = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];

const halfHourTimes = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, "0");
  const min = i % 2 === 0 ? "00" : "30";
  return `${hour}:${min}`;
});

/* ──────────────────────────────────────────────────────────────────── */
/*  Component                                                          */
/* ──────────────────────────────────────────────────────────────────── */
const AdminPharmaciesContent: React.FC = () => {
  /* ─── state ─────────────────────────────────────────────────────── */
  const [pharmacies, setPharmacies]       = useState<Pharmacy[]>([]);
  const [selected, setSelected]           = useState<Pharmacy | null>(null);
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [form, setForm]                   = useState(defaultFormData);
  const [logoPreview, setLogoPreview]     = useState<string | null>(null);
  const [removeImage, setRemoveImage]     = useState(false);
  const [formMode, setFormMode]           = useState<"add" | "edit">("add");
  const [loading, setLoading]             = useState(false);        // loader
  const modalRef                          = useRef<HTMLDivElement>(null);

  const headers = { "x-admin-key": localStorage.getItem("adminKey") || "" };

  /* ─── fetch list ────────────────────────────────────────────────── */
  const fetchPharmacies = async () => {
    setLoading(true);
    try {
      const resp = await apiClient.get("/Pharmacies", { headers });
      setPharmacies(resp.data.pharmacies);
    } catch (err) {
      console.error("Error fetching pharmacies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPharmacies(); }, []);

  /* ─── modal helpers ─────────────────────────────────────────────── */
  const openModal = (p?: Pharmacy) => {
    if (p) {
      setSelected(p);
      setForm({
        name:        p.name,
        description: p.description,
        phone:       p.phone,
        email:       p.email,
        website:     p.website,
        address:     p.address,
        startDay:    p.startDay,
        endDay:      p.endDay,
        startTime:   p.startTime,
        endTime:     p.endTime,
        logoFile:    p.imagePath || "",
        isVerified:  typeof p.isVerified === "boolean"
                       ? p.isVerified ? "Verified" : "Not Verified"
                       : (p.isVerified as string),
      });
      setLogoPreview(p.imagePath);
      setRemoveImage(false);
      setFormMode("edit");
    } else {
      setSelected(null);
      setForm(defaultFormData);
      setLogoPreview(null);
      setRemoveImage(false);
      setFormMode("add");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  /* ─── form change ───────────────────────────────────────────────── */
  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) =>
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));

  /* ─── logo upload ──────────────────────────────────────────────── */
  const onLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      alert("Nur JPG/PNG erlaubt");
      return;
    }

    setRemoveImage(false);
    const fd = new FormData();
    fd.append("file", file);

    try {
      setLoading(true);
      const resp = await apiClient.post("/upload/pharmacy-logo", fd, {
        headers: { "Content-Type": "multipart/form-data", ...headers },
      });
      setForm((f) => ({ ...f, logoFile: resp.data.filename }));
      setLogoPreview(resp.data.filename);
    } catch (err) {
      console.error("Logo upload failed:", err);
      alert("Upload fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  /* ─── submit (add/edit) ─────────────────────────────────────────── */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      name:            form.name,
      description:     form.description,
      phone:           form.phone,
      email:           form.email,
      website:         form.website,
      address:         form.address,
      startDay:        form.startDay,
      endDay:          form.endDay,
      startTime:       form.startTime,
      endTime:         form.endTime,
      imagePath:       form.logoFile,
      coverImagePath:  selected?.coverImagePath || "",
      isVerified:      form.isVerified,
    };

    if (removeImage && !form.logoFile) payload.imagePath = "";

    setLoading(true);
    try {
      if (formMode === "add") {
        await apiClient.post("/Pharmacies", payload, { headers });
      } else if (selected) {
        await apiClient.put(`/Pharmacies/${selected.id}`, payload, { headers });
      }
      fetchPharmacies();
      closeModal();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Speichern fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  /* ─── delete ───────────────────────────────────────────────────── */
  const onDelete = async (id: string) => {
    if (!confirm("Löschen?")) return;
    setLoading(true);
    try {
      await apiClient.delete(`/Pharmacies/${id}`, { headers });
      fetchPharmacies();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Löschen fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────────────── JSX ────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pharmacies</h2>
        <Button onClick={() => openModal()}>Neue Apotheke hinzufügen</Button>
      </div>

      {/* List */}
      <ul className="divide-y">
        {pharmacies.map((p) => (
          <li
            key={p.id}
            className="flex justify-between items-center p-2 hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              {p.imagePath && (
                <img
                  src={`${API_URL}/images/Pharmacy/${p.imagePath}`}
                  alt={p.name}
                  className="w-10 h-10 rounded-full object-cover border-2"
                  loading="lazy"
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
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
              {formMode === "edit" ? "Apotheke bearbeiten" : "Neue Apotheke"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Logo */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Logo (JPG/PNG)
                </label>
                {logoPreview ? (
                  <div className="relative inline-block">
                    <img
                      className="mt-2 w-24 h-24 object-cover border rounded"
                      src={`${API_URL}/images/Pharmacy/${logoPreview}`}
                      alt="Logo preview"
                      loading="lazy"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRemoveImage(true);
                        setLogoPreview(null);
                        setForm((f) => ({ ...f, logoFile: "" }));
                      }}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={onLogoUpload}
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
                  className="w-full border p-2"
                  required
                />
              </div>

              {/* Beschreibung */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Beschreibung
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onChange}
                  rows={3}
                  className="w-full border p-2"
                />
              </div>

              {/* Öffnungszeiten */}
              <fieldset className="border p-4 rounded">
                <legend className="text-lg font-semibold">Öffnungszeiten</legend>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-sm font-medium">
                      Start-Tag
                    </label>
                    <select
                      name="startDay"
                      value={form.startDay}
                      onChange={onChange}
                      className="w-full border p-2"
                    >
                      <option value="">– wählen –</option>
                      {germanDays.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">End-Tag</label>
                    <select
                      name="endDay"
                      value={form.endDay}
                      onChange={onChange}
                      className="w-full border p-2"
                    >
                      <option value="">– wählen –</option>
                      {germanDays.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium">
                      Start-Zeit
                    </label>
                    <select
                      name="startTime"
                      value={form.startTime}
                      onChange={onChange}
                      className="w-full border p-2"
                    >
                      <option value="">– wählen –</option>
                      {halfHourTimes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">End-Zeit</label>
                    <select
                      name="endTime"
                      value={form.endTime}
                      onChange={onChange}
                      className="w-full border p-2"
                    >
                      <option value="">– wählen –</option>
                      {halfHourTimes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* Telefon & E-Mail */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Telefon</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    className="w-full border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">E-Mail</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    className="w-full border p-2"
                  />
                </div>
              </div>

              {/* Webseite */}
              <div>
                <label className="block text-sm font-medium">Webseite</label>
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={onChange}
                  className="w-full border p-2"
                />
              </div>

              {/* Adresse */}
              <div>
                <label className="block text-sm font-medium">Adresse</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  className="w-full border p-2"
                  required
                />
              </div>

              {/* Verifiziert */}
              <div>
                <label className="block text-sm font-medium">Verifiziert</label>
                <select
                  name="isVerified"
                  value={form.isVerified}
                  onChange={onChange}
                  className="w-full border p-2"
                >
                  {verifiedOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
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

      {/* Loader overlay */}
      {loading && <FullPageLoader />}
    </div>
  );
};

export default AdminPharmaciesContent;
