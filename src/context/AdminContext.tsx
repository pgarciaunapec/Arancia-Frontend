import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { RestaurantTable, InventoryItem, CashSession, TableStatus } from '../types';
import { apiRequest } from '../lib/api';
import type { ApiEnvelope } from '../lib/api';
import { mapBackendInventoryItem, mapBackendTable } from '../lib/mappers';
import { useAuth } from './AuthContext';

interface AdminContextValue {
  tables: RestaurantTable[];
  inventory: InventoryItem[];
  cashSession: CashSession | null;
  updateTableStatus: (tableId: string, status: TableStatus) => Promise<void>;
  updateInventoryItem: (itemId: string, data: Partial<InventoryItem>) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => Promise<void>;
  removeInventoryItem: (itemId: string) => Promise<void>;
  openCashSession: (openingBalance: number, openedBy: string) => Promise<void>;
  closeCashSession: () => Promise<void>;
  refreshAdminData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextValue | null>(null);

const mapCashRegister = (raw: any): CashSession => ({
  id: String(raw._id || raw.id),
  date: raw.date || new Date().toISOString(),
  openedBy: raw.openedBy?.name || 'Admin',
  openingBalance: Number(raw.openingBalance || 0),
  closingBalance: raw.closingBalance !== undefined ? Number(raw.closingBalance) : undefined,
  totalSales: Number(raw.totalSales || 0),
  totalOrders: Number(raw.transactionCount || 0),
  isOpen: raw.status === 'open',
  transactions: [],
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [cashSession, setCashSession] = useState<CashSession | null>(null);

  const refreshAdminData = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) {
      setTables([]);
      setInventory([]);
      setCashSession(null);
      return;
    }

    const [tablesResponse, inventoryResponse, cashResponse] = await Promise.all([
      apiRequest<ApiEnvelope<any[]>>('/admin/tables', { auth: true }),
      apiRequest<ApiEnvelope<any[]>>('/admin/inventory', { auth: true }),
      apiRequest<ApiEnvelope<any | null>>('/admin/cash-register/today', { auth: true }),
    ]);

    setTables((tablesResponse.data || []).map(mapBackendTable));
    setInventory((inventoryResponse.data || []).map(mapBackendInventoryItem));
    setCashSession(cashResponse.data ? mapCashRegister(cashResponse.data) : null);
  }, [isAdmin, isAuthenticated]);

  useEffect(() => {
    refreshAdminData().catch(() => {
      setTables([]);
      setInventory([]);
      setCashSession(null);
    });
  }, [refreshAdminData]);

  const updateTableStatus = useCallback(async (tableId: string, status: TableStatus) => {
    await apiRequest(`/admin/tables/${tableId}`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify({ status }),
    });

    setTables((prev) => prev.map((table) => (table.id === tableId ? { ...table, status } : table)));
  }, []);

  const updateInventoryItem = useCallback(async (itemId: string, data: Partial<InventoryItem>) => {
    await apiRequest(`/admin/inventory/${itemId}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify({
        name: data.name,
        category: data.category,
        currentStock: data.quantity,
        minimumStock: data.minStock,
        unit: data.unit,
        costPerUnit: data.costPerUnit,
        supplier: data.supplier,
      }),
    });

    await refreshAdminData();
  }, [refreshAdminData]);

  const addInventoryItem = useCallback(async (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => {
    await apiRequest('/admin/inventory', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        name: item.name,
        category: item.category,
        currentStock: item.quantity,
        minimumStock: item.minStock,
        unit: item.unit,
        costPerUnit: item.costPerUnit,
        supplier: item.supplier,
      }),
    });

    await refreshAdminData();
  }, [refreshAdminData]);

  const removeInventoryItem = useCallback(async (itemId: string) => {
    await apiRequest(`/admin/inventory/${itemId}`, {
      method: 'DELETE',
      auth: true,
    });

    setInventory((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const openCashSession = useCallback(async (openingBalance: number) => {
    await apiRequest('/admin/cash-register/open', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ openingBalance }),
    });

    await refreshAdminData();
  }, [refreshAdminData]);

  const closeCashSession = useCallback(async () => {
    await apiRequest('/admin/cash-register/close', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({ notes: 'Cierre automático desde panel' }),
    });

    await refreshAdminData();
  }, [refreshAdminData]);

  return (
    <AdminContext.Provider
      value={{
        tables,
        inventory,
        cashSession,
        updateTableStatus,
        updateInventoryItem,
        addInventoryItem,
        removeInventoryItem,
        openCashSession,
        closeCashSession,
        refreshAdminData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
};
