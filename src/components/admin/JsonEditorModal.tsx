import React, { useEffect, useState } from "react";

interface JsonEditorModalProps {
  visible: boolean;
  title: string;
  initialValue: string;
  onClose: () => void;
  onSave: (value: Record<string, unknown>) => void;
}

const JsonEditorModal: React.FC<JsonEditorModalProps> = ({
  visible,
  title,
  initialValue,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(initialValue);
    setError("");
  }, [initialValue, visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          Fallback JSON para estructuras arbitrarias
        </p>

        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="mt-4 h-72 w-full rounded border border-slate-200 bg-slate-950 p-3 font-mono text-xs text-slate-100"
        />

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-300 px-4 py-2 text-sm"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              try {
                const parsed = JSON.parse(value) as Record<string, unknown>;
                onSave(parsed);
              } catch (err) {
                setError(err instanceof Error ? err.message : "JSON inválido");
              }
            }}
            className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default JsonEditorModal;
