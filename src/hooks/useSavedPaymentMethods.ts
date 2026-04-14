import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../lib/api';
import type { ISavedAddress, ISavedCard } from '../types';

/**
 * Hook para cargar direcciones y tarjetas guardadas del usuario
 * Se ejecuta automáticamente cuando el usuario está autenticado
 */
export const useSavedPaymentMethods = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<ISavedAddress[]>([]);
  const [cards, setCards] = useState<ISavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      setAddresses([]);
      setCards([]);
      return;
    }

    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        const [addressesData, cardsData] = await Promise.all([
          apiRequest<ISavedAddress[]>(`/users/me/saved-addresses`),
          apiRequest<ISavedCard[]>(`/users/me/saved-cards`),
        ]);

        setAddresses(addressesData || []);
        setCards(cardsData || []);
        setError(null);
      } catch (err) {
        console.warn('Error loading saved payment methods:', err);
        setAddresses([]);
        setCards([]);
        setError(err instanceof Error ? err.message : 'Error cargando métodos guardados');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [user?.id]);

  const addAddress = async (address: Omit<ISavedAddress, '_id'>) => {
    try {
      const newAddress = await apiRequest<ISavedAddress>(
        '/users/me/saved-addresses',
        {
          method: 'POST',
          body: address,
        }
      );
      setAddresses([...addresses, newAddress]);
      return newAddress;
    } catch (err) {
      throw new Error(`Error guardando dirección: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const addCard = async (card: Omit<ISavedCard, '_id'>) => {
    try {
      const newCard = await apiRequest<ISavedCard>(
        '/users/me/saved-cards',
        {
          method: 'POST',
          body: card,
        }
      );
      setCards([...cards, newCard]);
      return newCard;
    } catch (err) {
      throw new Error(`Error guardando tarjeta: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const deleteAddress = async (addressId: string) => {
    try {
      await apiRequest(`/users/me/saved-addresses/${addressId}`, {
        method: 'DELETE',
      });
      setAddresses(addresses.filter(a => a._id !== addressId));
    } catch (err) {
      throw new Error(`Error eliminando dirección: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const deleteCard = async (cardId: string) => {
    try {
      await apiRequest(`/users/me/saved-cards/${cardId}`, {
        method: 'DELETE',
      });
      setCards(cards.filter(c => c._id !== cardId));
    } catch (err) {
      throw new Error(`Error eliminando tarjeta: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return {
    addresses,
    cards,
    loading,
    error,
    addAddress,
    addCard,
    deleteAddress,
    deleteCard,
  };
};
