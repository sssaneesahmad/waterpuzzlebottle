import React from 'react';
import { LIQUID_COLORS } from '../game/colors';
import { LiquidColorId } from '../game/types';

export interface PourStreamGeometry {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: LiquidColorId;
}

interface PourStreamProps {
  stream: PourStreamGeometry | null;
}

export const PourStream: React.FC<PourStreamProps> = ({ stream }) => {
  if (!stream) return null;

  const def = LIQUID_COLORS[stream.color];
  const midX = (stream.startX + stream.endX) / 2;
  const ctrlY = Math.min(stream.startY, stream.endY) - 10;

  const pathData = `M ${stream.startX} ${stream.startY} Q ${midX} ${ctrlY}, ${stream.endX} ${stream.endY}`;

  return (
    <svg
      className="pointer-events-none fixed inset-0 w-full h-full z-50 overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <filter id="pourGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer Glowing Stream */}
      <path
        d={pathData}
        stroke={def.midHex}
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
        filter="url(#pourGlow)"
        opacity="0.92"
      />

      {/* Bright Specular Inner Stream Core */}
      <path
        d={pathData}
        stroke={def.meniscusHex}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* Splash Impact Glow & Droplets */}
      <circle
        cx={stream.endX}
        cy={stream.endY}
        r="9"
        fill={def.topHex}
        opacity="0.55"
      />
      <circle
        cx={stream.endX - 9}
        cy={stream.endY - 10}
        r="3"
        fill={def.meniscusHex}
        opacity="0.85"
      />
      <circle
        cx={stream.endX + 10}
        cy={stream.endY - 12}
        r="2.5"
        fill={def.meniscusHex}
        opacity="0.85"
      />
    </svg>
  );
};
