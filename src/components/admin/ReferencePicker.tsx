import React, { useEffect, useState } from "react";
import adminService from "../../services/admin.service";

type Option = {
  id: string;
  label: string;
};

interface ReferencePickerProps {
  collection: string;
  displayField: string;
  value?: string;
  onSelect: (id: string, option?: Record<string, unknown>) => void;
  disabled?: boolean;
}

const ReferencePicker: React.FC<ReferencePickerProps> = ({
  collection,
  displayField,
  value,
  onSelect,
  disabled,
}) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (disabled) {
      return;
    }

    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await adminService.listRecords(collection, {
          q: query,
          limit: 10,
          page: 1,
        });
        const docs = response.data.docs || [];
        setOptions(
          docs.map((doc) => {
            const id = String(doc._id || doc.id || "");
            const labelSource = doc[displayField];
            const label =
              typeof labelSource === "string"
                ? labelSource
                : labelSource !== undefined
                  ? JSON.stringify(labelSource)
                  : id;
            return { id, label };
          }),
        );
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
    };
  }, [collection, displayField, query, disabled]);

  return (
    <div className="space-y-2">
      <input
        type="text"
        placeholder={`Buscar en ${collection}`}
        value={query}
        disabled={disabled}
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
      />

      <select
        value={value || ""}
        disabled={disabled}
        onChange={(event) => {
          const selected = options.find(
            (item) => item.id === event.target.value,
          );
          onSelect(
            event.target.value,
            selected ? { label: selected.label } : undefined,
          );
        }}
        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
      >
        <option value="">Seleccionar referencia</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>

      {loading && (
        <p className="text-xs text-slate-500">Buscando referencias...</p>
      )}
    </div>
  );
};

export default ReferencePicker;
