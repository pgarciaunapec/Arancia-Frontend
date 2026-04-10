import React, { useEffect, useMemo, useState } from "react";
import type { AdminConfig, FieldConfig } from "../../types/admin";
import ReferencePicker from "./ReferencePicker";

type FormValue =
  | string
  | number
  | boolean
  | File
  | null
  | Record<string, unknown>
  | unknown[];

type Props = {
  config: AdminConfig;
  initialData?: Record<string, unknown>;
  onSubmit: (payload: Record<string, unknown>) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  disabled?: boolean;
};

const normalizeDateValue = (input: unknown): string => {
  if (!input) return "";
  const date = new Date(String(input));
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const normalizeDateTimeValue = (input: unknown): string => {
  if (!input) return "";
  const date = new Date(String(input));
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
};

const fieldLabel = (field: FieldConfig) => field.label || field.name;

const RecordForm: React.FC<Props> = ({
  config,
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Guardar",
  disabled,
}) => {
  const [useJsonFallback, setUseJsonFallback] = useState(false);
  const [jsonText, setJsonText] = useState("{}");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [values, setValues] = useState<Record<string, FormValue>>({});

  const orderedFields = useMemo(
    () => [...config.fields].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [config.fields],
  );

  useEffect(() => {
    const nextValues: Record<string, FormValue> = {};
    orderedFields.forEach((field) => {
      const source = initialData?.[field.name];
      if (field.type === "date") {
        nextValues[field.name] = normalizeDateValue(source);
        return;
      }
      if (field.type === "datetime") {
        nextValues[field.name] = normalizeDateTimeValue(source);
        return;
      }
      if (source !== undefined) {
        nextValues[field.name] = source as FormValue;
        return;
      }
      nextValues[field.name] = field.type === "boolean" ? false : "";
    });

    setValues(nextValues);
    setJsonText(JSON.stringify(initialData || {}, null, 2));
  }, [orderedFields, initialData]);

  const validateField = (
    field: FieldConfig,
    value: FormValue,
  ): string | null => {
    const stringValue = typeof value === "string" ? value.trim() : value;

    if (
      field.required &&
      (stringValue === "" || stringValue === null || stringValue === undefined)
    ) {
      return `El campo ${fieldLabel(field)} es obligatorio`;
    }

    if (
      field.validators?.pattern &&
      typeof stringValue === "string" &&
      stringValue !== ""
    ) {
      const regex = new RegExp(field.validators.pattern);
      if (!regex.test(stringValue)) {
        return `El campo ${fieldLabel(field)} no cumple el formato esperado`;
      }
    }

    if (typeof stringValue === "number") {
      if (
        field.validators?.min !== undefined &&
        stringValue < field.validators.min
      ) {
        return `El valor mínimo para ${fieldLabel(field)} es ${field.validators.min}`;
      }
      if (
        field.validators?.max !== undefined &&
        stringValue > field.validators.max
      ) {
        return `El valor máximo para ${fieldLabel(field)} es ${field.validators.max}`;
      }
    }

    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (useJsonFallback) {
      try {
        const parsed = JSON.parse(jsonText) as Record<string, unknown>;
        await onSubmit(parsed);
      } catch (err) {
        setErrors({
          json: err instanceof Error ? err.message : "JSON inválido",
        });
      }
      return;
    }

    const nextErrors: Record<string, string> = {};

    orderedFields.forEach((field) => {
      const error = validateField(field, values[field.name]);
      if (error) {
        nextErrors[field.name] = error;
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = Object.entries(values).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        if (value === "" || value === undefined) {
          return acc;
        }
        if (typeof value === "string") {
          acc[key] = value.trim();
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {},
    );

    setErrors({});
    await onSubmit(payload);
  };

  const renderFieldInput = (field: FieldConfig) => {
    const value = values[field.name];
    const readOnly = disabled || field.editable === false;

    if (field.type === "enum") {
      return (
        <select
          aria-label={fieldLabel(field)}
          value={typeof value === "string" ? value : ""}
          disabled={readOnly}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
          }
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">Seleccionar</option>
          {(field.enumOptions || []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "number") {
      return (
        <input
          aria-label={fieldLabel(field)}
          type="number"
          value={typeof value === "number" ? value : Number(value || 0)}
          disabled={readOnly}
          onChange={(event) =>
            setValues((prev) => ({
              ...prev,
              [field.name]:
                event.target.value === "" ? "" : Number(event.target.value),
            }))
          }
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      );
    }

    if (field.type === "boolean") {
      return (
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            aria-label={fieldLabel(field)}
            type="checkbox"
            checked={Boolean(value)}
            disabled={readOnly}
            onChange={(event) =>
              setValues((prev) => ({
                ...prev,
                [field.name]: event.target.checked,
              }))
            }
          />
          Activado
        </label>
      );
    }

    if (field.type === "date") {
      return (
        <input
          aria-label={fieldLabel(field)}
          type="date"
          value={typeof value === "string" ? value : ""}
          disabled={readOnly}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
          }
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      );
    }

    if (field.type === "datetime") {
      return (
        <input
          aria-label={fieldLabel(field)}
          type="datetime-local"
          value={typeof value === "string" ? value : ""}
          disabled={readOnly}
          onChange={(event) =>
            setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
          }
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      );
    }

    if (field.type === "reference" && field.reference) {
      return (
        <ReferencePicker
          collection={field.reference.collection}
          displayField={field.reference.displayField}
          value={typeof value === "string" ? value : ""}
          disabled={readOnly}
          onSelect={(id) =>
            setValues((prev) => ({ ...prev, [field.name]: id }))
          }
        />
      );
    }

    if (field.type === "file" || field.type === "image") {
      return (
        <div className="space-y-2">
          <input
            aria-label={fieldLabel(field)}
            type="file"
            disabled={readOnly}
            accept={field.type === "image" ? "image/*" : undefined}
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setValues((prev) => ({ ...prev, [field.name]: file }));
            }}
            className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
          />
          {value instanceof File && (
            <p className="text-xs text-slate-500">
              Archivo seleccionado: {value.name}
            </p>
          )}
          {typeof value === "string" && value && (
            <p className="text-xs text-slate-500">Valor actual: {value}</p>
          )}
        </div>
      );
    }

    if (field.type === "array" || field.type === "object") {
      const asString =
        typeof value === "string"
          ? value
          : JSON.stringify(value === undefined ? {} : value, null, 2);
      return (
        <textarea
          aria-label={fieldLabel(field)}
          value={asString}
          disabled={readOnly}
          onChange={(event) => {
            const raw = event.target.value;
            try {
              const parsed = JSON.parse(raw);
              setValues((prev) => ({ ...prev, [field.name]: parsed }));
            } catch {
              setValues((prev) => ({ ...prev, [field.name]: raw }));
            }
          }}
          rows={4}
          className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
        />
      );
    }

    return (
      <input
        aria-label={fieldLabel(field)}
        type="text"
        value={
          typeof value === "string"
            ? value
            : value === null
              ? ""
              : String(value || "")
        }
        disabled={readOnly}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, [field.name]: event.target.value }))
        }
        className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm"
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Formulario generado desde AdminConfig
        </p>
        <button
          type="button"
          onClick={() => setUseJsonFallback((prev) => !prev)}
          className="rounded border border-slate-300 px-3 py-1 text-xs text-slate-700"
        >
          {useJsonFallback ? "Volver al formulario" : "Usar fallback JSON"}
        </button>
      </div>

      {useJsonFallback ? (
        <div className="space-y-2">
          <textarea
            aria-label="JSON Fallback"
            value={jsonText}
            onChange={(event) => setJsonText(event.target.value)}
            rows={12}
            className="w-full rounded border border-slate-300 bg-slate-950 p-3 font-mono text-xs text-slate-100"
          />
          {errors.json && <p className="text-xs text-red-600">{errors.json}</p>}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orderedFields
            .filter((field) => field.visible !== false)
            .map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  {fieldLabel(field)}
                  {field.required ? " *" : ""}
                </label>
                {renderFieldInput(field)}
                {errors[field.name] && (
                  <p className="text-xs text-red-600">{errors[field.name]}</p>
                )}
              </div>
            ))}
        </div>
      )}

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-slate-300 px-4 py-2 text-sm"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={disabled}
          className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default RecordForm;
