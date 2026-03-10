import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Search, Star, StarOff, UserX, Users } from "lucide-react";
import { Button } from "../../components/ui/button";
import { adminApi, type User } from "../../services/api";
import { toast } from "sonner";

const AdminCustomers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.users.getAll({
        page,
        limit: 20,
        search: search || undefined,
        role: roleFilter || undefined,
      });
      if (res.data) setUsers(res.data);
      if (res.pagination) setTotalPages(res.pagination.pages);
    } catch {
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleVip = async (user: User) => {
    try {
      await adminApi.users.toggleVip(user.id, {
        isVip: !user.isVip,
        vipDiscount: user.isVip ? 0 : 10,
      });
      toast.success(user.isVip ? "VIP removido" : "VIP activado");
      fetchUsers();
    } catch {
      toast.error("Error al cambiar estado VIP");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Desactivar este usuario?")) return;
    try {
      await adminApi.users.delete(id);
      toast.success("Usuario desactivado");
      fetchUsers();
    } catch {
      toast.error("Error al desactivar usuario");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Clientes</h1>
          <p className="text-white/50 text-sm">
            Gestión de usuarios y programa VIP
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            size={16}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-[#f5b400]/50 outline-none"
          />
        </form>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm outline-none"
        >
          <option value="">Todos los roles</option>
          <option value="customer">Cliente</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#f5b400]" />
        </div>
      ) : (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/50 text-xs uppercase tracking-wider px-6 py-4">
                    Usuario
                  </th>
                  <th className="text-left text-white/50 text-xs uppercase tracking-wider px-6 py-4">
                    Rol
                  </th>
                  <th className="text-left text-white/50 text-xs uppercase tracking-wider px-6 py-4">
                    VIP
                  </th>
                  <th className="text-right text-white/50 text-xs uppercase tracking-wider px-6 py-4">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f5b400]/20 flex items-center justify-center text-[#f5b400] text-xs font-bold">
                          {u.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {u.name}
                          </p>
                          <p className="text-white/40 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                          u.role === "admin"
                            ? "bg-red-500/20 text-red-400"
                            : u.role === "staff"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-white/10 text-white/60"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.isVip ? (
                        <span className="text-[#f5b400] text-sm font-bold flex items-center gap-1">
                          <Star size={14} fill="#f5b400" /> {u.vipDiscount}%
                        </span>
                      ) : (
                        <span className="text-white/30 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleVip(u)}
                          className="text-[#f5b400]/60 hover:text-[#f5b400]"
                          title={u.isVip ? "Quitar VIP" : "Hacer VIP"}
                        >
                          {u.isVip ? <StarOff size={16} /> : <Star size={16} />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(u.id)}
                          className="text-red-400/60 hover:text-red-400"
                          title="Desactivar"
                        >
                          <UserX size={16} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12 text-white/30">
                      <Users size={32} className="mx-auto mb-2" />
                      No se encontraron usuarios
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-white/10">
              <Button
                size="sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="text-white/50"
              >
                Anterior
              </Button>
              <span className="text-white/50 text-sm">
                {page} / {totalPages}
              </span>
              <Button
                size="sm"
                variant="ghost"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="text-white/50"
              >
                Siguiente
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
