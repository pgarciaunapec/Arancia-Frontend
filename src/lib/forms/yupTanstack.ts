import { ValidationError, type AnyObjectSchema } from "yup";

export type TanStackFormError<TValues extends Record<string, unknown>> = {
  form?: string;
  fields?: Partial<Record<keyof TValues & string, string>>;
};

export const validateWithYup = <TValues extends Record<string, unknown>>(
  schema: AnyObjectSchema,
  values: TValues,
): TanStackFormError<TValues> | undefined => {
  try {
    schema.validateSync(values, {
      abortEarly: false,
      stripUnknown: false,
    });

    return undefined;
  } catch (error) {
    if (!(error instanceof ValidationError)) {
      return {
        form: "Hay errores de validación en el formulario.",
      };
    }

    const fieldErrors: Record<string, string> = {};

    if (error.inner.length > 0) {
      for (const issue of error.inner) {
        if (!issue.path || fieldErrors[issue.path]) {
          continue;
        }
        fieldErrors[issue.path] = issue.message;
      }
    } else if (error.path) {
      fieldErrors[error.path] = error.message;
    }

    return {
      form:
        Object.keys(fieldErrors).length === 0
          ? error.message || "Hay errores de validación en el formulario."
          : undefined,
      fields: fieldErrors as Partial<Record<keyof TValues & string, string>>,
    };
  }
};

export const getFirstFieldError = (errors: unknown[]): string | null => {
  if (!errors.length) {
    return null;
  }

  for (const error of errors) {
    if (typeof error === "string" && error.trim()) {
      return error;
    }

    if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof (error as { message?: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }
  }

  return "Valor inválido.";
};
