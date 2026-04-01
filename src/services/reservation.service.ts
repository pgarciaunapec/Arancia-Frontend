/**
 * Reservation Service
 * Maneja operaciones de reservaciones
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Reservation {
  _id: string;
  user?: string;
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  status: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReservationResponse {
  success: boolean;
  count?: number;
  data: Reservation | Reservation[];
  message?: string;
}

export class ReservationService {
  /**
   * Create a new reservation
   */
  static async create(
    reservation: Omit<Reservation, "_id" | "createdAt" | "updatedAt">,
  ): Promise<Reservation> {
    const response = await fetch(`${API_BASE_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al crear reservación");
    }

    const data: ReservationResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as Reservation);
  }

  /**
   * Get user's reservations
   */
  static async getUserReservations(token: string): Promise<Reservation[]> {
    const response = await fetch(
      `${API_BASE_URL}/reservations/my-reservations`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) throw new Error("Error al obtener reservaciones");

    const data: ReservationResponse = await response.json();
    return Array.isArray(data.data) ? data.data : [data.data as Reservation];
  }

  /**
   * Get reservation by ID
   */
  static async getById(id: string): Promise<Reservation> {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`);
    if (!response.ok) throw new Error("Reservación no encontrada");

    const data: ReservationResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as Reservation);
  }

  /**
   * Update a reservation
   */
  static async update(
    id: string,
    reservation: Partial<Reservation>,
  ): Promise<Reservation> {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reservation),
    });

    if (!response.ok) throw new Error("Error al actualizar reservación");

    const data: ReservationResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as Reservation);
  }

  /**
   * Cancel a reservation
   */
  static async cancel(id: string): Promise<Reservation> {
    const response = await fetch(`${API_BASE_URL}/reservations/${id}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Error al cancelar reservación");

    const data: ReservationResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as Reservation);
  }

  /**
   * Get all reservations (admin)
   */
  static async getAll(
    token: string,
    skip = 0,
    limit = 10,
  ): Promise<{ data: Reservation[]; total: number }> {
    const response = await fetch(
      `${API_BASE_URL}/reservations/admin/all?skip=${skip}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );

    if (!response.ok) throw new Error("Error al obtener reservaciones");

    const data: any = await response.json();
    return {
      data: Array.isArray(data.data) ? data.data : [data.data],
      total: data.total,
    };
  }

  /**
   * Confirm reservation (admin)
   */
  static async confirm(token: string, id: string): Promise<Reservation> {
    const response = await fetch(
      `${API_BASE_URL}/reservations/admin/${id}/confirm`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    if (!response.ok) throw new Error("Error al confirmar reservación");

    const data: ReservationResponse = await response.json();
    return Array.isArray(data.data) ? data.data[0] : (data.data as Reservation);
  }
}
