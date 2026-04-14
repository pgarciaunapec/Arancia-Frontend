import React, { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import type { ISavedAddress } from '../types';

interface SavedAddressSelectProps {
  addresses: ISavedAddress[];
  onSelect: (address: ISavedAddress | null) => void;
  onSave: (address: Omit<ISavedAddress, '_id'>) => Promise<void>;
  loading?: boolean;
  error?: string;
}

/**
 * Componente para seleccionar dirección guardada con fallback a input manual
 * Incluye opción de guardar dirección en perfil del usuario
 */
export const SavedAddressSelect: React.FC<SavedAddressSelectProps> = ({
  addresses,
  onSelect,
  onSave,
  loading = false,
  error,
}) => {
  const [showManual, setShowManual] = useState(addresses.length === 0);
  const [manualData, setManualData] = useState({
    name: '',
    address: '',
    city: 'Santo Domingo',
    zip: '00000',
  });
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectAddress = (address: ISavedAddress) => {
    onSelect(address);
    setShowManual(false);
  };

  const handleManualSubmit = async () => {
    if (!manualData.name || !manualData.address || !manualData.city) {
      return;
    }

    if (saveToProfile) {
      setSubmitting(true);
      try {
        await onSave({
          label: manualData.name,
          name: manualData.name,
          address: manualData.address,
          city: manualData.city,
          zip: manualData.zip,
          isDefault: false,
        });
      } finally {
        setSubmitting(false);
      }
    }

    onSelect({
      _id: 'manual',
      name: manualData.name,
      address: manualData.address,
      city: manualData.city,
      zip: manualData.zip,
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {!showManual && addresses.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="address-select">Dirección Guardada</Label>
          <select
            id="address-select"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            onChange={(e) => {
              const address = addresses.find(a => a._id === e.target.value);
              if (address) handleSelectAddress(address);
            }}
            defaultValue=""
          >
            <option value="">-- Selecciona una dirección guardada --</option>
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {addr.label || addr.name} - {addr.address}
              </option>
            ))}
            <option value="__new__">-- Usar nueva dirección --</option>
          </select>
        </div>
      )}

      {showManual && (
        <div className="space-y-3 p-4 rounded-md border border-border">
          <h4 className="font-bold text-sm">Dirección de Entrega</h4>

          <div>
            <Label htmlFor="addr-name" className="text-xs">Nombre</Label>
            <Input
              id="addr-name"
              placeholder="Tu nombre"
              value={manualData.name}
              onChange={(e) =>
                setManualData({ ...manualData, name: e.target.value })
              }
              disabled={loading || submitting}
            />
          </div>

          <div>
            <Label htmlFor="addr-address" className="text-xs">Dirección</Label>
            <Input
              id="addr-address"
              placeholder="Calle Número, Apto/Casa"
              value={manualData.address}
              onChange={(e) =>
                setManualData({ ...manualData, address: e.target.value })
              }
              disabled={loading || submitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="addr-city" className="text-xs">Ciudad</Label>
              <Input
                id="addr-city"
                placeholder="Santo Domingo"
                value={manualData.city}
                onChange={(e) =>
                  setManualData({ ...manualData, city: e.target.value })
                }
                disabled={loading || submitting}
              />
            </div>
            <div>
              <Label htmlFor="addr-zip" className="text-xs">Código Postal</Label>
              <Input
                id="addr-zip"
                placeholder="00000"
                value={manualData.zip}
                onChange={(e) =>
                  setManualData({ ...manualData, zip: e.target.value })
                }
                disabled={loading || submitting}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="save-address"
              checked={saveToProfile}
              onCheckedChange={(checked) => setSaveToProfile(checked === true)}
              disabled={loading || submitting}
            />
            <Label htmlFor="save-address" className="text-xs cursor-pointer">
              Guardar dirección en mi perfil
            </Label>
          </div>

          <Button
            onClick={handleManualSubmit}
            disabled={loading || submitting || !manualData.name || !manualData.address}
            className="w-full"
          >
            {submitting ? 'Guardando...' : 'Confirmar Dirección'}
          </Button>

          {addresses.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => setShowManual(false)}
              className="w-full text-xs"
            >
              Ver direcciones guardadas
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
