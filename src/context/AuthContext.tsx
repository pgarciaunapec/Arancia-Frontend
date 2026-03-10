import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  getAllUsers: () => User[];
  updateUser: (userId: string, data: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const STORAGE_KEY = 'restaurant_users';
const CURRENT_USER_KEY = 'restaurant_current_user';

// Seed admin + demo users
const seedUsers = (): User[] => [
  {
    id: 'admin-001',
    name: 'Administrador',
    email: 'admin@restaurante.com',
    phone: '+1 (809) 555-0001',
    address: 'Restaurante Principal',
    role: 'admin' as UserRole,
    isVIP: false,
    createdAt: '2025-01-01T00:00:00Z',
    loyaltyPoints: 0,
  },
  {
    id: 'user-001',
    name: 'Juan Pérez',
    email: 'juan@demo.com',
    phone: '+1 (809) 555-0123',
    address: 'Calle Demo 123, Santo Domingo',
    role: 'customer' as UserRole,
    isVIP: true,
    createdAt: '2025-06-15T00:00:00Z',
    loyaltyPoints: 450,
  },
];

// Passwords are stored as plain text for this demo (no real backend)
const PASSWORDS_KEY = 'restaurant_passwords';
const seedPasswords = (): Record<string, string> => ({
  'admin@restaurante.com': 'admin123',
  'juan@demo.com': 'demo123',
});

const getStoredUsers = (): User[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  const initial = seedUsers();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const getPasswords = (): Record<string, string> => {
  try {
    const stored = localStorage.getItem(PASSWORDS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  const initial = seedPasswords();
  localStorage.setItem(PASSWORDS_KEY, JSON.stringify(initial));
  return initial;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Ensure seed data exists on first load
    getStoredUsers();
    getPasswords();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = getStoredUsers();
    const passwords = getPasswords();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, error: 'Usuario no encontrado' };
    if (passwords[found.email] !== password) return { success: false, error: 'Contraseña incorrecta' };
    setUser(found);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(found));
    return { success: true };
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const users = getStoredUsers();
    const passwords = getPasswords();
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Este correo ya está registrado' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      address: '',
      role: 'customer',
      isVIP: false,
      createdAt: new Date().toISOString(),
      loyaltyPoints: 0,
    };
    const updatedUsers = [...users, newUser];
    const updatedPasswords = { ...passwords, [data.email]: data.password };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(PASSWORDS_KEY, JSON.stringify(updatedPasswords));
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    const users = getStoredUsers();
    const updatedUsers = users.map(u => u.id === user.id ? updated : u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  const getAllUsers = useCallback(() => getStoredUsers(), []);

  const updateUser = useCallback((userId: string, data: Partial<User>) => {
    const users = getStoredUsers();
    const updatedUsers = users.map(u => u.id === userId ? { ...u, ...data } : u);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    if (user?.id === userId) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateProfile,
      getAllUsers,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
