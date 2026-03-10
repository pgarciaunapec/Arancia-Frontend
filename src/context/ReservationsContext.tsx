import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Reservation, ReservationStatus } from '../types';

interface ReservationsContextValue {
  reservations: Reservation[];
  createReservation: (data: CreateReservationData) => Reservation;
  cancelReservation: (id: string) => void;
  getReservationsByUser: (userId: string) => Reservation[];
  getAllReservations: () => Reservation[];
  updateReservationStatus: (id: string, status: ReservationStatus, tableNumber?: number) => void;
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
  location?: string;
}

const RESERVATIONS_KEY = 'restaurant_reservations';

const seedReservations = (): Reservation[] => [
  {
    id: 'RES-2026-001',
    userId: 'user-001',
    name: 'Juan Pérez',
    email: 'juan@demo.com',
    phone: '+1 (809) 555-0123',
    date: '2026-03-15',
    time: '19:00',
    guests: 2,
    notes: '',
    status: 'confirmed',
    tableNumber: 5,
    location: 'Restaurante Principal',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'RES-2026-002',
    userId: 'user-001',
    name: 'Juan Pérez',
    email: 'juan@demo.com',
    phone: '+1 (809) 555-0123',
    date: '2026-02-14',
    time: '20:30',
    guests: 4,
    notes: 'Cena romántica',
    status: 'completed',
    tableNumber: 12,
    location: 'Terraza',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const getStoredReservations = (): Reservation[] => {
  try {
    const stored = localStorage.getItem(RESERVATIONS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  const initial = seedReservations();
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(initial));
  return initial;
};

const generateId = () => `RES-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const ReservationsContext = createContext<ReservationsContextValue | null>(null);

export const ReservationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reservations, setReservations] = useState<Reservation[]>(() => getStoredReservations());

  useEffect(() => {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
  }, [reservations]);

  const createReservation = useCallback((data: CreateReservationData): Reservation => {
    const newRes: Reservation = {
      id: generateId(),
      userId: data.userId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      guests: data.guests,
      notes: data.notes,
      status: 'confirmed',
      location: data.location || 'Restaurante Principal',
      createdAt: new Date().toISOString(),
    };
    setReservations(prev => [newRes, ...prev]);
    return newRes;
  }, []);

  const cancelReservation = useCallback((id: string) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  }, []);

  const getReservationsByUser = useCallback((userId: string) => {
    return reservations.filter(r => r.userId === userId);
  }, [reservations]);

  const getAllReservations = useCallback(() => reservations, [reservations]);

  const updateReservationStatus = useCallback((id: string, status: ReservationStatus, tableNumber?: number) => {
    setReservations(prev => prev.map(r =>
      r.id === id ? { ...r, status, ...(tableNumber !== undefined ? { tableNumber } : {}) } : r
    ));
  }, []);

  return (
    <ReservationsContext.Provider value={{
      reservations,
      createReservation,
      cancelReservation,
      getReservationsByUser,
      getAllReservations,
      updateReservationStatus,
    }}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => {
  const ctx = useContext(ReservationsContext);
  if (!ctx) throw new Error('useReservations must be used within ReservationsProvider');
  return ctx;
};
