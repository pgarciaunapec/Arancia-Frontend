import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import JsonEditorModal from "../../components/admin/JsonEditorModal";
import RecordForm from "../../components/admin/RecordForm";
import { useAdminConfig } from "../../hooks/useAdminConfig";
import { useCollectionRecords } from "../../hooks/useCollectionRecords";
import adminService from "../../services/admin.service";
import type { AuditLogEntry } from "../../types/admin";

const serializeCell = (value: unknown) => {
  if (value === undefined || value === null) return "-";
  if (typeof value === "object") {
    try {
      const text = JSON.stringify(value);
      return text.length > 140 ? `${text.slice(0, 140)}...` : text;
    } catch {
      return "[Objeto]";
    }
  }
  const text = String(value);
  return text.length > 140 ? `${text.slice(0, 140)}...` : text;
};

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
};

const AdminCollectionView: React.FC = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();

  const {
    config,
    loading: configLoading,
    error: configError,
    reload: reloadConfig,
    saveConfig,
  } = useAdminConfig(collection);

  const {
    records,
    loading,
    error,
    query,
    pagination,
    refresh,
    setPage,
    setSearch,
  } = useCollectionRecords(collection, 20);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [configEditorVisible, setConfigEditorVisible] = useState(false);
  const [auditVisible, setAuditVisible] = useState(false);
  const [auditRows, setAuditRows] = useState<AuditLogEntry[]>([]);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importMappingText, setImportMappingText] = useState("{}");
  const [importConflictMode, setImportConflictMode] = useState<
    "skip" | "replace" | "merge"
  >("skip");

  useEffect(() => {
    if (!searchParams.get("config")) {
      return;
    }
    setConfigEditorVisible(true);
  }, [searchParams]);

  useEffect(() => {
    setSelectedIds([]);
  }, [records]);

  const visibleFields = useMemo(() => {
    if (config?.fields?.length) {
      return config.fields
        .filter((field) => field.visible !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }

    if (records.length === 0) {
      return [];
    }

    return Object.keys(records[0]).map((name, index) => ({
      name,
      label: name,
      order: index,
      visible: true,
      editable: name !== "_id",
      type: "string" as const,
    }));
  }, [config, records]);

  const toggleSelection = (id: string) => {
    if (!id) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const selectableIds = useMemo(
    () =>
      records
        .map((row) => String(row._id || row.id || ""))
        .filter((id) => id.length > 0),
    [records],
  );

  const submitRecord = async (payload: Record<string, unknown>) => {
    if (!collection) return;

    setSubmitting(true);
    setMessage("");

    try {
      const fileEntries = Object.entries(payload).filter(
        ([, value]) => value instanceof File,
      );
      const cleanPayload = Object.entries(payload).reduce<
        Record<string, unknown>
      >((acc, [key, value]) => {
        if (!(value instanceof File)) {
          acc[key] = value;
        }
        return acc;
      }, {});

      const editedId = editingRecord?._id ? String(editingRecord._id) : null;
      const saved = editedId
        ? await adminService.updateRecord(collection, editedId, cleanPayload)
        : await adminService.createRecord(collection, cleanPayload);

      const targetId = String(saved.data._id || editedId || "");

      if (targetId && fileEntries.length > 0) {
        for (const [fieldName, value] of fileEntries) {
          await adminService.uploadAsset({
            collection,
            id: targetId,
            file: value as File,
            field: fieldName,
          });
        }
      }

      setFormVisible(false);
      setEditingRecord(null);
      setMessage(
        editedId
          ? "Registro actualizado correctamente"
          : "Registro creado correctamente",
      );
      await refresh();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "No se pudo guardar el registro",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteOne = async (id: string) => {
    if (!collection) return;
    if (
      !window.confirm("Esta acción eliminará el registro. ¿Deseas continuar?")
    ) {
      return;
    }

    try {
      await adminService.deleteRecord(collection, id);
      setMessage("Registro eliminado");
      await refresh();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "No se pudo eliminar el registro",
      );
    }
  };

  const runBulkDelete = async () => {
    if (!collection || selectedIds.length === 0) {
      return;
    }
    if (
      !window.confirm(
        `Se eliminarán ${selectedIds.length} registros. ¿Confirmas?`,
      )
    ) {
      return;
    }

    try {
      await adminService.bulkAction(collection, {
        action: "delete",
        ids: selectedIds,
      });
      setMessage(`Se eliminaron ${selectedIds.length} registros`);
      setSelectedIds([]);
      await refresh();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Error en borrado masivo",
      );
    }
  };

  const runBulkUpdate = async () => {
    if (!collection || selectedIds.length === 0) {
      return;
    }

    const field = window.prompt("Campo a actualizar (ej: status)");
    if (!field) return;
    const rawValue = window.prompt("Nuevo valor para el campo");
    if (rawValue === null) return;

    try {
      await adminService.bulkAction(collection, {
        action: "update",
        ids: selectedIds,
        payload: { [field]: rawValue },
      });
      setMessage(`Se actualizaron ${selectedIds.length} registros`);
      setSelectedIds([]);
      await refresh();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Error en actualización masiva",
      );
    }
  };

  const handleImport = async () => {
    if (!collection || !importFile) {
      return;
    }

    let mapping: Record<string, string>;
    try {
      mapping = JSON.parse(importMappingText) as Record<string, string>;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Mapping JSON inválido");
      return;
    }

    try {
      const result = await adminService.importRecords({
        collection,
        file: importFile,
        mapping,
        onConflict: importConflictMode,
      });
      setMessage(
        `Importación completada: ${result.data.inserted} insertados, ${result.data.updated} actualizados, ${result.data.errors.length} errores`,
      );
      await refresh();
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Error importando archivo",
      );
    }
  };

  const handleExport = async (format: "csv" | "json") => {
    if (!collection) return;

    try {
      const { blob, fileName } = await adminService.exportRecords({
        collection,
        format,
        fields: visibleFields.map((field) => field.name),
        q: query.q,
      });
      downloadBlob(blob, fileName);
      setMessage(`Exportación ${format.toUpperCase()} generada`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "No se pudo exportar");
    }
  };

  const openAudit = async () => {
    if (!collection) return;
    try {
      const response = await adminService.listAudit({ collection, limit: 50 });
      setAuditRows(response.data || []);
      setAuditVisible(true);
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "No se pudo cargar auditoría",
      );
    }
  };

  if (!collection) {
    return (
      <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm">
        Colección no definida
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">
          Colección: {collection}
        </h2>
        <p className="text-sm text-slate-600">
          Vista dinámica basada en AdminConfig. Puedes crear, editar, borrar,
          importar, exportar y revisar auditoría.
        </p>
      </header>

      {(error || configError || message) && (
        <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          {message || error || configError}
        </div>
      )}

      <section className="rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded bg-emerald-700 px-3 py-2 text-sm text-white"
            onClick={() => {
              setEditingRecord(null);
              setFormVisible(true);
            }}
          >
            Nuevo
          </button>
          <button
            className="rounded bg-slate-800 px-3 py-2 text-sm text-white"
            onClick={() => setConfigEditorVisible(true)}
          >
            Editar configuración
          </button>
          <button
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={openAudit}
          >
            Ver auditoría
          </button>
          <button
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={runBulkUpdate}
            disabled={selectedIds.length === 0}
          >
            Bulk update
          </button>
          <button
            className="rounded border border-red-300 px-3 py-2 text-sm text-red-700"
            onClick={runBulkDelete}
            disabled={selectedIds.length === 0}
          >
            Bulk delete
          </button>
          <button
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() => void refresh()}
          >
            Recargar
          </button>
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={query.q || ""}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Búsqueda de texto"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() => void handleExport("csv")}
          >
            Exportar CSV
          </button>
          <button
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() => void handleExport("json")}
          >
            Exportar JSON
          </button>
          <div className="text-xs text-slate-500">
            Seleccionados: {selectedIds.length}
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <input
            type="file"
            accept=".csv,.json"
            onChange={(event) => setImportFile(event.target.files?.[0] || null)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={importConflictMode}
            onChange={(event) =>
              setImportConflictMode(
                event.target.value as "skip" | "replace" | "merge",
              )
            }
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="skip">onConflict: skip</option>
            <option value="replace">onConflict: replace</option>
            <option value="merge">onConflict: merge</option>
          </select>
          <button
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            onClick={() => void handleImport()}
          >
            Importar archivo
          </button>
          <textarea
            value={importMappingText}
            onChange={(event) => setImportMappingText(event.target.value)}
            rows={2}
            className="rounded border border-slate-300 bg-slate-50 px-3 py-2 text-xs"
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {loading || configLoading ? (
          <div className="p-4 text-sm text-slate-600">
            Cargando registros...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectableIds.length > 0 &&
                        selectedIds.length === selectableIds.length
                      }
                      onChange={(event) =>
                        setSelectedIds(
                          event.target.checked ? selectableIds : [],
                        )
                      }
                    />
                  </th>
                  {visibleFields.map((field) => (
                    <th
                      key={field.name}
                      className="px-3 py-2 text-left font-medium"
                    >
                      {field.label || field.name}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((row, rowIndex) => {
                  const id = String(row._id || row.id || "");
                  return (
                    <tr key={id || `${collection}-${rowIndex}`}>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={id.length > 0 && selectedIds.includes(id)}
                          disabled={id.length === 0}
                          onChange={() => toggleSelection(id)}
                        />
                      </td>
                      {visibleFields.map((field) => (
                        <td
                          key={field.name}
                          className="px-3 py-2 text-slate-700"
                        >
                          {serializeCell(row[field.name])}
                        </td>
                      ))}
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            className="rounded border border-slate-300 px-2 py-1 text-xs"
                            onClick={() => {
                              setEditingRecord(row);
                              setFormVisible(true);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="rounded border border-red-300 px-2 py-1 text-xs text-red-700"
                            onClick={() => void deleteOne(id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <span>
            Página {pagination.page} de {pagination.totalPages} · Total{" "}
            {pagination.total}
          </span>
          <div className="flex gap-2">
            <button
              className="rounded border border-slate-300 px-2 py-1"
              disabled={pagination.page <= 1}
              onClick={() => setPage(pagination.page - 1)}
            >
              Anterior
            </button>
            <button
              className="rounded border border-slate-300 px-2 py-1"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(pagination.page + 1)}
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>

      {formVisible && config && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-4">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">
              {editingRecord ? "Editar registro" : "Nuevo registro"}
            </h3>
            <RecordForm
              config={config}
              initialData={editingRecord || undefined}
              disabled={submitting}
              submitLabel={submitting ? "Guardando..." : "Guardar"}
              onCancel={() => {
                setFormVisible(false);
                setEditingRecord(null);
              }}
              onSubmit={submitRecord}
            />
          </div>
        </div>
      )}

      <JsonEditorModal
        visible={configEditorVisible}
        title={`Configurar colección ${collection}`}
        initialValue={JSON.stringify(config || {}, null, 2)}
        onClose={() => setConfigEditorVisible(false)}
        onSave={(value) => {
          void saveConfig(value as Record<string, unknown>).then(async () => {
            setConfigEditorVisible(false);
            await reloadConfig();
            setMessage("Configuración actualizada");
          });
        }}
      />

      {auditVisible && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Audit Log · {collection}
              </h3>
              <button
                className="rounded border border-slate-300 px-3 py-1 text-sm"
                onClick={() => setAuditVisible(false)}
              >
                Cerrar
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left">Fecha</th>
                    <th className="px-3 py-2 text-left">Acción</th>
                    <th className="px-3 py-2 text-left">Usuario</th>
                    <th className="px-3 py-2 text-left">Doc ID</th>
                    <th className="px-3 py-2 text-left">Detalle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditRows.map((row) => (
                    <tr key={row._id || `${row.timestamp}-${row.action}`}>
                      <td className="px-3 py-2">
                        {new Date(row.timestamp).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">{row.action}</td>
                      <td className="px-3 py-2">{row.userEmail}</td>
                      <td className="px-3 py-2">{row.docId || "-"}</td>
                      <td className="px-3 py-2">
                        <pre className="max-h-32 overflow-auto rounded bg-slate-900 p-2 text-xs text-slate-100">
                          {JSON.stringify(row.diff || {}, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCollectionView;
