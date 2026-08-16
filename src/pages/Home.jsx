import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { COFFEE_MENU, COFFEE_QUIZ_QUESTIONS } from '../data/coffeeData';
import { useCart } from '../context/CartContext';

export default function Home() {
  const { addToCart, showToast } = useCart();
  const navigate = useNavigate();

  // Booking Bar State
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('2026-08-20');
  const [time, setTime] = useState('18:00');

  // Quiz State
  const [quizStep, setQuizStep] = useState(0);
  const [quizScores, setQuizScores] = useState([]);
  const [quizResult, setQuizResult] = useState(null);

  // FAQ State
  const [openFaq, setOpenFaq] = useState(null);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    showToast(`Reservasi ${guests} orang pada ${date} jam ${time} telah diajukan!`);
    navigate('/locations');
  };

  const handleQuizAnswer = (scoreType) => {
    const updated = [...quizScores, scoreType];
    setQuizScores(updated);

    if (quizStep + 1 < COFFEE_QUIZ_QUESTIONS.length) {
      setQuizStep(quizStep + 1);
    } else {
      const categoryCount = {};
      updated.forEach((cat) => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      const topCat = Object.keys(categoryCount).reduce((a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b
      );
      const recommended = COFFEE_MENU.find((item) => item.category === topCat) || COFFEE_MENU[0];
      setQuizResult(recommended);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizScores([]);
    setQuizResult(null);
  };

  const faqs = [
    {
      q: "Apakah Aroma & Co. menjual biji kopi sangrai (roasted beans) untuk diseduh di rumah?",
      a: "Ya! Kami menyediakan biji kopi freshly roasted kemasan 200g & 1kg lengkap dengan opsi tingkatan gilingan (whole bean, coarse, medium, fine) yang disangrai setiap minggunya."
    },
    {
      q: "Apakah tersedia pilihan susu non-dairy untuk minuman latte?",
      a: "Tentu. Kami menyediakan susu gandum Oat-Milk (Oatside) dan Susu Almond kualitas impor sebagai substitusi susu sapi tanpa tambahan biaya ekstra pada beberapa menu signature."
    },
    {
      q: "Bagaimana cara melakukan pemesanan tempat untuk rapat atau acara privat?",
      a: "Anda dapat menggunakan fitur Form Reservasi Meja pada halaman Outlet & Reservasi atau menghubungi Hotline WhatsApp kami secara langsung."
    },
    {
      q: "Apakah ada sesi workshop penyeduhan kopi (brewing class) untuk umum?",
      a: "Kami mengadakan Barista & Manual Brew Workshop setiap hari Sabtu sore di cabang Flagship Senopati. Pendaftaran terbuka melalui reservasi online."
    }
  ];

  return (
    <div className="home-page-root">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-container-grid">
          {/* LEFT: PHOTOGRAPHY FRAME WITH LUXURY GLOW */}
          <div className="hero-photo-frame">
            <div className="hero-img-container">
              <img
                src="/assets/images/hero-bg.jpg"
                alt="Aroma & Co Fine Specialty Coffee"
                className="hero-main-img"
              />
              <div className="hero-img-glow-overlay"></div>
            </div>

            {/* FLOATING LUXURY PILLS */}
            <div className="hero-photo-badge">
              <span>✦ 100% Arabica Specialty</span>
            </div>

            <div className="hero-floating-stat-card glass-panel">
              <div className="stat-icon">☕</div>
              <div>
                <strong className="stat-val">89+ SCA Score</strong>
                <span className="stat-lbl">Direct Trade Micro-lot</span>
              </div>
            </div>
          </div>

          {/* RIGHT: TYPOGRAPHY & CTA */}
          <div className="hero-content-col">
            <div className="hero-tag-badge">
              <span className="sub-tag">
                ✦ Specialty Coffee Roasters & Micro-Roastery
              </span>
            </div>

            <h1 className="hero-main-title">
              Aroma & Co. <br />
              <span className="stroke-text">Artisan Coffee</span>
            </h1>

            <p className="hero-main-desc">
              Disangrai secara presisi dari biji kopi single-origin terbaik nusantara. Nikmati kesempurnaan aroma, kompleksitas rasa, dan suasana fine-dining yang autentik di setiap tegukan.
            </p>

            <div className="hero-feature-highlights">
              <div className="feature-pill">
                <span className="pill-dot">●</span>
                <span>Fresh Weekly Roasting</span>
              </div>
              <div className="feature-pill">
                <span className="pill-dot">●</span>
                <span>Certified Q-Graders</span>
              </div>
              <div className="feature-pill">
                <span className="pill-dot">●</span>
                <span>Direct Trade Ethical</span>
              </div>
            </div>

            <div className="hero-cta-wrap">
              <Link to="/menu" className="circle-explore-btn">
                <span>EXPLORE</span>
                <strong>OUR MENUS</strong>
              </Link>
              <Link to="/locations" className="btn btn-outline hero-table-btn">
                <span>Reservasi Meja</span>
                <span className="btn-arrow">➔</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK BOOKING BAR */}
      <section className="booking-bar-section">
        <div className="container">
          <div className="booking-bar glass-panel">
            <div className="booking-bar-grid">
              <div className="booking-title-col">
                <span className="sub-tag">Meja Reservasi</span>
                <h3 className="booking-heading">
                  Book a Table / Reservasi
                </h3>
                <p className="booking-sub">
                  Nikmati racikan kopi specialty dan suasana ruang eksklusif.
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="booking-inputs-wrap">
                <div className="booking-input-group">
                  <label className="booking-input-label">Jumlah Tamu</label>
                  <select className="booking-select" value={guests} onChange={(e) => setGuests(e.target.value)}>
                    <option value="1">01 Tamu</option>
                    <option value="2">02 Tamu (Pasangan)</option>
                    <option value="4">04 Tamu (Keluarga)</option>
                    <option value="6">06+ Tamu VIP</option>
                  </select>
                </div>

                <div className="booking-input-group">
                  <label className="booking-input-label">Tanggal</label>
                  <input
                    type="date"
                    className="booking-select"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="booking-input-group">
                  <label className="booking-input-label">Waktu</label>
                  <input
                    type="time"
                    className="booking-select"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary booking-submit-btn">
                  <span>✦ Book A Seat</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY SECTION WITH ASYMMETRIC IMAGES */}
      <section className="section story-section">
        <div className="container">
          <div className="section-title-wrapper">
            <div className="gold-ornament">⚜️</div>
            <span className="sub-tag">Filosofi Citarasa</span>
            <h2 className="section-title">
              Around the world, <span>one cup at a time</span>
            </h2>
            <div className="story-keywords-row">
              <span>Roast</span> • <span>Brew</span> • <span>Enjoy</span>
            </div>
            <p className="section-description">
              Selamat datang di <strong>Aroma & Co.</strong>, tempat di mana dedikasi sangrai mikro dan keahlian barista dunia berpadu menciptakan setiap rasa kopi luar biasa. Kami mendedikasikan setiap cangkir untuk kehangatan cerita Anda.
            </p>

            <div className="story-action-wrap">
              <Link to="/about" className="btn btn-outline">
                ✦ Pelajari Kisah Roastery Kami
              </Link>
            </div>
          </div>

          {/* ASYMMETRIC IMAGES WITH BALANCED FRAMING */}
          <div className="story-images-grid">
            <div className="story-img-card card-1 glass-panel">
              <div className="story-img-inner">
                <img src="/assets/images/roastery.jpg" alt="Aroma & Co Atmosphere & Roasting Lab" />
                <div className="story-badge-sticker">
                  <span>🔥 Micro Roasting Lab</span>
                </div>
              </div>
              <div className="story-caption-box">
                <h4>Kurva Suhu Presisi</h4>
                <p>Mengatur transfer panas konveksi mikro untuk karamelisasi rasa maksimal.</p>
              </div>
            </div>

            <div className="story-img-card card-2 glass-panel">
              <div className="story-img-inner">
                <img src="/assets/images/prod-2.jpg" alt="Specialty Coffee Serving & Barista Craft" />
                <div className="story-badge-sticker">
                  <span>☕ Cupping Score 90+</span>
                </div>
              </div>
              <div className="story-caption-box">
                <h4>Standar Ekstraksi Emas</h4>
                <p>Penyeduhan berstandar Specialty Coffee Association (SCA) dunia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED MENU CATALOG */}
      <section className="section featured-menu-section">
        <div className="container">
          <div className="section-title-wrapper">
            <div className="gold-ornament">⚜️</div>
            <span className="sub-tag">Katalog Pilihan</span>
            <h2 className="section-title">
              We serve <span>elegant service</span> for people
            </h2>
            <p className="section-description">
              Pilihan menu kopi artisan terbaik disajikan dengan estetika fine-dining dan kualitas rasa specialty 100% Arabica.
            </p>
          </div>

          {/* MENU PRODUCTS GRID */}
          <div className="product-grid">
            {COFFEE_MENU.slice(0, 6).map((item) => (
              <div key={item.id} className="product-card glass-panel">
                <div className="product-card-top">
                  <div className="product-card-thumb-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="card-img-zoom"
                    />
                    <div className="product-card-badge-pos">
                      <span className={`badge ${item.badgeClass}`}>{item.badge}</span>
                    </div>
                    {item.altitude && (
                      <span className="product-altitude-badge">
                        🏔️ {item.altitude}
                      </span>
                    )}
                  </div>

                  <div className="product-card-body">
                    <div className="product-card-meta-row">
                      <div className="product-rating-text">
                        ★ {item.rating} / 5.0
                      </div>
                      <span className="product-roast-text">
                        {item.roastLevel || 'Medium Roast'}
                      </span>
                    </div>

                    <h3 className="product-card-title">
                      {item.name}
                    </h3>
                    
                    <p className="product-card-desc">
                      {item.description}
                    </p>

                    {/* TASTING NOTES MINI TAGS */}
                    {item.tastingNotes && (
                      <div className="product-notes-chips">
                        {item.tastingNotes.slice(0, 3).map((n, i) => (
                          <span key={i} className="mini-note-tag">{n}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="product-card-footer">
                  <div className="price-tag-wrap">
                    <span className="price-tag-caption">Harga</span>
                    <span className="product-price-tag">
                      Rp {item.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="product-card-btns">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate('/menu', { state: { selectedItemId: item.id } })}
                    >
                      + Pesan di Menu ➔
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="view-more-menu-wrap">
            <Link to="/menu" className="btn btn-outline btn-view-all-menu">
              <span>✦ Lihat Seluruh Katalog Menu Kopi</span>
              <span className="btn-arrow">➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* QUIZ INTERACTIVE WIDGET */}
      <section className="section quiz-section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="sub-tag">Rekomendasi Cerdas</span>
            <h2 className="section-title">
              Cari Kopi yang <span>Cocok</span> Untuk Anda
            </h2>
            <p className="section-description">
              Jawab 3 pertanyaan singkat ini untuk menemukan varian kopi yang paling pas dengan selera rasa Anda.
            </p>
          </div>

          <div className="glass-panel quiz-panel">
            {!quizResult ? (
              <div className="quiz-active-view">
                <div className="quiz-progress-line">
                  {COFFEE_QUIZ_QUESTIONS.map((_, idx) => (
                    <div
                      key={idx}
                      className={`quiz-progress-dot ${idx <= quizStep ? 'active' : ''}`}
                    >
                      <span>{idx + 1}</span>
                    </div>
                  ))}
                </div>

                <span className="quiz-step-count">Langkah {quizStep + 1} dari {COFFEE_QUIZ_QUESTIONS.length}</span>
                <h3 className="quiz-question-title">
                  {COFFEE_QUIZ_QUESTIONS[quizStep].question}
                </h3>

                <div className="quiz-options-list">
                  {COFFEE_QUIZ_QUESTIONS[quizStep].options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      className="quiz-opt-btn"
                      onClick={() => handleQuizAnswer(opt.score)}
                    >
                      <div className="quiz-opt-text-wrap">
                        {opt.tag && <span className="quiz-opt-tag-chip">{opt.tag}</span>}
                        <span className="quiz-opt-text-content">{opt.text}</span>
                      </div>
                      <span className="opt-arrow">➔</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="quiz-result-view animate-fade-in">
                <span className="badge badge-gold quiz-res-badge">
                  🎉 Rekomendasi Terpilih Untuk Selera Anda
                </span>
                
                <div className="quiz-result-card glass-panel">
                  <div className="quiz-res-thumb">
                    <img src={quizResult.image} alt={quizResult.name} />
                  </div>
                  <div className="quiz-res-info">
                    <h3 className="quiz-result-title">
                      {quizResult.name}
                    </h3>
                    <p className="quiz-result-desc">
                      {quizResult.description}
                    </p>
                    <div className="quiz-res-tags">
                      <span className="spec-pill">Origin: {quizResult.origin || 'Specialty Blend'}</span>
                      <span className="spec-pill">Roast: {quizResult.roastLevel || 'Medium'}</span>
                    </div>
                  </div>
                </div>

                <div className="quiz-result-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      addToCart(quizResult.id);
                      showToast(`"${quizResult.name}" ditambahkan ke pesanan!`);
                    }}
                  >
                    + Tambah Ke Pesanan (Rp {quizResult.price.toLocaleString('id-ID')})
                  </button>
                  <button className="btn btn-outline" onClick={resetQuiz}>
                    Ulangi Kuis 🔄
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="section faq-section">
        <div className="container faq-container">
          <div className="section-title-wrapper">
            <span className="sub-tag">Informasi Penting</span>
            <h2 className="section-title">
              Pertanyaan Sering <span>Diajukan (FAQ)</span>
            </h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className={`glass-panel faq-item-card ${openFaq === idx ? 'active' : ''}`}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="faq-question-row">
                  <h4 className="faq-question-text">
                    {faq.q}
                  </h4>
                  <span className="faq-toggle-icon">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </div>
                {openFaq === idx && (
                  <p className="faq-answer-text animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
