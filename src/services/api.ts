const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
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

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    count?: number;
}

// Token management
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
    authToken = token;
    if (token) {
        localStorage.setItem('authToken', token);
    } else {
        localStorage.removeItem('authToken');
    }
};

export const getAuthToken = () => authToken;

export const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = API_BASE_URL.replace('/api', '');
    return `${baseUrl}${path}`;
};

// Generic fetch wrapper
const fetchApi = async <T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en la solicitud');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
export const authApi = {
    register: async (name: string, email: string, password: string, phone?: string) => {
        const response = await fetchApi<{ user: User; token: string }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, phone }),
        });
        if (response.data?.token) {
            setAuthToken(response.data.token);
        }
        return response;
    },

    login: async (email: string, password: string) => {
        const response = await fetchApi<{ user: User; token: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (response.data?.token) {
            setAuthToken(response.data.token);
        }
        return response;
    },

    logout: () => {
        setAuthToken(null);
    },

    getCurrentUser: () => fetchApi<User>('/auth/me'),
};

// User API
export const userApi = {
    getProfile: () => fetchApi<User>('/users/profile'),

    updateProfile: (data: { name?: string; phone?: string; address?: string }) =>
        fetchApi<User>('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        }),

    changePassword: (currentPassword: string, newPassword: string) =>
        fetchApi<void>('/users/password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        }),
};

// Menu API
export const menuApi = {
    getAll: (params?: { category?: string; search?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.category) searchParams.append('category', params.category);
        if (params?.search) searchParams.append('search', params.search);
        const query = searchParams.toString();
        return fetchApi<MenuItem[]>(`/menu${query ? `?${query}` : ''}`);
    },

    getById: (id: string) => fetchApi<MenuItem>(`/menu/${id}`),

    getByCategory: (category: string) =>
        fetchApi<MenuItem[]>(`/menu/category/${encodeURIComponent(category)}`),

    getCategories: () => fetchApi<string[]>('/menu/categories'),
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
        fetchApi<Reservation>('/reservations', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getMyReservations: () => fetchApi<Reservation[]>('/reservations/my'),

    getById: (id: string) => fetchApi<Reservation>(`/reservations/${id}`),

    cancel: (id: string) =>
        fetchApi<Reservation>(`/reservations/${id}/cancel`, {
            method: 'PUT',
        }),
};

// Cart API
export const cartApi = {
    get: () => fetchApi<Order>('/cart'),

    addItem: (menuItemId: string, quantity: number = 1) =>
        fetchApi<Order>('/cart', {
            method: 'POST',
            body: JSON.stringify({ menuItemId, quantity }),
        }),

    updateQuantity: (itemId: string, quantity: number) =>
        fetchApi<Order>(`/cart/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity }),
        }),

    removeItem: (itemId: string) =>
        fetchApi<Order>(`/cart/${itemId}`, {
            method: 'DELETE',
        }),

    clear: () =>
        fetchApi<Order>('/cart', {
            method: 'DELETE',
        }),
};

// Order API
export const orderApi = {
    create: (shippingAddress: {
        name: string;
        address: string;
        city: string;
        zip: string;
    }) =>
        fetchApi<Order & { orderNumber: string }>('/orders', {
            method: 'POST',
            body: JSON.stringify({ shippingAddress }),
        }),

    getAll: () => fetchApi<Order[]>('/orders'),

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
        fetchApi<void>('/contact', {
            method: 'POST',
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
        fetchApi<void>('/contact/event-quote', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

export default {
    auth: authApi,
    user: userApi,
    menu: menuApi,
    reservation: reservationApi,
    cart: cartApi,
    order: orderApi,
    contact: contactApi,
};
