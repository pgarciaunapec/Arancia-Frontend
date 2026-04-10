import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Reservation, ReservationStatus } from '../types';
import { apiRequest } from '../lib/api';
import type { ApiEnvelope } from '../lib/api';
import { mapBackendReservation } from '../lib/mappers';
import { useAuth } from './AuthContext';

interface ReservationsContextValue {
  reservations: Reservation[];
  createReservation: (data: CreateReservationData) => Promise<Reservation>;
  updateReservation: (
    id: string,
    data: UpdateReservationData,
  ) => Promise<Reservation>;
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

interface UpdateReservationData {
  date?: string;
  time?: string;
  guests?: number;
  name?: string;
  phone?: string;
  notes?: string;
  acceptAdditionalCharge?: boolean;
}

const ReservationsContext = createContext<ReservationsContextValue | null>(null);

const unpackArrayData = (payload: unknown): any[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (
    payload &&
    typeof payload === 'object' &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: any[] }).data;
  }

  return [];
};

export const ReservationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const refreshReservations = useCallback(async () => {
    if (!isAuthenticated) {
      setReservations([]);
      return;
    }

    const response = await apiRequest<ApiEnvelope<any>>('/reservations/my', { auth: true });
    const mapped = unpackArrayData(response.data).map((raw) =>
      mapBackendReservation(raw, user?.id),
    );
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

  const updateReservation = useCallback(
    async (id: string, data: UpdateReservationData) => {
      const response = await apiRequest<ApiEnvelope<any>>(`/reservations/${id}`, {
        method: 'PUT',
        auth: true,
        body: JSON.stringify(data),
      });

      const mapped = mapBackendReservation(response.data, user?.id);
      setReservations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...mapped } : item)),
      );
      return mapped;
    },
    [user?.id],
  );

  const cancelReservation = useCallback(async (id: string) => {
    await apiRequest(`/reservations/${id}/cancel`, {
      method: 'POST',
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
    <ReservationsContext.Provider value={{ reservations, createReservation, updateReservation, cancelReservation, getReservationsByUser, getAllReservations, updateReservationStatus, refreshReservations }}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => {
  const ctx = useContext(ReservationsContext);
  if (!ctx) throw new Error('useReservations must be used within ReservationsProvider');
  return ctx;
};
