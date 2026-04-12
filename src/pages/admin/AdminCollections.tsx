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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Colecciones de BD</h2>
      <p className="mb-4 text-sm text-slate-600">
        AdminConfig define las columnas, validaciones y campos editables de cada
        colección.
      </p>

      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            className="rounded border border-slate-300 px-3 py-1 text-sm"
            onClick={() => void load()}
          >
            Recargar
          </button>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filtrar colecciones..."
            className="rounded border border-slate-300 px-3 py-1 text-sm min-w-[220px]"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2">Colección</th>
                <th className="text-left p-2">Registros</th>
                <th className="text-left p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCollections.map((c) => (
                <tr key={c.name} className="border-t">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.count}</td>
                  <td className="p-2">
                    <button
                      className="mr-2 px-3 py-1 bg-slate-600 text-white rounded"
                      onClick={() =>
                        navigate(
                          `/admin/collections/${encodeURIComponent(c.name)}`,
                        )
                      }
                    >
                      Abrir
                    </button>
                    <button
                      className="px-3 py-1 bg-amber-600 text-white rounded"
                      onClick={() =>
                        navigate(
                          `/admin/collections/${encodeURIComponent(c.name)}?config=1`,
                        )
                      }
                    >
                      Configurar
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCollections.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-4 text-sm text-slate-500">
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
