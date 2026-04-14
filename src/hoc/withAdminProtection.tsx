import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * HOC para proteger rutas admin
 * Redirige a login si no es admin o sesión es inválida
 */
export const withAdminProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
) => {
  const AdminProtectedComponent: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
      // Esperar a que cargue el estado de autenticación
      if (loading) return;

      // Redireccionar si no hay usuario
      if (!user) {
        navigate('/admin/login', { replace: true });
        return;
      }

      // Redireccionar si no es admin
      if (user.role !== 'admin') {
        // Invalida token client-side
        localStorage.removeItem('restaurant_auth_token');
        navigate('/admin/login', {
          replace: true,
          state: {
            error: 'Sesión de administrador inválida',
          },
        });
        return;
      }
    }, [user, loading, navigate]);

    // Mostrar loading mientras se verifica
    if (loading) {
      return (
        <div className="w-full h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            <p className="text-white mt-4">Verificando acceso...</p>
          </div>
        </div>
      );
    }

    // No renderizar si no es admin
    if (!user || user.role !== 'admin') {
      return null;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  AdminProtectedComponent.displayName = `withAdminProtection(${WrappedComponent.displayName || WrappedComponent.name})`;

  return AdminProtectedComponent;
};
