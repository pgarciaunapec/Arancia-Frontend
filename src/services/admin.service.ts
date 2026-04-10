import { apiRequest, ApiEnvelope } from "../lib/api";

export type CollectionInfo = { name: string; count: number };
export type ListRecordsResponse = { docs: any[]; total: number; page: number; limit: number };

export const listCollections = async (): Promise<ApiEnvelope<CollectionInfo[]>> => {
  return apiRequest("/admin/collections", { auth: true });
};

export const listRecords = async (collection: string, page = 1, limit = 20) => {
  return apiRequest<ApiEnvelope<ListRecordsResponse>>(
    `/admin/collections/${encodeURIComponent(collection)}?page=${page}&limit=${limit}`,
    { auth: true },
  );
};

export const getRecord = async (collection: string, id: string) => {
  return apiRequest<ApiEnvelope<any>>(`/admin/collections/${encodeURIComponent(collection)}/${id}`, { auth: true });
};

export const createRecord = async (collection: string, payload: any) => {
  return apiRequest<ApiEnvelope<any>>(`/admin/collections/${encodeURIComponent(collection)}`, {
    auth: true,
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateRecord = async (collection: string, id: string, payload: any) => {
  return apiRequest<ApiEnvelope<any>>(`/admin/collections/${encodeURIComponent(collection)}/${id}`, {
    auth: true,
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteRecord = async (collection: string, id: string) => {
  return apiRequest<ApiEnvelope<any>>(`/admin/collections/${encodeURIComponent(collection)}/${id}`, {
    auth: true,
    method: "DELETE",
  });
};

export const getConfig = async (collection: string) => {
  return apiRequest<ApiEnvelope<any>>(`/admin/collections/config/${encodeURIComponent(collection)}`, { auth: true });
};

export const updateConfig = async (collection: string, payload: any) => {
  return apiRequest<ApiEnvelope<any>>(`/admin/collections/config/${encodeURIComponent(collection)}`, {
    auth: true,
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export default {
  listCollections,
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  getConfig,
  updateConfig,
};
