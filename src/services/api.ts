const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "customer" | "staff" | "admin";
  isVip?: boolean;
  vipDiscount?: number;
}

export interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  image: string;
  available: boolean;
}

export interface CartItem {
  menuItem: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  _id: string;
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
}

export interface Reservation {
  _id: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: string;
  location?: string;
}

export interface PaymentData {
  _id: string;
  reference: string;
  amount: number;
  method: string;
  status: string;
  last4Digits?: string;
  transferReference?: string;
  order?: Order;
  createdAt: string;
}

export interface DeliveryData {
  _id: string;
  order: Order | string;
  user: string;
  status: string;
  deliveryAddress: {
    name: string;
    address: string;
    city: string;
    zip: string;
  };
  agent?: { name: string; phone: string };
  estimatedMinutes: number;
  estimatedArrival?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  todayOrders: number;
  todayReservations: number;
  todayRevenue: number;
  activeDeliveries: number;
  occupiedTables: number;
  totalTables: number;
}

export interface TableData {
  _id: string;
  number: number;
  capacity: number;
  zone: string;
  status: string;
  activeBill?: TableBillData;
}

export interface TableBillData {
  _id: string;
  table: string | TableData;
  waiter: string | { _id: string; name: string };
  customer?:
    | string
    | { _id: string; name: string; isVip?: boolean; vipDiscount?: number };
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod?: string;
  paidAt?: string;
}

export interface InventoryItemData {
  _id: string;
  name: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  unit: string;
  costPerUnit: number;
  supplier?: string;
  isLowStock: boolean;
  lastRestocked?: string;
}

export interface CashRegisterData {
  _id: string;
  date: string;
  status: string;
  openingBalance: number;
  closingBalance?: number;
  openedBy: { _id: string; name: string } | string;
  closedBy?: { _id: string; name: string } | string;
  totalSales: number;
  totalCash: number;
  totalCard: number;
  totalTransfer: number;
  transactionCount: number;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  lowStockCount?: number;
}

// Token management
let authToken: string | null = localStorage.getItem("authToken");

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
};

export const getAuthToken = () => authToken;

export const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  const baseUrl = API_BASE_URL.replace("/api", "");
  return `${baseUrl}${path}`;
};

// Generic fetch wrapper
const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error en la solicitud");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Auth API
export const authApi = {
  register: async (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ) => {
    const response = await fetchApi<{ user: User; token: string }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify({ name, email, password, phone }),
      },
    );
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await fetchApi<{ user: User; token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
    if (response.data?.token) {
      setAuthToken(response.data.token);
    }
    return response;
  },

  logout: () => {
    setAuthToken(null);
  },

  getCurrentUser: () => fetchApi<User>("/auth/me"),
};

