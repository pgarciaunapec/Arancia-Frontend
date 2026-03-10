import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { RestaurantTable, InventoryItem, CashSession, TableStatus, StockStatus } from '../types';

interface AdminContextValue {
  tables: RestaurantTable[];
  inventory: InventoryItem[];
  cashSession: CashSession | null;
  updateTableStatus: (tableId: number, status: TableStatus, orderId?: string) => void;
  updateInventoryItem: (itemId: string, data: Partial<InventoryItem>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => void;
  removeInventoryItem: (itemId: string) => void;
  openCashSession: (openingBalance: number, openedBy: string) => void;
  closeCashSession: (closingBalance: number) => void;
}

const TABLES_KEY = 'restaurant_tables';
const INVENTORY_KEY = 'restaurant_inventory';
const CASH_KEY = 'restaurant_cash_session';

const seedTables = (): RestaurantTable[] => [
  { id: 1, number: 1, capacity: 2, status: 'available', section: 'Interior' },
  { id: 2, number: 2, capacity: 4, status: 'occupied', section: 'Interior' },
  { id: 3, number: 3, capacity: 4, status: 'reserved', section: 'Interior' },
  { id: 4, number: 4, capacity: 6, status: 'available', section: 'Interior' },
  { id: 5, number: 5, capacity: 2, status: 'available', section: 'Interior' },
  { id: 6, number: 6, capacity: 8, status: 'cleaning', section: 'Salón Privado' },
  { id: 7, number: 7, capacity: 4, status: 'available', section: 'Terraza' },
  { id: 8, number: 8, capacity: 4, status: 'occupied', section: 'Terraza' },
  { id: 9, number: 9, capacity: 6, status: 'available', section: 'Terraza' },
  { id: 10, number: 10, capacity: 2, status: 'reserved', section: 'Barra' },
  { id: 11, number: 11, capacity: 2, status: 'available', section: 'Barra' },
  { id: 12, number: 12, capacity: 4, status: 'available', section: 'Terraza' },
];

const computeStockStatus = (qty: number, min: number): StockStatus => {
  if (qty === 0) return 'out';
  if (qty <= min) return 'low';
  return 'ok';
};

const seedInventory = (): InventoryItem[] => [
  { id: 'inv-001', name: 'Pollo entero', category: 'Carnes', quantity: 25, unit: 'kg', minStock: 10, costPerUnit: 180, supplier: 'Carnes Premium SRL', lastUpdated: new Date().toISOString(), status: 'ok' },
  { id: 'inv-002', name: 'Res (lomo)', category: 'Carnes', quantity: 8, unit: 'kg', minStock: 10, costPerUnit: 350, supplier: 'Carnes Premium SRL', lastUpdated: new Date().toISOString(), status: 'low' },
  { id: 'inv-003', name: 'Camarones', category: 'Mariscos', quantity: 0, unit: 'kg', minStock: 5, costPerUnit: 520, supplier: 'Mariscos del Caribe', lastUpdated: new Date().toISOString(), status: 'out' },
  { id: 'inv-004', name: 'Aceite vegetal', category: 'Aceites', quantity: 12, unit: 'litros', minStock: 5, costPerUnit: 95, supplier: 'Distribuidora Central', lastUpdated: new Date().toISOString(), status: 'ok' },
  { id: 'inv-005', name: 'Arroz blanco', category: 'Granos', quantity: 50, unit: 'kg', minStock: 20, costPerUnit: 45, supplier: 'Granos y Más', lastUpdated: new Date().toISOString(), status: 'ok' },
  { id: 'inv-006', name: 'Habichuelas negras', category: 'Granos', quantity: 3, unit: 'kg', minStock: 10, costPerUnit: 60, supplier: 'Granos y Más', lastUpdated: new Date().toISOString(), status: 'low' },
  { id: 'inv-007', name: 'Piña fresca', category: 'Frutas', quantity: 20, unit: 'unidades', minStock: 8, costPerUnit: 35, supplier: 'Frutería Tropical', lastUpdated: new Date().toISOString(), status: 'ok' },
  { id: 'inv-008', name: 'Ron Brugal', category: 'Licores', quantity: 6, unit: 'botellas', minStock: 4, costPerUnit: 750, supplier: 'Distribuidora de Licores', lastUpdated: new Date().toISOString(), status: 'ok' },
  { id: 'inv-009', name: 'Vodka Absolut', category: 'Licores', quantity: 2, unit: 'botellas', minStock: 3, costPerUnit: 1200, supplier: 'Distribuidora de Licores', lastUpdated: new Date().toISOString(), status: 'low' },
  { id: 'inv-010', name: 'Harina de maíz', category: 'Harinas', quantity: 30, unit: 'kg', minStock: 15, costPerUnit: 40, supplier: 'Granos y Más', lastUpdated: new Date().toISOString(), status: 'ok' },
];

const initializeFromStorage = <T,>(key: string, seed: () => T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);
  } catch {}
  const initial = seed();
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<RestaurantTable[]>(() => initializeFromStorage(TABLES_KEY, seedTables));
  const [inventory, setInventory] = useState<InventoryItem[]>(() => initializeFromStorage(INVENTORY_KEY, seedInventory));
  const [cashSession, setCashSession] = useState<CashSession | null>(() => {
    try {
      const stored = localStorage.getItem(CASH_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  useEffect(() => { localStorage.setItem(TABLES_KEY, JSON.stringify(tables)); }, [tables]);
  useEffect(() => { localStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory)); }, [inventory]);
  useEffect(() => { localStorage.setItem(CASH_KEY, JSON.stringify(cashSession)); }, [cashSession]);

  const updateTableStatus = useCallback((tableId: number, status: TableStatus, orderId?: string) => {
    setTables(prev => prev.map(t =>
      t.id === tableId ? { ...t, status, currentOrderId: orderId } : t
    ));
  }, []);

  const updateInventoryItem = useCallback((itemId: string, data: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      const updated = { ...item, ...data, lastUpdated: new Date().toISOString() };
      updated.status = computeStockStatus(updated.quantity, updated.minStock);
      return updated;
    }));
  }, []);

  const addInventoryItem = useCallback((data: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => {
    const newItem: InventoryItem = {
      ...data,
      id: `inv-${Date.now()}`,
      lastUpdated: new Date().toISOString(),
      status: computeStockStatus(data.quantity, data.minStock),
    };
    setInventory(prev => [...prev, newItem]);
  }, []);

  const removeInventoryItem = useCallback((itemId: string) => {
    setInventory(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const openCashSession = useCallback((openingBalance: number, openedBy: string) => {
    const session: CashSession = {
      id: `CASH-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      openedBy,
      openingBalance,
      totalSales: 0,
      totalOrders: 0,
      isOpen: true,
      transactions: [],
    };
    setCashSession(session);
  }, []);

  const closeCashSession = useCallback((closingBalance: number) => {
    setCashSession(prev => prev ? { ...prev, closingBalance, isOpen: false } : null);
  }, []);

  return (
    <AdminContext.Provider value={{
      tables, inventory, cashSession,
      updateTableStatus, updateInventoryItem, addInventoryItem, removeInventoryItem,
      openCashSession, closeCashSession,
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
