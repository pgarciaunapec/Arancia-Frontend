import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import adminService from "../../services/admin.service";

const JsonEditorModal: React.FC<{
  visible: boolean;
  initial?: string;
  title?: string;
  onSave: (value: any) => void;
  onClose: () => void;
}> = ({ visible, initial = "", title = "Editor JSON", onSave, onClose }) => {
  const [value, setValue] = useState(initial);

  useEffect(() => setValue(initial), [initial]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded p-4 w-[80%] max-w-2xl">
        <h3 className="font-bold mb-2">{title}</h3>
        <textarea
          className="w-full h-64 p-2 border"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex gap-2 mt-3 justify-end">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>Cancelar</button>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => {
              try {
                const parsed = JSON.parse(value || "{}");
                onSave(parsed);
              } catch (err) {
                alert("JSON inválido: " + (err as Error).message);
              }
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminCollectionView: React.FC = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const showConfig = !!searchParams.get("config");

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [config, setConfig] = useState<any>(null);

  const [editorVisible, setEditorVisible] = useState(false);
  const [editorInitial, setEditorInitial] = useState("");
  const [editorTitle, setEditorTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!collection) return;
    const load = async () => {
      setLoading(true);
      try {
        const cfg = await adminService.getConfig(collection);
        setConfig(cfg.data);
      } catch (err) {
        console.error(err);
      }
      try {
        const res = await adminService.listRecords(collection, page, limit);
        setRecords(res.data.docs || []);
        setTotal(res.data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [collection, page, limit]);

  const openNew = () => {
    setEditingId(null);
    setEditorInitial("{}");
    setEditorTitle(`Crear en ${collection}`);
    setEditorVisible(true);
  };

  const openEdit = (rec: any) => {
    setEditingId(String(rec._id || rec.id || ""));
    setEditorInitial(JSON.stringify(rec, null, 2));
    setEditorTitle(`Editar ${collection}`);
    setEditorVisible(true);
  };

  const handleSave = async (payload: any) => {
    try {
      if (editingId) {
        await adminService.updateRecord(collection!, editingId, payload);
      } else {
        await adminService.createRecord(collection!, payload);
      }
      setEditorVisible(false);
      // reload
      const res = await adminService.listRecords(collection!, page, limit);
      setRecords(res.data.docs || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      alert("Error guardando registro: " + (err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar registro?")) return;
    try {
      await adminService.deleteRecord(collection!, id);
      const res = await adminService.listRecords(collection!, page, limit);
      setRecords(res.data.docs || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      alert("Error eliminando registro: " + (err as Error).message);
    }
  };

  const saveConfig = async (payload: any) => {
    try {
      await adminService.updateConfig(collection!, payload);
      alert("Configuración guardada");
    } catch (err) {
      alert("Error guardando configuración: " + (err as Error).message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Colección: {collection}</h2>

      <div className="mb-4">
        <button className="px-3 py-1 bg-green-600 text-white rounded mr-2" onClick={openNew}>Nuevo registro</button>
        <button
          className="px-3 py-1 bg-slate-600 text-white rounded"
          onClick={async () => {
            try {
              const cfg = await adminService.getConfig(collection!);
              setConfig(cfg.data);
              // open config editor using modal
              setEditorInitial(JSON.stringify(cfg.data, null, 2));
              setEditorTitle(`Configurar ${collection}`);
              setEditingId("__config__");
              setEditorVisible(true);
            } catch (err) {
              alert("Error cargando configuración: " + (err as Error).message);
            }
          }}
        >
          Editar configuración
        </button>
      </div>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="p-2">#</th>
                {(config?.fields || ["_id"]).filter((f: any) => f.visible !== false).map((f: any) => (
                  <th key={f.name} className="p-2">{f.label || f.name}</th>
                ))}
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, idx) => (
                <tr key={String(r._id || idx)} className="border-t">
                  <td className="p-2">{idx + 1}</td>
                  {(config?.fields || Object.keys(r)).filter((f: any) => f.visible !== false).map((f: any) => (
                    <td key={f.name} className="p-2">{String(r[f.name] ?? JSON.stringify(r[f.name]) ?? "")}</td>
                  ))}
                  <td className="p-2">
                    <button className="mr-2 px-2 py-1 bg-blue-600 text-white rounded" onClick={() => openEdit(r)}>Editar</button>
                    <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={() => handleDelete(String(r._id))}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <JsonEditorModal
        visible={editorVisible}
        initial={editorInitial}
        title={editorTitle}
        onClose={() => { setEditorVisible(false); setEditingId(null); }}
        onSave={(payload) => {
          if (editingId === "__config__") {
            saveConfig(payload);
            setEditorVisible(false);
            setEditingId(null);
            return;
          }
          void handleSave(payload);
        }}
      />
    </div>
  );
};

export default AdminCollectionView;
