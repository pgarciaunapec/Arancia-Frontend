import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Reservation, ReservationStatus } from '../types';
import { apiRequest } from '../lib/api';
import type { ApiEnvelope } from '../lib/api';
import { mapBackendReservation } from '../lib/mappers';
import { useAuth } from './AuthContext';

interface ReservationsContextValue {
  reservations: Reservation[];
  createReservation: (data: CreateReservationData) => Promise<Reservation>;
  cancelReservation: (id: string) => Promise<void>;
  getReservationsByUser: (userId: string) => Reservation[];
  getAllReservations: () => Reservation[];
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  refreshReservations: () => Promise<void>;
}

interface CreateReservationData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
}

const ReservationsContext = createContext<ReservationsContextValue | null>(null);

export const ReservationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const refreshReservations = useCallback(async () => {
    if (!isAuthenticated) {
      setReservations([]);
      return;
    }

    const response = await apiRequest<ApiEnvelope<any[]>>('/reservations/my', { auth: true });
    const mapped = (response.data || []).map((raw) => mapBackendReservation(raw, user?.id));
    setReservations(mapped);
  }, [isAuthenticated, user?.id]);

  useEffect(() => {
    refreshReservations().catch(() => setReservations([]));
  }, [refreshReservations]);

  const createReservation = useCallback(async (data: CreateReservationData) => {
    const response = await apiRequest<ApiEnvelope<any>>('/reservations', {
      method: 'POST',
      auth: isAuthenticated,
      body: JSON.stringify({
        date: data.date,
        time: data.time,
        guests: data.guests,
        name: data.name,
        email: data.email,
        phone: data.phone,
        notes: data.notes,
      }),
    });

    const mapped = mapBackendReservation(response.data, data.userId);
    setReservations((prev) => [mapped, ...prev]);
    return mapped;
  }, [isAuthenticated]);

  const cancelReservation = useCallback(async (id: string) => {
    await apiRequest(`/reservations/${id}/cancel`, {
      method: 'PUT',
      auth: true,
    });

    setReservations((prev) => prev.map((item) => (item.id === id ? { ...item, status: 'cancelled' } : item)));
  }, []);

  const getReservationsByUser = useCallback((userId: string) => reservations.filter((item) => item.userId === userId || !item.userId), [reservations]);

  const getAllReservations = useCallback(() => reservations, [reservations]);

  const updateReservationStatus = useCallback((id: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  }, []);

  return (
    <ReservationsContext.Provider value={{ reservations, createReservation, cancelReservation, getReservationsByUser, getAllReservations, updateReservationStatus, refreshReservations }}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => {
  const ctx = useContext(ReservationsContext);
  if (!ctx) throw new Error('useReservations must be used within ReservationsProvider');
  return ctx;
};