// User API
export const userApi = {
  getProfile: () => fetchApi<User>("/users/profile"),

  updateProfile: (data: { name?: string; phone?: string; address?: string }) =>
    fetchApi<User>("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi<void>("/users/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// Menu API
export const menuApi = {
  getAll: (params?: { category?: string; search?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append("category", params.category);
    if (params?.search) searchParams.append("search", params.search);
    const query = searchParams.toString();
    return fetchApi<MenuItem[]>(`/menu${query ? `?${query}` : ""}`);
  },

  getById: (id: string) => fetchApi<MenuItem>(`/menu/${id}`),

  getByCategory: (category: string) =>
    fetchApi<MenuItem[]>(`/menu/category/${encodeURIComponent(category)}`),

  getCategories: () => fetchApi<string[]>("/menu/categories"),
};

// Reservation API
export const reservationApi = {
  create: (data: {
    date: string;
    time: string;
    guests: number;
    name: string;
    email: string;
    phone: string;
    notes?: string;
  }) =>
    fetchApi<Reservation>("/reservations", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyReservations: () => fetchApi<Reservation[]>("/reservations/my"),

  getById: (id: string) => fetchApi<Reservation>(`/reservations/${id}`),

  cancel: (id: string) =>
    fetchApi<Reservation>(`/reservations/${id}/cancel`, {
      method: "PUT",
    }),
};

// Cart API
export const cartApi = {
  get: () => fetchApi<Order>("/cart"),

  addItem: (menuItemId: string, quantity: number = 1) =>
    fetchApi<Order>("/cart", {
      method: "POST",
      body: JSON.stringify({ menuItemId, quantity }),
    }),

  updateQuantity: (itemId: string, quantity: number) =>
    fetchApi<Order>(`/cart/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (itemId: string) =>
    fetchApi<Order>(`/cart/${itemId}`, {
      method: "DELETE",
    }),

  clear: () =>
    fetchApi<Order>("/cart", {
      method: "DELETE",
    }),
};

// Order API
export const orderApi = {
  create: (data: {
    shippingAddress: {
      name: string;
      address: string;
      city: string;
      zip: string;
    };
    isDelivery?: boolean;
  }) =>
    fetchApi<Order & { orderNumber: string }>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => fetchApi<Order[]>("/orders"),

  getById: (id: string) => fetchApi<Order>(`/orders/${id}`),
};

// Contact API
export const contactApi = {
  sendMessage: (data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) =>
    fetchApi<void>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  requestEventQuote: (data: {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    packageName?: string;
    guests: number;
    preferredDate?: string;
    notes?: string;
  }) =>
    fetchApi<void>("/contact/event-quote", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Payment API
export const paymentApi = {
  process: (data: {
    orderId: string;
    method: "cash" | "card" | "transfer";
    cardNumber?: string;
    transferReference?: string;
  }) =>
    fetchApi<{ payment: PaymentData; transaction: unknown }>("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyPayments: () => fetchApi<PaymentData[]>("/payments/my"),

  getById: (id: string) => fetchApi<PaymentData>(`/payments/${id}`),
};

// Delivery API
export const deliveryApi = {
  getActive: () => fetchApi<DeliveryData>("/delivery/active"),

  getByOrder: (orderId: string) =>
    fetchApi<DeliveryData>(`/delivery/${orderId}`),
};

// Admin API
export const adminApi = {
  // Dashboard
  dashboard: {
    getStats: () => fetchApi<DashboardStats>("/admin/dashboard"),
  },

  // Users
  users: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", String(params.page));
      if (params?.limit) searchParams.append("limit", String(params.limit));
      if (params?.search) searchParams.append("search", params.search);
      if (params?.role) searchParams.append("role", params.role);
      const q = searchParams.toString();
      return fetchApi<User[]>(`/admin/users${q ? `?${q}` : ""}`);
    },
    getById: (id: string) => fetchApi<User>(`/admin/users/${id}`),
    update: (id: string, data: Partial<User>) =>
      fetchApi<User>(`/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    toggleVip: (id: string, data: { isVip: boolean; vipDiscount?: number }) =>
      fetchApi<User>(`/admin/users/${id}/vip`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/admin/users/${id}`, { method: "DELETE" }),
  },

  // Tables
  tables: {
    getAll: () => fetchApi<TableData[]>("/admin/tables"),
    create: (data: { number: number; capacity: number; zone?: string }) =>
      fetchApi<TableData>("/admin/tables", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<TableData>) =>
      fetchApi<TableData>(`/admin/tables/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/admin/tables/${id}`, { method: "DELETE" }),
  },

  // Table Bills
  tableBills: {
    open: (data: { tableId: string; customerId?: string }) =>
      fetchApi<TableBillData>("/admin/table-bills", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getById: (id: string) =>
      fetchApi<TableBillData>(`/admin/table-bills/${id}`),
    addItems: (id: string, items: CartItem[]) =>
      fetchApi<TableBillData>(`/admin/table-bills/${id}/items`, {
        method: "POST",
        body: JSON.stringify({ items }),
      }),
    removeItem: (billId: string, itemIndex: number) =>
      fetchApi<TableBillData>(
        `/admin/table-bills/${billId}/items/${itemIndex}`,
        {
          method: "DELETE",
        },
      ),
    setDiscount: (id: string, discount: number) =>
      fetchApi<TableBillData>(`/admin/table-bills/${id}/discount`, {
        method: "PATCH",
        body: JSON.stringify({ discount }),
      }),
    close: (id: string, paymentMethod: string) =>
      fetchApi<TableBillData>(`/admin/table-bills/${id}/close`, {
        method: "POST",
        body: JSON.stringify({ paymentMethod }),
      }),
  },

  // Cash Register
  cashRegister: {
    getToday: () => fetchApi<CashRegisterData>("/admin/cash-register/today"),
    open: (openingBalance: number) =>
      fetchApi<CashRegisterData>("/admin/cash-register/open", {
        method: "POST",
        body: JSON.stringify({ openingBalance }),
      }),
    close: (notes?: string) =>
      fetchApi<CashRegisterData>("/admin/cash-register/close", {
        method: "POST",
        body: JSON.stringify({ notes }),
      }),
    getById: (id: string) =>
      fetchApi<CashRegisterData>(`/admin/cash-register/${id}`),
  },

  // Inventory
  inventory: {
    getAll: (params?: {
      category?: string;
      search?: string;
      lowStock?: boolean;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.append("category", params.category);
      if (params?.search) searchParams.append("search", params.search);
      if (params?.lowStock) searchParams.append("lowStock", "true");
      const q = searchParams.toString();
      return fetchApi<InventoryItemData[]>(
        `/admin/inventory${q ? `?${q}` : ""}`,
      );
    },
    create: (data: Partial<InventoryItemData>) =>
      fetchApi<InventoryItemData>("/admin/inventory", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<InventoryItemData>) =>
      fetchApi<InventoryItemData>(`/admin/inventory/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    restock: (id: string, quantity: number) =>
      fetchApi<InventoryItemData>(`/admin/inventory/${id}/restock`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
      }),
    delete: (id: string) =>
      fetchApi<void>(`/admin/inventory/${id}`, { method: "DELETE" }),
    getAlerts: () => fetchApi<InventoryItemData[]>("/admin/inventory/alerts"),
  },

  // Orders (admin)
  orders: {
    getAll: (params?: { page?: number; limit?: number; status?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", String(params.page));
      if (params?.limit) searchParams.append("limit", String(params.limit));
      if (params?.status) searchParams.append("status", params.status);
      const q = searchParams.toString();
      return fetchApi<Order[]>(`/admin/orders${q ? `?${q}` : ""}`);
    },
    updateStatus: (id: string, status: string) =>
      fetchApi<Order>(`/admin/orders/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },

  // Delivery (admin)
  delivery: {
    getActive: () => fetchApi<DeliveryData[]>("/admin/delivery"),
    updateStatus: (
      id: string,
      data: { status: string; agent?: { name: string; phone: string } },
    ) =>
      fetchApi<DeliveryData>(`/admin/delivery/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
};

export default {
  auth: authApi,
  user: userApi,
  menu: menuApi,
  reservation: reservationApi,
  cart: cartApi,
  order: orderApi,
  contact: contactApi,
  payment: paymentApi,
  delivery: deliveryApi,
  admin: adminApi,
};
