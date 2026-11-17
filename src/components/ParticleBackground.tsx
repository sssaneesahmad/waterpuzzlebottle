import React from 'react';

const STARS = [
  { top: '8%', left: '12%', size: 2, dur: '4.2s', delay: '0s' },
  { top: '14%', left: '78%', size: 2.5, dur: '5.1s', delay: '1.1s' },
  { top: '22%', left: '28%', size: 1.5, dur: '3.8s', delay: '0.6s' },
  { top: '18%', left: '91%', size: 2, dur: '4.8s', delay: '2.2s' },
  { top: '34%', left: '7%', size: 2.5, dur: '5.5s', delay: '1.7s' },
  { top: '41%', left: '88%', size: 1.8, dur: '4.4s', delay: '0.3s' },
  { top: '58%', left: '15%', size: 2, dur: '5.9s', delay: '2.7s' },
  { top: '65%', left: '84%', size: 2.2, dur: '4.6s', delay: '1.4s' },
  { top: '79%', left: '22%', size: 1.6, dur: '5.2s', delay: '0.9s' },
  { top: '84%', left: '73%', size: 2.4, dur: '4.1s', delay: '2.0s' },
  { top: '11%', left: '49%', size: 1.8, dur: '5.7s', delay: '1.3s' },
  { top: '72%', left: '48%', size: 1.5, dur: '4.9s', delay: '0.4s' },
];

const PARTICLES = [
  { left: '16%', bottom: '18%', size: 5, dur: '8s', delay: '0s', color: '#27D9FF' },
  { left: '32%', bottom: '26%', size: 4, dur: '9.5s', delay: '1.5s', color: '#A7EEFF' },
  { left: '54%', bottom: '14%', size: 6, dur: '10.5s', delay: '0.8s', color: '#087BFF' },
  { left: '68%', bottom: '30%', size: 4, dur: '7.8s', delay: '2.4s', color: '#27D9FF' },
  { left: '82%', bottom: '20%', size: 5, dur: '9.2s', delay: '1.1s', color: '#A32BFF' },
  { left: '24%', bottom: '48%', size: 3.5, dur: '8.4s', delay: '3.1s', color: '#A7EEFF' },
  { left: '74%', bottom: '54%', size: 4.5, dur: '10s', delay: '2.0s', color: '#27D9FF' },
];

export const ParticleBackground: React.FC = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Base Midnight Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 44%, #10164D 0%, #090F3A 48%, #050A2D 100%)',
        }}
      />

      {/* Luminous Central Blue-Cyan Ambient Glow */}
      <div
        className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[780px] aspect-square rounded-full animate-pulse-aura"
        style={{
          background:
            'radial-gradient(circle, rgba(39, 217, 255, 0.16) 0%, rgba(8, 123, 255, 0.12) 38%, rgba(16, 22, 77, 0) 72%)',
        }}
      />

      {/* Subtle Diagonal Cyan Light Streaks */}
      <div
        className="absolute -top-24 left-1/4 w-[2px] h-[55vh] rotate-[24deg] opacity-20"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, #27D9FF 50%, transparent 100%)',
        }}
      />
      <div
        className="absolute -top-16 right-1/4 w-[2px] h-[48vh] -rotate-[20deg] opacity-15"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, #A7EEFF 50%, transparent 100%)',
        }}
      />

      {/* Twinkling Stars */}
      {STARS.map((star, idx) => (
        <span
          key={`star-${idx}`}
          className="absolute rounded-full bg-[#A7EEFF] animate-star-twinkle"
          style={
            {
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: '0 0 8px rgba(167, 238, 255, 0.85)',
              '--dur': star.dur,
              '--delay': star.delay,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Soft Floating Aquatic Motes */}
      {PARTICLES.map((p, idx) => (
        <span
          key={`mote-${idx}`}
          className="absolute rounded-full animate-float-slow"
          style={
            {
              left: p.left,
              bottom: p.bottom,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 12px ${p.color}`,
              filter: 'blur(0.5px)',
              '--dur': p.dur,
              '--delay': p.delay,
            } as React.CSSProperties
          }
        />
      ))}

      {/* Soft Edge Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 56%, rgba(3, 6, 28, 0.72) 100%)',
        }}
      />
    </div>
  );
};
