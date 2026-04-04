/**
 * useAuth Hook
 * Maneja la autenticación y perfil del usuario
 */

import { useEffect, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";
import { AuthService, type User } from "../services/auth.service";

export interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  const {
    user,
    token,
    isLoading,
    error,
    login: contextLogin,
    register: contextRegister,
    logout,
  } = context;

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const response = await AuthService.login(email, password);
        contextLogin(response.data.user, response.data.token);
      } catch (err) {
        throw err;
      }
    },
    [contextLogin],
  );

  const register = useCallback(
    async (name: string, email: string, password: string, phone?: string) => {
      try {
        const response = await AuthService.register(
          name,
          email,
          password,
          phone,
        );
        contextLogin(response.data.user, response.data.token);
      } catch (err) {
        throw err;
      }
    },
    [contextLogin],
  );

  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      if (!token) throw new Error("No autenticado");
      await AuthService.updateProfile(token, data);
    },
    [token],
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!token) throw new Error("No autenticado");
      await AuthService.changePassword(token, currentPassword, newPassword);
    },
    [token],
  );

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };
};
