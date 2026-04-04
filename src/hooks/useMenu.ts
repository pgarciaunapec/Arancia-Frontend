/**
 * useMenu Hook
 * Maneja el menú y navegación por categorías
 */

import { useState, useCallback, useEffect } from "react";
import { MenuService, type MenuItem } from "../services/menu.service";

export interface UseMenuReturn {
  items: MenuItem[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: string;
  searchQuery: string;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  refetch: () => Promise<void>;
}

export const useMenu = (initialCategory = "all"): UseMenuReturn => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMenu = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (searchQuery) {
        const results = await MenuService.search(searchQuery);
        setItems(results);
      } else {
        const allItems = await MenuService.getAll({
          category: selectedCategory,
          available: true,
        });
        setItems(allItems);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar menú");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await MenuService.getCategories();
      setCategories(["all", ...cats]);
    } catch (err) {
      console.error("Error al cargar categorías", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const refetch = useCallback(async () => {
    return fetchMenu();
  }, [fetchMenu]);

  return {
    items,
    categories,
    isLoading,
    error,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    refetch,
  };
};
