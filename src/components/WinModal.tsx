import React from 'react';
import { ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface WinModalProps {
  levelCompleted: number;
  moves: number;
  coinsEarned: number;
  streakBonus: number;
  onNextLevel: () => void;
  onReplay: () => void;
}

const CONFETTI = [
  { left: '12%', color: '#27D9FF', tx: '-24px', ty: '240px', rot: '220deg', delay: '0s' },
  { left: '22%', color: '#FF4BBD', tx: '18px', ty: '270px', rot: '-180deg', delay: '0.1s' },
  { left: '34%', color: '#FFD32F', tx: '-14px', ty: '230px', rot: '300deg', delay: '0.2s' },
  { left: '48%', color: '#32C978', tx: '28px', ty: '260px', rot: '-260deg', delay: '0.05s' },
  { left: '60%', color: '#A32BFF', tx: '-20px', ty: '250px', rot: '240deg', delay: '0.15s' },
  { left: '72%', color: '#FF8B27', tx: '16px', ty: '280px', rot: '-210deg', delay: '0.08s' },
  { left: '84%', color: '#27D9FF', tx: '-26px', ty: '245px', rot: '195deg', delay: '0.22s' },
  { left: '90%', color: '#FFD32F', tx: '12px', ty: '265px', rot: '290deg', delay: '0.12s' },
];

export const WinModal: React.FC<WinModalProps> = ({
  levelCompleted,
  moves,
  coinsEarned,
  streakBonus,
  onNextLevel,
  onReplay,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030620]/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-title"
    >
      {/* Celebratory Confetti Particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {CONFETTI.map((c, idx) => (
          <span
            key={idx}
            className="absolute top-12 w-2.5 h-2.5 rounded-sm"
            style={
              {
                left: c.left,
                backgroundColor: c.color,
                boxShadow: `0 0 10px ${c.color}`,
                '--tx': c.tx,
                '--ty': c.ty,
                '--rot': c.rot,
                animation: `confettiFall 2.2s ease-out ${c.delay} forwards`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Main Celebration Card */}
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#131E63] to-[#090F3A] border border-[#56C6FF]/45 p-6 sm:p-7 text-center shadow-[0_24px_64px_rgba(0,0,0,0.65),0_0_40px_rgba(39,217,255,0.2)]">
        {/* Luminous Crown Badge */}
        <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-[#27D9FF] to-[#087BFF] shadow-[0_0_28px_rgba(39,217,255,0.6)]">
          <Sparkles className="w-8 h-8 text-[#F3F8FF]" />
        </div>

        <h2
          id="win-title"
          className="font-display text-2xl sm:text-3xl font-extrabold tracking-wide text-[#F3F8FF]"
          style={{ textShadow: '0 0 18px rgba(39, 217, 255, 0.5)' }}
        >
          LEVEL COMPLETE!
        </h2>

        <p className="mt-2 text-sm text-[#A7EEFF]/85 leading-relaxed">
          Beautifully sorted! Ready for the next challenge?
        </p>

        {/* Summary Metrics (clean unboxed divider grid) */}
        <div className="mt-6 pt-5 pb-5 border-y border-white/10 grid grid-cols-3 gap-2">
          <div>
            <div className="text-[11px] font-medium text-[#A7EEFF]/70">Level</div>
            <div className="mt-1 font-mono-nums text-xl font-bold text-[#F3F8FF]">
              {levelCompleted}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#A7EEFF]/70">Moves</div>
            <div className="mt-1 font-mono-nums text-xl font-bold text-[#F3F8FF]">
              {moves}
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#A7EEFF]/70">Coins</div>
            <div className="mt-1 font-mono-nums text-xl font-bold text-[#FFD32F]">
              +{coinsEarned}
            </div>
          </div>
        </div>

        {streakBonus > 0 && (
          <p className="mt-3 text-xs font-medium text-[#FFD32F]">
            Includes +{streakBonus} Streak Bonus Coins
          </p>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onNextLevel}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-b from-[#33ADFF] via-[#087BFF] to-[#0552C7] border border-[#8EDBFF]/65 shadow-[0_8px_24px_rgba(8,123,255,0.5),inset_0_1.5px_0_rgba(255,255,255,0.45)] hover:brightness-110 active:scale-[0.98] transition-all duration-150 font-display text-base font-bold text-[#F3F8FF] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
          >
            <span>Next Level</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onReplay}
            className="w-full py-2.5 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-sm font-semibold text-[#A7EEFF] flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay Level</span>
          </button>
        </div>
      </div>
    </div>
  );
};
