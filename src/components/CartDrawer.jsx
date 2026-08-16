import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const {
    cartState,
    cartSubtotal,
    discountAmount,
    taxAmount,
    cartTotal,
    isCartOpen,
    closeCart,
    openCheckout,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    orderType,
    setOrderType,
    customerNote,
    setCustomerNote,
  } = useCart();

  const navigate = useNavigate();
  const [voucherCode, setVoucherCode] = useState('');

  const totalItemCount = cartState.reduce((a, b) => a + b.quantity, 0);

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    applyVoucher(voucherCode);
    setVoucherCode('');
  };

  const handleExploreMenu = () => {
    closeCart();
    navigate('/menu');
  };

  return (
    <>
      {/* BACKGROUND BACKDROP */}
      <div
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
        id="cartOverlay"
        onClick={closeCart}
      />

      {/* DRAWER CONTAINER */}
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`} id="cartDrawer">
        {/* DRAWER HEADER */}
        <div className="cart-header">
          <div className="cart-header-left">
            <div className="cart-header-icon">
              <svg width="20" height="20" fill="none" stroke="var(--color-gold)" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div>
              <h3 className="cart-title">Keranjang Pesanan</h3>
              <span className="cart-item-count">{totalItemCount} Menu Dipilih</span>
            </div>
          </div>

          <div className="cart-header-actions">
            {cartState.length > 0 && (
              <button
                className="cart-clear-btn"
                onClick={clearCart}
                title="Kosongkan Keranjang"
              >
                Kosongkan
              </button>
            )}
            <button
              className="cart-close-btn"
              id="closeCartBtn"
              onClick={closeCart}
              aria-label="Tutup Keranjang"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* ORDER TYPE QUICK SELECTOR */}
        {cartState.length > 0 && (
          <div className="cart-type-selector">
            <button
              type="button"
              className={`type-chip ${orderType === 'dine-in' ? 'active' : ''}`}
              onClick={() => setOrderType('dine-in')}
            >
              ☕ Dine In
            </button>
            <button
              type="button"
              className={`type-chip ${orderType === 'takeaway' ? 'active' : ''}`}
              onClick={() => setOrderType('takeaway')}
            >
              🛍️ Take Away
            </button>
            <button
              type="button"
              className={`type-chip ${orderType === 'delivery' ? 'active' : ''}`}
              onClick={() => setOrderType('delivery')}
            >
              🛵 Delivery
            </button>
          </div>
        )}

        {/* CART BODY / LIST */}
        <div className="cart-body" id="cartItemsList">
          {cartState.length === 0 ? (
            <div className="empty-cart-state animate-fade-in">
              <div className="empty-cart-icon-wrap">
                <svg width="60" height="60" fill="none" stroke="var(--color-gold)" strokeWidth="1.2" viewBox="0 0 24 24">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                  <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                  <line x1="6" y1="1" x2="6" y2="4"></line>
                  <line x1="10" y1="1" x2="10" y2="4"></line>
                  <line x1="14" y1="1" x2="14" y2="4"></line>
                </svg>
              </div>
              <h4>Keranjang Masih Kosong</h4>
              <p>Belum ada sajian kopi pilihan yang Anda tambahkan ke daftar pesanan.</p>
              <button className="btn btn-primary btn-sm" onClick={handleExploreMenu}>
                Jelajahi Menu Kopi ➔
              </button>
            </div>
          ) : (
            <div className="cart-items-container">
              {cartState.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item-card animate-fade-in">
                  {/* PRODUCT THUMBNAIL */}
                  <div className="cart-item-img-box">
                    <img
                      src={item.image || './assets/images/prod-1.jpg'}
                      alt={item.name}
                      className="cart-item-img"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="cart-item-info">
                    <div className="cart-item-header-row">
                      <h4 className="cart-item-title">{item.name}</h4>
                      <button
                        className="cart-item-remove-btn"
                        onClick={() => removeFromCart(index)}
                        title="Hapus Item"
                        aria-label="Hapus Item"
                      >
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>

                    {/* CUSTOM OPTIONS SPECS */}
                    {item.customOptions && Object.keys(item.customOptions).length > 0 && (
                      <div className="cart-item-options">
                        {item.customOptions.temperature && (
                          <span className="spec-pill">
                            {item.customOptions.temperature === 'ice' ? '🧊 Dingin' : '☕ Panas'}
                          </span>
                        )}
                        {item.customOptions.sweetness && (
                          <span className="spec-pill">Gula: {item.customOptions.sweetness}</span>
                        )}
                        {item.customOptions.milk && (
                          <span className="spec-pill">Susu: {item.customOptions.milk}</span>
                        )}
                      </div>
                    )}

                    {/* PRICE & STEPPER */}
                    <div className="cart-item-bottom-row">
                      <div className="cart-item-price-col">
                        <span className="unit-price">@ Rp {item.price.toLocaleString('id-ID')}</span>
                        <strong className="item-subtotal">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</strong>
                      </div>

                      <div className="qty-stepper">
                        <button
                          type="button"
                          className="stepper-btn minus"
                          onClick={() => updateCartQuantity(index, -1)}
                          aria-label="Kurangi Jumlah"
                        >
                          -
                        </button>
                        <span className="stepper-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="stepper-btn plus"
                          onClick={() => updateCartQuantity(index, 1)}
                          aria-label="Tambah Jumlah"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* QUICK VOUCHER DRAWER BOX */}
              <div className="drawer-voucher-box">
                <form onSubmit={handleApplyVoucher} className="drawer-voucher-form">
                  <input
                    type="text"
                    placeholder="Kode promo (AROMA10)"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="drawer-voucher-input"
                  />
                  <button type="submit" className="drawer-voucher-btn">Pakai</button>
                </form>

                {appliedVoucher && (
                  <div className="drawer-applied-voucher">
                    <span>🎉 Voucher: <strong>{appliedVoucher.code}</strong> (-Rp {discountAmount.toLocaleString('id-ID')})</span>
                    <button type="button" onClick={removeVoucher}>✕</button>
                  </div>
                )}
              </div>

              {/* BARISTA NOTE */}
              <div className="drawer-note-box">
                <input
                  type="text"
                  placeholder="📝 Catatan khusus barista (Cth: Less sugar)..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="drawer-note-input"
                />
              </div>
            </div>
          )}
        </div>

        {/* DRAWER FOOTER */}
        {cartState.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary-lines">
              <div className="summary-line">
                <span>Subtotal:</span>
                <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="summary-line discount">
                  <span>Diskon Promo:</span>
                  <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="summary-line">
                <span>PB1 Resto (10%):</span>
                <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="summary-line total">
                <span>Total Bayar:</span>
                <span className="total-gold">Rp {cartTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block checkout-trigger-btn"
              id="checkoutBtn"
              onClick={openCheckout}
            >
              <span>Lanjut Ke Pembayaran</span>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
