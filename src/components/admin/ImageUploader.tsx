import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ImageUploaderProps {
  onImageSelect: (imageData: string) => void;
  loading?: boolean;
  error?: string;
}

/**
 * Componente para seleccionar imagen local o URL externa
 * Frontend envía URL al backend, que se encarga de descargar y procesar
 */
export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelect,
  loading = false,
  error,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLocalFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setLocalPreview(base64String);
      setImageUrl('');
      onImageSelect(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      alert('Por favor ingresa una URL válida');
      return;
    }

    // El backend se encargará de procesar URLs externas
    setLocalPreview(null);
    onImageSelect(imageUrl);
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500 rounded-md text-red-600 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {localPreview && (
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500 rounded-md text-green-600 text-sm">
          <CheckCircle size={16} />
          Imagen local seleccionada
        </div>
      )}

      {/* Subida Local */}
      <div>
        <Label htmlFor="local-image" className="text-sm font-medium">
          Subir Imagen Local
        </Label>
        <div
          className="mt-2 p-4 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            id="local-image"
            accept="image/*"
            onChange={handleLocalFileSelect}
            disabled={loading}
            className="hidden"
          />
          <div className="text-center">
            <Upload size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              Drag and drop o haz clic para seleccionar
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP hasta 5MB</p>
          </div>
        </div>
      </div>

      {/* URL Externa */}
      <div className="border-t pt-4">
        <Label htmlFor="image-url" className="text-sm font-medium">
          O proporciona URL Externa
        </Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="image-url"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setLocalPreview(null);
            }}
            disabled={loading}
          />
          <Button
            onClick={handleUrlSubmit}
            disabled={loading || !imageUrl.trim()}
            className="whitespace-nowrap"
          >
            {loading ? 'Procesando...' : 'Usar URL'}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          El servidor descargará y almacenará la imagen automáticamente
        </p>
      </div>
    </div>
  );
};
