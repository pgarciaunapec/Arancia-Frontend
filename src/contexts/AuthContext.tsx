import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi, userApi, setAuthToken, getAuthToken, type User } from '../services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
    logout: () => void;
    updateProfile: (data: { name?: string; phone?: string; address?: string }) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = getAuthToken();
            if (token) {
                try {
                    const response = await authApi.getCurrentUser();
                    if (response.data) {
                        setUser(response.data);
                    }
                } catch {
                    // Token invalid, clear it
                    setAuthToken(null);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const response = await authApi.login(email, password);
        if (response.data?.user) {
            setUser(response.data.user);
        }
    }, []);

    const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
        const response = await authApi.register(name, email, password, phone);
        if (response.data?.user) {
            setUser(response.data.user);
        }
    }, []);

    const logout = useCallback(() => {
        authApi.logout();
        setUser(null);
    }, []);

    const updateProfile = useCallback(async (data: { name?: string; phone?: string; address?: string }) => {
        const response = await userApi.updateProfile(data);
        if (response.data) {
            setUser(response.data);
        }
    }, []);

    const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
        await userApi.changePassword(currentPassword, newPassword);
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
