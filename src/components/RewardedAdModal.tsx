import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, PlayCircle, X } from 'lucide-react';
import { ADD_MOVES_COUNT, ADD_TIME_SECONDS, AdRewardType } from '../game/types';
import { AD_CONFIG } from '../utils/adManager';

interface RewardedAdModalProps {
  rewardType: AdRewardType;
  onRewardCompleted: () => void;
  onCancel: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  rewardType,
  onRewardCompleted,
  onCancel,
}) => {
  const totalSeconds = AD_CONFIG.previewDurationSeconds;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = window.setTimeout(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [secondsRemaining]);

  const isCompleted = secondsRemaining === 0;
  const progressPct = Math.min(
    100,
    Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100)
  );

  const rewardLabel =
    rewardType === 'add_time'
      ? `+${ADD_TIME_SECONDS} Seconds Extra Time`
      : rewardType === 'add_moves'
        ? `+${ADD_MOVES_COUNT} Extra Moves`
        : '+1 Extra Empty Bottle';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020518]/90 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-modal-title"
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#131F66] to-[#080E38] border border-[#56C6FF]/45 p-6 shadow-[0_24px_64px_rgba(0,0,0,0.75)]">
        {/* Top Row: Ad Status & Close */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#A7EEFF]">
            <PlayCircle className="w-4 h-4 text-[#27D9FF]" />
            <span>Sponsored Reward</span>
          </div>

          {isCompleted ? (
            <span className="text-xs font-bold text-[#32C978] flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Reward Ready
            </span>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              aria-label="Cancel ad and forfeit reward"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-[#A7EEFF] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Skip</span>
            </button>
          )}
        </div>

        {/* Reward Preview Body */}
        <div className="mt-5 text-center">
          <div className="mx-auto mb-3 flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0B174D] border border-[#27D9FF]/40 text-[#27D9FF] shadow-[0_0_24px_rgba(39,217,255,0.28)]">
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8 text-[#32C978]" />
            ) : (
              <Clock className="w-7 h-7" />
            )}
          </div>

          <h2
            id="ad-modal-title"
            className="font-display text-lg font-bold text-[#F3F8FF]"
          >
            {AD_CONFIG.sponsorTitle}
          </h2>

          <p className="mt-1.5 text-xs text-[#A7EEFF]/75 leading-relaxed">
            {AD_CONFIG.sponsorSubtitle}
          </p>

          <div className="mt-4 py-2.5 px-3 rounded-xl bg-[#070D35] border border-[#27D9FF]/25 text-xs font-semibold text-[#FFD32F]">
            Unlocking: {rewardLabel}
          </div>
        </div>

        {/* Countdown Progress Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-[#A7EEFF]/80 mb-1.5">
            <span>{isCompleted ? 'Completed' : 'Please wait...'}</span>
            <span className="font-mono-nums font-bold text-[#F3F8FF]">
              {isCompleted ? '0s' : `${secondsRemaining}s`}
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#060B2C] overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#087BFF] to-[#27D9FF] transition-all duration-700 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Claim / Cancel Action */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            disabled={!isCompleted}
            onClick={onRewardCompleted}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-b from-[#33ADFF] via-[#087BFF] to-[#0552C7] border border-[#8EDBFF]/65 shadow-[0_8px_22px_rgba(8,123,255,0.45)] font-display text-sm font-bold text-[#F3F8FF] hover:brightness-110 active:scale-[0.98] disabled:opacity-45 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isCompleted
              ? `Claim ${rewardLabel}`
              : `Reward unlocks in ${secondsRemaining}s`}
          </button>

          {!isCompleted && (
            <p className="text-[11px] text-center text-[#A7EEFF]/55">
              Skipping early will not grant the reward.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
