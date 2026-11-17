import React from 'react';
import { AlertCircle, Clock, PlayCircle, RotateCcw } from 'lucide-react';
import { ADD_MOVES_COUNT, ADD_TIME_SECONDS } from '../game/types';

export type FailReason = 'time_up' | 'out_of_moves';

interface LevelFailedModalProps {
  reason: FailReason;
  levelNumber: number;
  movesUsed: number;
  extensionsUsed: number;
  onWatchAdToContinue: () => void;
  onRestartLevel: () => void;
}

export const LevelFailedModal: React.FC<LevelFailedModalProps> = ({
  reason,
  levelNumber,
  movesUsed,
  extensionsUsed,
  onWatchAdToContinue,
  onRestartLevel,
}) => {
  const isTimeUp = reason === 'time_up';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030620]/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fail-title"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#171C5E] to-[#090F3A] border border-[#FF4B6E]/45 p-6 sm:p-7 text-center shadow-[0_24px_64px_rgba(0,0,0,0.7),0_0_36px_rgba(241,59,82,0.2)]">
        <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-[#FF6A7D] to-[#C81B32] shadow-[0_0_26px_rgba(241,59,82,0.55)]">
          {isTimeUp ? (
            <Clock className="w-8 h-8 text-[#F3F8FF]" />
          ) : (
            <AlertCircle className="w-8 h-8 text-[#F3F8FF]" />
          )}
        </div>

        <h2
          id="fail-title"
          className="font-display text-2xl sm:text-3xl font-extrabold tracking-wide text-[#F3F8FF]"
        >
          {isTimeUp ? "TIME'S UP!" : 'OUT OF MOVES!'}
        </h2>

        <p className="mt-2 text-sm text-[#A7EEFF]/85 leading-relaxed">
          {isTimeUp ? (
            <>
              Level {levelNumber} ran out of time after{' '}
              <span className="font-mono-nums font-semibold text-[#F3F8FF]">
                {movesUsed}
              </span>{' '}
              moves. Watch a short ad to add{' '}
              <span className="font-mono-nums font-bold text-[#FFD32F]">
                +{ADD_TIME_SECONDS}s
              </span>{' '}
              and keep sorting!
            </>
          ) : (
            <>
              You used all moves on Level {levelNumber}. Watch a short ad to add{' '}
              <span className="font-mono-nums font-bold text-[#FFD32F]">
                +{ADD_MOVES_COUNT} Moves
              </span>{' '}
              and continue!
            </>
          )}
        </p>

        {extensionsUsed > 0 && (
          <p className="mt-2 text-xs text-[#A7EEFF]/65">
            Ad continues used this attempt:{' '}
            <span className="font-mono-nums font-bold text-[#F3F8FF]">
              {extensionsUsed}
            </span>
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onWatchAdToContinue}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-b from-[#FFE266] via-[#FFC824] to-[#D98E00] border border-[#FFF2A6]/80 shadow-[0_8px_24px_rgba(255,211,47,0.4)] hover:brightness-105 active:scale-[0.98] transition-all duration-150 font-display text-base font-extrabold text-[#050A2D] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD32F]"
          >
            <PlayCircle className="w-5 h-5" />
            <span>
              {isTimeUp
                ? `Watch Ad (+${ADD_TIME_SECONDS}s)`
                : `Watch Ad (+${ADD_MOVES_COUNT} Moves)`}
            </span>
          </button>

          <button
            type="button"
            onClick={onRestartLevel}
            className="w-full py-2.5 px-5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-sm font-semibold text-[#A7EEFF] flex items-center justify-center gap-2 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restart Level</span>
          </button>
        </div>
      </div>
    </div>
  );
};
