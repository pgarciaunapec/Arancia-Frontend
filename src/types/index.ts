export interface MenuItem {
  id: string;
  backendId?: string;
  name: string;
  category: string;
  price: number;
  ingredients: string[];
  description?: string;
  isPopular?: boolean;
  image: string;
}

export interface FilterState {
  category: string;
  sortBy: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  isVIP: boolean;
  createdAt: string;
  loyaltyPoints: number;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  backendId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  ingredients?: string[];
  description?: string;
}

// ─── Orders / Payments ───────────────────────────────────────────────────────
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'cash' | 'transfer';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type DeliveryType = 'delivery' | 'pickup' | 'dine-in';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  tax: number;
  total: number;
  method: PaymentMethod;
  status: PaymentStatus;
  cardLast4?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  ingredients?: string[];
  description?: string;
}

export interface Order {
  id: string;
  backendId?: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  deliveryType: DeliveryType;
  deliveryAddress?: string;
  estimatedMinutes?: number;
  transaction?: PaymentTransaction;
  createdAt: string;
  updatedAt: string;
  tableNumber?: number;
}

// ─── Reservations ────────────────────────────────────────────────────────────
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface ReservationPricing {
  coverPerGuest: number;
  previousTotal: number;
  newTotal: number;
  delta: number;
  additionalChargeApplied: boolean;
}

export interface Reservation {
  id: string;
  backendId?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: ReservationStatus;
  tableNumber?: number;
  location: string;
  pricing?: ReservationPricing;
  createdAt: string;
}

// ─── Delivery ────────────────────────────────────────────────────────────────
export type DeliveryStep = 'confirmed' | 'preparing' | 'ready' | 'on_the_way' | 'delivered';

export interface DeliveryTracking {
  orderId: string;
  currentStep: DeliveryStep;
  estimatedMinutes: number;
  address: string;
  steps: { step: DeliveryStep; label: string; completedAt?: string }[];
}

// ─── Admin – Tables ──────────────────────────────────────────────────────────
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface RestaurantTable {
  id: string;
  number: number;
  capacity: number;
  status: TableStatus;
  section: string;
  currentOrderId?: string;
  reservationId?: string;
}

// ─── Admin – Inventory ───────────────────────────────────────────────────────
export type StockStatus = 'ok' | 'low' | 'out';

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  costPerUnit: number;
  supplier: string;
  lastUpdated: string;
  status: StockStatus;
}

// ─── Admin – Cash Register ───────────────────────────────────────────────────
export interface CashSession {
  id: string;
  date: string;
  openedBy: string;
  openingBalance: number;
  closingBalance?: number;
  totalSales: number;
  totalOrders: number;
  isOpen: boolean;
  transactions: PaymentTransaction[];
}
