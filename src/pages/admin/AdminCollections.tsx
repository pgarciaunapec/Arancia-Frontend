import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminService from "../../services/admin.service";

const AdminCollections: React.FC = () => {
  const [collections, setCollections] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminService.listCollections();
        setCollections(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Colecciones de BD</h2>
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
              {collections.map((c) => (
                <tr key={c.name} className="border-t">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.count}</td>
                  <td className="p-2">
                    <button
                      className="mr-2 px-3 py-1 bg-slate-600 text-white rounded"
                      onClick={() => navigate(`/admin/collections/${encodeURIComponent(c.name)}`)}
                    >
                      Abrir
                    </button>
                    <button
                      className="px-3 py-1 bg-amber-600 text-white rounded"
                      onClick={() => navigate(`/admin/collections/${encodeURIComponent(c.name)}?config=1`)}
                    >
                      Configurar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCollections;
