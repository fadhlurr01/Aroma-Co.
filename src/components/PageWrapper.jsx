import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageWrapper({ children }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Initialize Intersection Observer for on-scroll animations
    const revealTargets = document.querySelectorAll(
      '.reveal-on-scroll, .section-header, .glass-panel, .coffee-card-artisan, .story-img-card, .menu-showcase-card, .outlet-card, .timeline-card, .roaster-card, .faq-accordion-item, .admin-stat-card, .origin-story-card, .guide-sub-card'
    );

    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    revealTargets.forEach((el, index) => {
      el.classList.add('scroll-reveal-item');
      if (index % 4 === 1) el.classList.add('stagger-1');
      if (index % 4 === 2) el.classList.add('stagger-2');
      if (index % 4 === 3) el.classList.add('stagger-3');
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div key={location.pathname} className="page-transition-wrapper">
      {children}
    </div>
  );
}
