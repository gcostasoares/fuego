import React, { useEffect, useState, useRef } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";

interface Article {
  id: string;
  title: string;
  content: string;
  url: string;
  date: string;
  imagePath: string | null;
}

const defaultFormData = {
  title: "",
  content: "",
  url: "",
  date: "",
};

export default function AdminArticlesContent() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selected, setSelected] = useState<Article | null>(null);
  const [form, setForm] = useState(defaultFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const API_URL = "https://fuego-ombm.onrender.com";
  const headers = { "x-admin-key": localStorage.getItem("adminKey") || "" };

  /** display without numeric prefix */
  const stripPrefix = (t: string) => t.replace(/^\d+\s*-\s*/, "");

  /** fetch from admin GET /Articles */
  const fetchArticles = async () => {
    try {
      const resp = await apiClient.get("/Articles", { headers });
      setArticles(resp.data);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  /** open modal for add/edit */
  const openModal = (a?: Article) => {
    if (a) {
      setSelected(a);
      setForm({
        title: stripPrefix(a.title),
        content: a.content,
        url: a.url,
        date: a.date.slice(0, 10),
      });
      setImagePreview(a.imagePath);
      setFormMode("edit");
    } else {
      setSelected(null);
      setForm(defaultFormData);
      setImagePreview(null);
      setFormMode("add");
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      return alert("Nur JPG/PNG erlaubt");
    }
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  /** create or update */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title.trim() || "(Ohne Titel)");
    fd.append("content", form.content);
    fd.append("url", form.url);
    fd.append("date", form.date);
    fd.append("tagIds", "[]");
    if (selectedFile) fd.append("file", selectedFile);
    else if (formMode === "edit" && imagePreview === null)
      fd.append("clearImage", "true");

    try {
      if (formMode === "add") {
        await apiClient.post("/Articles", fd, {
          headers: { "Content-Type": "multipart/form-data", ...headers },
        });
      } else if (selected) {
        await apiClient.put(`/Articles/${selected.id}`, fd, {
          headers: { "Content-Type": "multipart/form-data", ...headers },
        });
      }
      await fetchArticles();
      closeModal();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Speichern fehlgeschlagen");
    }
  };

  /** delete */
  const onDelete = async (id: string) => {
    if (!confirm("Löschen?")) return;
    try {
      await apiClient.delete(`/Articles/${id}`, { headers });
      await fetchArticles();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Löschen fehlgeschlagen");
    }
  };

  /** drag & drop → PUT /Articles/reorder */
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const updated = Array.from(articles);
    const [moved] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, moved);
    setArticles(updated);

    try {
      const order = updated.map((a, i) => ({
        id: a.id,
        position: i + 1,
      }));
      await apiClient.put("/Articles/reorder", { order }, { headers });
      await fetchArticles();
    } catch (err) {
      console.error("Reorder failed:", err);
      alert("Reihenfolge konnte nicht gespeichert werden.");
      await fetchArticles();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Articles</h2>
        <Button onClick={() => openModal()}>Neuen Artikel hinzufügen</Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="articles-list">
          {(prov) => (
            <ul ref={prov.innerRef} {...prov.droppableProps} className="divide-y">
              {articles.map((a, idx) => (
                <Draggable key={a.id} draggableId={a.id} index={idx}>
                  {(p) => (
                    <li
                      ref={p.innerRef}
                      {...p.draggableProps}
                      {...p.dragHandleProps}
                      className="flex justify-between items-center p-2 hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        {a.imagePath && (
                          <img
                            src={`${API_URL}/images/Articles/${a.imagePath}`}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border-2"
                            loading="lazy"
                          />
                        )}
                        <span
                          className="cursor-pointer text-blue-600 hover:underline"
                          onClick={() => openModal(a)}
                        >
                          {stripPrefix(a.title)}
                        </span>
                      </div>
                      <Button variant="destructive" onClick={() => onDelete(a.id)}>
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
      </DragDropContext>

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
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4">
              {formMode === "edit" ? "Artikel bearbeiten" : "Neuen Artikel"}
            </h3>
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Image Picker */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bild (JPG/PNG)
                </label>
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={
                        selectedFile
                          ? imagePreview
                          : `${API_URL}/images/Articles/${imagePreview}`
                      }
                      alt="Vorschau"
                      className="w-24 h-24 object-cover rounded-full border-2"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-0 right-0 bg-white rounded-full p-1 text-red-500 shadow"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={onImageUpload}
                  />
                )}
              </div>

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

              {/* Content */}
              <div>
                <label className="block text-sm font-medium">Inhalt</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={onChange}
                  rows={4}
                  className="w-full border p-2"
                  required
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-sm font-medium">Link</label>
                <input
                  name="url"
                  value={form.url}
                  onChange={onChange}
                  className="w-full border p-2"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium">Datum</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={onChange}
                  className="w-full border p-2"
                  required
                />
              </div>

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
    </div>
  );
}
