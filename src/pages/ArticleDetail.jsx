import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ARTICLES_DATA } from '../data/articlesData';
import { useCart } from '../context/CartContext';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, articlesList } = useCart();

  const article = articlesList.find((a) => a.id === id) || articlesList[0];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Tautan artikel berhasil disalin ke clipboard!');
  };

  const handleShareWA = () => {
    const text = `*${article.title}*\n\nBaca artikel riset kopi spesialti dari Aroma & Co. Roasters:\n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const otherArticles = articlesList.filter((a) => a.id !== article.id);

  return (
    <div className="article-detail-page section">
      <div className="container article-container">
        {/* TOP BACK BUTTON */}
        <div className="article-top-nav">
          <Link to="/guide" className="btn btn-outline btn-sm">
            ← Kembali ke Jurnal & Panduan
          </Link>
          <div className="article-share-quick">
            <button type="button" className="btn-share-icon" onClick={handleShareWA} title="Bagikan ke WhatsApp">
              📱 WhatsApp
            </button>
            <button type="button" className="btn-share-icon" onClick={handleCopyLink} title="Salin Tautan">
              📋 Salin Tautan
            </button>
          </div>
        </div>

        {/* HEADER HERO */}
        <header className="article-header-block">
          <div className="article-category-badge-row">
            <span className="badge badge-gold">{article.category}</span>
            <span className="article-read-time">⏱️ {article.readTime}</span>
            <span className="article-date-tag">📅 {article.date}</span>
          </div>

          <h1 className="article-hero-title">
            {article.title}
          </h1>

          <p className="article-lead-excerpt">
            {article.excerpt}
          </p>

          <div className="article-author-card">
            <div className="author-avatar-circle">
              <span>☕</span>
            </div>
            <div>
              <span className="author-by">Ditulis & Divalidasi Oleh:</span>
              <strong className="author-name">{article.author}</strong>
            </div>
          </div>
        </header>

        {/* FEATURED HERO IMAGE */}
        <div className="article-featured-media glass-panel">
          <img src={article.image} alt={article.title} className="article-banner-img" />
          <div className="article-media-caption">
            <span>Dokumentasi Riset Laboratorium Sangrai & Kebun Kemitraan Aroma & Co. Roasters</span>
          </div>
        </div>

        {/* ARTICLE BODY CONTENT */}
        <div className="article-body-wrapper">
          <div className="article-content-main">
            {article.content.map((sec, idx) => (
              <section key={idx} className="article-section-chapter">
                <h2 className="section-chapter-heading">
                  <span className="chapter-bullet">{idx + 1}.</span> {sec.heading}
                </h2>
                <div className="section-chapter-body">
                  {sec.text.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="article-paragraph-text">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            {/* KEY TAKEAWAYS BOX */}
            <div className="article-takeaways-card glass-panel mt-4">
              <div className="takeaways-header">
                <span className="takeaways-icon">💡</span>
                <h3>Intisari & Rekomendasi Barista</h3>
              </div>
              <ul className="takeaways-list">
                <li>Memahami sains di balik kopi membuka pengalaman menikmati rasa yang jauh lebih dalam.</li>
                <li>Setiap pilihan biji kopi yang kami sangrai di Aroma & Co. melalui uji kurasi ketat berstandar SCA internasional.</li>
                <li>Eksplorasi seduhan di rumah dapat dimulai dengan memperhatikan rasio seduh dan suhu air yang tepat.</li>
              </ul>
            </div>

            {/* ARTICLE TAGS */}
            <div className="article-tags-row mt-4">
              <span className="tags-label">Topik Terkait:</span>
              <div className="tags-chips-list">
                {article.tags.map((t, i) => (
                  <span key={i} className="article-topic-pill">#{t}</span>
                ))}
              </div>
            </div>

            {/* BOTTOM SHARE CARD */}
            <div className="article-bottom-share-card glass-panel mt-4">
              <div>
                <h4>Suka Dengan Wawasan Artikel Ini?</h4>
                <p>Bagikan pengetahuan kopi spesialti ini kepada sesama penikmat kopi.</p>
              </div>
              <div className="bottom-share-btns">
                <button type="button" className="btn btn-outline btn-sm" onClick={handleShareWA}>
                  📱 Kirim ke Teman (WA)
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={handleCopyLink}>
                  📋 Salin Tautan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RELATED ARTICLES SECTION */}
        <section className="related-articles-section mt-5">
          <div className="section-title-wrapper">
            <span className="sub-tag">Eksplorasi Jurnal Lainnya</span>
            <h2 className="section-title">
              Esai & Sains <span>Kopi Terpilih</span>
            </h2>
          </div>

          <div className="articles-grid-row">
            {otherArticles.map((item) => (
              <article key={item.id} className="article-story-card glass-panel">
                <span className="article-meta-tag">{item.category?.toUpperCase()} • {item.readTime}</span>
                <h3 className="article-card-title">{item.title}</h3>
                <p className="article-card-snippet">{item.excerpt}</p>
                <div className="article-card-footer">
                  <span>{item.author.split('(')[0]}</span>
                  <Link to={`/article/${item.id}`} className="read-more-link">
                    Baca Selengkapnya ➔
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA */}
        <div className="article-bottom-cta-wrap mt-5">
          <div className="guide-cta-card glass-panel text-center">
            <h3 className="cta-heading">Cicipi Kopi yang Dibahas dalam Artikel Ini</h3>
            <p className="cta-desc">Koleksi varian kopi single origin segar kami siap diseduh untuk Anda.</p>
            <Link to="/menu" className="btn btn-primary">
              ✦ Pesan Menu Kopi Spesialti ➔
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
