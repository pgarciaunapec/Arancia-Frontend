import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, ShieldCheck, UserPlus, Users } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../types";

const COLORS = {
  primary: "#f5b400",
  secondary: "#2d1f0f",
  muted: "rgba(255,255,255,0.6)",
  border: "rgba(245, 180, 0, 0.2)",
};

const roleOptions: Array<{ value: User["role"]; label: string }> = [
  { value: "admin", label: "Admin" },
  { value: "staff", label: "Mesero" },
  { value: "customer", label: "Cliente" },
];

const roleBadgeClass: Record<User["role"], string> = {
  admin: "bg-red-500/20 text-red-300",
  staff: "bg-blue-500/20 text-blue-300",
  customer: "bg-emerald-500/20 text-emerald-300",
};

const AdminUsers: React.FC = () => {
  const { getAllUsers, updateUser, createUser } = useAuth();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | User["role"]>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    role: User["role"];
  }>({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const users = getAllUsers();

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setFeedback("");
    setIsSaving(true);

    const result = await createUser(formData);

    setIsSaving(false);

    if (!result.success) {
      setFeedback(result.error || "No se pudo crear el usuario.");
      return;
    }

    setFeedback("Usuario creado correctamente.");
    setFormData({ name: "", email: "", password: "", role: "customer" });
    setShowCreateModal(false);
  };

  const handleRoleChange = async (userId: string, role: User["role"]) => {
    setFeedback("");
    const result = await updateUser(userId, { role });

    if (!result.success) {
      setFeedback(result.error || "No se pudo actualizar el rol.");
      return;
    }

    setFeedback("Rol actualizado correctamente.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
          <p style={{ color: COLORS.muted }}>
            Crea cuentas manualmente y asigna roles de Admin, Mesero o Cliente.
          </p>
        </div>

        <Button
          className="flex items-center gap-2"
          onClick={() => {
            setFeedback("");
            setShowCreateModal(true);
          }}
        >
          <UserPlus size={16} /> Nuevo Usuario
        </Button>
      </div>

      <Card
        className="p-4 flex gap-3 flex-wrap items-center"
        style={{
          backgroundColor: COLORS.secondary,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 text-white/30" size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre o correo..."
            className="w-full bg-black/20 pl-9 pr-4 py-2 rounded-lg border text-white text-sm focus:ring-2 outline-none"
            style={{ borderColor: COLORS.border }}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(event) =>
            setRoleFilter(event.target.value as "all" | User["role"])
          }
          className="bg-black/20 border rounded-lg px-4 py-2 text-sm text-white"
          style={{ borderColor: COLORS.border }}
        >
          <option value="all">Todos los roles</option>
          {roleOptions.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
      </Card>

      {feedback && (
        <div className="rounded-lg border border-blue-400/30 bg-blue-400/10 px-3 py-2 text-sm text-blue-200">
          {feedback}
        </div>
      )}

      <Card
        style={{
          backgroundColor: COLORS.secondary,
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/60">
                <th className="p-4">Usuario</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Rol Actual</th>
                <th className="p-4">Asignar Rol</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b border-white/5"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
                        style={{
                          backgroundColor: "rgba(245,180,0,0.15)",
                          color: COLORS.primary,
                        }}
                      >
                        {user.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-white/50">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 text-white/80">
                    {user.isVIP ? "VIP" : "Regular"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-bold ${roleBadgeClass[user.role]}`}
                    >
                      {
                        roleOptions.find((role) => role.value === user.role)
                          ?.label
                      }
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(event) =>
                          void handleRoleChange(
                            user.id,
                            event.target.value as User["role"],
                          )
                        }
                        className="bg-black/20 border rounded-lg px-3 py-2 text-xs text-white"
                        style={{ borderColor: COLORS.border }}
                      >
                        {roleOptions.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>

                      <ShieldCheck
                        size={14}
                        style={{ color: COLORS.primary }}
                      />
                    </div>
                  </td>
                </motion.tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-white/40">
                    <Users size={28} className="mx-auto mb-2" />
                    No se encontraron usuarios para los filtros actuales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={() => setShowCreateModal(false)}
        >
          <Card
            className="w-full max-w-lg p-6"
            style={{
              backgroundColor: COLORS.secondary,
              border: `1px solid ${COLORS.border}`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-white mb-4">Crear Usuario</h2>

            <form className="space-y-4" onSubmit={handleCreateUser}>
              <input
                value={formData.name}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Nombre completo"
                required
                className="w-full bg-black/20 border rounded-lg px-3 py-2 text-white"
                style={{ borderColor: COLORS.border }}
              />

              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                placeholder="Correo electrónico"
                required
                className="w-full bg-black/20 border rounded-lg px-3 py-2 text-white"
                style={{ borderColor: COLORS.border }}
              />

              <input
                type="password"
                value={formData.password}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                placeholder="Contraseña (mínimo 6 caracteres)"
                required
                minLength={6}
                className="w-full bg-black/20 border rounded-lg px-3 py-2 text-white"
                style={{ borderColor: COLORS.border }}
              />

              <select
                value={formData.role}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    role: event.target.value as User["role"],
                  }))
                }
                className="w-full bg-black/20 border rounded-lg px-3 py-2 text-white"
                style={{ borderColor: COLORS.border }}
              >
                {roleOptions.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1" disabled={isSaving}>
                  {isSaving ? "Guardando..." : "Crear usuario"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-white/20 text-white/70"
                  onClick={() => setShowCreateModal(false)}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
