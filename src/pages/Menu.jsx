import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { COFFEE_MENU } from '../data/coffeeData';
import { useCart } from '../context/CartContext';
import CoffeeModal from '../components/CoffeeModal';

export default function Menu() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart, showToast } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state?.selectedItemId) {
      const target = COFFEE_MENU.find((it) => it.id === location.state.selectedItemId);
      if (target) {
        setSelectedProduct(target);
      }
    }
  }, [location.state]);

  const categories = [
    { id: 'all', label: 'Semua Menu' },
    { id: 'espresso', label: 'Espresso Bar' },
    { id: 'cold', label: 'Cold Brew & Iced' },
    { id: 'manual', label: 'Manual Brew (V60)' },
    { id: 'noncoffee', label: 'Non-Coffee & Latte' },
    { id: 'pastry', label: 'Artisan Bakery' },
  ];

  const filteredMenu = COFFEE_MENU.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tastingNotes && item.tastingNotes.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="menu-page-root section">
      <div className="container">
        {/* HEADER SECTION */}
        <div className="section-title-wrapper">
          <span className="sub-tag">✦ Artisan Curated Selections ✦</span>
          <h1 className="section-title">
            Catalogue <span>Artisan Menu</span>
          </h1>
          <p className="section-description">
            Setiap hidangan disajikan dengan teknik ekstraksi presisi dan perpaduan cita rasa kopi kualitas kelas dunia 100% Arabica.
          </p>
        </div>

        {/* SEARCH & CATEGORY FILTER */}
        <div className="menu-filter-container glass-panel">
          <div className="menu-search-wrap">
            <input
              type="text"
              placeholder="Cari kopi, karakter rasa (cth: caramel, citrus, plum)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="menu-search-input"
            />
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="var(--color-gold)"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className="search-icon-pos"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>

          <div className="menu-category-scroll">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`menu-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="menu-result-counter">
            <span>Menampilkan <strong>{filteredMenu.length}</strong> menu kopi pilihan</span>
          </div>
        </div>

        {/* EDITORIAL SHOWCASE LIST */}
        {filteredMenu.length === 0 ? (
          <div className="menu-empty-state glass-panel">
            <div className="empty-icon">✦</div>
            <h3>Menu Tidak Ditemukan</h3>
            <p>Coba gunakan kata kunci lain seperti "vanilla", "espresso", atau "chocolate".</p>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
            >
              Reset Filter Pencarian
            </button>
          </div>
        ) : (
          <div className="menu-showcase-list">
            {filteredMenu.map((item, index) => {
              const isEven = index % 2 === 0;
              const isSelected = location.state?.selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  id={`menu-card-${item.id}`}
                  className={`glass-panel menu-showcase-card ${isEven ? 'layout-normal' : 'layout-reverse'} ${isSelected ? 'highlight-focus' : ''}`}
                >
                  {/* IMAGE COL WITH RATIO & BADGES */}
                  <div className="menu-card-img-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="menu-card-img card-img-zoom"
                    />
                    <div className="menu-card-badge-pos">
                      <span className={`badge ${item.badgeClass}`}>{item.badge}</span>
                    </div>
                    <div className="menu-card-rating-float">
                      ★ {item.rating} / 5.0
                    </div>
                    {item.altitude && (
                      <div className="menu-card-altitude-badge">
                        Elevasi: {item.altitude}
                      </div>
                    )}
                  </div>

                  {/* CONTENT DETAILS COL */}
                  <div className="menu-card-content">
                    <div className="menu-card-top-header">
                      <div className="menu-item-tag">
                        ✦ Artisan Selection #{index + 1} • {item.origin || 'Single Origin'}
                      </div>
                      <span className="menu-roast-pill">{item.roastLevel || 'Medium Roast'}</span>
                    </div>

                    <h2 className="menu-item-title">
                      {item.name}
                    </h2>

                    <p className="menu-item-desc">
                      {item.description}
                    </p>

                    {/* TASTING NOTES CHIPS */}
                    {item.tastingNotes && (
                      <div className="menu-tasting-chips-row">
                        <span className="tasting-caption">Flavor Notes:</span>
                        <div className="tasting-chips-wrap">
                          {item.tastingNotes.map((note, nIdx) => (
                            <span key={nIdx} className="tasting-chip">
                              ✦ {note}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* FLAVOR PROFILE METERS GRID */}
                    {item.flavorProfile && (
                      <div className="menu-flavor-grid">
                        <div className="flavor-grid-item">
                          <span>Acidity:</span> <strong>{item.flavorProfile.acidity}</strong>
                        </div>
                        <div className="flavor-grid-item">
                          <span>Body:</span> <strong>{item.flavorProfile.body}</strong>
                        </div>
                        <div className="flavor-grid-item">
                          <span>Sweetness:</span> <strong>{item.flavorProfile.sweetness}</strong>
                        </div>
                        <div className="flavor-grid-item">
                          <span>Aroma:</span> <strong>{item.flavorProfile.aroma}</strong>
                        </div>
                      </div>
                    )}

                    <div className="menu-card-bottom-row">
                      <div className="menu-price-display">
                        <span className="price-label">Harga Satuan</span>
                        <span className="price-val">Rp {item.price.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="menu-action-btns">
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => setSelectedProduct(item)}
                          title="Buka profil citarasa lengkap"
                        >
                          Detail Rasa
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => setSelectedProduct(item)}
                          title="Kustomisasi & Pesan Menu Kopi"
                        >
                          + Pesan Kopi ➔
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DETAIL RASA MODAL */}
      {selectedProduct && (
        <CoffeeModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
