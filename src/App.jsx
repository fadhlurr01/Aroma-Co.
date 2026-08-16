import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import Toast from './components/Toast';
import AmbientScene from './components/AmbientScene';
import PageWrapper from './components/PageWrapper';

import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Locations from './pages/Locations';
import Guide from './pages/Guide';
import Admin from './pages/Admin';
import ArticleDetail from './pages/ArticleDetail';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* AMBIENT BACKGROUND SCENE */}
          <AmbientScene />

          <Navbar />
          
          <main style={{ flex: 1, position: 'relative', zIndex: 2 }}>
            <PageWrapper>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/about" element={<About />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
              </Routes>
            </PageWrapper>
          </main>

          <Footer />

          {/* INTERACTIVE CART & CHECKOUT */}
          <CartDrawer />
          <CheckoutModal />
          <Toast />
        </div>
      </Router>
    </CartProvider>
  );
}
