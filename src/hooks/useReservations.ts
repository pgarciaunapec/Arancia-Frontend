/**
 * useReservations Hook
 * Maneja reservaciones del usuario
 */

import { useState, useCallback } from "react";
import {
  ReservationService,
  type Reservation,
} from "../services/reservation.service";

export interface UseReservationsReturn {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  createReservation: (
    reservation: Omit<Reservation, "_id" | "createdAt" | "updatedAt">,
  ) => Promise<Reservation>;
  cancelReservation: (id: string) => Promise<void>;
  refetch: (token: string) => Promise<void>;
}

export const useReservations = (
  token: string | null,
): UseReservationsReturn => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async (authToken: string) => {
    if (!authToken) return;
    try {
      setIsLoading(true);
      setError(null);
      const userReservations =
        await ReservationService.getUserReservations(authToken);
      setReservations(userReservations);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar reservaciones",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReservation = useCallback(
    async (
      reservation: Omit<Reservation, "_id" | "createdAt" | "updatedAt">,
    ): Promise<Reservation> => {
      try {
        setIsLoading(true);
        const created = await ReservationService.create(reservation);
        if (token) {
          await refetch(token);
        }
        return created;
      } finally {
        setIsLoading(false);
      }
    },
    [token, refetch],
  );

  const cancelReservation = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);
        await ReservationService.cancel(id);
        if (token) {
          await refetch(token);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [token, refetch],
  );

  return {
    reservations,
    isLoading,
    error,
    createReservation,
    cancelReservation,
    refetch,
  };
};
