import React from 'react';
import { X } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

const STEPS = [
  {
    num: 1,
    title: 'Tap a bottle',
    desc: 'Select any bottle with liquid inside to lift it up.',
  },
  {
    num: 2,
    title: 'Choose another bottle',
    desc: 'Tap a second bottle to pour the top color layer across.',
  },
  {
    num: 3,
    title: 'Match liquid colors',
    desc: 'You can only pour onto the same color or into an empty bottle with space.',
  },
  {
    num: 4,
    title: 'Sort every bottle',
    desc: 'Fill each non-empty bottle with 4 matching units of a single color.',
  },
  {
    num: 5,
    title: 'Complete the level',
    desc: 'Use Restart, Undo, Hint, or +Bottle anytime if you want a fresh angle.',
  },
];

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030620]/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="howto-title"
    >
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#121D5E] to-[#090F3A] border border-[#56C6FF]/40 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2
            id="howto-title"
            className="font-display text-xl font-bold text-[#F3F8FF]"
          >
            How to Play
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close instructions"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-[#F3F8FF] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mini Visual Pouring Diagram */}
        <div
          className="my-4 py-4 px-3 rounded-2xl bg-[#070D35]/80 border border-[#27D9FF]/20 flex items-center justify-center gap-4"
          aria-hidden="true"
        >
          <svg viewBox="0 0 180 86" className="w-44 h-22">
            {/* Source Bottle */}
            <rect x="26" y="14" width="28" height="60" rx="10" fill="#0B1854" stroke="#66D7FF" strokeWidth="2" />
            <rect x="29" y="48" width="22" height="23" rx="6" fill="#FF4BBD" />
            <rect x="29" y="28" width="22" height="20" fill="#27D9FF" />
            {/* Curved Pour Arrow */}
            <path
              d="M58 20 Q 90 4, 118 22"
              stroke="#A7EEFF"
              strokeWidth="2.5"
              strokeDasharray="4 3"
              fill="none"
            />
            <polygon points="118,17 125,24 115,26" fill="#A7EEFF" />
            {/* Destination Bottle */}
            <rect x="124" y="14" width="28" height="60" rx="10" fill="#0B1854" stroke="#27D9FF" strokeWidth="2" />
            <rect x="127" y="48" width="22" height="23" rx="6" fill="#27D9FF" />
            <rect x="127" y="28" width="22" height="20" fill="#27D9FF" opacity="0.7" />
          </svg>
        </div>

        <ol className="space-y-3">
          {STEPS.map((step) => (
            <li key={step.num} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#087BFF] text-[#F3F8FF] font-mono-nums text-xs font-bold shrink-0 mt-0.5">
                {step.num}
              </span>
              <div>
                <div className="text-sm font-semibold text-[#F3F8FF]">
                  {step.title}
                </div>
                <p className="text-xs text-[#A7EEFF]/75 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full py-3 px-6 rounded-2xl bg-gradient-to-b from-[#33ADFF] via-[#087BFF] to-[#0552C7] border border-[#8EDBFF]/65 font-display text-sm font-bold text-[#F3F8FF] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27D9FF]"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
