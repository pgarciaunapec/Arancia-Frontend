import React, { useEffect } from 'react';
import './Modal.css';

interface DialogProps {
  isVisible: boolean;
  heading: string;
  content: string;
  handleDismiss: () => void;
}

const Modal: React.FC<DialogProps> = ({ isVisible, heading, content, handleDismiss }) => {
  useEffect(() => {
    const handleEscKey = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape' && isVisible) {
        handleDismiss();
      }
    };

    if (isVisible) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isVisible, handleDismiss]);

  if (!isVisible) return null;

  return (
    <div className="dialog-wrapper">
      <div className="backdrop-layer" onClick={handleDismiss} />
      <div className="dialog-box" role="dialog" aria-modal="true" aria-labelledby="dialog-heading">
        <div className="dialog-top-section">
          <h3 id="dialog-heading" className="dialog-heading">{heading}</h3>
          <button 
            className="close-button" 
            onClick={handleDismiss}
            aria-label="Cerrar diálogo"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="dialog-main-section">
          <p className="dialog-text">{content}</p>
        </div>
        <div className="dialog-bottom-section">
          <button className="confirm-button" onClick={handleDismiss} type="button">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
