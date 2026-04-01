/**
 * Authentication Service
 * Maneja autenticación y operaciones de usuario
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: "customer" | "staff" | "admin";
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  static async register(
    name: string,
    email: string,
    password: string,
    phone?: string,
  ): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al registrar usuario");
    }

    return response.json();
  }

  /**
   * Login user
   */
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al iniciar sesión");
    }

    return response.json();
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(
    token: string,
  ): Promise<{ success: boolean; data: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("No autorizado");
    }

    return response.json();
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    token: string,
    data: Partial<User>,
  ): Promise<{ success: boolean; data: User; message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al actualizar perfil");
    }

    return response.json();
  }

  /**
   * Change password
   */
  static async changePassword(
    token: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al cambiar contraseña");
    }

    return response.json();
  }

  /**
   * Verify token
   */
  static async verifyToken(
    token: string,
  ): Promise<{ success: boolean; valid: boolean }> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.json();
  }

  /**
   * Logout (local operation)
   */
  static logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Get stored token
   */
  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Get stored user
   */
  static getStoredUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  /**
   * Save user and token to local storage
   */
  static saveAuth(user: User, token: string): void {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  }
}
