import React from 'react';
import { useCart } from '../context/CartContext';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="toast toast-show" role="status" aria-live="polite">
      <div className="toast-icon-wrap">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="6" y1="1" x2="6" y2="4" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="10" y1="1" x2="10" y2="4" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round"/>
          <line x1="14" y1="1" x2="14" y2="4" stroke="var(--color-gold)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <span className="toast-text-msg">{toastMessage}</span>
      <div className="toast-badge-accent">✦</div>
    </div>
  );
}
