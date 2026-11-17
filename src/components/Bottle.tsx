import React, { useId } from 'react';
import { LIQUID_COLORS } from '../game/colors';
import { isBottleCompleted } from '../game/engine';
import { BottleState } from '../game/types';

export interface BottlePourTransform {
  tx: number;
  ty: number;
  rotate: number;
}

interface BottleProps {
  bottle: BottleState;
  index: number;
  width: number;
  height: number;
  selected: boolean;
  isInvalidShake: boolean;
  hintRole: 'source' | 'dest' | null;
  pourTransform: BottlePourTransform | null;
  colorblindSymbols: boolean;
  disabled: boolean;
  onSelect: (index: number) => void;
  bottleRef?: (el: HTMLButtonElement | null) => void;
}

// Interior liquid chamber geometry in 92x224 viewBox:
// Top of usable liquid chamber (4 units): y = 70
// Bottom of interior base: y = 202
// Total liquid height = 132 => 33 units per layer
const LIQUID_BOTTOM_Y = 202;
const LAYER_HEIGHT = 33;
const INTERIOR_LEFT = 19;
const INTERIOR_WIDTH = 54;

export const Bottle: React.FC<BottleProps> = ({
  bottle,
  index,
  width,
  height,
  selected,
  isInvalidShake,
  hintRole,
  pourTransform,
  colorblindSymbols,
  disabled,
  onSelect,
  bottleRef,
}) => {
  const uid = useId().replace(/:/g, '');
  const completed = isBottleCompleted(bottle);
  const topColor =
    bottle.colors.length > 0
      ? LIQUID_COLORS[bottle.colors[bottle.colors.length - 1]]
      : null;

  const ariaDescription =
    bottle.colors.length === 0
      ? `Bottle ${index + 1}, empty`
      : `Bottle ${index + 1}, ${bottle.colors
          .map((c) => LIQUID_COLORS[c].name)
          .join(', ')}${completed ? ', completed' : ''}`;

  const liftPx = Math.max(8, Math.min(16, Math.round(height * 0.085)));

  const style: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    transform: pourTransform
      ? `translate3d(${pourTransform.tx}px, ${pourTransform.ty}px, 0) rotate(${pourTransform.rotate}deg)`
      : selected
        ? `translate3d(0, -${liftPx}px, 0) scale(1.04)`
        : 'translate3d(0, 0, 0) scale(1)',
    transition: pourTransform
      ? 'transform 420ms cubic-bezier(0.22, 1, 0.36, 1)'
      : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
    zIndex: pourTransform ? 40 : selected ? 30 : 10,
  };

  return (
    <button
      ref={bottleRef}
      type="button"
      disabled={disabled}
      onClick={() => onSelect(index)}
      aria-label={ariaDescription}
      aria-pressed={selected}
      style={style}
      className={`group relative flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050A2D] rounded-2xl cursor-pointer select-none touch-manipulation ${
        isInvalidShake ? 'animate-shake-gentle' : ''
      }`}
    >
      {/* Selected or Completed Ambient Aura */}
      {(selected || completed || hintRole) && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-1 rounded-3xl transition-opacity duration-300"
          style={{
            boxShadow: selected
              ? '0 0 28px rgba(39, 217, 255, 0.65), inset 0 0 18px rgba(167, 238, 255, 0.25)'
              : hintRole
                ? '0 0 26px rgba(255, 211, 47, 0.7)'
                : topColor
                  ? `0 0 22px ${topColor.glowHex}`
                  : undefined,
          }}
        />
      )}

      {/* Hint Direction Indicator Badge */}
      {hintRole && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase whitespace-nowrap bg-[#FFD32F] text-[#050A2D] shadow-[0_0_12px_rgba(255,211,47,0.75)] z-30"
        >
          {hintRole === 'source' ? 'Pour' : 'Here'}
        </span>
      )}

      {/* Completed Bottle Star Sparkle */}
      {completed && !pourTransform && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-[#27D9FF] text-[#050A2D] shadow-[0_0_12px_rgba(39,217,255,0.9)] z-30"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path
              fillRule="evenodd"
              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}

      {/* Realistic SVG Glass Bottle */}
      <svg
        viewBox="0 0 92 224"
        className="w-full h-full overflow-visible drop-shadow-[0_12px_18px_rgba(2,5,24,0.65)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Interior Glass Cavity Clip Path */}
          <clipPath id={`clip-${uid}`}>
            <path d="M33 20 H59 V47 C59 56 73 63 73 78 V192 C73 203 63 208 46 208 C29 208 19 203 19 192 V78 C19 63 33 56 33 47 Z" />
          </clipPath>

          {/* Outer Glass Body Tint */}
          <linearGradient id={`glassBg-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#27D9FF" stopOpacity="0.16" />
            <stop offset="22%" stopColor="#A7EEFF" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#087BFF" stopOpacity="0.04" />
            <stop offset="82%" stopColor="#A7EEFF" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#27D9FF" stopOpacity="0.18" />
          </linearGradient>

          {/* Left Glossy Specular Highlight */}
          <linearGradient id={`glossLeft-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#A7EEFF" stopOpacity="0.04" />
          </linearGradient>

          {/* Rim Highlight */}
          <linearGradient id={`rimGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#A7EEFF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#27D9FF" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#A7EEFF" stopOpacity="0.95" />
          </linearGradient>

          {/* Individual Liquid Gradients */}
          {Object.values(LIQUID_COLORS).map((c) => (
            <linearGradient
              key={c.id}
              id={`liq-${uid}-${c.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={c.topHex} />
              <stop offset="48%" stopColor={c.midHex} />
              <stop offset="100%" stopColor={c.bottomHex} />
            </linearGradient>
          ))}
        </defs>

        {/* Translucent Glass Interior */}
        <path
          d="M27 12 C27 9 30 8 33 8 H59 C62 8 65 9 65 12 C65 15 62 17 60 18 V46 C60 56 76 63 76 79 V193 C76 206 64 212 46 212 C28 212 16 206 16 193 V79 C16 63 32 56 32 46 V18 C30 17 27 15 27 12 Z"
          fill={`url(#glassBg-${uid})`}
        />

        {/* Liquid Layers Clipped Inside Bottle */}
        <g clipPath={`url(#clip-${uid})`}>
          {bottle.colors.map((colorId, layerIdx) => {
            const def = LIQUID_COLORS[colorId];
            const isTopLayer = layerIdx === bottle.colors.length - 1;
            const yTop = LIQUID_BOTTOM_Y - (layerIdx + 1) * LAYER_HEIGHT;
            // Slight overlap (+1.5px) prevents subpixel seams between layers
            const rectHeight = layerIdx === 0 ? LAYER_HEIGHT + 10 : LAYER_HEIGHT + 1.5;

            return (
              <g
                key={`${bottle.id}-layer-${layerIdx}`}
                className="transition-all duration-300 ease-out"
              >
                <rect
                  x={INTERIOR_LEFT}
                  y={yTop}
                  width={INTERIOR_WIDTH}
                  height={rectHeight}
                  fill={`url(#liq-${uid}-${colorId})`}
                />

                {/* Subtle top edge sheen between layers */}
                {!isTopLayer && (
                  <line
                    x1={INTERIOR_LEFT}
                    y1={yTop + 0.6}
                    x2={INTERIOR_LEFT + INTERIOR_WIDTH}
                    y2={yTop + 0.6}
                    stroke={def.meniscusHex}
                    strokeOpacity="0.35"
                    strokeWidth="1"
                  />
                )}

                {/* Top Curved Liquid Meniscus Surface */}
                {isTopLayer && (
                  <g>
                    <ellipse
                      cx="46"
                      cy={yTop + 1}
                      rx="27"
                      ry="5"
                      fill={def.meniscusHex}
                      fillOpacity="0.88"
                    />
                    <ellipse
                      cx="42"
                      cy={yTop + 0.5}
                      rx="16"
                      ry="2.3"
                      fill="#FFFFFF"
                      fillOpacity="0.48"
                    />
                  </g>
                )}

                {/* Accessibility Colorblind Symbol */}
                {colorblindSymbols && (
                  <text
                    x="46"
                    y={yTop + LAYER_HEIGHT / 2 + 4}
                    textAnchor="middle"
                    fill="#050A2D"
                    fillOpacity="0.85"
                    fontSize="12"
                    fontWeight="800"
                    fontFamily="var(--font-mono)"
                  >
                    {def.symbol}
                  </text>
                )}
              </g>
            );
          })}

          {/* Subtle Rising Bubbles in Completed Bottles */}
          {completed && (
            <g>
              <circle
                cx="34"
                cy="185"
                r="2.4"
                fill="#FFFFFF"
                fillOpacity="0.65"
                className="animate-bubble"
                style={{ '--dur': '2.3s', '--delay': '0s' } as React.CSSProperties}
              />
              <circle
                cx="54"
                cy="192"
                r="1.9"
                fill="#FFFFFF"
                fillOpacity="0.55"
                className="animate-bubble"
                style={{ '--dur': '2.7s', '--delay': '0.9s' } as React.CSSProperties}
              />
              <circle
                cx="45"
                cy="176"
                r="2.1"
                fill="#FFFFFF"
                fillOpacity="0.6"
                className="animate-bubble"
                style={{ '--dur': '2.1s', '--delay': '1.5s' } as React.CSSProperties}
              />
            </g>
          )}
        </g>

        {/* Glass Specular Highlights (Above Liquid) */}
        {/* Main Left Vertical Glass Reflection */}
        <path
          d="M24 84 C24 72 29 66 34 61 V46 C34 46 36 62 29 69 C26 73 26 80 26 88 V186 C26 196 31 200 36 202 C29 201 24 195 24 185 Z"
          fill={`url(#glossLeft-${uid})`}
          opacity="0.72"
        />

        {/* Secondary Right Rim Reflection */}
        <path
          d="M68 85 V186 C68 193 64 197 60 199 C65 198 70 193 70 185 V85 C70 76 67 69 62 65 C66 70 68 77 68 85Z"
          fill="#A7EEFF"
          fillOpacity="0.28"
        />

        {/* Bottom Glass Thickness Curve */}
        <path
          d="M22 195 C26 206 35 209 46 209 C57 209 66 206 70 195 C65 202 56 204 46 204 C36 204 27 202 22 195Z"
          fill="#A7EEFF"
          fillOpacity="0.32"
        />

        {/* Dark Inner Glass Edge Shadow */}
        <path
          d="M27 12 C27 9 30 8 33 8 H59 C62 8 65 9 65 12 C65 15 62 17 60 18 V46 C60 56 76 63 76 79 V193 C76 206 64 212 46 212 C28 212 16 206 16 193 V79 C16 63 32 56 32 46 V18 C30 17 27 15 27 12 Z"
          stroke="#06123B"
          strokeOpacity="0.72"
          strokeWidth="3.2"
        />

        {/* Outer Cyan Glass Outline */}
        <path
          d="M27 12 C27 9 30 8 33 8 H59 C62 8 65 9 65 12 C65 15 62 17 60 18 V46 C60 56 76 63 76 79 V193 C76 206 64 212 46 212 C28 212 16 206 16 193 V79 C16 63 32 56 32 46 V18 C30 17 27 15 27 12 Z"
          stroke={
            selected
              ? '#27D9FF'
              : hintRole
                ? '#FFD32F'
                : completed
                  ? '#A7EEFF'
                  : '#66D7FF'
          }
          strokeOpacity={selected || hintRole ? 1 : 0.68}
          strokeWidth={selected || hintRole ? 2.2 : 1.5}
        />

        {/* Bottle Lip Rim Highlight */}
        <rect
          x="26"
          y="8"
          width="40"
          height="7"
          rx="3.5"
          fill="none"
          stroke={`url(#rimGrad-${uid})`}
          strokeWidth="1.6"
        />
        <line
          x1="31"
          y1="10.5"
          x2="52"
          y2="10.5"
          stroke="#FFFFFF"
          strokeOpacity="0.65"
          strokeWidth="1.4"
          strokeLinecap="round"
        />

        {/* Extra Bottle Indicator Ring on Neck */}
        {bottle.isExtra && (
          <rect
            x="31"
            y="24"
            width="30"
            height="4"
            rx="2"
            fill="#FFD32F"
            fillOpacity="0.75"
          />
        )}
      </svg>
    </button>
  );
};
