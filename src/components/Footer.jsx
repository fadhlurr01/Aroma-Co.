import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        {/* RESPONSIVE TWO-COLUMN SPLIT */}
        <div className="footer-split-layout">
          {/* LEFT: BRAND INFO & LINKS */}
          <div className="footer-brand-col">
            <Link to="/" className="brand-logo footer-logo">
              <svg width="30" height="30" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 28C16 23.5817 19.5817 20 24 20H40C44.4183 20 48 23.5817 48 28V42C48 47.5228 43.5228 52 38 52H26C20.4772 52 16 47.5228 16 42V28Z" stroke="var(--color-gold)" strokeWidth="2.5"/>
                <path d="M48 26H51C54.3137 26 57 28.6863 57 32V34C57 37.3137 54.3137 40 51 40H48" stroke="var(--color-gold)" strokeWidth="2.5"/>
              </svg>
              <span>AROMA <span className="accent">& CO.</span></span>
            </Link>

            <p className="footer-desc">
              Mendedikasikan setiap cangkir untuk keahlian sangrai artisan terbaik, etika perdagangan kopi langsung (*Direct Trade*), dan kehangatan rasa berstandar dunia.
            </p>

            <div className="footer-links-grid">
              <div className="footer-link-group">
                <h4 className="footer-heading">Navigasi</h4>
                <ul className="footer-list">
                  <li><Link to="/">Beranda Utama</Link></li>
                  <li><Link to="/menu">Menu Kopi Artisan</Link></li>
                  <li><Link to="/about">Tentang Roastery</Link></li>
                  <li><Link to="/locations">Outlet & Reservasi</Link></li>
                  <li><Link to="/guide">Panduan Brewing</Link></li>
                </ul>
              </div>

              <div className="footer-link-group">
                <h4 className="footer-heading">Jam Operasional</h4>
                <ul className="footer-list">
                  <li><strong>Senin - Jumat:</strong><br />07.00 - 22.00 WIB</li>
                  <li><strong>Sabtu - Minggu:</strong><br />07.00 - 23.00 WIB</li>
                </ul>
              </div>

              <div className="footer-link-group">
                <h4 className="footer-heading">Kontak Kami</h4>
                <ul className="footer-list">
                  <li>📞 +62 21 555 8901</li>
                  <li>💬 WhatsApp Support</li>
                  <li>✉️ hello@aromacoffee.id</li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: MAP CARD */}
          <div className="footer-map-col">
            <div className="glass-panel footer-map-card">
              <div className="map-card-header">
                <div>
                  <h4 className="map-store-title">📍 Flagship Store & Roastery</h4>
                  <span className="map-store-address">Senopati Raya No. 45, Jakarta Selatan</span>
                </div>
                <span className="map-status-badge">🟢 Open Today</span>
              </div>

              <div className="map-embed-wrapper">
                <iframe
                  title="Aroma Coffee Location Map"
                  src="https://maps.google.com/maps?q=Senopati%20Jakarta&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  className="map-iframe"
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>

              <div className="map-card-footer">
                <span className="map-facilities-text">Parkir Valet • AC Indoor & Outdoor Terrace</span>
                <a
                  href="https://maps.google.com/?q=Senopati+Jakarta"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  Petunjuk Arah ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="footer-bottom-row">
          <p>&copy; {new Date().getFullYear()} Aroma & Co. Coffee Roasters. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#privacy">Kebijakan Privasi</a>
            <a href="#terms">Syarat & Ketentuan</a>
            <Link to="/admin" className="staff-portal-link" title="Portal Barista & Kasir">
              🔒 Staf POS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
