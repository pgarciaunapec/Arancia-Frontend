import { useCallback, useEffect, useMemo, useState } from "react";
import adminService from "../services/admin.service";

type QueryState = {
  page: number;
  limit: number;
  sort?: string;
  q?: string;
  filters: Record<string, string>;
};

export const useCollectionRecords = (
  collection?: string,
  initialLimit = 20,
) => {
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<QueryState>({
    page: 1,
    limit: initialLimit,
    sort: "_id:desc",
    q: "",
    filters: {},
  });

  const refresh = useCallback(async () => {
    if (!collection) {
      setRecords([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await adminService.listRecords(collection, query);
      setRecords(response.data.docs || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los registros",
      );
    } finally {
      setLoading(false);
    }
  }, [collection, query]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setPage = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page: Math.max(1, page) }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setQuery((prev) => ({ ...prev, limit: Math.max(1, limit), page: 1 }));
  }, []);

  const setSort = useCallback((sort: string) => {
    setQuery((prev) => ({ ...prev, sort, page: 1 }));
  }, []);

  const setSearch = useCallback((q: string) => {
    setQuery((prev) => ({ ...prev, q, page: 1 }));
  }, []);

  const setFilter = useCallback((field: string, value: string) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      filters: {
        ...prev.filters,
        [field]: value,
      },
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setQuery((prev) => ({ ...prev, page: 1, q: "", filters: {} }));
  }, []);

  const pagination = useMemo(
    () => ({
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    }),
    [query.page, query.limit, total],
  );

  return {
    records,
    total,
    loading,
    error,
    query,
    pagination,
    refresh,
    setPage,
    setLimit,
    setSort,
    setSearch,
    setFilter,
    clearFilters,
  };
};

export default useCollectionRecords;
