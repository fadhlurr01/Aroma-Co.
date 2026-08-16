import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function CheckoutModal() {
  const {
    isCheckoutOpen,
    closeCheckout,
    cartState,
    cartSubtotal,
    discountAmount,
    taxAmount,
    cartTotal,
    appliedVoucher,
    applyVoucher,
    removeVoucher,
    orderType,
    setOrderType,
    customerNote,
    setCustomerNote,
    placeOrder,
    showToast,
  } = useCart();

  const [step, setStep] = useState(1); // 1: Details & Summary, 2: Payment, 3: Success Receipt
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('04');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [voucherInput, setVoucherInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris'); // 'qris' | 'bca_va' | 'mandiri_va' | 'cash'
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (isCheckoutOpen) {
      setStep(1);
      setIsProcessing(false);
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    applyVoucher(voucherInput);
    setVoucherInput('');
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Mohon masukkan nama pemesan.');
      return;
    }
    if (!customerPhone.trim()) {
      showToast('Mohon masukkan nomor WhatsApp pemesan.');
      return;
    }
    if (orderType === 'dine-in' && !tableNumber.trim()) {
      showToast('Mohon masukkan nomor meja.');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      showToast('Mohon masukkan alamat pengantaran.');
      return;
    }
    setStep(2);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let statusDesc = 'Menunggu Verifikasi (Pending)';
      if (paymentMethod === 'qris') statusDesc = 'LUNAS (QRIS Terverifikasi)';
      if (paymentMethod === 'bca_va' || paymentMethod === 'mandiri_va') statusDesc = 'Menunggu Konfirmasi Transfer';
      if (paymentMethod === 'cash') statusDesc = 'Bayar di Kasir (Pending)';

      const order = placeOrder({
        customerName,
        customerPhone,
        tableNumber: orderType === 'dine-in' ? tableNumber : null,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
        paymentMethod,
        paymentStatus: statusDesc,
      });
      setCompletedOrder(order);
      setIsProcessing(false);
      setStep(3);
    }, 1200);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    showToast('Nomor rekening / instruksi berhasil disalin!');
    setTimeout(() => setCopiedText(false), 2500);
  };

  // DOWNLOAD RECEIPT AS DIGITAL FILE (.TXT)
  const handleDownloadReceipt = () => {
    if (!completedOrder) return;
    const itemsLines = completedOrder.items
      .map(
        (it) =>
          `  ${it.quantity}x ${it.name.padEnd(28, ' ')} Rp ${(it.price * it.quantity).toLocaleString('id-ID')}`
      )
      .join('\n');

    const receiptSlipText = `================================================
          AROMA & CO. COFFEE ROASTERS
      Artisan Specialty Coffee & Micro-Roastery
        Jl. Senopati Raya 45, Jakarta Selatan
             Hotline: +62 812 5558 901
================================================
KODE ORDER    : ${completedOrder.orderId}
TANGGAL       : ${new Date(completedOrder.createdAt).toLocaleString('id-ID')}
NAMA PEMESAN  : ${completedOrder.customerName}
NO. WHATSAPP  : ${completedOrder.customerPhone}
LAYANAN       : ${completedOrder.orderType.toUpperCase()} ${completedOrder.tableNumber ? `(Meja ${completedOrder.tableNumber})` : ''}
METODE BAYAR  : ${completedOrder.paymentMethod.toUpperCase()}
STATUS PESANAN: ${completedOrder.paymentStatus}
------------------------------------------------
RINCIAN MENU                               HARGA
------------------------------------------------
${itemsLines}
------------------------------------------------
Subtotal                               Rp ${completedOrder.subtotal.toLocaleString('id-ID')}
${completedOrder.discount > 0 ? `Diskon (${completedOrder.voucher?.code || 'Promo'})              -Rp ${completedOrder.discount.toLocaleString('id-ID')}\n` : ''}Pajak Restoran PB1 (10%)               Rp ${completedOrder.tax.toLocaleString('id-ID')}
================================================
TOTAL PEMBAYARAN                       Rp ${completedOrder.total.toLocaleString('id-ID')}
================================================
CATATAN BARISTA: "${completedOrder.customerNote || '-'}"

VERIFIED BY AROMA & CO. OFFICIAL POS SYSTEM
"Mendedikasikan Setiap Cangkir untuk Cerita Anda"
Terima kasih atas pembelian Anda! Simpan struk ini sebagai bukti.
================================================
`;
    const blob = new Blob([receiptSlipText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Struk-AromaCo-${completedOrder.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Bukti struk pembelian berhasil diunduh ke perangkat!');
  };

  // SEND RECEIPT DIRECTLY TO CUSTOMER'S WHATSAPP
  const handleShareWhatsapp = () => {
    if (!completedOrder) return;
    let cleanPhone = completedOrder.customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }

    const itemsText = completedOrder.items
      .map((it) => {
        const custom = it.customOptions
          ? [it.customOptions.temperature, it.customOptions.sweetness, it.customOptions.milk, it.customOptions.size, it.customOptions.extraShot]
              .filter(Boolean)
              .join(', ')
          : 'Standar';
        return `• *${it.quantity}x ${it.name}* (${custom}) = Rp ${(it.price * it.quantity).toLocaleString('id-ID')}`;
      })
      .join('\n');

    const msg = `*AROMA & CO. COFFEE ROASTERS*\n*STRUK BUKTI PEMBAYARAN ARTISAN*\n----------------------------------------\n*No. Pesanan:* ${completedOrder.orderId}\n*Waktu:* ${new Date(completedOrder.createdAt).toLocaleString('id-ID')}\n*Nama Pelanggan:* ${completedOrder.customerName}\n*Layanan:* ${completedOrder.orderType.toUpperCase()} ${completedOrder.tableNumber ? `(Meja ${completedOrder.tableNumber})` : ''}\n*Status Bayar:* ${completedOrder.paymentStatus}\n----------------------------------------\n*RINCIAN MENU:*\n${itemsText}\n----------------------------------------\n*Subtotal:* Rp ${completedOrder.subtotal.toLocaleString('id-ID')}\n${completedOrder.discount > 0 ? `*Diskon Promo:* -Rp ${completedOrder.discount.toLocaleString('id-ID')}\n` : ''}*Pajak PB1 (10%):* Rp ${completedOrder.tax.toLocaleString('id-ID')}\n*TOTAL BAYAR:* *Rp ${completedOrder.total.toLocaleString('id-ID')}*\n----------------------------------------\n*Catatan Barista:* "${completedOrder.customerNote || '-'}"\n\nTerima kasih telah memesan kopi artisan di Aroma & Co.! Kopi Anda sedang diseduh dengan presisi. ☕\n_Jl. Senopati Raya 45, Jakarta Selatan • Hotline: +62 812 5558 901_`;

    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="checkout-modal-backdrop" onClick={closeCheckout}>
      <div
        className="checkout-modal-container glass-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="checkout-modal-header no-print">
          <div className="checkout-header-title">
            <div className="gold-icon-circle">
              <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 28C16 23.5817 19.5817 20 24 20H40C44.4183 20 48 23.5817 48 28V42C48 47.5228 43.5228 52 38 52H26C20.4772 52 16 47.5228 16 42V28Z" stroke="var(--color-gold)" strokeWidth="2.5"/>
                <path d="M48 26H51C54.3137 26 57 28.6863 57 32V34C57 37.3137 54.3137 40 51 40H48" stroke="var(--color-gold)" strokeWidth="2.5"/>
              </svg>
            </div>
            <div>
              <h3>Pemesanan Kopi Artisan</h3>
              <p>Aroma & Co. Roastery Express Checkout</p>
            </div>
          </div>

          <button className="checkout-close-btn" onClick={closeCheckout} aria-label="Tutup Checkout">
            ✕
          </button>
        </div>

        {/* STEP PROGRESS BAR */}
        <div className="checkout-progress-bar no-print">
          <div className={`step-node ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">{step > 1 ? '✓' : '1'}</span>
            <span className="step-label">Rincian & Meja</span>
          </div>
          <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-node ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">{step > 2 ? '✓' : '2'}</span>
            <span className="step-label">Instruksi Pembayaran</span>
          </div>
          <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step-node ${step === 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Struk Transaksi</span>
          </div>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="checkout-modal-body">
          {/* ================= STEP 1: ORDER DETAILS & SUMMARY ================= */}
          {step === 1 && (
            <div className="checkout-step-content animate-fade-in">
              {/* ORDER TYPE SELECTOR */}
              <div className="checkout-section">
                <label className="checkout-label">Tipe Layanan:</label>
                <div className="order-type-tabs">
                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'dine-in' ? 'selected' : ''}`}
                    onClick={() => setOrderType('dine-in')}
                  >
                    <span className="tab-title">☕ Dine In</span>
                    <span className="tab-desc">Minum di Meja Kafe</span>
                  </button>

                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'takeaway' ? 'selected' : ''}`}
                    onClick={() => setOrderType('takeaway')}
                  >
                    <span className="tab-title">🛍️ Take Away</span>
                    <span className="tab-desc">Bawa Pulang Segera</span>
                  </button>

                  <button
                    type="button"
                    className={`order-type-btn ${orderType === 'delivery' ? 'selected' : ''}`}
                    onClick={() => setOrderType('delivery')}
                  >
                    <span className="tab-title">🛵 Delivery</span>
                    <span className="tab-desc">Kirim ke Alamat</span>
                  </button>
                </div>
              </div>

              {/* CUSTOMER FORM */}
              <div className="checkout-form-grid">
                <div className="form-group-item">
                  <label className="form-label">Nama Pemesan <span className="req">*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Alexander Pratama"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-label">Nomor WhatsApp Pemesan <span className="req">*</span></label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="0812-xxxx-xxxx"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                {orderType === 'dine-in' && (
                  <div className="form-group-item full-col">
                    <label className="form-label">Pilih Nomor Meja Kafe <span className="req">*</span></label>
                    <div className="table-quick-select">
                      {['01', '02', '03', '04', '05', 'Bar Counter', 'VIP Lounge'].map((tbl) => (
                        <button
                          key={tbl}
                          type="button"
                          className={`table-pill ${tableNumber === tbl ? 'active' : ''}`}
                          onClick={() => setTableNumber(tbl)}
                        >
                          {tbl}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div className="form-group-item full-col">
                    <label className="form-label">Alamat Pengantaran <span className="req">*</span></label>
                    <textarea
                      className="form-control textarea"
                      rows="2"
                      placeholder="Nama jalan, nomor rumah/kantor, patokan khusus..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                    ></textarea>
                  </div>
                )}

                <div className="form-group-item full-col">
                  <label className="form-label">Catatan Tambahan untuk Barista (Opsional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Contoh: Es batu sedikit, pisahkan gula, ekstra panas..."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                  />
                </div>
              </div>

              {/* ORDER ITEMS REVIEW */}
              <div className="checkout-section mt-4">
                <label className="checkout-label">Ringkasan Menu ({cartState.reduce((a, b) => a + b.quantity, 0)} Item):</label>
                <div className="checkout-items-list">
                  {cartState.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="checkout-item-card">
                      <div className="checkout-thumb-box">
                        <img src={item.image || '/assets/images/prod-1.jpg'} alt={item.name} className="checkout-thumb-img" />
                      </div>

                      <div className="checkout-item-info">
                        <div className="checkout-item-name-row">
                          <h4 className="checkout-item-name">{item.name}</h4>
                          <span className="checkout-item-qty-badge">x{item.quantity}</span>
                        </div>

                        {item.customOptions && (
                          <div className="checkout-item-specs">
                            {item.customOptions.temperature && <span className="spec-tag">{item.customOptions.temperature}</span>}
                            {item.customOptions.sweetness && <span className="spec-tag">{item.customOptions.sweetness}</span>}
                            {item.customOptions.milk && <span className="spec-tag">{item.customOptions.milk}</span>}
                            {item.customOptions.size && <span className="spec-tag">{item.customOptions.size}</span>}
                            {item.customOptions.extraShot && <span className="spec-tag">{item.customOptions.extraShot}</span>}
                          </div>
                        )}

                        <div className="checkout-item-calc">
                          <span className="unit-calc">@ Rp {item.price.toLocaleString('id-ID')}</span>
                          <strong className="item-subtotal">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* VOUCHER INPUT BOX */}
              <div className="voucher-container mt-3">
                <form onSubmit={handleApplyVoucher} className="voucher-form">
                  <div className="voucher-input-wrap">
                    <input
                      type="text"
                      placeholder="Kode promo (Cth: AROMA10, KOPI50, ARTISAN)"
                      value={voucherInput}
                      onChange={(e) => setVoucherInput(e.target.value)}
                      className="voucher-input"
                    />
                  </div>
                  <button type="submit" className="btn-voucher-apply">Gunakan</button>
                </form>

                {/* QUICK VOUCHER PILLS */}
                <div className="quick-voucher-pills">
                  <button type="button" onClick={() => applyVoucher('AROMA10')} className="pill-code">🏷️ AROMA10 (-10%)</button>
                  <button type="button" onClick={() => applyVoucher('KOPI50')} className="pill-code">🏷️ KOPI50 (-50%)</button>
                  <button type="button" onClick={() => applyVoucher('ARTISAN')} className="pill-code">🏷️ ARTISAN (-15k)</button>
                </div>

                {appliedVoucher && (
                  <div className="applied-voucher-badge">
                    <div className="badge-info">
                      <span className="badge-code">🎉 {appliedVoucher.code}</span>
                      <span className="badge-text">{appliedVoucher.label} (-Rp {discountAmount.toLocaleString('id-ID')})</span>
                    </div>
                    <button type="button" onClick={removeVoucher} className="btn-remove-voucher">✕</button>
                  </div>
                )}
              </div>

              {/* PAYMENT BREAKDOWN */}
              <div className="checkout-summary-box">
                <div className="summary-row">
                  <span>Subtotal Pesanan:</span>
                  <span>Rp {cartSubtotal.toLocaleString('id-ID')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Diskon Promo ({appliedVoucher?.code}):</span>
                    <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Pajak Restoran PB1 (10%):</span>
                  <span>Rp {taxAmount.toLocaleString('id-ID')}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total Pembayaran:</span>
                  <span className="total-gold-price">Rp {cartTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* STEP 1 ACTIONS */}
              <div className="checkout-actions-row">
                <button type="button" className="btn btn-outline" onClick={closeCheckout}>
                  Kembali ke Menu
                </button>
                <button type="button" className="btn btn-primary" onClick={handleProceedToPayment}>
                  <span>Lanjut ke Pembayaran</span>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2: PAYMENT METHOD & INSTRUCTIONS (QRIS / TRANSFER / CASH) ================= */}
          {step === 2 && (
            <div className="checkout-step-content animate-fade-in">
              <div className="payment-total-banner">
                <div>
                  <span className="banner-subtitle">TOTAL TAGIHAN FINAL</span>
                  <h2 className="banner-amount">Rp {cartTotal.toLocaleString('id-ID')}</h2>
                </div>
                <div className="banner-badge">
                  <span>{orderType.toUpperCase()} • {customerName}</span>
                </div>
              </div>

              <div className="checkout-section">
                <label className="checkout-label">Pilih Metode Pembayaran:</label>
                <div className="payment-methods-grid">
                  {/* QRIS */}
                  <label className={`payment-method-card ${paymentMethod === 'qris' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qris"
                      checked={paymentMethod === 'qris'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="pm-info">
                      <div className="pm-title-row">
                        <span className="pm-title">QRIS Instan (Semua Bank & e-Wallet)</span>
                        <span className="pm-rec-badge">REKOMENDASI</span>
                      </div>
                      <span className="pm-desc">BCA, Mandiri, GoPay, OVO, Dana, ShopeePay (Pindai QR)</span>
                    </div>
                  </label>

                  {/* TRANSFER BANK (BCA / MANDIRI) */}
                  <label className={`payment-method-card ${paymentMethod === 'bca_va' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bca_va"
                      checked={paymentMethod === 'bca_va'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="pm-info">
                      <span className="pm-title">Transfer Bank BCA (Virtual Account / Rekening)</span>
                      <span className="pm-desc">Transfer manual atau mobile banking ke rekening resmi kedai</span>
                    </div>
                  </label>

                  {/* MANDIRI VA */}
                  <label className={`payment-method-card ${paymentMethod === 'mandiri_va' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mandiri_va"
                      checked={paymentMethod === 'mandiri_va'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="pm-info">
                      <span className="pm-title">Transfer Bank Mandiri / Bank Lain</span>
                      <span className="pm-desc">Transfer antar bank online dengan verifikasi otomatis</span>
                    </div>
                  </label>

                  {/* CASH / KASIR */}
                  <label className={`payment-method-card ${paymentMethod === 'cash' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === 'cash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="pm-info">
                      <span className="pm-title">Bayar Tunai / EDC di Kasir Kafe</span>
                      <span className="pm-desc">Bayar langsung di kasir kafe saat kopi disajikan oleh barista</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* DYNAMIC PAYMENT INSTRUCTION DISPLAY */}
              <div className="payment-instruction-box glass-panel mt-3">
                {paymentMethod === 'qris' && (
                  <div className="qris-interactive-display animate-fade-in">
                    <div className="qris-header-row">
                      <div>
                        <h4 className="qris-title">Pindai QRIS Resmi Aroma & Co.</h4>
                        <p className="qris-sub">Gunakan aplikasi m-Banking atau e-Wallet apapun</p>
                      </div>
                      <span className="qris-timer-pill">⏱️ Berlaku 15:00 Menit</span>
                    </div>

                    <div className="qris-qr-center">
                      <div className="qris-frame">
                        {/* SVG QR CODE VISUAL */}
                        <svg className="qris-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="200" height="200" fill="#FFFFFF" rx="8"/>
                          {/* Corner squares */}
                          <rect x="20" y="20" width="45" height="45" fill="#0A1B14"/>
                          <rect x="26" y="26" width="33" height="33" fill="#FFFFFF"/>
                          <rect x="32" y="32" width="21" height="21" fill="#C5A880"/>

                          <rect x="135" y="20" width="45" height="45" fill="#0A1B14"/>
                          <rect x="141" y="26" width="33" height="33" fill="#FFFFFF"/>
                          <rect x="147" y="32" width="21" height="21" fill="#C5A880"/>

                          <rect x="20" y="135" width="45" height="45" fill="#0A1B14"/>
                          <rect x="26" y="141" width="33" height="33" fill="#FFFFFF"/>
                          <rect x="32" y="147" width="21" height="21" fill="#C5A880"/>

                          {/* Pattern Blocks */}
                          <rect x="80" y="20" width="12" height="12" fill="#0A1B14"/>
                          <rect x="98" y="20" width="12" height="12" fill="#0A1B14"/>
                          <rect x="116" y="20" width="12" height="12" fill="#0A1B14"/>
                          <rect x="80" y="40" width="12" height="12" fill="#0A1B14"/>
                          <rect x="105" y="40" width="18" height="12" fill="#C5A880"/>
                          <rect x="80" y="60" width="24" height="12" fill="#0A1B14"/>
                          <rect x="112" y="60" width="16" height="12" fill="#0A1B14"/>

                          <rect x="20" y="80" width="12" height="12" fill="#0A1B14"/>
                          <rect x="38" y="80" width="18" height="12" fill="#0A1B14"/>
                          <rect x="65" y="80" width="12" height="12" fill="#0A1B14"/>
                          <rect x="85" y="80" width="30" height="30" fill="#0A1B14" rx="4"/>
                          <circle cx="100" cy="95" r="8" fill="#C5A880"/>
                          <rect x="125" y="80" width="12" height="12" fill="#0A1B14"/>
                          <rect x="145" y="80" width="18" height="12" fill="#0A1B14"/>
                          <rect x="170" y="80" width="12" height="12" fill="#0A1B14"/>

                          <rect x="20" y="100" width="24" height="12" fill="#0A1B14"/>
                          <rect x="52" y="100" width="12" height="12" fill="#0A1B14"/>
                          <rect x="135" y="100" width="24" height="12" fill="#0A1B14"/>
                          <rect x="168" y="100" width="14" height="12" fill="#0A1B14"/>

                          <rect x="80" y="120" width="18" height="12" fill="#0A1B14"/>
                          <rect x="105" y="120" width="12" height="12" fill="#0A1B14"/>
                          <rect x="125" y="120" width="20" height="12" fill="#C5A880"/>
                          <rect x="155" y="120" width="25" height="12" fill="#0A1B14"/>

                          <rect x="80" y="140" width="12" height="12" fill="#0A1B14"/>
                          <rect x="100" y="140" width="25" height="12" fill="#0A1B14"/>
                          <rect x="135" y="140" width="12" height="12" fill="#0A1B14"/>
                          <rect x="155" y="140" width="25" height="12" fill="#0A1B14"/>

                          <rect x="80" y="160" width="30" height="18" fill="#0A1B14"/>
                          <rect x="120" y="160" width="15" height="18" fill="#0A1B14"/>
                          <rect x="145" y="160" width="35" height="18" fill="#0A1B14"/>
                        </svg>

                        <div className="qris-brand-logo-tag">
                          <span>QRIS STANDAR INDONESIA</span>
                        </div>
                      </div>

                      <div className="qris-side-instructions">
                        <div className="qris-total-box">
                          <span className="q-tot-lbl">Jumlah Harus Dibayar:</span>
                          <strong className="q-tot-val">Rp {cartTotal.toLocaleString('id-ID')}</strong>
                        </div>
                        <ul className="qris-steps-list">
                          <li>1. Buka aplikasi m-BCA, GoPay, OVO, Dana, atau Livin Mandiri.</li>
                          <li>2. Pilih menu <strong>Scan / Bayar QRIS</strong>.</li>
                          <li>3. Arahkan kamera ke kode QR di atas atau simpan gambar.</li>
                          <li>4. Pastikan penerima adalah <strong>AROMA & CO ROASTERS</strong>.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bca_va' && (
                  <div className="va-interactive-display animate-fade-in">
                    <div className="va-header-box">
                      <span className="va-bank-badge">BANK BCA</span>
                      <h4>Transfer Virtual Account / Rekening Resmi</h4>
                    </div>

                    <div className="va-number-card">
                      <div className="va-num-left">
                        <span className="va-lbl">Nomor Rekening Resmi BCA:</span>
                        <strong className="va-number-text">8830 1920 4491 0021</strong>
                        <span className="va-name">a.n <strong>PT AROMA KOPI NUSANTARA</strong></span>
                      </div>
                      <button
                        type="button"
                        className="btn-copy-va"
                        onClick={() => copyToClipboard('8830192044910021')}
                      >
                        {copiedText ? '✓ Tersalin' : '📋 Salin Rekening'}
                      </button>
                    </div>

                    <div className="va-instruction-list">
                      <p>• Masukkan nominal tepat: <strong>Rp {cartTotal.toLocaleString('id-ID')}</strong></p>
                      <p>• Pesanan akan otomatis berstatus pending verifikasi setelah Anda mengonfirmasi pesanan.</p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'mandiri_va' && (
                  <div className="va-interactive-display animate-fade-in">
                    <div className="va-header-box">
                      <span className="va-bank-badge">BANK MANDIRI</span>
                      <h4>Transfer Rekening Giro Mandiri</h4>
                    </div>

                    <div className="va-number-card">
                      <div className="va-num-left">
                        <span className="va-lbl">Nomor Rekening Mandiri:</span>
                        <strong className="va-number-text">1370 0982 3341 8</strong>
                        <span className="va-name">a.n <strong>AROMA COFFEE ROASTERS</strong></span>
                      </div>
                      <button
                        type="button"
                        className="btn-copy-va"
                        onClick={() => copyToClipboard('1370098233418')}
                      >
                        {copiedText ? '✓ Tersalin' : '📋 Salin Rekening'}
                      </button>
                    </div>

                    <div className="va-instruction-list">
                      <p>• Masukkan nominal tepat: <strong>Rp {cartTotal.toLocaleString('id-ID')}</strong></p>
                      <p>• Verifikasi dilakukan oleh sistem admin kafe dalam 1-2 menit.</p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'cash' && (
                  <div className="cash-instruction-display animate-fade-in">
                    <div className="cash-icon-box">☕ 💵</div>
                    <div className="cash-text-wrap">
                      <h4>Pembayaran di Kasir Kafe (Cash / EDC Card)</h4>
                      <p>Tunjukkan <strong>Kode Order Struk</strong> pada barista saat kopi disajikan di meja atau diambil di bar kasir.</p>
                      <div className="cash-amount-tag">
                        <span>Tagihan Disiapkan: <strong>Rp {cartTotal.toLocaleString('id-ID')}</strong></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2 ACTIONS */}
              <div className="checkout-actions-row mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)} disabled={isProcessing}>
                  ← Ubah Rincian
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Memverifikasi Pembayaran...' : '✦ KONFIRMASI PESANAN SEKARANG'}
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 3: TRANSACTION RECEIPT & HISTORI PEMBELIAN ================= */}
          {step === 3 && completedOrder && (
            <div className="checkout-step-content animate-fade-in">
              <div className="receipt-success-banner no-print">
                <div className="success-check-circle">✓</div>
                <h2>Pesanan Berhasil Diajukan!</h2>
                <p>Status: <strong className="status-highlight">{completedOrder.paymentStatus}</strong></p>
                <small className="order-notice-text">Rincian pesanan telah tercatat di sistem POS & antrean Barista Aroma & Co.</small>
              </div>

              {/* ISOLATED TRANSACTION RECEIPT SLIP */}
              <div className="printable-receipt-card" id="printableReceiptSlip">
                {/* RECEIPT HEADER */}
                <div className="receipt-paper-header">
                  <h2 className="receipt-company-title">AROMA & CO. COFFEE ROASTERS</h2>
                  <p className="receipt-company-sub">Artisan Specialty Coffee & Micro-Roastery</p>
                  <p className="receipt-address-text">Jl. Senopati Raya No. 45, Jakarta Selatan • Hotline: +62 812 5558 901</p>
                </div>

                <div className="receipt-dashed-line"></div>

                {/* TRANSACTION METADATA */}
                <div className="receipt-meta-grid">
                  <div className="receipt-meta-item">
                    <span>KODE ORDER:</span>
                    <strong>{completedOrder.orderId}</strong>
                  </div>
                  <div className="receipt-meta-item text-right">
                    <span>TANGGAL:</span>
                    <strong>{new Date(completedOrder.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}, {new Date(completedOrder.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</strong>
                  </div>
                  <div className="receipt-meta-item">
                    <span>NAMA PEMESAN:</span>
                    <strong>{completedOrder.customerName}</strong>
                  </div>
                  <div className="receipt-meta-item text-right">
                    <span>NO. WHATSAPP:</span>
                    <strong>{completedOrder.customerPhone}</strong>
                  </div>
                  <div className="receipt-meta-item">
                    <span>TIPE LAYANAN:</span>
                    <strong style={{ textTransform: 'uppercase' }}>
                      {completedOrder.orderType === 'dine-in' ? `DINE IN (MEJA ${completedOrder.tableNumber || '-'})` : completedOrder.orderType}
                    </strong>
                  </div>
                  <div className="receipt-meta-item text-right">
                    <span>STATUS BAYAR:</span>
                    <strong className="status-highlight">{completedOrder.paymentStatus}</strong>
                  </div>
                </div>

                {completedOrder.customerNote && (
                  <div className="receipt-barista-note">
                    <strong>CATATAN BARISTA:</strong> "{completedOrder.customerNote}"
                  </div>
                )}

                <div className="receipt-dashed-line"></div>

                {/* PURCHASED ITEMS TABLE */}
                <div className="receipt-table-header">
                  <span className="col-desc">ITEM MENU DIBELI</span>
                  <span className="col-qty">QTY</span>
                  <span className="col-price">TOTAL</span>
                </div>
                <div className="receipt-items-list">
                  {completedOrder.items.map((it, i) => (
                    <div key={i} className="receipt-item-line">
                      <div className="col-desc">
                        <strong>{it.name}</strong>
                        {it.customOptions && (
                          <small className="receipt-spec-text">
                            {[it.customOptions.temperature, it.customOptions.sweetness, it.customOptions.milk, it.customOptions.size, it.customOptions.extraShot].filter(Boolean).join(' • ')}
                          </small>
                        )}
                      </div>
                      <div className="col-qty">{it.quantity}</div>
                      <div className="col-price">Rp {(it.price * it.quantity).toLocaleString('id-ID')}</div>
                    </div>
                  ))}
                </div>

                <div className="receipt-dashed-line"></div>

                {/* TOTALS CALCULATION */}
                <div className="receipt-totals-table">
                  <div className="receipt-calc-row">
                    <span>Subtotal Menu:</span>
                    <span>Rp {completedOrder.subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  {completedOrder.discount > 0 && (
                    <div className="receipt-calc-row discount">
                      <span>Potongan Voucher ({completedOrder.voucher?.code}):</span>
                      <span>- Rp {completedOrder.discount.toLocaleString('id-ID')}</span>
                    </div>
                  )}
                  <div className="receipt-calc-row">
                    <span>Pajak Restoran PB1 (10%):</span>
                    <span>Rp {completedOrder.tax.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="receipt-calc-row grand-total">
                    <span>TOTAL TAGIHAN:</span>
                    <span>Rp {completedOrder.total.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                <div className="receipt-dashed-line"></div>

                {/* BARCODE / VERIFICATION BADGE */}
                <div className="receipt-barcode-wrap">
                  <div className="simulated-barcode">||| | |||| | ||| |||| | || |||| | ||| | |||</div>
                  <span className="receipt-security-code">VERIFIED TRANSACTION • AROMA & CO. POS</span>
                </div>

                {/* FOOTER MESSAGE */}
                <div className="receipt-paper-footer">
                  <p className="receipt-quote">"Mendedikasikan Setiap Cangkir untuk Cerita Anda"</p>
                  <p className="receipt-thanks">Terima Kasih Atas Pembelian Anda • Simpan Struk Sebagai Bukti</p>
                </div>
              </div>

              {/* ACTION BUTTONS (NO PRINT BUTTON) */}
              <div className="receipt-actions no-print">
                <button type="button" className="btn btn-outline" onClick={handleDownloadReceipt}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  <span>Unduh File Bukti</span>
                </button>

                <button type="button" className="btn btn-outline" onClick={handleShareWhatsapp}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>Kirim ke WA Pemesan</span>
                </button>

                <button type="button" className="btn btn-primary" onClick={closeCheckout}>
                  <span>Selesai</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
