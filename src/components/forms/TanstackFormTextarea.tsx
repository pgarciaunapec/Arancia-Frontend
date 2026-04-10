import React from "react";
import { getFirstFieldError } from "../../lib/forms/yupTanstack";

interface TanstackFormTextareaProps {
  form: any;
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  leftIcon?: React.ReactNode;
  textareaClassName?: string;
  textareaStyle?: React.CSSProperties;
  labelClassName?: string;
  errorClassName?: string;
}

export const TanstackFormTextarea: React.FC<TanstackFormTextareaProps> = ({
  form,
  name,
  label,
  placeholder,
  rows = 4,
  required,
  leftIcon,
  textareaClassName,
  textareaStyle,
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
                <span className="absolute left-3 top-4 text-white/40">
                  {leftIcon}
                </span>
              )}
              <textarea
                name={field.name}
                value={String(field.state.value ?? "")}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder={placeholder}
                rows={rows}
                required={required}
                aria-invalid={!!error}
                className={textareaClassName}
                style={textareaStyle}
              />
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
