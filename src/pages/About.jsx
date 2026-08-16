import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-page-root">
      {/* HERO ABOUT */}
      <section className="section about-hero">
        <div className="container about-hero-container">
          <span className="sub-tag">✦ Perjalanan & Filosofi ✦</span>
          <h1 className="section-title">
            Dedikasi Sangrai Kopi <span>Berstandar Dunia</span>
          </h1>
          <p className="section-description">
            Berdiri sejak 2018, Aroma & Co. hadir dengan satu misi utama: memperkenalkan keanekaragaman karakter kopi terbaik Indonesia melalui teknik mikro-roasting modern dan penyeduhan berpresisi tinggi.
          </p>
        </div>
      </section>

      {/* ROASTING PROCESS */}
      <section className="section about-roasting-section">
        <div className="container about-grid-2col">
          <div className="about-img-wrap">
            <div className="glass-panel about-img-card">
              <div className="about-img-container">
                <img
                  src="/assets/images/roastery.jpg"
                  alt="Proses Sangrai Kopi Roastery Lab"
                  className="about-roastery-img"
                />
                <div className="about-img-badge">
                  <span>✦ Micro Roasting Chamber</span>
                </div>
              </div>
              <div className="about-img-caption">
                <h4>Suhu Presisi 0.1°C</h4>
                <p>Memastikan perkembangan aroma bunga dan gula karamel yang maksimal pada setiap batch.</p>
              </div>
            </div>
          </div>

          <div className="about-content-wrap">
            <span className="sub-tag">Proses Roasting Artisan</span>
            <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.3rem)', marginBottom: '1rem' }}>
              Presisi Suhu & <span>Waktu Sangrai</span>
            </h2>
            <p className="about-text-lead">
              Kami tidak hanya memasak biji kopi; kami membuka potensi tersembunyi di setiap varietal. Menggunakan mesin roaster khusus, Head Roaster kami memantau kurva sangrai (*roast profile*) detik demi detik.
            </p>

            <div className="timeline-wrap">
              <div className="timeline-step">
                <div className="timeline-num">1</div>
                <div className="timeline-info">
                  <h4>Seleksi Green Bean Specialty</h4>
                  <p>Hanya biji kopi dengan *cupping score* di atas 85 yang lulus tahap sortir manual kami.</p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="timeline-num">2</div>
                <div className="timeline-info">
                  <h4>Profil Sangrai Presisi</h4>
                  <p>Pengaturan aliran udara & suhu konveksi mikro untuk karamelisasi gula sempurna tanpa rasa gosong.</p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="timeline-num">3</div>
                <div className="timeline-info">
                  <h4>Cupping & Quality Check</h4>
                  <p>Setiap batch diseduh dan diuji oleh Q-Grader bersertifikat sebelum dikemas rapat dengan katup satu arah.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORIGINS */}
      <section className="section about-origins-section">
        <div className="container">
          <div className="section-title-wrapper">
            <span className="sub-tag">✦ Asal Biji Kopi Nusantara ✦</span>
            <h2 className="section-title">
              Sumber Mitra <span>Petani Lokal</span>
            </h2>
            <p className="section-description">
              Bekerja sama secara langsung (*Direct Trade*) dengan petani kopi di berbagai dataran tinggi nusantara untuk kesejahteraan bersama dan mutu biji terbaik.
            </p>
          </div>

          <div className="origins-grid">
            <div className="glass-panel origin-card">
              <span className="badge badge-gold origin-badge">Sumatra</span>
              <h3 className="origin-title">Aceh Gayo Highland</h3>
              <p className="origin-altitude">Elevasi: 1.400 - 1.600 mdpl</p>
              <p className="origin-desc">Profil rasa: Dark Chocolate, Cedar Wood, & Rempah Manis Berkarakter Tebal.</p>
            </div>

            <div className="glass-panel origin-card">
              <span className="badge badge-amber origin-badge">Bali</span>
              <h3 className="origin-title">Bali Kintamani Organic</h3>
              <p className="origin-altitude">Elevasi: 1.300 - 1.500 mdpl</p>
              <p className="origin-desc">Profil rasa: Jeruk Tangerine, Citrus Blossom, & Clean Crisp Finish yang menyegarkan.</p>
            </div>

            <div className="glass-panel origin-card">
              <span className="badge badge-gold origin-badge">Sulawesi</span>
              <h3 className="origin-title">Toraja Sapan Kalosi</h3>
              <p className="origin-altitude">Elevasi: 1.600 - 1.900 mdpl</p>
              <p className="origin-desc">Profil rasa: Ripe Plum, Toasted Almond, Honey, & Silky Smooth Texture.</p>
            </div>
          </div>

          <div className="about-cta-center">
            <Link to="/menu" className="btn btn-primary">
              ✦ Coba Seluruh Varian Kopi Nusantara
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
