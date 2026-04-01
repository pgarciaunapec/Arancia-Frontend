/**
 * Order Service
 * Maneja operaciones de órdenes
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface CartItem {
  menuItem: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  _id: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus: string;
  isDelivery?: boolean;
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  count?: number;
  data: Order | Order[];
  message?: string;
}

export class OrderService {
  /**
   * Create a new order
   */
  static async create(
    token: string,
    items: { menuItem: string; quantity: number }[],
    shippingAddress?: any,
    isDelivery?: boolean,
  ): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items,
        shippingAddress,
        isDelivery,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al crear orden");
    }

    const data: OrderResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as Order);
  }

  /**
   * Get user's orders
   */
  static async getUserOrders(token: string): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al obtener órdenes");

    const data: OrderResponse = await response.json();
    return Array.isArray(data.data) ? data.data : [data.data as Order];
  }

  /**
   * Get order by ID
   */
  static async getById(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`);
    if (!response.ok) throw new Error("Orden no encontrada");

    const data: OrderResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as Order);
  }

  /**
   * Update order status
   */
  static async updateStatus(
    token: string,
    id: string,
    status: string,
  ): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error("Error al actualizar orden");

    const data: OrderResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as Order);
  }

  /**
   * Cancel an order
   */
  static async cancel(token: string, id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al cancelar orden");

    const data: OrderResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as Order);
  }

  /**
   * Get all orders (admin)
   */
  static async getAll(
    token: string,
    skip = 0,
    limit = 10,
  ): Promise<{ data: Order[]; total: number }> {
    const response = await fetch(
      `${API_BASE_URL}/orders/admin/all?skip=${skip}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (!response.ok) throw new Error("Error al obtener órdenes");

    const data: any = await response.json();
    return {
      data: Array.isArray(data.data) ? data.data : [data.data],
      total: data.total,
    };
  }
}
