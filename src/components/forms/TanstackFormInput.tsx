import React from "react";
import { getFirstFieldError } from "../../lib/forms/yupTanstack";

interface TanstackFormInputProps {
  form: any;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
  labelClassName?: string;
  errorClassName?: string;
}

export const TanstackFormInput: React.FC<TanstackFormInputProps> = ({
  form,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  required,
  leftIcon,
  rightSlot,
  inputClassName,
  inputStyle,
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
                <span className="absolute left-3 top-3 text-white/40">
                  {leftIcon}
                </span>
              )}
              <input
                type={type}
                name={field.name}
                value={String(field.state.value ?? "")}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required={required}
                aria-invalid={!!error}
                className={inputClassName}
                style={inputStyle}
              />
              {rightSlot && (
                <div className="absolute right-3 top-3">{rightSlot}</div>
              )}
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
