import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { RestaurantTable, InventoryItem, CashSession, TableStatus } from '../types';
import { apiRequest } from '../lib/api';
import type { ApiEnvelope } from '../lib/api';
import { mapBackendInventoryItem, mapBackendTable } from '../lib/mappers';
import { useAuth } from './AuthContext';

interface AdminContextValue {
  tables: RestaurantTable[];
  inventory: InventoryItem[];
  lowStockAlerts: InventoryItem[];
  cashSession: CashSession | null;
  updateTableStatus: (tableId: string, status: TableStatus) => Promise<void>;
  updateInventoryItem: (itemId: string, data: Partial<InventoryItem>) => Promise<void>;
  restockInventoryItem: (itemId: string, quantity: number) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => Promise<void>;
  removeInventoryItem: (itemId: string) => Promise<void>;
  openCashSession: (openingBalance: number) => Promise<void>;
  closeCashSession: (payload?: { notes?: string; declaredClosingBalance?: number }) => Promise<void>;
  refreshAlerts: () => Promise<void>;
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
  const { isAuthenticated, isAdmin, user } = useAuth();
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<InventoryItem[]>([]);
  const [cashSession, setCashSession] = useState<CashSession | null>(null);

  const refreshAlerts = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setLowStockAlerts([]);
      return;
    }

    const alertsResponse = await apiRequest<ApiEnvelope<any[]>>('/admin/inventory/alerts', { auth: true });
    setLowStockAlerts((alertsResponse.data || []).map(mapBackendInventoryItem));
  }, [isAuthenticated, user?.role]);

  const refreshAdminData = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) {
      setTables([]);
      setInventory([]);
      setLowStockAlerts([]);
      setCashSession(null);
      return;
    }

    const canManageInventory = user?.role === 'admin';

    const [tablesResponse, cashResponse, inventoryResponse, alertsResponse] = await Promise.all([
      apiRequest<ApiEnvelope<any[]>>('/admin/tables', { auth: true }),
      apiRequest<ApiEnvelope<any | null>>('/admin/cash-register/today', { auth: true }),
      canManageInventory
        ? apiRequest<ApiEnvelope<any[]>>('/admin/inventory', { auth: true })
        : Promise.resolve({ data: [] } as ApiEnvelope<any[]>),
      canManageInventory
        ? apiRequest<ApiEnvelope<any[]>>('/admin/inventory/alerts', { auth: true })
        : Promise.resolve({ data: [] } as ApiEnvelope<any[]>),
    ]);

    setTables((tablesResponse.data || []).map(mapBackendTable));
    setInventory((inventoryResponse.data || []).map(mapBackendInventoryItem));
    setLowStockAlerts((alertsResponse.data || []).map(mapBackendInventoryItem));
    setCashSession(cashResponse.data ? mapCashRegister(cashResponse.data) : null);
  }, [isAdmin, isAuthenticated, user?.role]);

  useEffect(() => {
    refreshAdminData().catch(() => {
      setTables([]);
      setInventory([]);
      setLowStockAlerts([]);
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

  const restockInventoryItem = useCallback(async (itemId: string, quantity: number) => {
    await apiRequest(`/admin/inventory/${itemId}/restock`, {
      method: 'PATCH',
      auth: true,
      body: JSON.stringify({ quantity }),
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

  const closeCashSession = useCallback(async (payload?: { notes?: string; declaredClosingBalance?: number }) => {
    await apiRequest('/admin/cash-register/close', {
      method: 'POST',
      auth: true,
      body: JSON.stringify({
        notes: payload?.notes || 'Cierre desde panel',
        declaredClosingBalance: payload?.declaredClosingBalance,
      }),
    });

    await refreshAdminData();
  }, [refreshAdminData]);

  return (
    <AdminContext.Provider
      value={{
        tables,
        inventory,
        lowStockAlerts,
        cashSession,
        updateTableStatus,
        updateInventoryItem,
        restockInventoryItem,
        addInventoryItem,
        removeInventoryItem,
        openCashSession,
        closeCashSession,
        refreshAlerts,
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
