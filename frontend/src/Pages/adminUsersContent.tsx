import React, { useEffect, useState, useRef } from "react";
import apiClient from "@/Apis/apiService";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string | null;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  isAdmin: boolean;
}

interface Form {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  isAdmin: boolean;
}

const defaultForm: Form = {
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
  emailConfirmed: false,
  phoneNumber: "",
  twoFactorEnabled: false,
  lockoutEnabled: false,
  isAdmin: false,
};

export default function AdminUsersContent() {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm] = useState<Form>(defaultForm);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [resetting, setResetting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const headers = { "x-admin-key": localStorage.getItem("adminKey") || "" };

  const fetchUsers = async () => {
    try {
      const resp = await apiClient.get<User[]>('/Users', { headers });
      setUsers(resp.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = (m: 'add' | 'edit', user?: User) => {
    setMode(m);
    setResetting(false);
    setShowPassword(false);
    setShowConfirm(false);

    if (m === 'edit' && user) {
      setSelected(user);
      setForm({
        userName: user.userName,
        email: user.email,
        password: '',
        confirmPassword: '',
        emailConfirmed: user.emailConfirmed,
        phoneNumber: user.phoneNumber || '',
        twoFactorEnabled: user.twoFactorEnabled,
        lockoutEnabled: user.lockoutEnabled,
        isAdmin: user.isAdmin,
      });
    } else {
      setSelected(null);
      setForm(defaultForm);
    }

    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((mode === 'add' || resetting) && form.password !== form.confirmPassword) {
      alert('Passwörter müssen übereinstimmen.');
      return;
    }

    try {
      if (mode === 'add') {
        await apiClient.post(
          '/Users',
          { userName: form.userName, email: form.email, password: form.password, isAdmin: form.isAdmin },
          { headers }
        );
      } else if (mode === 'edit' && selected) {
        const payload: any = {
          userName: form.userName,
          email: form.email,
          emailConfirmed: form.emailConfirmed,
          phoneNumber: form.phoneNumber,
          twoFactorEnabled: form.twoFactorEnabled,
          lockoutEnabled: form.lockoutEnabled,
          isAdmin: form.isAdmin,
        };
        if (resetting) payload.password = form.password;

        await apiClient.put(
          `/Users/${selected.id}`,
          payload,
          { headers: { 'Content-Type': 'application/json', ...headers } }
        );
      }

      await fetchUsers();
      closeModal();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Speichern fehlgeschlagen');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Löschen?')) return;
    try {
      await apiClient.delete(`/Users/${id}`, { headers });
      await fetchUsers();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Löschen fehlgeschlagen');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Benutzer verwalten</h2>
        <Button onClick={() => openModal('add')}>Neuen Benutzer</Button>
      </div>

      <ul className="divide-y">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex justify-between items-center p-2 hover:bg-gray-50"
          >
            <div className="cursor-pointer" onClick={() => openModal('edit', u)}>
              <span className="font-medium">{u.userName}</span>
              <span className="ml-2 text-gray-600">({u.email})</span>
            </div>
            <Button variant="destructive" onClick={() => remove(u.id)}>
              Löschen
            </Button>
          </li>
        ))}
      </ul>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={closeModal}
            >
              ×
            </button>
            <h3 className="text-2xl font-bold mb-4">
              {mode === 'add' ? 'Neuen Benutzer' : 'Benutzer bearbeiten'}
            </h3>

            <form onSubmit={submit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium">Username</label>
                <input
                  name="userName"
                  value={form.userName}
                  onChange={onChange}
                  required
                  className="w-full border p-2"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium">E-Mail</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  className="w-full border p-2"
                />
              </div>

              {/* Reset toggle in edit */}
              {mode === 'edit' && (
                <Button
                  size="sm"
                  variant={resetting ? 'outline' : 'secondary'}
                  onClick={() => setResetting((r) => !r)}
                >
                  {resetting ? 'Abbrechen' : 'Passwort zurücksetzen'}
                </Button>
              )}

              {/* Password fields */}
              {(mode === 'add' || resetting) && (
                <>
                  <div>
                    <label className="block text-sm font-medium">Passwort</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={onChange}
                        required
                        className="w-full border p-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-2 text-sm text-gray-600"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Passwort bestätigen</label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={onChange}
                        required
                        className="w-full border p-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((s) => !s)}
                        className="absolute right-2 top-2 text-sm text-gray-600"
                      >
                        {showConfirm ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Flags & Admin */}
              {mode === 'edit' && !resetting && (
                <>
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="emailConfirmed"
                        checked={form.emailConfirmed}
                        onChange={onChange}
                        className="mr-2"
                      />
                      E-Mail bestätigt
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Telefon</label>
                    <input
                      name="phoneNumber"
                      value={form.phoneNumber}
                      onChange={onChange}
                      className="w-full border p-2"
                    />
                  </div>
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="twoFactorEnabled"
                        checked={form.twoFactorEnabled}
                        onChange={onChange}
                        className="mr-2"
                      />
                      Zwei-Faktor aktiviert
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="lockoutEnabled"
                        checked={form.lockoutEnabled}
                        onChange={onChange}
                        className="mr-2"
                      />
                      Lockout aktiviert
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="isAdmin"
                        checked={form.isAdmin}
                        onChange={onChange}
                        className="mr-2"
                      />
                      Administrator
                    </label>
                  </div>
                </>
              )}

              {/* Submit */}
              <div className="flex justify-end space-x-4 mt-4">
                <Button type="submit">
                  {mode === 'add'
                    ? 'Hinzufügen'
                    : resetting
                    ? 'Passwort speichern'
                    : 'Speichern'}
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
