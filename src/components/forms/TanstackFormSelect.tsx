import React from "react";
import { getFirstFieldError } from "../../lib/forms/yupTanstack";

interface SelectOption {
  value: string;
  label: string;
}

interface TanstackFormSelectProps {
  form: any;
  name: string;
  label: string;
  options: SelectOption[];
  required?: boolean;
  leftIcon?: React.ReactNode;
  selectClassName?: string;
  selectStyle?: React.CSSProperties;
  labelClassName?: string;
  errorClassName?: string;
}

export const TanstackFormSelect: React.FC<TanstackFormSelectProps> = ({
  form,
  name,
  label,
  options,
  required,
  leftIcon,
  selectClassName,
  selectStyle,
  labelClassName,
  errorClassName,
}) => {
  return (
    <form.Field name={name}>
      {(field: any) => {
        const error = getFirstFieldError(field.state.meta.errors ?? []);

        return (
          <div className="space-y-2">
            <label className={labelClassName}>{label}</label>
            <div className="relative">
              {leftIcon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                  {leftIcon}
                </span>
              )}
              <select
                name={field.name}
                value={String(field.state.value ?? "")}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                required={required}
                aria-invalid={!!error}
                className={selectClassName}
                style={selectStyle}
              >
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <p
                className={
                  errorClassName || "text-xs text-red-400 font-medium mt-1"
                }
              >
                {error}
              </p>
            )}
          </div>
        );
      }}
    </form.Field>
  );
};
