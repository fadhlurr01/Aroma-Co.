import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount, openCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
      document.documentElement.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
      document.documentElement.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
      document.documentElement.classList.remove('mobile-menu-open');
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { to: '/', label: 'Beranda', end: true },
    { to: '/menu', label: 'Menu Kopi' },
    { to: '/about', label: 'Tentang Kami' },
    { to: '/locations', label: 'Outlet & Reservasi' },
    { to: '/guide', label: 'Jurnal & Eksplorasi' },
  ];

  return (
    <>
      {/* HEADER NAVBAR */}
      <header className="header">
        <div className="container header-container">
          <NavLink to="/" className="brand-logo" id="brandLogo">
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 28C16 23.5817 19.5817 20 24 20H40C44.4183 20 48 23.5817 48 28V42C48 47.5228 43.5228 52 38 52H26C20.4772 52 16 47.5228 16 42V28Z" stroke="var(--color-gold)" strokeWidth="2.5"/>
              <path d="M48 26H51C54.3137 26 57 28.6863 57 32V34C57 37.3137 54.3137 40 51 40H48" stroke="var(--color-gold)" strokeWidth="2.5"/>
            </svg>
            <span>AROMA <span className="accent">& CO.</span></span>
          </NavLink>

          {/* DESKTOP NAV LINKS (VISIBLE ON DESKTOP) */}
          <nav className="nav-menu desktop-only-nav" id="desktopNavMenu">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                end={link.end}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="header-actions">
            <button
              className="cart-toggle-btn"
              id="cartToggleBtn"
              aria-label="Buka Keranjang Pesanan"
              onClick={openCart}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <span className="cart-badge" id="cartBadgeCount">{cartCount}</span>
            </button>

            <button
              className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`}
              id="mobileMenuBtn"
              aria-label="Toggle Mobile Menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* DEDICATED FULL-HEIGHT MOBILE DRAWER (OUTSIDE HEADER TO PREVENT BACKDROP-FILTER CLIPPING) */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-drawer-brand">
            <span className="brand-dot">✦</span>
            <span className="mobile-nav-title">Menu Navigasi</span>
          </div>
          <button
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Tutup Menu"
          >
            ✕
          </button>
        </div>

        <div className="mobile-links-list">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `mobile-drawer-link ${isActive ? 'active' : ''}`}
              end={link.end}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{link.label}</span>
              <span className="arrow-icon">➔</span>
            </NavLink>
          ))}
        </div>

        <div className="mobile-nav-footer">
          <p>Specialty Coffee & Micro Roastery</p>
          <span>Senopati Raya 45, Jakarta Selatan</span>
          <small className="operating-text">Buka Setiap Hari 07.00 - 22.00 WIB</small>
        </div>
      </div>

      {/* FULL VIEWPORT BACKDROP */}
      {mobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}
    </>
  );
}
