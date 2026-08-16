import React, { useEffect, useState } from 'react';

export default function AmbientScene() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate gentle floating ambient particles
    const items = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.1,
    }));
    setParticles(items);
  }, []);

  return (
    <div className="ambient-scene-container" aria-hidden="true">
      {/* GLOWING ORBS */}
      <div className="ambient-orb orb-gold"></div>
      <div className="ambient-orb orb-emerald"></div>
      <div className="ambient-orb orb-warm"></div>

      {/* FLOATING LUXURY PARTICLES / STEAM DUST */}
      <div className="ambient-particles-layer">
        {particles.map((p) => (
          <span
            key={p.id}
            className="ambient-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
}
