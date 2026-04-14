import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface CashRegisterEntry {
  id: string;
  type: 'entrada' | 'salida';
  description: string;
  amount: number;
  timestamp: string;
  reference?: string;
  category?: 'venta' | 'gasto' | 'cierre' | 'otro';
}

interface CashRegisterProps {
  isOpen?: boolean;
  onOpenSession?: () => Promise<void>;
  onCloseSession?: (balance: number) => Promise<void>;
  entries?: CashRegisterEntry[];
}

/**
 * Componente de Caja (Cash Register)
 * Gestiona flujo de entrada/salida de dinero en el restaurante
 */
export const CashRegister: React.FC<CashRegisterProps> = ({
  isOpen = false,
  onOpenSession,
  onCloseSession,
  entries = [],
}) => {
  const [localEntries, setLocalEntries] = useState<CashRegisterEntry[]>(entries);
  const [newEntry, setNewEntry] = useState({
    type: 'entrada' as const,
    description: '',
    amount: 0,
    category: 'venta' as const,
  });
  const [loading, setLoading] = useState(false);

  const totalEntradas = localEntries
    .filter((e) => e.type === 'entrada')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalSalidas = localEntries
    .filter((e) => e.type === 'salida')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalEntradas - totalSalidas;

  const handleAddEntry = () => {
    if (!newEntry.description || newEntry.amount <= 0) {
      alert('Completa todos los campos correctamente');
      return;
    }

    const entry: CashRegisterEntry = {
      id: `${Date.now()}`,
      type: newEntry.type,
      description: newEntry.description,
      amount: newEntry.amount,
      category: newEntry.category,
      timestamp: new Date().toLocaleString('es-DO'),
    };

    setLocalEntries([...localEntries, entry]);
    setNewEntry({
      type: 'entrada',
      description: '',
      amount: 0,
      category: 'venta',
    });
  };

  const handleOpenSession = async () => {
    if (onOpenSession) {
      setLoading(true);
      try {
        await onOpenSession();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSession = async () => {
    if (onCloseSession) {
      setLoading(true);
      try {
        await onCloseSession(balance);
        setLocalEntries([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con Controles */}
      <Card className="p-6 bg-gradient-to-r from-amber-900 to-amber-950 border-amber-700">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Caja Diaria</h2>
            <p className="text-amber-200 text-sm">
              {isOpen ? '✅ Caja abierta' : '❌ Caja cerrada'}
            </p>
          </div>
          <div className="space-x-2">
            <Button
              onClick={handleOpenSession}
              disabled={isOpen || loading}
              variant="default"
            >
              {loading ? 'Procesando...' : 'Abrir Caja'}
            </Button>
            <Button
              onClick={handleCloseSession}
              disabled={!isOpen || loading}
              variant="destructive"
            >
              {loading ? 'Procesando...' : 'Cerrar Caja'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-green-500/10 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">Entradas</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                ${totalEntradas.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </Card>

        <Card className="p-4 bg-red-500/10 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-red-600 font-medium">Salidas</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                ${totalSalidas.toFixed(2)}
              </p>
            </div>
            <TrendingDown className="text-red-600" size={32} />
          </div>
        </Card>

        <Card className="p-4 bg-amber-500/10 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-amber-600 font-medium">Balance</p>
              <p className="text-2xl font-bold text-amber-600 mt-2">
                ${balance.toFixed(2)}
              </p>
            </div>
            <DollarSign className="text-amber-600" size={32} />
          </div>
        </Card>
      </div>

      {/* Formulario para Nueva Entrada */}
      {isOpen && (
        <Card className="p-6 border-primary/30">
          <h3 className="font-bold mb-4 text-white">Registrar Movimiento</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select
                value={newEntry.type}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    type: e.target.value as 'entrada' | 'salida',
                  })
                }
                className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>

              <select
                value={newEntry.category}
                onChange={(e) =>
                  setNewEntry({
                    ...newEntry,
                    category: e.target.value as CashRegisterEntry['category'],
                  })
                }
                className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
              >
                <option value="venta">Venta</option>
                <option value="gasto">Gasto</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Descripción"
              value={newEntry.description}
              onChange={(e) =>
                setNewEntry({ ...newEntry, description: e.target.value })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
            />

            <input
              type="number"
              placeholder="Monto (RD$)"
              value={newEntry.amount === 0 ? '' : newEntry.amount}
              onChange={(e) =>
                setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) || 0 })
              }
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
            />

            <Button onClick={handleAddEntry} className="w-full">
              Registrar Movimiento
            </Button>
          </div>
        </Card>
      )}

      {/* Historial */}
      <Card className="p-6">
        <h3 className="font-bold mb-4 text-white flex items-center gap-2">
          <Clock size={18} /> Historial de Movimientos
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {localEntries.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Sin movimientos registrados
            </p>
          ) : (
            localEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center p-3 bg-black/20 rounded-md border border-border"
              >
                <div className="flex-1">
                  <p className="font-medium text-white">{entry.description}</p>
                  <p className="text-xs text-muted-foreground">{entry.timestamp}</p>
                </div>
                <div
                  className={`text-lg font-bold ${
                    entry.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {entry.type === 'entrada' ? '+' : '-'}${entry.amount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
