import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/admin.service";

const AdminCollections: React.FC = () => {
  const [collections, setCollections] = useState<
    { name: string; count: number }[]
  >([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminService.listCollections();
      setCollections(res.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar las colecciones",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filteredCollections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = [...collections].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    if (!q) {
      return sorted;
    }

    return sorted.filter((collection) =>
      collection.name.toLowerCase().includes(q),
    );
  }, [collections, query]);

  return (
    <div className="space-y-5">
      <header className="rounded-2xl border border-amber-400/30 bg-[#2d1f0f]/75 p-5 text-amber-50 shadow-lg shadow-black/20">
        <h2 className="text-2xl font-bold text-amber-300">Colecciones</h2>
        <p className="mt-2 text-sm text-amber-100/80">
          Controla configuraciones, registros y mantenimiento dinámico de MongoDB
          desde una vista unificada.
        </p>
      </header>

      <section className="rounded-2xl border border-amber-500/20 bg-[#1f140a]/80 p-4 shadow-lg shadow-black/20">
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-[#2d1f0f] transition hover:bg-amber-400"
            onClick={() => void load()}
          >
            Recargar
          </button>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filtrar por nombre de colección"
            className="min-w-60 flex-1 rounded-lg border border-amber-300/30 bg-[#120d08] px-3 py-2 text-sm text-amber-50 placeholder:text-amber-200/50"
          />
        </div>
      </section>

      {error && (
        <div className="rounded-lg border border-rose-400/40 bg-rose-900/20 px-3 py-2 text-sm text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-amber-500/20 bg-[#1f140a]/80 p-6 text-sm text-amber-100/80">
          Cargando colecciones...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-amber-500/20 bg-[#1f140a]/80 shadow-lg shadow-black/20">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-[#2d1f0f]/90 text-amber-200">
              <tr>
                <th className="p-3 text-left font-semibold">Colección</th>
                <th className="p-3 text-left font-semibold">Registros</th>
                <th className="p-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-amber-50/90">
              {filteredCollections.map((c) => (
                <tr key={c.name} className="border-t border-amber-400/15">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">{c.count}</td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-lg border border-amber-300/40 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/20"
                        onClick={() =>
                          navigate(
                            `/admin/collections/${encodeURIComponent(c.name)}`,
                          )
                        }
                      >
                        Abrir
                      </button>
                      <button
                        className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-[#2d1f0f] transition hover:bg-amber-400"
                        onClick={() =>
                          navigate(
                            `/admin/collections/${encodeURIComponent(c.name)}?config=1`,
                          )
                        }
                      >
                        Configurar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCollections.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-sm text-amber-100/70">
                    No se encontraron colecciones para el filtro aplicado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCollections;
