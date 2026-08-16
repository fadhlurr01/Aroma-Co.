import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ARTICLE_CATEGORIES = [
  { id: 'Sains Fermentasi', label: 'Sains Fermentasi' },
  { id: 'Direct Trade', label: 'Direct Trade & Petani' },
  { id: 'Home Brewing', label: 'Home Brewing' },
  { id: 'Roastery Lab', label: 'Roastery & Sangrai' },
  { id: 'Barista Tips', label: 'Barista Masterclass' }
];

export default function Admin() {
  const {
    ordersList,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    clearFinishedOrders,
    articlesList,
    addArticle,
    deleteArticle,
    showToast,
  } = useCart();

  const [activeAdminSection, setActiveAdminSection] = useState('orders'); // 'orders' | 'articles'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'processing' | 'completed' | 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');

  // --- Article Editor State ---
  const [editorTab, setEditorTab] = useState('write'); // 'write' | 'preview'
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Sains Fermentasi');
  const [newReadTime, setNewReadTime] = useState('5 Menit Baca');
  const [newAuthor, setNewAuthor] = useState('Pratama Wicaksana (Roastery Lab)');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContentText, setNewContentText] = useState('');
  const [newTags, setNewTags] = useState('Sains Kopi, Gayo Pantan Musara, Specialty');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFileName, setImageFileName] = useState('');
  const [articleSearch, setArticleSearch] = useState('');
  const [articleFilterCat, setArticleFilterCat] = useState('all');

  // --- Custom Luxury Delete Confirmation Modal ---
  const [deleteModal, setDeleteModal] = useState(null);

  // Calculate Metrics
  const totalRevenue = ordersList
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = ordersList.length;
  const pendingOrders = ordersList.filter((o) => o.status === 'pending').length;
  const processingOrders = ordersList.filter((o) => o.status === 'processing').length;
  const completedOrders = ordersList.filter((o) => o.status === 'completed').length;

  const filteredOrders = ordersList.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const filteredArticles = articlesList.filter((art) => {
    const matchesCat = articleFilterCat === 'all' || art.category === articleFilterCat;
    const matchesSearch =
      art.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.author.toLowerCase().includes(articleSearch.toLowerCase()) ||
      art.category.toLowerCase().includes(articleSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleApproveOrder = (order) => {
    updateOrderStatus(order.orderId, 'processing');
    updatePaymentStatus(order.orderId, 'LUNAS (Dikonfirmasi Admin)');
    showToast(`Pesanan #${order.orderId} telah dikonfirmasi dan masuk antrean seduh!`);
  };

  const handleCompleteOrder = (order) => {
    updateOrderStatus(order.orderId, 'completed');
    showToast(`Pesanan #${order.orderId} telah selesai disajikan.`);
  };

  const handleCancelOrder = (order) => {
    updateOrderStatus(order.orderId, 'cancelled');
    showToast(`Pesanan #${order.orderId} telah dibatalkan.`);
  };

  const executeDelete = () => {
    if (!deleteModal) return;

    if (deleteModal.type === 'order') {
      deleteOrder(deleteModal.id);
      showToast(`Histori pesanan #${deleteModal.id} berhasil dihapus permanen.`);
    } else if (deleteModal.type === 'clear_finished') {
      clearFinishedOrders();
      showToast('Seluruh riwayat pesanan selesai/dibatalkan telah dibersihkan.');
    } else if (deleteModal.type === 'article') {
      deleteArticle(deleteModal.id);
      showToast(`Artikel "${deleteModal.name}" berhasil dihapus dari jurnal.`);
    }

    setDeleteModal(null);
  };

  const openWhatsAppCustomer = (order) => {
    let cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const msg = `Halo ${order.customerName}, kami dari Barista Aroma & Co. Roasters mengonfirmasi pesanan #${order.orderId} (${order.orderType.toUpperCase()}) sedang disiapkan. Terima kasih!`;
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Handle Photo Upload from Local Device / Gallery
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Mohon pilih file gambar yang valid (JPG, PNG, WebP).');
        return;
      }
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFileName('');
  };

  const handlePublishArticle = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newExcerpt.trim() || !newContentText.trim()) {
      showToast('Mohon lengkapi judul, ringkasan, dan isi artikel.');
      return;
    }

    const generatedId = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    // Split content into structured chapters
    const paragraphs = newContentText.split('\n\n').filter(Boolean);
    const structuredContent = paragraphs.map((para, index) => {
      const lines = para.split('\n');
      if (lines.length > 1 && lines[0].endsWith(':')) {
        return {
          heading: lines[0].replace(':', ''),
          text: lines.slice(1).join('\n')
        };
      }
      return {
        heading: `Wawasan & Analisis Bagian ${index + 1}`,
        text: para
      };
    });

    const parsedTags = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newArticleObj = {
      id: generatedId,
      title: newTitle.trim(),
      category: newCategory,
      readTime: newReadTime || '5 Menit Baca',
      author: newAuthor || 'Tim Roastery Lab',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      image: imagePreview || './assets/images/prod-1.jpg',
      excerpt: newExcerpt.trim(),
      tags: parsedTags.length > 0 ? parsedTags : ['Kopi Spesialti', 'Roastery Lab'],
      content: structuredContent
    };

    addArticle(newArticleObj);

    // Reset Form
    setNewTitle('');
    setNewExcerpt('');
    setNewContentText('');
    setImagePreview(null);
    setImageFileName('');
    setEditorTab('write');
  };

  return (
    <div className="admin-page-root section">
      <div className="container">
        {/* HEADER SECTION */}
        <div className="admin-header-row">
          <div>
            <div className="admin-badge-tag">
              <span>✦ OFFICIAL STORE POS & EDITORIAL DASHBOARD</span>
            </div>
            <h1 className="admin-main-title">
              Panel Pengelola <span>Kedai & Konten</span>
            </h1>
            <p className="admin-sub-desc">
              Pusat kendali operasional pesanan kasir, antrean seduh barista, serta penerbitan esai riset jurnal kopi.
            </p>
          </div>

          <div className="admin-header-actions">
            <Link to="/menu" className="btn btn-outline btn-sm">
              ← Menu Kopi
            </Link>
            <Link to="/guide" className="btn btn-outline btn-sm">
              Jurnal Kopi
            </Link>
            <span className="live-status-pill">
              <span className="live-dot">●</span> POS LIVE ACTIVE
            </span>
          </div>
        </div>

        {/* TOP SECTION SWITCHER TABS (CLEAN TYPOGRAPHY) */}
        <div className="admin-main-nav-tabs mt-4">
          <button
            type="button"
            className={`admin-main-tab ${activeAdminSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveAdminSection('orders')}
          >
            Manajemen Pesanan & Kasir ({ordersList.length})
          </button>
          <button
            type="button"
            className={`admin-main-tab ${activeAdminSection === 'articles' ? 'active' : ''}`}
            onClick={() => setActiveAdminSection('articles')}
          >
            Kelola & Terbitkan Artikel Jurnal ({articlesList.length})
          </button>
        </div>

        {/* ================= SECTION 1: ORDERS MANAGEMENT ================= */}
        {activeAdminSection === 'orders' && (
          <div className="admin-orders-flow animate-fadeIn">
            {/* METRICS STATS CARDS */}
            <div className="admin-metrics-grid mt-4">
              <div className="glass-panel admin-stat-card">
                <span className="stat-label">Total Omset Penjualan</span>
                <strong className="stat-value gold-text">Rp {totalRevenue.toLocaleString('id-ID')}</strong>
                <span className="stat-sub">Dari {totalOrders} transaksi</span>
              </div>

              <div className="glass-panel admin-stat-card">
                <span className="stat-label">Menunggu Konfirmasi</span>
                <strong className="stat-value orange-text">{pendingOrders} Pesanan</strong>
                <span className="stat-sub">Verifikasi bayar / kasir</span>
              </div>

              <div className="glass-panel admin-stat-card">
                <span className="stat-label">Sedang Diracik Barista</span>
                <strong className="stat-value purple-text">{processingOrders} Antrean</strong>
                <span className="stat-sub">Proses seduh espresso & brew</span>
              </div>

              <div className="glass-panel admin-stat-card">
                <span className="stat-label">Pesanan Selesai Disajikan</span>
                <strong className="stat-value green-text">{completedOrders} Selesai</strong>
                <span className="stat-sub">Transaksi tuntas</span>
              </div>
            </div>

            {/* FILTER & SEARCH BAR */}
            <div className="admin-controls-bar glass-panel mt-4">
              <div className="admin-search-input-box">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Cari ID Pesanan, Nama Pemesan, atau WhatsApp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <div className="admin-status-tabs">
                {[
                  { id: 'all', label: `Semua (${ordersList.length})` },
                  { id: 'pending', label: `Menunggu (${pendingOrders})` },
                  { id: 'processing', label: `Diproses (${processingOrders})` },
                  { id: 'completed', label: `Selesai (${completedOrders})` },
                  { id: 'cancelled', label: 'Dibatalkan' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`admin-tab-btn ${filterStatus === tab.id ? 'active' : ''}`}
                    onClick={() => setFilterStatus(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn-clear-history"
                onClick={() =>
                  setDeleteModal({
                    type: 'clear_finished',
                    id: 'all',
                    name: 'Semua Riwayat Selesai/Batal',
                    detail: 'Tindakan ini akan menghapus semua catatan pesanan berstatus Selesai dan Dibatalkan dari sistem penyimpanan lokal.',
                  })
                }
                title="Bersihkan semua pesanan yang sudah selesai atau dibatalkan"
              >
                Bersihkan Riwayat Selesai
              </button>
            </div>

            {/* ORDERS LIST */}
            <div className="admin-orders-container mt-4">
              {filteredOrders.length === 0 ? (
                <div className="glass-panel admin-empty-orders">
                  <div className="empty-icon-artisan">✦</div>
                  <h3>Tidak Ada Pesanan Ditemukan</h3>
                  <p>Belum ada data pesanan yang sesuai dengan filter pencarian saat ini.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.orderId}
                    className={`glass-panel admin-order-card ${order.status === 'pending' ? 'border-pending' : order.status === 'processing' ? 'border-processing' : ''}`}
                  >
                    {/* TOP HEADER */}
                    <div className="order-card-header">
                      <div className="order-main-meta">
                        <span className="order-id-tag">#{order.orderId}</span>
                        <span className="order-time-tag">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}, {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                        <span className="order-type-badge">
                          {order.orderType === 'dine-in' ? `DINE IN (MEJA ${order.tableNumber || '-'})` : order.orderType === 'takeaway' ? 'TAKE AWAY' : 'DELIVERY'}
                        </span>
                      </div>

                      <div className="order-status-badge-wrap">
                        {order.status === 'pending' && <span className="badge badge-pending">Menunggu Konfirmasi</span>}
                        {order.status === 'processing' && <span className="badge badge-processing">Sedang Diracik Barista</span>}
                        {order.status === 'completed' && <span className="badge badge-completed">Selesai Disajikan</span>}
                        {order.status === 'cancelled' && <span className="badge badge-cancelled">Dibatalkan</span>}
                      </div>
                    </div>

                    {/* CUSTOMER & PAYMENT ROW */}
                    <div className="order-customer-row">
                      <div className="customer-info-box">
                        <span className="info-title">Pelanggan:</span>
                        <strong>{order.customerName}</strong>
                        <span className="phone-text">({order.customerPhone})</span>
                        {order.deliveryAddress && (
                          <span className="address-text">Alamat: {order.deliveryAddress}</span>
                        )}
                      </div>

                      <div className="payment-info-box">
                        <span className="info-title">Metode & Status Bayar:</span>
                        <strong className="pm-name">{order.paymentMethod.toUpperCase()}</strong>
                        <span className="pm-status">{order.paymentStatus}</span>
                      </div>

                      <div className="total-info-box">
                        <span className="info-title">Total Tagihan:</span>
                        <strong className="total-gold-num">Rp {order.total.toLocaleString('id-ID')}</strong>
                      </div>
                    </div>

                    {order.customerNote && (
                      <div className="order-barista-note">
                        <strong>Catatan Pelanggan:</strong> "{order.customerNote}"
                      </div>
                    )}

                    {/* ITEMS LIST */}
                    <div className="order-items-table">
                      <span className="items-heading">Rincian Menu ({order.items.length} Item):</span>
                      <div className="order-items-grid">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="admin-item-row">
                            <div className="item-thumb-box">
                              <img src={it.image || './assets/images/prod-1.jpg'} alt={it.name} />
                            </div>
                            <div className="item-text-info">
                              <strong className="item-name">{it.quantity}x {it.name}</strong>
                              {it.customOptions && (
                                <small className="item-specs">
                                  {[it.customOptions.temperature, it.customOptions.sweetness, it.customOptions.milk, it.customOptions.size, it.customOptions.extraShot]
                                    .filter(Boolean)
                                    .join(' • ')}
                                </small>
                              )}
                            </div>
                            <span className="item-subtotal">Rp {(it.price * it.quantity).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ACTION BUTTONS ROW */}
                    <div className="order-admin-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => openWhatsAppCustomer(order)}
                      >
                        Chat WhatsApp
                      </button>

                      {order.status === 'pending' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleApproveOrder(order)}
                        >
                          Konfirmasi & Mulai Seduh
                        </button>
                      )}

                      {order.status === 'processing' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleCompleteOrder(order)}
                        >
                          Tandai Selesai Disajikan
                        </button>
                      )}

                      {order.status !== 'completed' && order.status !== 'cancelled' && (
                        <button
                          type="button"
                          className="btn-cancel-link"
                          onClick={() => handleCancelOrder(order)}
                        >
                          Batalkan
                        </button>
                      )}

                      {/* DELETE ORDER HISTORY BUTTON */}
                      <button
                        type="button"
                        className="btn-delete-order"
                        onClick={() =>
                          setDeleteModal({
                            type: 'order',
                            id: order.orderId,
                            name: `Pesanan #${order.orderId}`,
                            detail: `Pelanggan: ${order.customerName} (Total: Rp ${order.total.toLocaleString('id-ID')})`,
                          })
                        }
                        title="Hapus riwayat pesanan ini dari daftar"
                      >
                        Hapus Histori
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= SECTION 2: ARTICLES PUBLISHING & MANAGEMENT ================= */}
        {activeAdminSection === 'articles' && (
          <div className="admin-articles-flow animate-fadeIn mt-4">
            <div className="admin-article-layout-grid">
              {/* LEFT: ARTISAN ARTICLE EDITOR */}
              <div className="glass-panel admin-form-card">
                <div className="form-card-header-row">
                  <div>
                    <span className="badge badge-gold">✦ EDITOR JURNAL ARTISAN</span>
                    <h3 className="editor-main-heading">Publikasi Esai & Wawasan Kopi</h3>
                    <p className="form-subtext">Bagikan riset sains seduh, kabar kebun kopi, dan eksplorasi rasa terbaru.</p>
                  </div>

                  {/* WRITE VS PREVIEW TABS (CLEAN TEXT) */}
                  <div className="editor-sub-tabs">
                    <button
                      type="button"
                      className={`editor-tab-pill ${editorTab === 'write' ? 'active' : ''}`}
                      onClick={() => setEditorTab('write')}
                    >
                      Tulis Naskah
                    </button>
                    <button
                      type="button"
                      className={`editor-tab-pill ${editorTab === 'preview' ? 'active' : ''}`}
                      onClick={() => setEditorTab('preview')}
                    >
                      Pratinjau Pembaca
                    </button>
                  </div>
                </div>

                {editorTab === 'write' ? (
                  <form onSubmit={handlePublishArticle} className="admin-publish-form mt-3">
                    <div className="form-group-item">
                      <label className="form-label">Judul Esai Kopi <span className="req">*</span></label>
                      <input
                        type="text"
                        className="form-control editor-title-input"
                        placeholder="Contoh: Eksplorasi Profil Sangrai Honey Process di Lereng Gunung..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                      />
                    </div>

                    {/* CATEGORY CHIPS SELECTOR (CLEAN LUXURY PILLS) */}
                    <div className="form-group-item">
                      <label className="form-label">Pilih Rubrik Kategori <span className="req">*</span></label>
                      <div className="category-chips-grid">
                        {ARTICLE_CATEGORIES.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            className={`category-chip-btn ${newCategory === cat.id ? 'active' : ''}`}
                            onClick={() => setNewCategory(cat.id)}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="form-double-row">
                      <div className="form-group-item">
                        <label className="form-label">Estimasi Waktu Baca</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: 5 Menit Baca"
                          value={newReadTime}
                          onChange={(e) => setNewReadTime(e.target.value)}
                        />
                      </div>

                      <div className="form-group-item">
                        <label className="form-label">Nama Penulis & Jabatan</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Contoh: Pratama Wicaksana (Licensed Q-Grader)"
                          value={newAuthor}
                          onChange={(e) => setNewAuthor(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* LOCAL GALLERY PHOTO UPLOAD DROPZONE (MINIMAL VECTOR ICON) */}
                    <div className="form-group-item">
                      <label className="form-label">
                        Foto Sampul Artikel (Pilih dari Galeri Perangkat Anda) <span className="req">*</span>
                      </label>

                      {!imagePreview ? (
                        <div className="gallery-upload-dropzone">
                          <input
                            type="file"
                            id="articleGalleryInput"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="file-input-hidden"
                          />
                          <label htmlFor="articleGalleryInput" className="dropzone-label">
                            <div className="dropzone-svg-icon">
                              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                            </div>
                            <strong>Pilih Foto dari Galeri HP / Komputer</strong>
                            <span>Format JPG, PNG, atau WebP (Tersimpan otomatis secara lokal)</span>
                          </label>
                        </div>
                      ) : (
                        <div className="gallery-preview-card">
                          <img src={imagePreview} alt="Preview Unggahan" className="gallery-preview-img" />
                          <div className="preview-overlay-bar">
                            <span className="preview-file-name">{imageFileName || 'Foto Galeri'}</span>
                            <button type="button" className="btn-remove-preview" onClick={handleRemoveImage}>
                              Ganti Foto
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="form-group-item">
                      <label className="form-label">Ringkasan Pengantar (Lead Excerpt) <span className="req">*</span></label>
                      <textarea
                        className="form-control"
                        rows="2"
                        placeholder="Tuliskan 1-2 kalimat ringkasan yang memikat untuk menarik minat baca pengunjung..."
                        value={newExcerpt}
                        onChange={(e) => setNewExcerpt(e.target.value)}
                        required
                      ></textarea>
                    </div>

                    <div className="form-group-item">
                      <label className="form-label">Naskah Lengkap Artikel (Paragraf & Bab) <span className="req">*</span></label>
                      <textarea
                        className="form-control editor-content-area"
                        rows="8"
                        placeholder="Tuliskan naskah esai secara terperinci. Gunakan baris kosong ganda (Enter 2x) untuk memisahkan bab/paragraf..."
                        value={newContentText}
                        onChange={(e) => setNewContentText(e.target.value)}
                        required
                      ></textarea>
                      <small className="form-hint">Tip: Baris pertama yang diakhiri tanda titik dua (:) akan otomatis menjadi sub-judul bab.</small>
                    </div>

                    <div className="form-group-item">
                      <label className="form-label">Tag Topik Artikel (Pisahkan dengan koma)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Sains Kopi, Gayo, Fermentasi, Barista, Manual Brew"
                        value={newTags}
                        onChange={(e) => setNewTags(e.target.value)}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-2 btn-publish-action">
                      ✦ Terbitkan Artikel ke Jurnal Sekarang ➔
                    </button>
                  </form>
                ) : (
                  /* LIVE PREVIEW TAB */
                  <div className="editor-live-preview-box mt-3 glass-panel">
                    <div className="preview-header-meta">
                      <span className="badge badge-gold">{newCategory}</span>
                      <span className="meta-read-time">{newReadTime || '5 Menit Baca'}</span>
                      <span className="meta-date">{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>

                    <h2 className="preview-hero-title">{newTitle || 'Judul Artikel Anda Akan Tampil di Sini'}</h2>
                    
                    <p className="preview-lead-excerpt">
                      {newExcerpt || 'Ringkasan pengantar artikel yang memikat pembaca akan tampil di sini dengan garis aksen emas.'}
                    </p>

                    <div className="preview-author-badge">
                      <span>Ditulis oleh: <strong>{newAuthor || 'Tim Roastery Lab'}</strong></span>
                    </div>

                    {imagePreview && (
                      <div className="preview-banner-wrap mt-3">
                        <img src={imagePreview} alt="Pratinjau Sampul" className="preview-banner-img" />
                      </div>
                    )}

                    <div className="preview-body-content mt-3">
                      {(newContentText || 'Isi pembahasan naskah artikel Anda akan dipratinjau di bagian ini secara rapi.').split('\n\n').map((p, i) => (
                        <p key={i} className="preview-paragraph">{p}</p>
                      ))}
                    </div>

                    <button type="button" className="btn btn-outline btn-sm mt-4" onClick={() => setEditorTab('write')}>
                      ← Kembali Mengedit Naskah
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT: PUBLISHED ARTICLES MANAGEMENT */}
              <div className="glass-panel admin-articles-list-card">
                <div className="list-card-header">
                  <div className="list-title-row">
                    <h3>Daftar Artikel Terbit ({articlesList.length})</h3>
                    <span className="badge badge-sand">Live on /guide</span>
                  </div>
                  <p>Semua esai aktif yang dapat dibaca oleh pengunjung website.</p>

                  {/* SEARCH & FILTER IN ARTICLES LIST */}
                  <div className="art-list-search-box mt-3">
                    <input
                      type="text"
                      placeholder="Cari judul artikel atau nama penulis..."
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                      className="admin-search-input art-search-input"
                    />
                  </div>
                </div>

                <div className="admin-articles-scroll mt-3">
                  {filteredArticles.length === 0 ? (
                    <div className="admin-empty-orders">
                      <p>Tidak ada artikel yang cocok dengan pencarian.</p>
                    </div>
                  ) : (
                    filteredArticles.map((art) => (
                      <div key={art.id} className="admin-article-item-card">
                        <div className="art-item-thumb">
                          <img src={art.image} alt={art.title} />
                        </div>
                        <div className="art-item-info">
                          <span className="art-cat-badge">{art.category} • {art.readTime}</span>
                          <h4 className="art-title">{art.title}</h4>
                          <span className="art-author-date">{art.author.split('(')[0]} • {art.date}</span>
                          <div className="art-actions-row">
                            <Link to={`/article/${art.id}`} className="btn-view-art" target="_blank">
                              Buka Artikel ↗
                            </Link>
                            <button
                              type="button"
                              className="btn-delete-art-pill"
                              onClick={() =>
                                setDeleteModal({
                                  type: 'article',
                                  id: art.id,
                                  name: art.title,
                                  detail: `Kategori: ${art.category} • Penulis: ${art.author}`,
                                })
                              }
                              title="Hapus artikel ini"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= LUXURY CONFIRMATION DELETE MODAL ================= */}
      {deleteModal && (
        <div className="modal-overlay open" onClick={() => setDeleteModal(null)}>
          <div className="modal-content glass-panel luxury-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon-circle">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>

            <h3 className="confirm-modal-title">Konfirmasi Penghapusan</h3>
            <p className="confirm-modal-desc">
              Apakah Anda yakin ingin menghapus data berikut secara permanen?
            </p>

            <div className="confirm-item-preview-box">
              <strong className="confirm-item-name">{deleteModal.name}</strong>
              {deleteModal.detail && <span className="confirm-item-sub">{deleteModal.detail}</span>}
            </div>

            <div className="confirm-modal-actions mt-4">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteModal(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={executeDelete}
              >
                Ya, Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
