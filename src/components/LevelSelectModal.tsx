import React from 'react';
import { Check, Lock, X } from 'lucide-react';

interface LevelSelectModalProps {
  currentLevel: number;
  highestUnlockedLevel: number;
  completedLevels: number[];
  onSelectLevel: (level: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  currentLevel,
  highestUnlockedLevel,
  completedLevels,
  onSelectLevel,
  onClose,
}) => {
  const totalVisible = Math.max(15, Math.ceil(highestUnlockedLevel / 5) * 5 + 5);
  const completedSet = new Set(completedLevels);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030620]/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="levels-title"
    >
      <div className="relative w-full max-w-md max-h-[85vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#121D5E] to-[#090F3A] border border-[#56C6FF]/40 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <h2
            id="levels-title"
            className="font-display text-xl font-bold text-[#F3F8FF]"
          >
            Select Level
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close level selector"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-[#F3F8FF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-2.5 pr-1">
          {Array.from({ length: totalVisible }, (_, idx) => idx + 1).map(
            (lvl) => {
              const unlocked = lvl <= highestUnlockedLevel;
              const isCurrent = lvl === currentLevel;
              const isDone = completedSet.has(lvl);

              return (
                <button
                  key={lvl}
                  type="button"
                  disabled={!unlocked}
                  onClick={() => onSelectLevel(lvl)}
                  aria-label={`Level ${lvl}${isDone ? ', completed' : ''}${
                    !unlocked ? ', locked' : ''
                  }`}
                  className={`relative h-14 rounded-2xl font-mono-nums text-base font-bold flex flex-col items-center justify-center transition-all duration-150 ${
                    isCurrent
                      ? 'bg-gradient-to-b from-[#33ADFF] to-[#087BFF] text-[#F3F8FF] border-2 border-[#A7EEFF] shadow-[0_0_18px_rgba(39,217,255,0.6)] cursor-pointer'
                      : unlocked
                        ? 'bg-[#162770] hover:bg-[#1E3594] text-[#F3F8FF] border border-[#56C6FF]/35 cursor-pointer active:scale-95'
                        : 'bg-[#0B123F]/70 text-[#A7EEFF]/30 border border-white/5 cursor-not-allowed'
                  }`}
                >
                  <span>{lvl}</span>
                  {isDone && (
                    <Check className="w-3.5 h-3.5 text-[#32C978] mt-0.5" />
                  )}
                  {!unlocked && (
                    <Lock className="w-3 h-3 text-[#A7EEFF]/30 mt-0.5" />
                  )}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
