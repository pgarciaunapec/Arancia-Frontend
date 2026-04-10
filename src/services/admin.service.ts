import { apiRequest, getAuthToken } from "../lib/api";
import type { ApiEnvelope } from "../lib/api";
import type {
  AdminConfig,
  AuditLogEntry,
  CollectionRecordList,
  ImportSummary,
} from "../types/admin";

export type CollectionInfo = { name: string; count: number };

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type ListRecordParams = {
  page?: number;
  limit?: number;
  sort?: string;
  q?: string;
  filters?: Record<string, string>;
};

const buildListQuery = (params?: ListRecordParams) => {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.sort) query.set("sort", params.sort);
  if (params?.q) query.set("q", params.q);
  if (params?.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (!value) return;
      query.set(`filter[${key}]`, value);
    });
  }
  return query.toString();
};

export const listCollections = async (): Promise<
  ApiEnvelope<CollectionInfo[]>
> => {
  return apiRequest("/admin/collections", { auth: true });
};

export const listRecords = async (
  collection: string,
  params: ListRecordParams = {},
) => {
  const query = buildListQuery(params);
  const suffix = query ? `?${query}` : "";
  return apiRequest<ApiEnvelope<CollectionRecordList>>(
    `/admin/collections/${encodeURIComponent(collection)}${suffix}`,
    { auth: true },
  );
};

export const getRecord = async (collection: string, id: string) => {
  return apiRequest<ApiEnvelope<Record<string, unknown>>>(
    `/admin/collections/${encodeURIComponent(collection)}/${id}`,
    { auth: true },
  );
};

export const createRecord = async (
  collection: string,
  payload: Record<string, unknown>,
) => {
  return apiRequest<ApiEnvelope<Record<string, unknown>>>(
    `/admin/collections/${encodeURIComponent(collection)}`,
    {
      auth: true,
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
};

export const updateRecord = async (
  collection: string,
  id: string,
  payload: Record<string, unknown>,
) => {
  return apiRequest<ApiEnvelope<Record<string, unknown>>>(
    `/admin/collections/${encodeURIComponent(collection)}/${id}`,
    {
      auth: true,
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
};

export const deleteRecord = async (
  collection: string,
  id: string,
  cascade = false,
) => {
  return apiRequest<ApiEnvelope<{ message: string }>>(
    `/admin/collections/${encodeURIComponent(collection)}/${id}?cascade=${cascade ? "true" : "false"}`,
    {
      auth: true,
      method: "DELETE",
    },
  );
};

export const bulkAction = async (
  collection: string,
  payload: {
    action: "update" | "delete";
    ids: string[];
    payload?: Record<string, unknown>;
  },
) => {
  return apiRequest<ApiEnvelope<{ affected: number }>>(
    `/admin/collections/${encodeURIComponent(collection)}/bulk`,
    {
      auth: true,
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
};

export const getConfig = async (collection: string) => {
  return apiRequest<ApiEnvelope<AdminConfig>>(
    `/admin/collections/config/${encodeURIComponent(collection)}`,
    { auth: true },
  );
};

export const updateConfig = async (
  collection: string,
  payload: Partial<AdminConfig>,
) => {
  return apiRequest<ApiEnvelope<AdminConfig>>(
    `/admin/collections/config/${encodeURIComponent(collection)}`,
    {
      auth: true,
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
};

export const importRecords = async (params: {
  collection: string;
  file: File;
  mapping?: Record<string, string>;
  onConflict?: "skip" | "replace" | "merge";
}) => {
  const formData = new FormData();
  formData.append("file", params.file);
  formData.append("mapping", JSON.stringify(params.mapping || {}));
  formData.append("onConflict", params.onConflict || "skip");

  return apiRequest<ApiEnvelope<ImportSummary>>(
    `/admin/collections/${encodeURIComponent(params.collection)}/import`,
    {
      auth: true,
      method: "POST",
      body: formData,
    },
  );
};

export const exportRecords = async (params: {
  collection: string;
  format?: "csv" | "json";
  fields?: string[];
  q?: string;
  sort?: string;
  filters?: Record<string, string>;
}) => {
  const query = new URLSearchParams();
  query.set("format", params.format || "csv");
  if (params.fields && params.fields.length > 0) {
    query.set("fields", params.fields.join(","));
  }
  if (params.q) query.set("q", params.q);
  if (params.sort) query.set("sort", params.sort);
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (!value) return;
      query.set(`filter[${key}]`, value);
    });
  }

  const token = getAuthToken();
  const response = await fetch(
    `${API_BASE_URL}/admin/collections/${encodeURIComponent(params.collection)}/export?${query.toString()}`,
    {
      method: "GET",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    },
  );

  if (!response.ok) {
    throw new Error(`No se pudo exportar (${response.status})`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get("content-disposition") || "";
  const fileNameMatch = contentDisposition.match(/filename="?([^\"]+)"?/i);
  const fileName =
    fileNameMatch?.[1] || `${params.collection}.${params.format || "csv"}`;

  return { blob, fileName };
};

export const uploadAsset = async (params: {
  collection: string;
  id: string;
  file: File;
  field?: string;
}) => {
  const formData = new FormData();
  formData.append("file", params.file);
  if (params.field) {
    formData.append("field", params.field);
  }

  return apiRequest<ApiEnvelope<{ path: string }>>(
    `/admin/collections/${encodeURIComponent(params.collection)}/${params.id}/assets`,
    {
      auth: true,
      method: "POST",
      body: formData,
    },
  );
};

export const listAudit = async (params: {
  collection?: string;
  docId?: string;
  limit?: number;
}) => {
  const query = new URLSearchParams();
  if (params.collection) query.set("collection", params.collection);
  if (params.docId) query.set("docId", params.docId);
  if (params.limit) query.set("limit", String(params.limit));

  return apiRequest<ApiEnvelope<AuditLogEntry[]>>(
    `/admin/audit?${query.toString()}`,
    {
      auth: true,
    },
  );
};

export default {
  listCollections,
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  bulkAction,
  getConfig,
  updateConfig,
  importRecords,
  exportRecords,
  uploadAsset,
  listAudit,
};
