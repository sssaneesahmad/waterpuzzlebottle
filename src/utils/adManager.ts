import { AdRewardType } from '../game/types';

export type AdProviderMode = 'adsense_h5' | 'custom_sdk' | 'built_in_preview';

export interface AdManagerConfig {
  /**
   * 'adsense_h5'  -> Uses Google AdSense H5 Games Ads (window.adBreak) when script is in index.html.
   *                  Automatically falls back to 'built_in_preview' if adBreak is not loaded or blocked.
   * 'custom_sdk'  -> Calls AD_CONFIG.onCustomRewardedAd if you integrate Monetag, AdinPlay, Poki, etc.
   * 'built_in_preview' -> Uses the built-in 5-second RewardedAdModal preview.
   */
  provider: AdProviderMode;
  previewDurationSeconds: number;
  /** Optional custom sponsor card shown inside the built-in rewarded ad slot */
  sponsorTitle?: string;
  sponsorSubtitle?: string;
  sponsorUrl?: string;
}

export const AD_CONFIG: AdManagerConfig = {
  provider: 'adsense_h5',
  previewDurationSeconds: 5,
  sponsorTitle: 'Aqua Alchemy — Bonus Reward Slot',
  sponsorSubtitle:
    'Connect Google AdSense H5 Games Ads (adBreak) or your ad network in index.html & src/utils/adManager.ts.',
};

interface AdBreakPlacement {
  type: 'reward';
  name: string;
  beforeAd?: () => void;
  afterAd?: () => void;
  beforeReward?: (showAdFn: () => void) => void;
  adDismissed?: () => void;
  adViewed?: () => void;
  adBreakDone?: (placementInfo: { breakStatus: string }) => void;
}

declare global {
  interface Window {
    adBreak?: (placement: AdBreakPlacement) => void;
    adConfig?: (config: { sound?: 'on' | 'off'; preloadAdBreaks?: 'on' | 'off' }) => void;
  }
}

export interface RewardedAdCallbacks {
  rewardType: AdRewardType;
  onGranted: () => void;
  onDismissed: () => void;
  onFallbackPreview: () => void;
}

/**
 * Triggers a live rewarded ad via the configured ad network SDK if present,
 * otherwise invokes `onFallbackPreview()` to open the built-in RewardedAdModal.
 */
export function triggerRewardedAd({
  rewardType,
  onGranted,
  onDismissed,
  onFallbackPreview,
}: RewardedAdCallbacks): void {
  if (
    AD_CONFIG.provider === 'adsense_h5' &&
    typeof window !== 'undefined' &&
    typeof window.adBreak === 'function'
  ) {
    let handled = false;

    try {
      const placementName =
        rewardType === 'add_time'
          ? 'extra_time_20s'
          : rewardType === 'add_moves'
            ? 'extra_moves_5'
            : 'extra_bottle';
      window.adBreak({
        type: 'reward',
        name: placementName,
        beforeReward: (showAdFn) => {
          handled = true;
          showAdFn();
        },
        adViewed: () => {
          onGranted();
        },
        adDismissed: () => {
          onDismissed();
        },
        adBreakDone: (info) => {
          if (!handled && info.breakStatus !== 'viewed') {
            onFallbackPreview();
          }
        },
      });
      return;
    } catch {
      onFallbackPreview();
      return;
    }
  }

  onFallbackPreview();
}
