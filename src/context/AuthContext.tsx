import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { apiRequest, getAuthToken, setAuthToken } from '../lib/api';
import type { ApiEnvelope } from '../lib/api';
import { mapBackendUser } from '../lib/mappers';
import { normalizeDominicanPhone } from '../lib/phone';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  getAllUsers: () => User[];
  updateUser: (userId: string, data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const CURRENT_USER_KEY = 'restaurant_current_user';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? (JSON.parse(stored) as User) : null;
    } catch {
      return null;
    }
  });
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const bootstrap = async () => {
      const token = getAuthToken();
      if (!token) {
        return;
      }

      try {
        const response = await apiRequest<ApiEnvelope<any>>('/auth/me', { auth: true });
        const mapped = mapBackendUser(response.data);
        setUser(mapped);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mapped));
      } catch {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    };

    bootstrap();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
        setUsers([]);
        return;
      }

      try {
        const response = await apiRequest<ApiEnvelope<any[]>>('/admin/users?limit=200', { auth: true });
        setUsers((response.data || []).map(mapBackendUser));
      } catch {
        setUsers([]);
      }
    };

    loadUsers();
  }, [user]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiRequest<ApiEnvelope<{ user: any; token: string }>>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const token = response.data.token;
      const mapped = mapBackendUser(response.data.user);

      setAuthToken(token);
      setUser(mapped);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mapped));

      return { success: true, user: mapped };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al iniciar sesión' };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const normalizedPhone = data.phone ? normalizeDominicanPhone(data.phone) : undefined;
      const response = await apiRequest<ApiEnvelope<{ user: any; token: string }>>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          phone: normalizedPhone || undefined,
        }),
      });

      const token = response.data.token;
      const mapped = mapBackendUser(response.data.user);

      setAuthToken(token);
      setUser(mapped);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mapped));

      return { success: true, user: mapped };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al registrar usuario' };
    }
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    try {
      const normalizedPhone = data.phone ? normalizeDominicanPhone(data.phone) : undefined;
      const response = await apiRequest<ApiEnvelope<any>>('/users/profile', {
        method: 'PUT',
        auth: true,
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: normalizedPhone || undefined,
          address: data.address,
        }),
      });

      const mapped = mapBackendUser(response.data);
      setUser(mapped);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mapped));

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'No se pudo actualizar el perfil' };
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      await apiRequest('/users/password', {
        method: 'PUT',
        auth: true,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'No se pudo cambiar la contraseña' };
    }
  }, []);

  const getAllUsers = useCallback(() => users, [users]);

  const updateUser = useCallback(async (userId: string, data: Partial<User>) => {
    try {
      const isVipPayload = typeof data.isVIP === 'boolean';

      if (isVipPayload) {
        await apiRequest(`/admin/users/${userId}/vip`, {
          method: 'PATCH',
          auth: true,
          body: JSON.stringify({ isVip: data.isVIP, vipDiscount: data.isVIP ? 10 : 0 }),
        });
      } else {
        const normalizedPhone = data.phone ? normalizeDominicanPhone(data.phone) : undefined;
        await apiRequest(`/admin/users/${userId}`, {
          method: 'PUT',
          auth: true,
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            phone: normalizedPhone || undefined,
            role: data.role,
          }),
        });
      }

      if (user?.id === userId) {
        const merged = { ...user, ...data };
        setUser(merged);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(merged));
      }

      setUsers((prev) => prev.map((item) => (item.id === userId ? { ...item, ...data } : item)));

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'No se pudo actualizar el usuario' };
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'staff',
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        getAllUsers,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
