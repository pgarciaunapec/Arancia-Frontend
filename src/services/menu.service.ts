/**
 * Menu Service
 * Maneja operaciones del menú
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  image: string;
  available: boolean;
}

export interface MenuResponse {
  success: boolean;
  count?: number;
  data: MenuItem | MenuItem[];
}

export class MenuService {
  /**
   * Get all menu items with filtering
   */
  static async getAll(filters?: {
    category?: string;
    search?: string;
    available?: boolean;
  }): Promise<MenuItem[]> {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== "all") {
      params.append("category", filters.category);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.available !== undefined) {
      params.append("available", String(filters.available));
    }

    const queryString = params.toString();
    const url = `${API_BASE_URL}/menu${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Error al obtener menú");

    const data: MenuResponse = await response.json();
    return Array.isArray(data.data) ? data.data : [data.data];
  }

  /**
   * Get menu item by ID
   */
  static async getById(id: string): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`);
    if (!response.ok) throw new Error("Artículo no encontrado");

    const data: MenuResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as MenuItem);
  }

  /**
   * Get all categories
   */
  static async getCategories(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/menu/categories`);
    if (!response.ok) throw new Error("Error al obtener categorías");

    const data: { success: boolean; data: string[] } = await response.json();
    return data.data;
  }

  /**
   * Search menu items
   */
  static async search(query: string): Promise<MenuItem[]> {
    const response = await fetch(`${API_BASE_URL}/menu/search/${query}`);
    if (!response.ok) throw new Error("Error en búsqueda");

    const data: MenuResponse = await response.json();
    return Array.isArray(data.data) ? data.data : [data.data];
  }

  /**
   * Create menu item (admin)
   */
  static async create(
    token: string,
    item: Omit<MenuItem, "_id">,
  ): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) throw new Error("Error al crear artículo");

    const data: MenuResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as MenuItem);
  }

  /**
   * Update menu item (admin)
   */
  static async update(
    token: string,
    id: string,
    item: Partial<MenuItem>,
  ): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) throw new Error("Error al actualizar artículo");

    const data: MenuResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as MenuItem);
  }

  /**
   * Delete menu item (admin)
   */
  static async delete(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al eliminar artículo");
  }
}
