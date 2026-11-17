import React from 'react';
import { BookOpen, Play } from 'lucide-react';
import { Bottle } from './Bottle';

interface LandingScreenProps {
  currentLevel: number;
  coins: number;
  completedCount: number;
  onPlay: () => void;
  onHowToPlay: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  currentLevel,
  coins,
  completedCount,
  onPlay,
  onHowToPlay,
}) => {
  const isReturning = currentLevel > 1 || completedCount > 0;

  return (
    <div className="relative z-10 min-h-full w-full flex flex-col items-center justify-center px-5 py-8 text-center">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Decorative Showcase Trio of Glowing Bottles */}
        <div
          className="relative flex items-end justify-center gap-4 mb-6 pointer-events-none select-none"
          aria-hidden="true"
        >
          <div className="-rotate-6 opacity-90">
            <Bottle
              bottle={{
                id: 'preview-1',
                colors: ['purple', 'pink', 'cyan', 'cyan'],
                capacity: 4,
              }}
              index={0}
              width={60}
              height={146}
              selected={false}
              isInvalidShake={false}
              hintRole={null}
              pourTransform={null}
              colorblindSymbols={false}
              disabled={true}
              onSelect={() => {}}
            />
          </div>
          <div className="-translate-y-3">
            <Bottle
              bottle={{
                id: 'preview-2',
                colors: ['cyan', 'cyan', 'cyan', 'cyan'],
                capacity: 4,
              }}
              index={1}
              width={68}
              height={165}
              selected={true}
              isInvalidShake={false}
              hintRole={null}
              pourTransform={null}
              colorblindSymbols={false}
              disabled={true}
              onSelect={() => {}}
            />
          </div>
          <div className="rotate-6 opacity-90">
            <Bottle
              bottle={{
                id: 'preview-3',
                colors: ['orange', 'yellow', 'emerald', 'pink'],
                capacity: 4,
              }}
              index={2}
              width={60}
              height={146}
              selected={false}
              isInvalidShake={false}
              hintRole={null}
              pourTransform={null}
              colorblindSymbols={false}
              disabled={true}
              onSelect={() => {}}
            />
          </div>
        </div>

        {/* Original Game Logo & Wordmark */}
        <div className="font-display text-xs font-bold tracking-[0.26em] uppercase text-[#27D9FF] mb-2">
          Aqua Alchemy
        </div>

        <h1
          className="font-display text-3xl sm:text-4xl font-extrabold text-[#F3F8FF] leading-tight text-balance"
          style={{ textShadow: '0 0 24px rgba(39, 217, 255, 0.4)' }}
        >
          A Little Color. A Lot of Calm.
        </h1>

        <p className="mt-3 text-sm sm:text-base text-[#A7EEFF]/80 max-w-sm leading-relaxed">
          Pour, match, and sort your way through beautifully crafted liquid puzzles.
        </p>

        {/* Returning Player Progress (clean unboxed text) */}
        {isReturning && (
          <div className="mt-5 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-medium text-[#A7EEFF]">
            <span className="font-mono-nums">Level {currentLevel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-nums">{coins} Coins</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono-nums">{completedCount} Solved</span>
          </div>
        )}

        {/* Primary Play CTA */}
        <button
          type="button"
          onClick={onPlay}
          className="mt-7 w-full max-w-xs py-4 px-8 rounded-2xl bg-gradient-to-b from-[#35B2FF] via-[#087BFF] to-[#0552C7] border border-[#8EDBFF]/70 shadow-[0_10px_30px_rgba(8,123,255,0.55),inset_0_2px_0_rgba(255,255,255,0.5)] hover:brightness-110 hover:shadow-[0_0_34px_rgba(39,217,255,0.75)] active:scale-[0.98] transition-all duration-150 font-display text-lg font-extrabold tracking-wide text-[#F3F8FF] flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{isReturning ? `CONTINUE LEVEL ${currentLevel}` : 'PLAY NOW'}</span>
        </button>

        {/* Secondary How to Play Link */}
        <button
          type="button"
          onClick={onHowToPlay}
          className="mt-4 py-2 px-4 text-sm font-semibold text-[#A7EEFF]/85 hover:text-[#27D9FF] flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF] rounded-xl"
        >
          <BookOpen className="w-4 h-4" />
          <span>How to Play</span>
        </button>
      </div>
    </div>
  );
};
