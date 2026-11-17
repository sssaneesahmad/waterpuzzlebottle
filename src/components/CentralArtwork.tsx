import React from 'react';

export const CentralArtwork: React.FC = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      <div className="relative w-[240px] h-[240px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px] opacity-35 sm:opacity-50 md:opacity-60 transition-opacity duration-500">
        {/* Soft Halo Behind Lotus */}
        <div
          className="absolute inset-4 rounded-full animate-pulse-aura"
          style={{
            background:
              'radial-gradient(circle, rgba(39, 217, 255, 0.24) 0%, rgba(163, 43, 255, 0.12) 45%, transparent 72%)',
          }}
        />

        {/* Original SVG Crystalline Water Lotus & Magic Ripples */}
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_24px_rgba(39,217,255,0.28)]"
        >
          <defs>
            <radialGradient id="lotusCoreGlow" cx="50%" cy="55%" r="50%">
              <stop offset="0%" stopColor="#A7EEFF" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#27D9FF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#087BFF" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="petalCyan" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A7EEFF" stopOpacity="0.55" />
              <stop offset="55%" stopColor="#27D9FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#087BFF" stopOpacity="0.08" />
            </linearGradient>

            <linearGradient id="petalViolet" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A32BFF" stopOpacity="0.38" />
              <stop offset="65%" stopColor="#087BFF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10164D" stopOpacity="0.05" />
            </linearGradient>

            <linearGradient id="rippleRing" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#087BFF" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#27D9FF" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#087BFF" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Concentric Arcane Water Ripples */}
          <ellipse
            cx="200"
            cy="266"
            rx="145"
            ry="34"
            stroke="url(#rippleRing)"
            strokeWidth="1.5"
          />
          <ellipse
            cx="200"
            cy="266"
            rx="105"
            ry="24"
            stroke="url(#rippleRing)"
            strokeWidth="1.2"
            strokeDasharray="6 6"
          />
          <ellipse
            cx="200"
            cy="266"
            rx="66"
            ry="15"
            stroke="#A7EEFF"
            strokeOpacity="0.35"
            strokeWidth="1"
          />

          {/* Outer Violet-Blue Petals */}
          <path
            d="M200 258 C135 245, 78 206, 72 156 C118 164, 165 198, 200 258Z"
            fill="url(#petalViolet)"
            stroke="#27D9FF"
            strokeOpacity="0.28"
            strokeWidth="1.2"
          />
          <path
            d="M200 258 C265 245, 322 206, 328 156 C282 164, 235 198, 200 258Z"
            fill="url(#petalViolet)"
            stroke="#27D9FF"
            strokeOpacity="0.28"
            strokeWidth="1.2"
          />

          {/* Mid Wing Petals */}
          <path
            d="M200 254 C142 222, 108 162, 122 108 C162 132, 186 184, 200 254Z"
            fill="url(#petalCyan)"
            stroke="#A7EEFF"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
          <path
            d="M200 254 C258 222, 292 162, 278 108 C238 132, 214 184, 200 254Z"
            fill="url(#petalCyan)"
            stroke="#A7EEFF"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />

          {/* Lower Cradle Petals */}
          <path
            d="M200 264 C146 266, 98 242, 86 206 C132 212, 170 232, 200 264Z"
            fill="url(#petalCyan)"
            stroke="#27D9FF"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          <path
            d="M200 264 C254 266, 302 242, 314 206 C268 212, 230 232, 200 264Z"
            fill="url(#petalCyan)"
            stroke="#27D9FF"
            strokeOpacity="0.25"
            strokeWidth="1"
          />

          {/* Central Crown Lotus Petal */}
          <path
            d="M200 256 C164 198, 162 122, 200 72 C238 122, 236 198, 200 256Z"
            fill="url(#petalCyan)"
            stroke="#A7EEFF"
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />

          {/* Inner Luminous Core Orb */}
          <circle cx="200" cy="212" r="54" fill="url(#lotusCoreGlow)" />
          <circle
            cx="200"
            cy="210"
            r="9"
            fill="#A7EEFF"
            fillOpacity="0.7"
          />
          <circle
            cx="200"
            cy="210"
            r="16"
            stroke="#27D9FF"
            strokeOpacity="0.45"
            strokeWidth="1"
          />

          {/* Floating Crystal Droplets */}
          <circle cx="152" cy="112" r="2.5" fill="#A7EEFF" fillOpacity="0.7" />
          <circle cx="248" cy="112" r="2.5" fill="#A7EEFF" fillOpacity="0.7" />
          <circle cx="200" cy="48" r="3" fill="#27D9FF" fillOpacity="0.8" />
          <circle cx="110" cy="140" r="2" fill="#27D9FF" fillOpacity="0.5" />
          <circle cx="290" cy="140" r="2" fill="#27D9FF" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
};
