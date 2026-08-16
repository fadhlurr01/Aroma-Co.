import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ARTICLES_DATA } from '../data/articlesData';

export default function Guide() {
  const { showToast, articlesList } = useCart();
  const [activeChapter, setActiveChapter] = useState('chapter-origin');
  const [activeRoastLevel, setActiveRoastLevel] = useState('medium');
  const [activeFlavorCat, setActiveFlavorCat] = useState('citrus');
  const [rsvpModal, setRsvpModal] = useState(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpPhone, setRsvpPhone] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Smooth scroll to target chapter section
  const scrollToChapter = (id) => {
    setActiveChapter(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Listen to scroll position to update active chapter indicator
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['chapter-origin', 'chapter-roast', 'chapter-sensory', 'chapter-workshop', 'chapter-articles'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveChapter(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpPhone.trim()) {
      showToast('Mohon lengkapi nama dan WhatsApp untuk reservasi workshop.');
      return;
    }
    setRsvpSuccess(true);
    showToast(`Registrasi "${rsvpModal.title}" berhasil dicatat!`);
  };

  const closeRsvpModal = () => {
    setRsvpModal(null);
    setRsvpSuccess(false);
    setRsvpName('');
    setRsvpPhone('');
  };

  // Roast spectrum data
  const ROAST_SPECTRUMS = {
    light: {
      name: 'Light Roast (Cinnamon / Nordic)',
      temp: '196°C - 204°C',
      time: '9 Menit 15 Detik',
      color: '#D4A373',
      badge: 'Fruity & Floral High-Acidity',
      desc: 'Biji kopi dikeluarkan tepat setelah bunyi retakan pertama (First Crack). Menjaga senyawa organik asli buah ceri kopi, menghasilkan body yang jernih seperti teh dengan keasaman cerah dan aroma bunga melati serta buah peach yang memikat.',
      notes: ['Tangerine Citrus', 'White Peach', 'Jasmine Blossom', 'Earl Grey Tea'],
      bestOrigin: 'Gayo Pantan Musara & Bali Kintamani Natural'
    },
    medium: {
      name: 'Medium Roast (City / Full City)',
      temp: '210°C - 218°C',
      time: '11 Menit 40 Detik',
      color: '#C5A880',
      badge: 'Peak Balance & Caramel Sweetness',
      desc: 'Titik emas karamelisasi gula alami kopi (Maillard Reaction). Menghadirkan keseimbangan sempurna antara keasaman lembut, ketebalan bodi yang creamy, dan semerbak manis karamel toffee serta kacang almond panggang.',
      notes: ['Salted Caramel', 'Toffee Nut', 'Dark Cocoa Nib', 'Sweet Plum'],
      bestOrigin: 'Toraja Sapan Single Estate & Flores Bajawa'
    },
    dark: {
      name: 'Dark Roast (Vienna / French Roast)',
      temp: '225°C - 232°C',
      time: '13 Menit 50 Detik',
      color: '#8A5A44',
      badge: 'Intense Bold & Rich Dark Crema',
      desc: 'Biji kopi mencapai retakan kedua (Second Crack) hingga minyak esensial alami keluar ke permukaan. Keasaman hampir hilang sepenuhnya, digantikan oleh profil citarasa yang sangat pekat, smokey, cokelat hitam 85%, dan bodi yang sangat tebal.',
      notes: ['85% Dark Chocolate', 'Roasted Hazelnut', 'Cedarwood Spice', 'Smoky Molasses'],
      bestOrigin: 'Sumatra Mandheling Vintage & Italian Espresso Blend'
    }
  };

  // Flavor wheel categories
  const FLAVOR_CATEGORIES = {
    citrus: {
      title: 'Cerah & Buah-Buahan (Fruity & Citrus)',
      color: '#E2A85C',
      desc: 'Citarasa segar alami yang menyerupai keasaman manis buah-buahan tropis segar.',
      elements: [
        { name: 'Tangerine Citrus', origin: 'Bali Kintamani', intensity: '92%' },
        { name: 'Wild Raspberry', origin: 'Gayo Anaerobic', intensity: '88%' },
        { name: 'Yellow Peach', origin: 'Ethiopia Yirgacheffe', intensity: '85%' },
        { name: 'Green Apple Crisp', origin: 'Kenya Nyeri AA', intensity: '80%' }
      ]
    },
    chocolate: {
      title: 'Cokelat & Karamel (Cocoa & Confectionery)',
      color: '#C5A880',
      desc: 'Karakter rasa manis legit, kacang panggang, dan cokelat murni yang menenangkan.',
      elements: [
        { name: 'Dark Chocolate Fudge', origin: 'Toraja Sapan', intensity: '95%' },
        { name: 'Salted Butter Caramel', origin: 'Java Preanger', intensity: '90%' },
        { name: 'Toasted Macadamia', origin: 'Flores Bajawa', intensity: '86%' },
        { name: 'Wild Honeycomb', origin: 'Mandheling Honey', intensity: '82%' }
      ]
    },
    floral: {
      title: 'Bunga & Teh Herbal (Floral & Botanical)',
      color: '#A7F3D0',
      desc: 'Aroma harum semerbak bunga putih dan herba aromatik pegunungan tinggi.',
      elements: [
        { name: 'White Jasmine Blossom', origin: 'Geisha Hacienda', intensity: '96%' },
        { name: 'Bergamot Orange Oil', origin: 'Gayo Washed', intensity: '89%' },
        { name: 'Chamomile Tea Notes', origin: 'Kintamani Honey', intensity: '84%' },
        { name: 'Lemongrass Zest', origin: 'Sidama Micro-lot', intensity: '79%' }
      ]
    },
    spices: {
      title: 'Rempah & Kayu Hangat (Spices & Earthy)',
      color: '#D4A373',
      desc: 'Karakteristik tanah vulkanis yang kaya akan aroma kayu manis, cengkeh, dan rempah nusantara.',
      elements: [
        { name: 'Cinnamon Bark', origin: 'Sumatra Lintong', intensity: '90%' },
        { name: 'Warm Clove & Nutmeg', origin: 'Papua Wamena', intensity: '87%' },
        { name: 'Cedarwood Pine', origin: 'Mandheling Dark', intensity: '92%' },
        { name: 'Fresh Cardamom', origin: 'Aceh Gayo Natural', intensity: '81%' }
      ]
    }
  };

  const WORKSHOPS_DATA = [
    {
      id: 'ws-1',
      title: 'Sensory Cupping & Aroma Calibration',
      level: 'Semua Level (Pemula - Penggemar)',
      date: 'Sabtu, 22 Agustus 2026',
      time: '14:00 - 17:00 WIB',
      location: 'Roastery Lab • Senopati HQ',
      seats: 'Sisa 4 Kursi',
      instructor: 'Pratama Wicaksana (Licensed Q-Grader)',
      price: 'Rp 450.000 / Peserta',
      perks: ['Sertifikat Artisan Cupping', 'Biji Kopi Single Estate 250g', 'Cupping Spoon Eksklusif']
    },
    {
      id: 'ws-2',
      title: 'The Art of Micro-Roasting & Profile Curves',
      level: 'Tingkat Menengah / Home Roaster',
      date: 'Minggu, 30 Agustus 2026',
      time: '10:00 - 15:00 WIB',
      location: 'Aroma Co. Roasting Chamber',
      seats: 'Sisa 2 Kursi',
      instructor: 'Hendrik Hartanto (Head Roaster)',
      price: 'Rp 850.000 / Peserta',
      perks: ['Praktek Mesin Giesen W6A', 'Roast Profile Workbook', 'Bawa Pulang 1kg Hasil Sangrai']
    },
    {
      id: 'ws-3',
      title: 'Espresso Dial-In & Microfoam Latte Art',
      level: 'Barista & Home Enthusiast',
      date: 'Sabtu, 5 September 2026',
      time: '13:00 - 16:30 WIB',
      location: 'Slow Bar Counter • Senopati',
      seats: 'Sisa 5 Kursi',
      instructor: 'Clarissa Natalia (Champion Barista)',
      price: 'Rp 550.000 / Peserta',
      perks: ['Hands-on La Marzocco KB90', 'Buku Panduan Milk Texturing', 'Merchandise Barista Apron']
    }
  ];

  return (
    <div className="guide-page-wrapper animate-page-enter">
      {/* ================= HERO STORY HEADER ================= */}
      <section className="section guide-hero-section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="sub-tag">Eksplorasi & Jurnal Kopi</span>
            <h1 className="section-title">
              Sains, Seni & <span>Cerita Kopi</span> Nusantara
            </h1>
            <p className="section-description">
              Menyusuri perjalanan setiap tetes kopi dari kebun vulkanik ketinggian 1.800 mdpl, keajaiban termal sangrai mikro, hingga panduan kalibrasi sensorik para artisan.
            </p>
            <div className="guide-hero-badge-row">
              <span className="badge badge-gold">Vol. IV • Edisi Roastery Artisan</span>
              <span className="badge badge-amber">Q-Grader Certified Curation</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STICKY CHAPTER NAVIGATOR ================= */}
      <div className="sticky-chapter-nav-wrap">
        <div className="container">
          <nav className="chapter-nav-pills glass-panel" aria-label="Bab Eksplorasi">
            {[
              { id: 'chapter-origin', label: '01. Terroir Kebun' },
              { id: 'chapter-roast', label: '02. Sains Roasting' },
              { id: 'chapter-sensory', label: '03. Roda Rasa' },
              { id: 'chapter-workshop', label: '04. Masterclass Barista' },
              { id: 'chapter-articles', label: '05. Jurnal & Esai' },
            ].map((ch) => (
              <button
                key={ch.id}
                type="button"
                className={`chapter-pill-btn ${activeChapter === ch.id ? 'active' : ''}`}
                onClick={() => scrollToChapter(ch.id)}
              >
                <span>{ch.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ================= CHAPTER 1: ORIGIN & TERROIR ================= */}
      <section id="chapter-origin" className="section chapter-section">
        <div className="container">
          <div className="chapter-header-box">
            <span className="chapter-number-tag">Bab 01 • Perjalanan Hulu</span>
            <h2 className="chapter-heading">Terroir & Ekosistem Tanah Vulkanik</h2>
            <p className="chapter-lead-text">
              Ketinggian di atas 1.400 mdpl memperlambat pematangan buah ceri kopi, menciptakan konsentrasi gula alami dan kerapatan biji yang padat dan kaya nutrisi.
            </p>
          </div>

          <div className="story-origin-cards-grid">
            {/* GAYO */}
            <div className="origin-story-card glass-panel">
              <div className="origin-story-img-wrap">
                <img src="./assets/images/prod-1.jpg" alt="Kebun Kopi Gayo" className="story-card-img" />
                <span className="origin-elev-badge">1.600 mdpl • Pantan Musara</span>
              </div>
              <div className="origin-story-body">
                <span className="origin-microclimate">Tanah Vulkanik • Iklim Tropis Pegunungan</span>
                <h3 className="origin-story-title">Dataran Tinggi Gayo, Aceh</h3>
                <p className="origin-story-desc">
                  Ditanam di bawah naungan pohon pinus dan lamtoro. Proses pasca panen *Natural Anaerobic Fermentation* selama 72 jam menghasilkan kejernihan rasa manis buah delima dan bunga melati.
                </p>
                <div className="origin-story-specs">
                  <div className="spec-item">
                    <span>Suhu Rata-rata:</span>
                    <strong>16°C - 22°C</strong>
                  </div>
                  <div className="spec-item">
                    <span>Varietas Unggulan:</span>
                    <strong>Ateng Super & Tim-Tim</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* KINTAMANI */}
            <div className="origin-story-card glass-panel">
              <div className="origin-story-img-wrap">
                <img src="./assets/images/prod-5.jpg" alt="Kebun Kopi Bali Kintamani" className="story-card-img" />
                <span className="origin-elev-badge">1.450 mdpl • Gunung Batur</span>
              </div>
              <div className="origin-story-body">
                <span className="origin-microclimate">Sistem Tumpangsari Jeruk • Subak Abian</span>
                <h3 className="origin-story-title">Lereng Vulkanik Kintamani, Bali</h3>
                <p className="origin-story-desc">
                  Pohon kopi ditanam berdampingan dengan kebun jeruk manis Kintamani. Menghasilkan karakter keasaman sitrus (*citric acidity*) yang cerah, menyegarkan, dan beraroma bunga pohon jeruk.
                </p>
                <div className="origin-story-specs">
                  <div className="spec-item">
                    <span>Suhu Rata-rata:</span>
                    <strong>15°C - 20°C</strong>
                  </div>
                  <div className="spec-item">
                    <span>Varietas Unggulan:</span>
                    <strong>Kopyol Arabica Bali</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* TORAJA */}
            <div className="origin-story-card glass-panel">
              <div className="origin-story-img-wrap">
                <img src="./assets/images/prod-2.jpg" alt="Kebun Kopi Toraja" className="story-card-img" />
                <span className="origin-elev-badge">1.800 mdpl • Sapan Minanga</span>
              </div>
              <div className="origin-story-body">
                <span className="origin-microclimate">Hutan Hujan Pegunungan Berkabut</span>
                <h3 className="origin-story-title">Toraja Sapan, Sulawesi Selatan</h3>
                <p className="origin-story-desc">
                  Salah satu perkebunan tertinggi di Indonesia. Biji kopi bertekstur sangat padat dengan aroma rempah kayu manis, cokelat hitam pekat, serta kemanisan toffee madu yang sangat bertahan lama.
                </p>
                <div className="origin-story-specs">
                  <div className="spec-item">
                    <span>Suhu Rata-rata:</span>
                    <strong>14°C - 19°C</strong>
                  </div>
                  <div className="spec-item">
                    <span>Varietas Unggulan:</span>
                    <strong>Typica & S-Line 795</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CHAPTER 2: ROASTING LAB METAMORPHOSIS ================= */}
      <section id="chapter-roast" className="section chapter-section bg-deep-accent">
        <div className="container">
          <div className="chapter-header-box text-center">
            <span className="chapter-number-tag">Bab 02 • Sains Pengolahan</span>
            <h2 className="chapter-heading">Alkimia & Spektrum Sangrai Mikro</h2>
            <p className="chapter-lead-text center-max">
              Suhu, aliran udara termal, dan waktu pemanggangan mengendalikan transformasi kimia biji kopi hijau (*green beans*) menjadi simfoni aroma kompleks.
            </p>
          </div>

          {/* ROAST LEVEL INTERACTIVE SELECTOR */}
          <div className="roast-interactive-box glass-panel">
            <div className="roast-nav-tabs">
              <button
                type="button"
                className={`roast-tab-btn ${activeRoastLevel === 'light' ? 'active' : ''}`}
                onClick={() => setActiveRoastLevel('light')}
              >
                <span className="tab-dot dot-light"></span>
                <span>Light Roast</span>
              </button>

              <button
                type="button"
                className={`roast-tab-btn ${activeRoastLevel === 'medium' ? 'active' : ''}`}
                onClick={() => setActiveRoastLevel('medium')}
              >
                <span className="tab-dot dot-medium"></span>
                <span>Medium Roast</span>
              </button>

              <button
                type="button"
                className={`roast-tab-btn ${activeRoastLevel === 'dark' ? 'active' : ''}`}
                onClick={() => setActiveRoastLevel('dark')}
              >
                <span className="tab-dot dot-dark"></span>
                <span>Dark Roast</span>
              </button>
            </div>

            {/* ACTIVE SPECTRUM DISPLAY */}
            <div className="roast-profile-display animate-fade-in" key={activeRoastLevel}>
              <div className="roast-display-left">
                <div className="roast-bean-visual" style={{ borderColor: ROAST_SPECTRUMS[activeRoastLevel].color }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={ROAST_SPECTRUMS[activeRoastLevel].color} strokeWidth="1.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.41 0 8 3.59 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                  </svg>
                  <span className="roast-temp-badge">{ROAST_SPECTRUMS[activeRoastLevel].temp}</span>
                </div>
                <div className="roast-time-info">
                  <span>Waktu Drum Roasting:</span>
                  <strong>{ROAST_SPECTRUMS[activeRoastLevel].time}</strong>
                </div>
              </div>

              <div className="roast-display-right">
                <div className="roast-title-row">
                  <h3 className="roast-name">{ROAST_SPECTRUMS[activeRoastLevel].name}</h3>
                  <span className="badge badge-gold">{ROAST_SPECTRUMS[activeRoastLevel].badge}</span>
                </div>

                <p className="roast-desc-paragraph">{ROAST_SPECTRUMS[activeRoastLevel].desc}</p>

                <div className="roast-details-grid">
                  <div className="roast-detail-col">
                    <span className="detail-col-title">Tasting Notes Karakteristik:</span>
                    <div className="roast-notes-chips">
                      {ROAST_SPECTRUMS[activeRoastLevel].notes.map((n, i) => (
                        <span key={i} className="tasting-chip">✦ {n}</span>
                      ))}
                    </div>
                  </div>

                  <div className="roast-detail-col">
                    <span className="detail-col-title">Rekomendasi Asal Biji:</span>
                    <p className="best-origin-text">{ROAST_SPECTRUMS[activeRoastLevel].bestOrigin}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CHAPTER 3: SENSORY WHEEL & FLAVOR MATRIX ================= */}
      <section id="chapter-sensory" className="section chapter-section">
        <div className="container">
          <div className="chapter-header-box">
            <span className="chapter-number-tag">Bab 03 • Panduan Q-Grader</span>
            <h2 className="chapter-heading">Roda Sensorik & Palet Citarasa Kopi</h2>
            <p className="chapter-lead-text">
              Setiap cangkir kopi menyimpan ratusan senyawa aromatik. Gunakan panduan klasifikasi sensorik ini untuk mengidentifikasi lapis demi lapis citarasa dalam seduhan Anda.
            </p>
          </div>

          <div className="flavor-matrix-container glass-panel">
            {/* CATEGORY SWITCHER */}
            <div className="flavor-category-nav">
              {Object.keys(FLAVOR_CATEGORIES).map((catKey) => (
                <button
                  key={catKey}
                  type="button"
                  className={`flavor-cat-btn ${activeFlavorCat === catKey ? 'active' : ''}`}
                  onClick={() => setActiveFlavorCat(catKey)}
                >
                  {FLAVOR_CATEGORIES[catKey].title}
                </button>
              ))}
            </div>

            {/* ACTIVE FLAVOR ITEMS */}
            <div className="flavor-category-content animate-fade-in" key={activeFlavorCat}>
              <p className="flavor-cat-desc">{FLAVOR_CATEGORIES[activeFlavorCat].desc}</p>

              <div className="flavor-elements-grid">
                {FLAVOR_CATEGORIES[activeFlavorCat].elements.map((el, i) => (
                  <div key={i} className="flavor-element-card">
                    <div className="element-top-row">
                      <h4 className="element-name">{el.name}</h4>
                      <span className="element-intensity-badge">Intensitas {el.intensity}</span>
                    </div>
                    <span className="element-origin">Origin Utama: {el.origin}</span>
                    <div className="element-meter-track">
                      <div className="element-meter-fill" style={{ width: el.intensity }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CHAPTER 4: WORKSHOPS & MASTERCLASSES ================= */}
      <section id="chapter-workshop" className="section chapter-section bg-deep-accent">
        <div className="container">
          <div className="chapter-header-box text-center">
            <span className="chapter-number-tag">Bab 04 • Akademi Kopi</span>
            <h2 className="chapter-heading">Workshop & Masterclass Barista</h2>
            <p className="chapter-lead-text center-max">
              Tingkatkan wawasan dan keterampilan teknik ekstraksi kopi Anda bersama Q-Grader dan Head Roaster profesional kami dalam sesi kelas tatap muka terbatas.
            </p>
          </div>

          <div className="workshops-list-grid">
            {WORKSHOPS_DATA.map((ws) => (
              <div key={ws.id} className="workshop-card glass-panel">
                <div className="workshop-card-header">
                  <div className="ws-level-badge">{ws.level}</div>
                  <span className="ws-seat-tag">{ws.seats}</span>
                </div>

                <h3 className="ws-title">{ws.title}</h3>
                
                <div className="ws-meta-list">
                  <div className="ws-meta-row">
                    <span className="ws-lbl">Jadwal:</span>
                    <strong>{ws.date} • {ws.time}</strong>
                  </div>
                  <div className="ws-meta-row">
                    <span className="ws-lbl">Lokasi:</span>
                    <strong>{ws.location}</strong>
                  </div>
                  <div className="ws-meta-row">
                    <span className="ws-lbl">Instruktur:</span>
                    <strong>{ws.instructor}</strong>
                  </div>
                </div>

                <div className="ws-perks-box">
                  <span className="perks-title">Fasilitas Termasuk:</span>
                  <ul>
                    {ws.perks.map((p, idx) => (
                      <li key={idx}>✓ {p}</li>
                    ))}
                  </ul>
                </div>

                <div className="ws-card-footer">
                  <div className="ws-price-wrap">
                    <span className="ws-price-lbl">Investasi Kelas</span>
                    <strong className="ws-price-val">{ws.price}</strong>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setRsvpModal(ws)}
                  >
                    Daftar Kursi ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CHAPTER 5: ARTICLES & ESSAYS ================= */}
      <section id="chapter-articles" className="section chapter-section">
        <div className="container">
          <div className="chapter-header-box">
            <span className="chapter-number-tag">Bab 05 • Esai & Jurnal</span>
            <h2 className="chapter-heading">Esai Kopi & Wawasan Barista Terkini</h2>
            <p className="chapter-lead-text">
              Artikel pilihan dari tim riset Aroma & Co. mengenai perkembangan tren kopi spesialti dunia, sains fermentasi, dan etika *direct trade*.
            </p>
          </div>

          <div className="articles-editorial-grid">
            {articlesList.map((article) => (
              <article key={article.id} className="article-story-card glass-panel">
                <span className="article-meta-tag">{article.category?.toUpperCase()} • {article.readTime}</span>
                <h3 className="article-card-title">
                  {article.title}
                </h3>
                <p className="article-card-snippet">
                  {article.excerpt}
                </p>
                <div className="article-card-footer">
                  <span>{article.author.split('(')[0]}</span>
                  <Link to={`/article/${article.id}`} className="read-more-link">
                    Baca Selengkapnya ➔
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="guide-bottom-cta-wrap">
            <div className="guide-cta-card glass-panel text-center">
              <h3 className="cta-heading">Ingin Mencicipi Hasil Sangrai Terbaru Kami?</h3>
              <p className="cta-desc">Kunjungi katalog menu kopi kami untuk memesan varian single origin terkurasi hari ini.</p>
              <Link to="/menu" className="btn btn-primary">
                ✦ Jelajahi Katalog Menu Kopi ➔
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= RSVP WORKSHOP MODAL ================= */}
      {rsvpModal && (
        <div className="modal-overlay open" onClick={closeRsvpModal}>
          <div className="modal-content glass-panel rsvp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="luxury-modal-close" onClick={closeRsvpModal}>✕</button>

            {!rsvpSuccess ? (
              <form onSubmit={handleRsvpSubmit} className="rsvp-form">
                <div className="rsvp-header">
                  <span className="badge badge-gold">Pendaftaran Kursi Kelas</span>
                  <h3>{rsvpModal.title}</h3>
                  <p className="rsvp-meta-info">📍 {rsvpModal.location} • 📅 {rsvpModal.date}</p>
                </div>

                <div className="rsvp-inputs-group">
                  <div className="form-group-item">
                    <label className="form-label">Nama Lengkap Peserta <span className="req">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Masukkan nama Anda"
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group-item">
                    <label className="form-label">Nomor WhatsApp Aktif <span className="req">*</span></label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="0812-xxxx-xxxx"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="rsvp-price-box">
                  <span>Biaya Workshop:</span>
                  <strong>{rsvpModal.price}</strong>
                </div>

                <div className="rsvp-actions">
                  <button type="button" className="btn btn-outline" onClick={closeRsvpModal}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Konfirmasi Reservasi Kursi ➔
                  </button>
                </div>
              </form>
            ) : (
              <div className="rsvp-success-view text-center">
                <div className="success-check-circle">✓</div>
                <h3>Pendaftaran Berhasil Diterima!</h3>
                <p>
                  Terima kasih, <strong>{rsvpName}</strong>. Barista Koordinator kami akan segera menghubungi nomor WhatsApp <strong>{rsvpPhone}</strong> untuk konfirmasi instruksi kedatangan dan e-ticket kelas.
                </p>
                <button type="button" className="btn btn-primary mt-3" onClick={closeRsvpModal}>
                  Selesai & Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
