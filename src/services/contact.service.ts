/**
 * Contact Service
 * Maneja operaciones de contacto
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  success: boolean;
  data: Contact;
  message?: string;
}

export class ContactService {
  /**
   * Send a contact message
   */
  static async send(
    contact: Omit<Contact, "_id" | "status" | "createdAt" | "updatedAt">,
  ): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contact),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al enviar mensaje");
    }

    const data: ContactResponse = await response.json();
    return data.data;
  }

  /**
   * Get all messages (admin)
   */
  static async getAll(
    token: string,
    skip = 0,
    limit = 10,
    status?: string,
  ): Promise<{ data: Contact[]; total: number }> {
    const params = new URLSearchParams();
    params.append("skip", String(skip));
    params.append("limit", String(limit));
    if (status) params.append("status", status);

    const response = await fetch(`${API_BASE_URL}/contact?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al obtener mensajes");

    const data: any = await response.json();
    return {
      data: Array.isArray(data.data) ? data.data : [data.data],
      total: data.total,
    };
  }

  /**
   * Get message by ID
   */
  static async getById(token: string, id: string): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Mensaje no encontrado");

    const data: ContactResponse = await response.json();
    return data.data;
  }

  /**
   * Update message status (admin)
   */
  static async updateStatus(
    token: string,
    id: string,
    status: string,
  ): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contact/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error("Error al actualizar estado");

    const data: ContactResponse = await response.json();
    return data.data;
  }

  /**
   * Delete message (admin)
   */
  static async delete(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contact/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Error al eliminar mensaje");
  }
}
