import React, { useState } from 'react';
import { OUTLETS_DATA } from '../data/coffeeData';
import { useCart } from '../context/CartContext';

export default function Locations() {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    outlet: 'out-1',
    date: '',
    time: '',
    guests: '2',
    notes: '',
  });

  const [reservationSuccess, setReservationSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      showToast('Mohon lengkapi data reservasi Anda.');
      return;
    }

    const outletObj = OUTLETS_DATA.find((o) => o.id === formData.outlet) || OUTLETS_DATA[0];

    const confirmation = {
      code: 'RSV-' + Math.floor(100000 + Math.random() * 900000),
      name: formData.name,
      outletName: outletObj.name,
      date: formData.date,
      time: formData.time,
      guests: formData.guests,
    };

    setReservationSuccess(confirmation);
    showToast('Reservasi Meja Berhasil Dikonfirmasi!');
  };

  return (
    <div className="locations-page-root section">
      <div className="container">
        <div className="section-title-wrapper">
          <span className="sub-tag">✦ Kunjungi Kafe & Roastery Kami ✦</span>
          <h1 className="section-title">
            Lokasi Outlet <span>& Reservasi Meja</span>
          </h1>
          <p className="section-description">
            Temukan suasana hangat tempat penyeduhan kami atau lakukan pemesanan meja khusus untuk rapat, santai, maupun kencan kopi.
          </p>
        </div>

        {/* OUTLETS LIST */}
        <div className="outlets-grid">
          {OUTLETS_DATA.map((outlet) => (
            <div key={outlet.id} className="glass-panel outlet-card">
              <div className="outlet-card-header">
                <div className="outlet-header-main">
                  <h3 className="outlet-name">
                    {outlet.name}
                  </h3>
                  <span className="outlet-status-pill">● Buka Setiap Hari</span>
                </div>
                {outlet.isPopular && (
                  <span className="badge badge-gold">Flagship HQ</span>
                )}
              </div>

              <div className="outlet-info-list">
                <p className="outlet-info-item">
                  <span className="info-icon">✦</span> 
                  <span>{outlet.address}</span>
                </p>
                <p className="outlet-info-item">
                  <span className="info-icon">✦</span> 
                  <span>{outlet.hours}</span>
                </p>
                <p className="outlet-info-item">
                  <span className="info-icon">✦</span> 
                  <span>{outlet.phone}</span>
                </p>
              </div>

              <div className="outlet-features-list">
                {outlet.features.map((feat, idx) => (
                  <span key={idx} className="outlet-feature-tag">
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* RESERVATION FORM */}
        <div className="glass-panel reservation-card">
          <div className="reservation-header">
            <span className="sub-tag">Formulir Mandiri</span>
            <h2 className="reservation-title">
              Formulir Reservasi Meja Online
            </h2>
            <p className="reservation-subtitle">
              Konfirmasi instan langsung ke nomor WhatsApp Anda tanpa biaya uang muka.
            </p>
          </div>

          {reservationSuccess ? (
            <div className="reservation-success-view animate-fade-in">
              <div className="success-check-circle">✓</div>
              <h3 className="res-success-heading">
                Reservasi Meja Berhasil Dikonfirmasi!
              </h3>
              <p className="res-success-sub">
                Kode Tiket Reservasi: <strong className="res-code">{reservationSuccess.code}</strong>
              </p>
              <div className="res-summary-box">
                <div className="res-row"><span>Nama Pemesan:</span> <strong>{reservationSuccess.name}</strong></div>
                <div className="res-row"><span>Outlet Kafe:</span> <strong>{reservationSuccess.outletName}</strong></div>
                <div className="res-row"><span>Jadwal:</span> <strong>{reservationSuccess.date} @ {reservationSuccess.time} WIB</strong></div>
                <div className="res-row"><span>Jumlah Tamu:</span> <strong>{reservationSuccess.guests} Orang</strong></div>
              </div>
              <button className="btn btn-primary" onClick={() => setReservationSuccess(null)}>
                Buat Reservasi Baru
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="reservation-form-grid">
              <div className="form-col">
                <label className="res-label">Nama Lengkap <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="res-input"
                />
              </div>

              <div className="form-col">
                <label className="res-label">Nomor WhatsApp <span className="req">*</span></label>
                <input
                  type="tel"
                  required
                  placeholder="0812-xxxx-xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="res-input"
                />
              </div>

              <div className="form-col">
                <label className="res-label">Email Konfirmasi</label>
                <input
                  type="email"
                  placeholder="email@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="res-input"
                />
              </div>

              <div className="form-col">
                <label className="res-label">Pilih Outlet <span className="req">*</span></label>
                <select
                  value={formData.outlet}
                  onChange={(e) => setFormData({ ...formData, outlet: e.target.value })}
                  className="res-input"
                >
                  {OUTLETS_DATA.map((o) => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-col">
                <label className="res-label">Tanggal Kunjungan <span className="req">*</span></label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="res-input"
                />
              </div>

              <div className="form-col">
                <label className="res-label">Waktu Kedatangan <span className="req">*</span></label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="res-input"
                />
              </div>

              <div className="form-col">
                <label className="res-label">Jumlah Tamu <span className="req">*</span></label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="res-input"
                >
                  <option value="1">1 Orang</option>
                  <option value="2">2 Orang (Pasangan)</option>
                  <option value="4">4 Orang (Keluarga/Teman)</option>
                  <option value="6">6 Orang</option>
                  <option value="8+">8+ Orang (Grup Meeting/Acara)</option>
                </select>
              </div>

              <div className="form-col full-span">
                <label className="res-label">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows="3"
                  placeholder="Contoh: Meja dekat jendela, request baby chair, perayaan ulang tahun..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="res-input textarea"
                />
              </div>

              <div className="form-col full-span form-action-wrap">
                <button type="submit" className="btn btn-primary btn-block">
                  <span>✦ Konfirmasi Reservasi Meja Sekarang</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
