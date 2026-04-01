/**
 * Services Index - Frontend
 */

export { AuthService, type User, type AuthResponse } from "./auth.service";
export { MenuService, type MenuItem, type MenuResponse } from "./menu.service";
export {
  OrderService,
  type Order,
  type CartItem,
  type OrderResponse,
} from "./order.service";
export {
  ReservationService,
  type Reservation,
  type ReservationResponse,
} from "./reservation.service";
export {
  ContactService,
  type Contact,
  type ContactResponse,
} from "./contact.service";

// Legacy API service (deprecated - use specific services instead)
// Use domain-specific services for better code organization
