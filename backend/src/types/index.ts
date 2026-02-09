import { Request } from 'express';
import { Types } from 'mongoose';

// User types
export interface IUser {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    createdAt: Date;
    updatedAt: Date;
}

// MenuItem types
export interface IMenuItem {
    _id: Types.ObjectId;
    name: string;
    category: string;
    price: number;
    ingredients: string[];
    image: string;
    available: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Reservation types
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface IReservation {
    _id: Types.ObjectId;
    user?: Types.ObjectId;
    date: Date;
    time: string;
    guests: number;
    name: string;
    email: string;
    phone: string;
    notes?: string;
    status: ReservationStatus;
    location?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Order types
export type OrderStatus = 'cart' | 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface IOrderItem {
    menuItem: Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
}

export interface IShippingAddress {
    name: string;
    address: string;
    city: string;
    zip: string;
}

export interface IOrder {
    _id: Types.ObjectId;
    user: Types.ObjectId;
    items: IOrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: OrderStatus;
    shippingAddress?: IShippingAddress;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
}

// Contact types
export type ContactStatus = 'unread' | 'read' | 'responded';

export interface IContact {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    message: string;
    status: ContactStatus;
    createdAt: Date;
    updatedAt: Date;
}

// EventRequest types
export type EventRequestStatus = 'pending' | 'contacted' | 'confirmed' | 'cancelled';

export interface IEventRequest {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    eventType: string;
    packageName?: string;
    guests: number;
    preferredDate?: Date;
    notes?: string;
    status: EventRequestStatus;
    createdAt: Date;
    updatedAt: Date;
}

// Express extended types
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

// API Response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
