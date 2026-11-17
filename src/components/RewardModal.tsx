import React from 'react';
import { Gift, Sparkles, X } from 'lucide-react';
import {
  DAILY_REWARD_COINS,
  LEVEL_REWARD_COINS,
  STREAK_BONUS_COINS,
} from '../game/types';

interface RewardModalProps {
  coins: number;
  streakCount: number;
  canClaimDaily: boolean;
  onClaimDaily: () => void;
  onClose: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  coins,
  streakCount,
  canClaimDaily,
  onClaimDaily,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030620]/75 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reward-title"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#121D5E] to-[#090F3A] border border-[#56C6FF]/40 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h2
            id="reward-title"
            className="font-display text-xl font-bold text-[#F3F8FF]"
          >
            Alchemy Treasury
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close rewards"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-[#F3F8FF] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 text-center">
          <div className="text-xs font-medium text-[#A7EEFF]/75">
            Current Coin Balance
          </div>
          <div className="mt-1 font-mono-nums text-3xl font-extrabold text-[#FFD32F]">
            {coins} Coins
          </div>
        </div>

        {/* Daily Reward Action */}
        <div className="mt-5 p-4 rounded-2xl bg-[#0A1344]/85 border border-[#FFD32F]/35 text-center">
          <div className="mx-auto mb-2 flex items-center justify-center w-11 h-11 rounded-xl bg-[#FFD32F]/15 text-[#FFD32F]">
            <Gift className="w-6 h-6" />
          </div>
          <div className="text-sm font-bold text-[#F3F8FF]">
            Daily Alchemy Gift
          </div>
          <p className="mt-1 text-xs text-[#A7EEFF]/75">
            Collect +{DAILY_REWARD_COINS} bonus coins once every day.
          </p>
          <button
            type="button"
            disabled={!canClaimDaily}
            onClick={onClaimDaily}
            className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-b from-[#FFE266] to-[#E59E00] text-[#050A2D] font-display text-sm font-extrabold shadow-[0_6px_18px_rgba(255,211,47,0.35)] hover:brightness-105 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {canClaimDaily
              ? `Claim +${DAILY_REWARD_COINS} Coins`
              : 'Already Claimed Today'}
          </button>
        </div>

        {/* Earning Guide */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-[#A7EEFF]/80">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#27D9FF]" />
              Complete any level
            </span>
            <span className="font-mono-nums font-bold text-[#FFD32F]">
              +{LEVEL_REWARD_COINS} coins
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Every 3-level streak ({streakCount % 3}/3)</span>
            <span className="font-mono-nums font-bold text-[#FFD32F]">
              +{STREAK_BONUS_COINS} bonus
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
