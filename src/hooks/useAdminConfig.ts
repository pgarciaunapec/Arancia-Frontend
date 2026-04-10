import { useCallback, useEffect, useState } from "react";
import adminService from "../services/admin.service";
import type { AdminConfig } from "../types/admin";

export const useAdminConfig = (collection?: string) => {
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!collection) {
      setConfig(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getConfig(collection);
      setConfig(response.data || null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar la configuración",
      );
    } finally {
      setLoading(false);
    }
  }, [collection]);

  const saveConfig = useCallback(
    async (nextConfig: Partial<AdminConfig>) => {
      if (!collection) {
        throw new Error("Colección no seleccionada");
      }

      const response = await adminService.updateConfig(collection, nextConfig);
      setConfig(response.data || null);
      return response.data;
    },
    [collection],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    config,
    loading,
    error,
    reload,
    saveConfig,
  };
};

export default useAdminConfig;
