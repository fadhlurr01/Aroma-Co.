import React from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toastMessage, showToast } = useCart();

  if (!toastMessage) return null;

  return (
    <aside 
      className="toast toast-show" 
      role="status" 
      aria-live="polite"
      onClick={() => showToast(null)}
      title="Ketuk untuk menutup"
    >
      <div className="toast-icon-wrap" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="var(--color-gold)" strokeWidth="2"/>
          <path d="M8 12.5L10.5 15L16 9.5" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="toast-text-msg">{toastMessage}</span>
      <button 
        type="button" 
        className="toast-close-btn" 
        onClick={(e) => {
          e.stopPropagation();
          showToast(null);
        }}
        aria-label="Tutup notifikasi"
      >
        ✕
      </button>
    </aside>
  );
}
