import type {
  CartItem,
  DeliveryType,
  InventoryItem,
  MenuItem,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentTransaction,
  Reservation,
  ReservationStatus,
  RestaurantTable,
  StockStatus,
  User,
} from '../types';

const strHash = (value: string): number => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
};

export const mapBackendUser = (raw: any): User => ({
  id: String(raw.id || raw._id),
  name: raw.name || '',
  email: raw.email || '',
  phone: raw.phone || '',
  address: raw.address || '',
  role: raw.role || 'customer',
  isVIP: !!raw.isVip,
  createdAt: raw.createdAt || new Date().toISOString(),
  loyaltyPoints: raw.loyaltyPoints || 0,
});

export const mapBackendMenuItem = (raw: any): MenuItem => ({
  id: String(raw._id || raw.id),
  backendId: String(raw._id || raw.id),
  name: raw.name,
  category: raw.category,
  price: Number(raw.price || 0),
  ingredients: Array.isArray(raw.ingredients) ? raw.ingredients : [],
  image: raw.image || '',
});

export const mapBackendCartItem = (raw: any): CartItem => {
  const backendId = String(raw.menuItem?._id || raw.menuItem || raw._id || raw.id);
  return {
    id: backendId,
    backendId,
    name: raw.name || raw.menuItem?.name || 'Item',
    price: Number(raw.price || raw.menuItem?.price || 0),
    quantity: Number(raw.quantity || 1),
    image: raw.image || raw.menuItem?.image || '',
    category: raw.category || raw.menuItem?.category || 'General',
  };
};

const mapOrderStatus = (status: string): OrderStatus => {
  if (status === 'pending' || status === 'confirmed' || status === 'preparing' || status === 'ready' || status === 'delivering' || status === 'delivered' || status === 'cancelled') {
    return status;
  }
  return 'pending';
};

export const mapBackendOrder = (raw: any, userId?: string): Order => {
  const backendId = String(raw._id || raw.id);
  const deliveryType: DeliveryType = raw.isDelivery ? 'delivery' : 'pickup';

  const transaction: PaymentTransaction | undefined = raw.latestPayment
    ? {
        id: String(raw.latestPayment._id),
        orderId: backendId,
        userId: String(raw.user || userId || ''),
        amount: Number(raw.latestPayment.amount || raw.subtotal || 0),
        tax: Number(raw.tax || 0),
        total: Number(raw.total || 0),
        method: (raw.latestPayment.method || 'cash') as PaymentMethod,
        status: raw.latestPayment.status === 'completed' ? 'paid' : 'pending',
        cardLast4: raw.latestPayment.last4Digits,
        createdAt: raw.latestPayment.createdAt || raw.createdAt,
      }
    : undefined;

  return {
    id: backendId,
    backendId,
    userId: String(raw.user || userId || ''),
    items: (raw.items || []).map((item: any) => ({
      id: String(item.menuItem?._id || item.menuItem || item._id || strHash(item.name || 'item')),
      name: item.name || item.menuItem?.name || 'Item',
      price: Number(item.price || item.menuItem?.price || 0),
      quantity: Number(item.quantity || 1),
      image: item.menuItem?.image || item.image || '',
    })),
    subtotal: Number(raw.subtotal || 0),
    tax: Number(raw.tax || 0),
    total: Number(raw.total || 0),
    status: mapOrderStatus(raw.status),
    deliveryType,
    deliveryAddress: raw.shippingAddress
      ? `${raw.shippingAddress.address}, ${raw.shippingAddress.city}`
      : undefined,
    estimatedMinutes: raw.estimatedMinutes || 35,
    transaction,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString(),
  };
};

export const mapBackendReservation = (raw: any, userId?: string): Reservation => {
  const status = ['pending', 'confirmed', 'cancelled', 'completed'].includes(raw.status)
    ? (raw.status as ReservationStatus)
    : 'pending';

  const date = raw.date ? new Date(raw.date).toISOString().split('T')[0] : '';

  return {
    id: String(raw._id || raw.id),
    backendId: String(raw._id || raw.id),
    userId: String(raw.user || userId || ''),
    name: raw.name || '',
    email: raw.email || '',
    phone: raw.phone || '',
    date,
    time: raw.time || '',
    guests: Number(raw.guests || 1),
    notes: raw.notes || '',
    status,
    location: raw.location || 'Restaurante Principal',
    createdAt: raw.createdAt || new Date().toISOString(),
  };
};

const mapStockStatus = (raw: any): StockStatus => {
  const quantity = Number(raw.currentStock || 0);
  const minimum = Number(raw.minimumStock || 0);
  if (quantity === 0) return 'out';
  if (quantity <= minimum) return 'low';
  return 'ok';
};

export const mapBackendInventoryItem = (raw: any): InventoryItem => ({
  id: String(raw._id || raw.id),
  name: raw.name,
  category: raw.category,
  quantity: Number(raw.currentStock || 0),
  unit: raw.unit || 'unidad',
  minStock: Number(raw.minimumStock || 0),
  costPerUnit: Number(raw.costPerUnit || 0),
  supplier: raw.supplier || 'N/A',
  lastUpdated: raw.updatedAt || new Date().toISOString(),
  status: mapStockStatus(raw),
});

export const mapBackendTable = (raw: any): RestaurantTable => ({
  id: String(raw._id || raw.id),
  number: Number(raw.number || 0),
  capacity: Number(raw.capacity || 0),
  status: raw.status || 'available',
  section: raw.zone || 'General',
  currentOrderId: raw.activeBill ? String(raw.activeBill) : undefined,
});
