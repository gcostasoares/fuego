/*  src/components/adminAppContentContent.tsx
    ─────────────────────────────────────────────────────────────────────────────
    Same UI/behaviour as before, now with key-mapping so back-end columns match.
*/

import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

/* ─────────── loader overlay ─────────── */
function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center
                    bg-white/70 backdrop-blur-sm">
      <Loader />
    </div>
  );
}

/* ─────────── type definitions ────────── */
interface AppContent {
  id: string;
  seoTitle: string;
  seoKeys: string;
  contentType: string | null;
  url: string;
  seoDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  imprint: string;
  dataProtection: string;
  cookiePolicy: string;
  shopSectionDescription: string;
  shopSectionTitle: string;
}
type Form = Omit<AppContent, "id">;

/* ─────────── helpers ────────── */
const defaultForm: Form = {
  seoTitle: "",
  seoKeys: "",
  contentType: "",
  url: "",
  seoDescription: "",
  aboutTitle: "",
  aboutDescription: "",
  imprint: "",
  dataProtection: "",
  cookiePolicy: "",
  shopSectionDescription: "",
  shopSectionTitle: "",
};

/** Convert DB row (Pascal-case) → camel-case used in the UI */
function rowToCamel(r: any): AppContent {
  return {
    id:                     r.id ?? r.Id,
    seoTitle:               r.seoTitle               ?? r.SeoTitle               ?? "",
    seoKeys:                r.seoKeys                ?? r.SeoKeys                ?? "",
    contentType:            r.contentType            ?? r.ContentType            ?? "",
    url:                    r.url                    ?? r.URL                    ?? "",
    seoDescription:         r.seoDescription         ?? r.SeoDescription         ?? "",
    aboutTitle:             r.aboutTitle             ?? r.AboutTitle             ?? "",
    aboutDescription:       r.aboutDescription       ?? r.AboutDescription       ?? "",
    imprint:                r.imprint                ?? r.Imprint                ?? "",
    dataProtection:         r.dataProtection         ?? r.DataProtection         ?? "",
    cookiePolicy:           r.cookiePolicy           ?? r.CookiePolicy           ?? "",
    shopSectionDescription: r.shopSectionDescription ?? r.ShopSectionDescription ?? "",
    shopSectionTitle:       r.shopSectionTitle       ?? r.ShopSectionTitle       ?? "",
  };
}

/** Convert camel-case form → Pascal-case payload expected by the API */
function formToPayload(f: Form) {
  return {
    SeoTitle:               f.seoTitle,
    SeoKeys:                f.seoKeys,
    ContentType:            f.contentType,
    URL:                     f.url,
    SeoDescription:         f.seoDescription,
    AboutTitle:             f.aboutTitle,
    AboutDescription:       f.aboutDescription,
    Imprint:                f.imprint,
    DataProtection:         f.dataProtection,
    CookiePolicy:           f.cookiePolicy,
    ShopSectionDescription: f.shopSectionDescription,
    ShopSectionTitle:       f.shopSectionTitle,
  };
}

export default function AdminAppContentContent() {
  const [rows, setRows]         = useState<AppContent[]>([]);
  const [selected, setSelected] = useState<AppContent | null>(null);
  const [form, setForm]         = useState<Form>(defaultForm);
  const [mode, setMode]         = useState<"add" | "edit">("add");
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const modalRef                = useRef<HTMLDivElement>(null);

  const ADMIN_KEY = localStorage.getItem("adminKey") || "";

  /* ─── list -------------------------------------------------------- */
  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/AppContent", {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const payload = res.data;
      const listArr: any[] = Array.isArray(payload)
        ? payload
        : payload.appContent ?? [];
      setRows(listArr.map(rowToCamel));
    } catch (err) {
      console.error(err);
      alert("Fehler beim Laden der App-Inhalte");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchContent(); }, []);

  /* ─── modal helpers ---------------------------------------------- */
  const openModal = (row?: AppContent) => {
    if (row) {
      setSelected(row);
      setForm(row);
      setMode("edit");
    } else {
      setSelected(null);
      setForm(defaultForm);
      setMode("add");
    }
    setOpen(true);
  };
  const closeModal = () => setOpen(false);

  /* ─── form change ------------------------------------------------- */
  const onChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  /* ─── save -------------------------------------------------------- */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = formToPayload(form);
      if (mode === "add") {
        await apiClient.post("/AppContent", payload, {
          headers: { "x-admin-key": ADMIN_KEY },
        });
      } else {
        await apiClient.put(`/AppContent/${selected!.id}`, payload, {
          headers: { "x-admin-key": ADMIN_KEY },
        });
      }
      await fetchContent();
      closeModal();
    } catch (err: any) {
      console.error(err);
      alert("Speichern fehlgeschlagen: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  /* ─── delete ------------------------------------------------------ */
  const onDelete = async (id: string) => {
    if (!confirm("Löschen?")) return;
    setLoading(true);
    try {
      await apiClient.delete(`/AppContent/${id}`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      await fetchContent();
    } catch {
      alert("Löschen fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────── JSX ───────────────────────────────── */
  return (
    <div>
      {/* header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">App-Content</h2>
        <Button onClick={() => openModal()}>Neuen Eintrag hinzufügen</Button>
      </div>

      {/* list */}
      <ul className="divide-y">
        {rows.map((r) => (
          <li
            key={r.id}
            className="flex justify-between items-center p-2 hover:bg-gray-50"
          >
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => openModal(r)}
            >
              {r.seoTitle || r.shopSectionTitle || r.id.slice(0, 8)}
            </span>
            <Button variant="destructive" onClick={() => onDelete(r.id)}>
              Löschen
            </Button>
          </li>
        ))}
      </ul>

      {/* modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-2xl max-h-[80vh] overflow-auto rounded-lg p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>

            <h3 className="text-2xl font-bold mb-4">
              {mode === "edit" ? "App-Content bearbeiten" : "Neuer App-Content"}
            </h3>

            <form onSubmit={onSubmit} className="space-y-4">
              {/* simple text inputs */}
              {([
                ["seoTitle", "SEO-Titel"],
                ["seoKeys", "SEO-Keywords"],
                ["contentType", "Content-Typ"],
                ["url", "URL"],
                ["seoDescription", "SEO-Beschreibung"],
                ["aboutTitle", "About-Titel"],
                ["shopSectionTitle", "Shop-Bereich-Titel"],
              ] as Array<[keyof Form, string]>).map(([key, label]) => (
                <div key={key as string}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input
                    name={key as string}
                    value={form[key] as string | undefined}
                    onChange={onChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}

              {/* big textareas */}
              {([
                ["aboutDescription", "About-Beschreibung"],
                ["imprint", "Impressum"],
                ["dataProtection", "Datenschutz"],
                ["cookiePolicy", "Cookie-Richtlinie"],
                ["shopSectionDescription", "Shop-Bereich-Beschreibung"],
              ] as Array<[keyof Form, string]>).map(([key, label]) => (
                <div key={key as string}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <textarea
                    name={key as string}
                    value={form[key] as string | undefined}
                    onChange={onChange}
                    rows={4}
                    className="w-full border p-2 rounded"
                  />
                </div>
              ))}

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

      {loading && <FullPageLoader />}
    </div>
  );
}
