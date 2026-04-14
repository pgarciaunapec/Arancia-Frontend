import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import type { ISavedCard } from '../types';

interface SavedCardSelectProps {
  cards: ISavedCard[];
  onSelect: (card: ISavedCard | null) => void;
  onSave: (card: Omit<ISavedCard, '_id'>) => Promise<void>;
  loading?: boolean;
  error?: string;
}

/**
 * Componente para seleccionar tarjeta guardada con fallback a entrada manual
 * Solo almacena últimos 4 dígitos por seguridad
 * Incluye opción de guardar tarjeta en perfil del usuario
 */
export const SavedCardSelect: React.FC<SavedCardSelectProps> = ({
  cards,
  onSelect,
  onSave,
  loading = false,
  error,
}) => {
  const [showManual, setShowManual] = useState(cards.length === 0);
  const [manualData, setManualData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [saveToProfile, setSaveToProfile] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const maskCardNumber = (value: string) =>
    value
      .replace(/\D/g, '')
      .slice(0, 19)
      .replace(/(.{4})/g, '$1 ')
      .trim();

  const maskCardExp = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const maskCardCvv = (value: string) => value.replace(/\D/g, '').slice(0, 4);

  const handleSelectCard = (card: ISavedCard) => {
    onSelect(card);
    setShowManual(false);
  };

  const handleManualSubmit = async () => {
    const cleanCard = manualData.cardNumber.replace(/\s/g, '');
    const expParts = manualData.expiryMonth.split('/');

    if (!cleanCard || !expParts[0] || !expParts[1] || !manualData.cvv) {
      return;
    }

    const month = parseInt(expParts[0], 10);
    const year = parseInt(expParts[1], 10) + (new Date().getFullYear() - 2024 + 2000);
    const last4 = cleanCard.slice(-4);

    if (saveToProfile) {
      setSubmitting(true);
      try {
        // Detectar tipo de tarjeta
        let cardType: 'visa' | 'mastercard' | 'other' = 'other';
        if (cleanCard.startsWith('4')) cardType = 'visa';
        if (cleanCard.startsWith('5')) cardType = 'mastercard';

        await onSave({
          label: `${cardType.toUpperCase()} ...${last4}`,
          last4,
          cardType,
          expiryMonth: month,
          expiryYear: year,
          isDefault: false,
        });
      } finally {
        setSubmitting(false);
      }
    }

    onSelect({
      _id: 'manual',
      last4,
      cardType: 'other',
      expiryMonth: month,
      expiryYear: year,
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}

      {!showManual && cards.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="card-select">Tarjeta Guardada</Label>
          <select
            id="card-select"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            onChange={(e) => {
              const card = cards.find(c => c._id === e.target.value);
              if (card) handleSelectCard(card);
            }}
            defaultValue=""
          >
            <option value="">-- Selecciona una tarjeta guardada --</option>
            {cards.map((card) => (
              <option key={card._id} value={card._id}>
                {card.label || `${card.cardType} ...${card.last4}`}
              </option>
            ))}
            <option value="__new__">-- Usar nueva tarjeta --</option>
          </select>
        </div>
      )}

      {showManual && (
        <div className="space-y-3 p-4 rounded-md border border-border">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={18} />
            <h4 className="font-bold text-sm">Datos de Tarjeta</h4>
          </div>

          <div>
            <Label htmlFor="card-number" className="text-xs">Número de Tarjeta</Label>
            <Input
              id="card-number"
              placeholder="4532 1234 5678 9010"
              value={maskCardNumber(manualData.cardNumber)}
              onChange={(e) =>
                setManualData({
                  ...manualData,
                  cardNumber: e.target.value.replace(/\s/g, ''),
                })
              }
              disabled={loading || submitting}
              maxLength={23}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="card-exp" className="text-xs">Vencimiento (MM/AA)</Label>
              <Input
                id="card-exp"
                placeholder="12/25"
                value={maskCardExp(manualData.expiryMonth)}
                onChange={(e) =>
                  setManualData({ ...manualData, expiryMonth: e.target.value })
                }
                disabled={loading || submitting}
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="card-cvv" className="text-xs">CVV</Label>
              <Input
                id="card-cvv"
                placeholder="123"
                value={maskCardCvv(manualData.cvv)}
                onChange={(e) =>
                  setManualData({ ...manualData, cvv: e.target.value })
                }
                disabled={loading || submitting}
                type="password"
                maxLength={4}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="save-card"
              checked={saveToProfile}
              onCheckedChange={(checked) => setSaveToProfile(checked === true)}
              disabled={loading || submitting}
            />
            <Label htmlFor="save-card" className="text-xs cursor-pointer">
              Guardar tarjeta en mi perfil
            </Label>
          </div>

          <p className="text-xs text-muted-foreground">
            ⚠️ Solo guardaremos los últimos 4 dígitos por seguridad
          </p>

          <Button
            onClick={handleManualSubmit}
            disabled={
              loading ||
              submitting ||
              !manualData.cardNumber ||
              !manualData.expiryMonth ||
              !manualData.cvv
            }
            className="w-full"
          >
            {submitting ? 'Guardando...' : 'Confirmar Tarjeta'}
          </Button>

          {cards.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => setShowManual(false)}
              className="w-full text-xs"
            >
              Ver tarjetas guardadas
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
