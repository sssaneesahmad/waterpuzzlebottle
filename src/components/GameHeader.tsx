import React, { useEffect, useState } from 'react';
import { Clock, Settings } from 'lucide-react';

interface GameHeaderProps {
  levelNumber: number;
  movesLeft: number;
  timeLeft: number;
  coins: number;
  canClaimDaily: boolean;
  onOpenSettings: () => void;
  onOpenRewards: () => void;
  onOpenLevels: () => void;
}

function formatSeconds(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  levelNumber,
  movesLeft,
  timeLeft,
  coins,
  canClaimDaily,
  onOpenSettings,
  onOpenRewards,
  onOpenLevels,
}) => {
  const [popping, setPopping] = useState(false);
  const [prevCoins, setPrevCoins] = useState(coins);

  useEffect(() => {
    if (coins !== prevCoins) {
      if (coins > prevCoins) {
        setPopping(true);
        const timer = window.setTimeout(() => setPopping(false), 480);
        setPrevCoins(coins);
        return () => window.clearTimeout(timer);
      }
      setPrevCoins(coins);
    }
  }, [coins, prevCoins]);

  const isTimeCritical = timeLeft <= 5;
  const isTimeWarning = timeLeft > 5 && timeLeft <= 12;

  const isMovesCritical = movesLeft <= 1;
  const isMovesWarning = movesLeft > 1 && movesLeft <= 3;

  return (
    <header className="relative z-20 w-full max-w-4xl mx-auto px-3 sm:px-6 safe-pt pt-3 pb-2 flex items-center justify-between gap-2">
      {/* Left: Coin Balance */}
      <button
        type="button"
        onClick={onOpenRewards}
        aria-label={`Coin balance: ${coins}. Open rewards`}
        className="group relative flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-gradient-to-b from-[#16347A]/90 to-[#0C1D4F]/95 border border-[#56C6FF]/45 shadow-[0_4px_16px_rgba(8,123,255,0.25),inset_0_1px_0_rgba(167,238,255,0.35)] hover:border-[#27D9FF]/80 active:scale-95 transition-all duration-150 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
      >
        <span
          className={`relative flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-[0_0_12px_rgba(255,211,47,0.65)] ${
            popping ? 'animate-coin-pop' : ''
          }`}
          aria-hidden="true"
        >
          <svg viewBox="0 0 32 32" className="w-full h-full">
            <defs>
              <radialGradient id="goldCoinGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FFF5B8" />
                <stop offset="45%" stopColor="#FFD32F" />
                <stop offset="100%" stopColor="#D48800" />
              </radialGradient>
            </defs>
            <circle cx="16" cy="16" r="14" fill="url(#goldCoinGrad)" stroke="#FFF2A6" strokeWidth="1.5" />
            <circle cx="16" cy="16" r="10" fill="none" stroke="#B46A00" strokeOpacity="0.45" strokeWidth="1.2" />
            <path
              d="M16 9.5 L17.9 13.7 L22.4 14.3 L19.1 17.4 L20 21.8 L16 19.6 L12 21.8 L12.9 17.4 L9.6 14.3 L14.1 13.7 Z"
              fill="#FFF8CC"
              fillOpacity="0.9"
            />
          </svg>
        </span>

        <span className="font-mono-nums text-sm sm:text-base font-bold text-[#F3F8FF] tracking-tight whitespace-nowrap">
          {coins}
        </span>

        {canClaimDaily && (
          <span className="ml-0.5 text-[11px] font-bold text-[#FFD32F] whitespace-nowrap">
            +25
          </span>
        )}
      </button>

      {/* Center: Level Indicator + Live Timer & Moves Remaining */}
      <button
        type="button"
        onClick={onOpenLevels}
        aria-label={`Level ${levelNumber}, ${formatSeconds(timeLeft)} remaining, ${movesLeft} moves left. Choose level`}
        className="group flex flex-col items-center justify-center px-3 py-1 rounded-2xl hover:bg-white/5 active:scale-95 transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
      >
        <div
          className="font-display text-lg sm:text-2xl font-extrabold tracking-wider text-[#F3F8FF] whitespace-nowrap"
          style={{
            textShadow:
              '0 0 18px rgba(39, 217, 255, 0.55), 0 2px 4px rgba(5, 10, 45, 0.8)',
          }}
        >
          LEVEL <span className="font-mono-nums text-[#A7EEFF]">{levelNumber}</span>
        </div>

        <div className="text-[11px] sm:text-xs font-medium flex items-center gap-1.5 whitespace-nowrap">
          <span
            className={`inline-flex items-center gap-1 font-mono-nums font-bold transition-colors ${
              isTimeCritical
                ? 'text-[#FF6A7D] animate-pulse'
                : isTimeWarning
                  ? 'text-[#FFD32F]'
                  : 'text-[#27D9FF]'
            }`}
          >
            <Clock className="w-3 h-3" aria-hidden="true" />
            {formatSeconds(timeLeft)}
          </span>
          <span className="text-[#A7EEFF]/45" aria-hidden="true">
            ·
          </span>
          <span
            className={`font-mono-nums font-bold transition-colors ${
              isMovesCritical
                ? 'text-[#FF6A7D] animate-pulse'
                : isMovesWarning
                  ? 'text-[#FFD32F]'
                  : 'text-[#A7EEFF]/85'
            }`}
          >
            {movesLeft} {movesLeft === 1 ? 'Move' : 'Moves'} Left
          </span>
        </div>
      </button>

      {/* Right: Settings Button */}
      <button
        type="button"
        onClick={onOpenSettings}
        aria-label="Open game settings"
        className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-b from-[#2A9BFF] via-[#087BFF] to-[#0552C7] border border-[#8CD6FF]/60 shadow-[0_6px_18px_rgba(8,123,255,0.45),inset_0_1.5px_0_rgba(255,255,255,0.45)] hover:brightness-110 active:translate-y-0.5 active:scale-95 transition-all duration-150 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
      >
        <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-[#F3F8FF] drop-shadow-sm" />
      </button>
    </header>
  );
};
