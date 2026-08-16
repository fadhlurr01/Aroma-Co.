import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function CoffeeModal({ product, onClose }) {
  const { addToCart, showToast } = useCart();

  const [temperature, setTemperature] = useState('ice'); // 'ice' | 'hot'
  const [sweetness, setSweetness] = useState('100%');
  const [milk, setMilk] = useState('fresh'); // 'fresh' | 'oat' | 'almond'
  const [size, setSize] = useState('regular'); // 'regular' | 'large'
  const [extraShot, setExtraShot] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Lock background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!product) return null;

  // Calculate dynamic price with customization options
  let extra = 0;
  if (milk === 'oat') extra += 5000;
  if (milk === 'almond') extra += 7000;
  if (size === 'large') extra += 6000;
  if (extraShot) extra += 8000;

  const unitPrice = product.price + extra;
  const totalItemPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addToCart(product.id, {
      temperature: temperature === 'ice' ? 'Dingin (Iced)' : 'Panas (Hot)',
      sweetness: `Gula ${sweetness}`,
      milk: milk === 'fresh' ? 'Fresh Milk' : milk === 'oat' ? 'Oat Milk (+5k)' : 'Almond Milk (+7k)',
      size: size === 'regular' ? 'Reguler (250ml)' : 'Large (+6k)',
      extraShot: extraShot ? '+1 Extra Shot (+8k)' : null,
      quantity,
    });
    showToast(`"${product.name}" berhasil ditambahkan ke keranjang!`);
    onClose();
  };

  // Helper percentages for flavor meters
  const getAcidityPercent = () => {
    const ac = product.flavorProfile?.acidity?.toLowerCase() || '';
    if (ac.includes('cerah') || ac.includes('bright') || ac.includes('tinggi') || ac.includes('jeruk')) return 85;
    if (ac.includes('sedang')) return 60;
    if (ac.includes('rendah') || ac.includes('tidak')) return 30;
    return 50;
  };

  const getBodyPercent = () => {
    const bd = product.flavorProfile?.body?.toLowerCase() || '';
    if (bd.includes('tebal') || bd.includes('full') || bd.includes('berat') || bd.includes('pekat')) return 92;
    if (bd.includes('kental') || bd.includes('creamy') || bd.includes('silky')) return 78;
    if (bd.includes('sedang')) return 60;
    return 45;
  };

  const getSweetnessPercent = () => {
    const sw = product.flavorProfile?.sweetness?.toLowerCase() || '';
    if (sw.includes('karamel') || sw.includes('caramel') || sw.includes('madu') || sw.includes('toffee')) return 88;
    if (sw.includes('sedang') || sw.includes('alami')) return 65;
    return 50;
  };

  const getAromaPercent = () => 92;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div
        className="glass-panel detail-rasa-modal luxury-modern-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* CLOSE BUTTON */}
        <button
          className="luxury-modal-close"
          onClick={onClose}
          aria-label="Tutup Detail Rasa"
        >
          ✕
        </button>

        {/* 2-COLUMN LUXURY MODERN LAYOUT */}
        <div className="detail-modal-layout">
          {/* LEFT COLUMN: HERO VISUAL, BADGES & TASTING NOTES */}
          <div className="detail-modal-media">
            <div className="detail-modal-img-wrapper">
              <img
                src={product.image || './assets/images/prod-1.jpg'}
                alt={product.name}
                className="detail-modal-hero-img"
              />
              <div className="detail-media-gradient"></div>
            </div>

            <div className="detail-media-top-badges">
              <span className={`badge ${product.badgeClass || 'badge-gold'}`}>
                {product.badge || 'Artisan Special'}
              </span>
              {product.qScore && (
                <span className="badge badge-qscore">
                  ★ SCA {product.qScore}
                </span>
              )}
            </div>

            <div className="detail-media-bottom-info">
              <div className="media-origin-header">
                <span className="media-origin-tag">{product.origin || 'Single Origin'}</span>
                <span className="media-altitude-tag">🏔️ {product.altitude || '1.500 mdpl'}</span>
              </div>
              <h3 className="media-product-title">{product.name}</h3>

              {product.tastingNotes && (
                <div className="media-tasting-chips">
                  {product.tastingNotes.map((note, idx) => (
                    <span key={idx} className="modern-tasting-pill">✦ {note}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: EDITORIAL DETAILS, SPECS, SENSORY & ULTRA-MINIMALIST CUSTOMIZER */}
          <div className="detail-modal-info-col">
            <div className="detail-modal-scroll-body">
              {/* HEADER TITLE & PROCESS */}
              <div className="detail-header-group">
                <div className="detail-category-row">
                  <span className="detail-category-label">✦ {product.category?.toUpperCase() || 'SPECIALTY COFFEE'}</span>
                  <span className="detail-process-badge">{product.process || 'Washed'}</span>
                </div>
                <h2 className="detail-title-text">{product.name}</h2>
                <p className="detail-desc-text">{product.description}</p>
              </div>

              {/* BEAN & TERROIR SPECS (MODERN CLEAN CARDS) */}
              <div className="detail-bean-specs-grid">
                <div className="bean-spec-cell">
                  <span className="spec-label">Asal Kebun</span>
                  <strong className="spec-value">{product.origin || 'Nusantara Blend'}</strong>
                </div>
                <div className="bean-spec-cell">
                  <span className="spec-label">Elevasi Kebun</span>
                  <strong className="spec-value">{product.altitude || '1.500 mdpl'}</strong>
                </div>
                <div className="bean-spec-cell">
                  <span className="spec-label">Metode Proses</span>
                  <strong className="spec-value">{product.process || 'Washed'}</strong>
                </div>
                <div className="bean-spec-cell">
                  <span className="spec-label">Tingkat Sangrai</span>
                  <strong className="spec-value">{product.roastLevel || 'Medium Roast'}</strong>
                </div>
                {product.qScore && (
                  <div className="bean-spec-cell highlight-cell">
                    <span className="spec-label">Skor Mutu SCA</span>
                    <strong className="spec-value highlight-score">★ {product.qScore} Pts</strong>
                  </div>
                )}
              </div>

              {/* SENSORY SPECTRUM BARS */}
              {product.flavorProfile && (
                <div className="detail-section-block">
                  <h4 className="detail-section-title">Profil Sensorik Rasa (Q-Grader):</h4>
                  <div className="sensory-meter-grid">
                    <div className="sensory-bar-item">
                      <div className="bar-label-row">
                        <span className="bar-title">Keasaman (Acidity)</span>
                        <strong className="bar-val">{product.flavorProfile.acidity || 'Sedang'}</strong>
                      </div>
                      <div className="meter-track">
                        <div className="meter-fill acidity-fill" style={{ width: `${getAcidityPercent()}%` }}></div>
                      </div>
                    </div>

                    <div className="sensory-bar-item">
                      <div className="bar-label-row">
                        <span className="bar-title">Ketebalan Bodi (Body)</span>
                        <strong className="bar-val">{product.flavorProfile.body || 'Full'}</strong>
                      </div>
                      <div className="meter-track">
                        <div className="meter-fill body-fill" style={{ width: `${getBodyPercent()}%` }}></div>
                      </div>
                    </div>

                    <div className="sensory-bar-item">
                      <div className="bar-label-row">
                        <span className="bar-title">Kemanisan (Sweetness)</span>
                        <strong className="bar-val">{product.flavorProfile.sweetness || 'Alami'}</strong>
                      </div>
                      <div className="meter-track">
                        <div className="meter-fill sweetness-fill" style={{ width: `${getSweetnessPercent()}%` }}></div>
                      </div>
                    </div>

                    <div className="sensory-bar-item">
                      <div className="bar-label-row">
                        <span className="bar-title">Aroma Sangrai</span>
                        <strong className="bar-val">{product.flavorProfile.aroma || 'Floral'}</strong>
                      </div>
                      <div className="meter-track">
                        <div className="meter-fill aroma-fill" style={{ width: `${getAromaPercent()}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ULTRA-MINIMALIST ELEGANT BARISTA CUSTOMIZER */}
              <div className="detail-section-block minimalist-customizer-box">
                <h4 className="detail-section-title">Kustomisasi Sajian Barista:</h4>
                
                <div className="artisan-custom-row">
                  {/* SUHU */}
                  <div className="artisan-opt-group">
                    <span className="artisan-opt-label">Suhu Penyajian:</span>
                    <div className="artisan-chips-wrap">
                      <button
                        type="button"
                        className={`artisan-chip ${temperature === 'ice' ? 'active' : ''}`}
                        onClick={() => setTemperature('ice')}
                      >
                        <span className="chip-icon">❄️</span>
                        <span>Dingin (Iced)</span>
                      </button>
                      <button
                        type="button"
                        className={`artisan-chip ${temperature === 'hot' ? 'active' : ''}`}
                        onClick={() => setTemperature('hot')}
                      >
                        <span className="chip-icon">🔥</span>
                        <span>Panas (Hot)</span>
                      </button>
                    </div>
                  </div>

                  {/* GULA */}
                  <div className="artisan-opt-group">
                    <span className="artisan-opt-label">Kemanisan Gula:</span>
                    <div className="artisan-chips-wrap">
                      {[
                        { val: '100%', lbl: '100% Normal' },
                        { val: '50%', lbl: '50% Less' },
                        { val: '0%', lbl: '0% No Sugar' }
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          className={`artisan-chip ${sweetness === item.val ? 'active' : ''}`}
                          onClick={() => setSweetness(item.val)}
                        >
                          {item.lbl}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="artisan-custom-row mt-3">
                  {/* SUSU */}
                  <div className="artisan-opt-group">
                    <span className="artisan-opt-label">Pilihan Susu:</span>
                    <div className="artisan-chips-wrap">
                      <button
                        type="button"
                        className={`artisan-chip ${milk === 'fresh' ? 'active' : ''}`}
                        onClick={() => setMilk('fresh')}
                      >
                        Fresh Milk
                      </button>
                      <button
                        type="button"
                        className={`artisan-chip ${milk === 'oat' ? 'active' : ''}`}
                        onClick={() => setMilk('oat')}
                      >
                        Oat (+5k)
                      </button>
                      <button
                        type="button"
                        className={`artisan-chip ${milk === 'almond' ? 'active' : ''}`}
                        onClick={() => setMilk('almond')}
                      >
                        Almond (+7k)
                      </button>
                    </div>
                  </div>

                  {/* UKURAN */}
                  <div className="artisan-opt-group">
                    <span className="artisan-opt-label">Ukuran Cup:</span>
                    <div className="artisan-chips-wrap">
                      <button
                        type="button"
                        className={`artisan-chip ${size === 'regular' ? 'active' : ''}`}
                        onClick={() => setSize('regular')}
                      >
                        Reguler (250ml)
                      </button>
                      <button
                        type="button"
                        className={`artisan-chip ${size === 'large' ? 'active' : ''}`}
                        onClick={() => setSize('large')}
                      >
                        Large (+6k)
                      </button>
                    </div>
                  </div>
                </div>

                {/* EXTRA SHOT CHECKBOX ROW */}
                <div className="artisan-extra-row">
                  <label className="artisan-checkbox-card">
                    <input
                      type="checkbox"
                      checked={extraShot}
                      onChange={(e) => setExtraShot(e.target.checked)}
                      className="custom-checkbox"
                    />
                    <div className="extra-text-group">
                      <span className="extra-title">+ 1 Extra Shot Espresso Artisan</span>
                      <span className="extra-sub">Double extraction blend (+Rp 8.000)</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* PINNED LUXURY FOOTER ACTION */}
            <div className="detail-modal-footer">
              <div className="footer-qty-control">
                <span className="qty-tag">Jumlah:</span>
                <div className="luxury-stepper">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="stepper-count">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary luxury-submit-btn"
                onClick={handleAddToCart}
              >
                <span>+ TAMBAH KE PESANAN</span>
                <strong className="btn-price-tag">Rp {totalItemPrice.toLocaleString('id-ID')}</strong>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
