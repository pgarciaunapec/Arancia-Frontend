export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "enum"
  | "reference"
  | "file"
  | "image"
  | "array"
  | "object";

export interface FieldValidators {
  pattern?: string;
  min?: number;
  max?: number;
  customValidatorId?: string;
}

export interface FieldReference {
  collection: string;
  displayField: string;
}

export interface FieldConfig {
  name: string;
  label?: string;
  visible?: boolean;
  editable?: boolean;
  type?: FieldType;
  order?: number;
  required?: boolean;
  enumOptions?: string[];
  reference?: FieldReference;
  validators?: FieldValidators;
}

export interface AdminConfig {
  _id?: string;
  collection: string;
  fields: FieldConfig[];
  listDefaults?: {
    pageSize?: number;
    defaultSort?: Record<string, number>;
  };
  permissions?: Record<
    string,
    { read?: boolean; write?: boolean; delete?: boolean }
  >;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollectionRecordList {
  docs: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
}

export interface ImportSummary {
  processed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: Array<{
    line: number;
    reason: string;
    payload: Record<string, unknown>;
  }>;
}

export interface AuditLogEntry {
  _id?: string;
  userId?: string;
  userEmail: string;
  action:
    | "create"
    | "update"
    | "delete"
    | "import"
    | "bulk-update"
    | "bulk-delete";
  collection: string;
  docId?: string;
  timestamp: string;
  diff?: {
    before?: unknown;
    after?: unknown;
  };
  meta?: {
    ip?: string;
    userAgent?: string;
    requestId?: string;
  };
}
