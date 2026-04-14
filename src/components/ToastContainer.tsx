import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToastStore, type Toast } from '../store/toastStore';

interface ToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const getToastStyles = (type: Toast['type']) => {
  const styles = {
    success: {
      bg: 'bg-green-950/90',
      border: 'border-green-700',
      icon: <CheckCircle size={20} className="text-green-500" />,
      title: 'text-green-100',
    },
    error: {
      bg: 'bg-red-950/90',
      border: 'border-red-700',
      icon: <AlertCircle size={20} className="text-red-500" />,
      title: 'text-red-100',
    },
    info: {
      bg: 'bg-blue-950/90',
      border: 'border-blue-700',
      icon: <Info size={20} className="text-blue-500" />,
      title: 'text-blue-100',
    },
    warning: {
      bg: 'bg-yellow-950/90',
      border: 'border-yellow-700',
      icon: <AlertCircle size={20} className="text-yellow-500" />,
      title: 'text-yellow-100',
    },
  };
  return styles[type];
};

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const styles = getToastStyles(toast.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={`${styles.bg} ${styles.border} border rounded-lg p-4 backdrop-blur-sm shadow-lg max-w-sm`}
    >
      <div className="flex gap-3">
        {styles.icon}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-sm ${styles.title}`}>{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-gray-300 mt-1">{toast.description}</p>
          )}
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                onClose(toast.id);
              }}
              className="mt-2 text-xs font-medium underline hover:opacity-75 transition-opacity"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Toast container that renders all active toasts
 * Place this in App.tsx or main layout
 */
export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none space-y-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onClose={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
