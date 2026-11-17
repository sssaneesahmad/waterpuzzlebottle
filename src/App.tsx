import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AdSlot } from './components/AdSlot';
import { GameBoard } from './components/GameBoard';
import { GameControls } from './components/GameControls';
import { GameHeader } from './components/GameHeader';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LandingScreen } from './components/LandingScreen';
import { FailReason, LevelFailedModal } from './components/LevelFailedModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { ParticleBackground } from './components/ParticleBackground';
import { RewardedAdModal } from './components/RewardedAdModal';
import { RewardModal } from './components/RewardModal';
import { SettingsModal } from './components/SettingsModal';
import { WinModal } from './components/WinModal';
import {
  addExtraBottle,
  calculatePourAmount,
  checkWinCondition,
  findHintMove,
  generateLevel,
  getLevelMoveLimit,
  getLevelTimeLimit,
  isBottleCompleted,
  levelConfigToBottleStates,
  performPour,
  undoMove,
  validateMove,
} from './game/engine';
import {
  ADD_MOVES_COUNT,
  ADD_TIME_SECONDS,
  AdRewardType,
  BottleState,
  DAILY_REWARD_COINS,
  GameSettings,
  HINT_COST,
  LEVEL_REWARD_COINS,
  MoveRecord,
  PlayerProgress,
  PourAnimationState,
  STREAK_BONUS_COINS,
} from './game/types';
import { triggerRewardedAd } from './utils/adManager';
import { soundEngine, triggerVibration } from './utils/sound';
import {
  clearBoardState,
  DEFAULT_PROGRESS,
  getTodayDateString,
  loadBoardState,
  loadProgress,
  loadSettings,
  resetAllStorage,
  saveBoardState,
  saveProgress,
  saveSettings,
} from './utils/storage';

type ActiveModal = 'none' | 'settings' | 'howto' | 'rewards' | 'levels';

interface WinSummary {
  levelCompleted: number;
  moves: number;
  coinsEarned: number;
  streakBonus: number;
}

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => loadProgress());
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());

  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [winSummary, setWinSummary] = useState<WinSummary | null>(null);

  const [bottles, setBottles] = useState<BottleState[]>(() => {
    const saved = loadBoardState(progress.currentLevel);
    if (saved) return saved.bottles;
    return levelConfigToBottleStates(generateLevel(progress.currentLevel));
  });

  const [history, setHistory] = useState<MoveRecord[]>(() => {
    const saved = loadBoardState(progress.currentLevel);
    return saved ? saved.history : [];
  });

  const [moves, setMoves] = useState<number>(() => {
    const saved = loadBoardState(progress.currentLevel);
    return saved ? saved.moves : 0;
  });

  const [moveLimit, setMoveLimit] = useState<number>(() => {
    const saved = loadBoardState(progress.currentLevel);
    return saved ? saved.moveLimit : getLevelMoveLimit(progress.currentLevel);
  });

  const [movesLeft, setMovesLeft] = useState<number>(() => {
    const saved = loadBoardState(progress.currentLevel);
    return saved ? saved.movesLeft : getLevelMoveLimit(progress.currentLevel);
  });

  const [extraBottlesAdded, setExtraBottlesAdded] = useState<number>(() => {
    const saved = loadBoardState(progress.currentLevel);
    return saved ? saved.extraBottlesAdded : 0;
  });

  const [timeLimit, setTimeLimit] = useState<number>(() => {
    const saved = loadBoardState(progress.currentLevel);
    return saved ? saved.timeLimit : getLevelTimeLimit(progress.currentLevel);
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const saved = loadBoardState(progress.currentLevel);
    return saved ? saved.timeLeft : getLevelTimeLimit(progress.currentLevel);
  });

  const [failReason, setFailReason] = useState<FailReason | null>(() => {
    const saved = loadBoardState(progress.currentLevel);
    if (!saved) return null;
    if (saved.timeLeft === 0) return 'time_up';
    if (saved.movesLeft === 0) return 'out_of_moves';
    return null;
  });

  const [adExtensionsUsed, setAdExtensionsUsed] = useState<number>(0);
  const [activeAdReward, setActiveAdReward] = useState<AdRewardType | null>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [invalidShakeIndex, setInvalidShakeIndex] = useState<number | null>(null);
  const [hintMove, setHintMove] = useState<{
    fromIndex: number;
    toIndex: number;
  } | null>(null);
  const [pourAnim, setPourAnim] = useState<PourAnimationState | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const timersRef = useRef<number[]>([]);
  const toastTimerRef = useRef<number | null>(null);

  const clearAnimTimers = useCallback(() => {
    for (const id of timersRef.current) {
      window.clearTimeout(id);
    }
    timersRef.current = [];
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2600);
  }, []);

  // Sync audio preferences
  useEffect(() => {
    soundEngine.setSoundEnabled(settings.soundEnabled);
    soundEngine.setMusicEnabled(settings.musicEnabled);
    saveSettings(settings);
  }, [settings]);

  // Persist player progress
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Persist active board state (unless won)
  useEffect(() => {
    if (!winSummary) {
      saveBoardState({
        levelNumber: progress.currentLevel,
        bottles,
        history,
        moves,
        movesLeft,
        moveLimit,
        extraBottlesAdded,
        timeLeft,
        timeLimit,
      });
    }
  }, [
    progress.currentLevel,
    bottles,
    history,
    moves,
    movesLeft,
    moveLimit,
    extraBottlesAdded,
    timeLeft,
    timeLimit,
    winSummary,
  ]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearAnimTimers();
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
      soundEngine.stopAmbientMusic();
    };
  }, [clearAnimTimers]);

  // Per-level countdown timer (pauses on landing, modals, win, fail, or ad playback)
  const isTimerPaused =
    showLanding ||
    activeModal !== 'none' ||
    winSummary !== null ||
    failReason !== null ||
    activeAdReward !== null;

  useEffect(() => {
    if (isTimerPaused) return;

    if (timeLeft <= 0) {
      if (pourAnim === null) {
        soundEngine.playInvalid();
        setSelectedIndex(null);
        setFailReason('time_up');
      }
      return;
    }

    const tick = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(tick);
  }, [isTimerPaused, timeLeft, pourAnim]);

  const canClaimDaily = useMemo(() => {
    const today = getTodayDateString();
    return progress.lastDailyRewardDate !== today;
  }, [progress.lastDailyRewardDate]);

  const loadFreshLevel = useCallback(
    (levelNum: number) => {
      clearAnimTimers();
      setPourAnim(null);
      setSelectedIndex(null);
      setHintMove(null);
      setWinSummary(null);
      setFailReason(null);
      setAdExtensionsUsed(0);
      setActiveAdReward(null);

      const config = generateLevel(levelNum);
      const tLimit = getLevelTimeLimit(levelNum);
      const mLimit = getLevelMoveLimit(levelNum);
      setBottles(levelConfigToBottleStates(config));
      setHistory([]);
      setMoves(0);
      setMoveLimit(mLimit);
      setMovesLeft(mLimit);
      setExtraBottlesAdded(0);
      setTimeLimit(tLimit);
      setTimeLeft(tLimit);
    },
    [clearAnimTimers]
  );

  const grantAdReward = useCallback(
    (rewardType: AdRewardType) => {
      setActiveAdReward(null);
      if (rewardType === 'add_time') {
        soundEngine.playCoin();
        triggerVibration(settings.vibrationEnabled, [18, 28, 18]);
        setTimeLeft((prev) => prev + ADD_TIME_SECONDS);
        setFailReason(null);
        setAdExtensionsUsed((prev) => prev + 1);
        showToast(`+${ADD_TIME_SECONDS} seconds added!`);
      } else if (rewardType === 'add_moves') {
        soundEngine.playCoin();
        triggerVibration(settings.vibrationEnabled, [18, 28, 18]);
        setMovesLeft((prev) => prev + ADD_MOVES_COUNT);
        setFailReason(null);
        setAdExtensionsUsed((prev) => prev + 1);
        showToast(`+${ADD_MOVES_COUNT} extra moves added!`);
      } else if (rewardType === 'add_bottle') {
        soundEngine.playCoin();
        triggerVibration(settings.vibrationEnabled, 18);
        setSelectedIndex(null);
        setHintMove(null);
        setBottles((prev) => addExtraBottle(prev));
        setExtraBottlesAdded((prev) => prev + 1);
        showToast('Extra empty bottle added!');
      }
    },
    [settings.vibrationEnabled, showToast]
  );

  const startRewardedAdFlow = useCallback(
    (rewardType: AdRewardType) => {
      soundEngine.unlockAudio();
      soundEngine.playButtonClick();
      triggerRewardedAd({
        rewardType,
        onGranted: () => grantAdReward(rewardType),
        onDismissed: () => {
          setActiveAdReward(null);
          showToast('Ad skipped — reward not granted');
        },
        onFallbackPreview: () => {
          setActiveAdReward(rewardType);
        },
      });
    },
    [grantAdReward, showToast]
  );

  const handleSelectBottle = useCallback(
    (index: number) => {
      soundEngine.unlockAudio();
      if (
        pourAnim !== null ||
        winSummary !== null ||
        failReason !== null ||
        activeAdReward !== null ||
        movesLeft <= 0
      ) {
        return;
      }

      setHintMove(null);

      // Nothing selected yet -> pick source
      if (selectedIndex === null) {
        const target = bottles[index];
        if (!target || target.colors.length === 0) {
          soundEngine.playInvalid();
          setInvalidShakeIndex(index);
          const t = window.setTimeout(() => setInvalidShakeIndex(null), 340);
          timersRef.current.push(t);
          return;
        }
        soundEngine.playSelect();
        triggerVibration(settings.vibrationEnabled, 10);
        setSelectedIndex(index);
        return;
      }

      // Clicking the same bottle deselects it
      if (selectedIndex === index) {
        soundEngine.playDeselect();
        setSelectedIndex(null);
        return;
      }

      // Attempt pour from selectedIndex -> index
      if (!validateMove(bottles, selectedIndex, index)) {
        soundEngine.playInvalid();
        triggerVibration(settings.vibrationEnabled, [18, 28, 18]);
        setInvalidShakeIndex(index);
        setSelectedIndex(null);
        const t = window.setTimeout(() => setInvalidShakeIndex(null), 340);
        timersRef.current.push(t);
        return;
      }

      const amount = calculatePourAmount(bottles, selectedIndex, index);
      const poured = performPour(bottles, selectedIndex, index);
      if (!poured || amount <= 0) return;

      const fromIdx = selectedIndex;
      const toIdx = index;
      const color = poured.move.color;
      const nextMovesLeft = Math.max(0, movesLeft - 1);

      setSelectedIndex(null);
      setPourAnim({
        fromIndex: fromIdx,
        toIndex: toIdx,
        color,
        count: amount,
        phase: 'lifting',
      });

      const t1 = window.setTimeout(() => {
        setPourAnim((prev) => (prev ? { ...prev, phase: 'pouring' } : null));
        soundEngine.playPour(amount);
        triggerVibration(settings.vibrationEnabled, 16);
      }, 200);

      const t2 = window.setTimeout(() => {
        setBottles(poured.bottles);
        setHistory((prev) => [...prev, poured.move]);
        setMoves((prev) => prev + 1);
        setMovesLeft(nextMovesLeft);

        const destCompleted = isBottleCompleted(poured.bottles[toIdx]);
        if (destCompleted) {
          soundEngine.playBottleComplete();
        }
      }, 280);

      const t3 = window.setTimeout(() => {
        setPourAnim((prev) =>
          prev ? { ...prev, phase: 'returning' } : null
        );
      }, 460);

      const t4 = window.setTimeout(() => {
        setPourAnim(null);

        if (checkWinCondition(poured.bottles)) {
          const nextStreak = progress.streakCount + 1;
          const streakBonus = nextStreak % 3 === 0 ? STREAK_BONUS_COINS : 0;
          const earned = LEVEL_REWARD_COINS + streakBonus;
          const completedLvl = progress.currentLevel;
          const totalMovesForLevel = moves + 1;

          soundEngine.playWin();
          triggerVibration(settings.vibrationEnabled, [25, 40, 45]);
          clearBoardState();

          setProgress((prev) => ({
            ...prev,
            coins: prev.coins + earned,
            highestUnlockedLevel: Math.max(
              prev.highestUnlockedLevel,
              completedLvl + 1
            ),
            completedLevels: prev.completedLevels.includes(completedLvl)
              ? prev.completedLevels
              : [...prev.completedLevels, completedLvl],
            totalMoves: prev.totalMoves + totalMovesForLevel,
            streakCount: nextStreak,
          }));

          setWinSummary({
            levelCompleted: completedLvl,
            moves: totalMovesForLevel,
            coinsEarned: earned,
            streakBonus,
          });
          return;
        }

        if (nextMovesLeft <= 0) {
          soundEngine.playInvalid();
          setFailReason('out_of_moves');
        }
      }, 650);

      timersRef.current.push(t1, t2, t3, t4);
    },
    [
      activeAdReward,
      bottles,
      failReason,
      moves,
      movesLeft,
      pourAnim,
      progress.currentLevel,
      progress.streakCount,
      selectedIndex,
      settings.vibrationEnabled,
      winSummary,
    ]
  );

  const handleRestart = useCallback(() => {
    soundEngine.unlockAudio();
    if (pourAnim !== null) return;
    soundEngine.playButtonClick();
    triggerVibration(settings.vibrationEnabled, 12);
    loadFreshLevel(progress.currentLevel);
  }, [loadFreshLevel, pourAnim, progress.currentLevel, settings.vibrationEnabled]);

  const handleUndo = useCallback(() => {
    soundEngine.unlockAudio();
    if (pourAnim !== null || history.length === 0 || failReason !== null) return;
    const result = undoMove(bottles, history);
    if (!result) return;

    soundEngine.playButtonClick();
    triggerVibration(settings.vibrationEnabled, 10);
    setSelectedIndex(null);
    setHintMove(null);
    setBottles(result.bottles);
    setHistory(result.history);
    setMoves((m) => Math.max(0, m - 1));
    setMovesLeft((m) => m + 1);
  }, [bottles, failReason, history, pourAnim, settings.vibrationEnabled]);

  const handleAddBottle = useCallback(() => {
    if (
      pourAnim !== null ||
      extraBottlesAdded >= 2 ||
      failReason !== null ||
      activeAdReward !== null
    ) {
      return;
    }
    startRewardedAdFlow('add_bottle');
  }, [activeAdReward, extraBottlesAdded, failReason, pourAnim, startRewardedAdFlow]);

  const handleHint = useCallback(() => {
    soundEngine.unlockAudio();
    if (pourAnim !== null || winSummary !== null || failReason !== null) return;
    if (progress.coins < HINT_COST) {
      soundEngine.playInvalid();
      showToast(`Need ${HINT_COST} coins for a hint`);
      return;
    }

    const suggestion = findHintMove(bottles);
    if (!suggestion) {
      soundEngine.playInvalid();
      showToast('No moves available — try Undo or + Bottle');
      return;
    }

    soundEngine.playSelect();
    triggerVibration(settings.vibrationEnabled, 12);
    setSelectedIndex(null);
    setHintMove(suggestion);
    setProgress((prev) => ({
      ...prev,
      coins: prev.coins - HINT_COST,
    }));

    const t = window.setTimeout(() => setHintMove(null), 3500);
    timersRef.current.push(t);
  }, [
    bottles,
    failReason,
    pourAnim,
    progress.coins,
    settings.vibrationEnabled,
    showToast,
    winSummary,
  ]);

  const handleNextLevel = useCallback(() => {
    soundEngine.playButtonClick();
    const nextLvl = progress.currentLevel + 1;
    setProgress((prev) => ({
      ...prev,
      currentLevel: nextLvl,
      highestUnlockedLevel: Math.max(prev.highestUnlockedLevel, nextLvl),
    }));
    loadFreshLevel(nextLvl);
  }, [loadFreshLevel, progress.currentLevel]);

  const handleReplayFromWin = useCallback(() => {
    soundEngine.playButtonClick();
    loadFreshLevel(progress.currentLevel);
  }, [loadFreshLevel, progress.currentLevel]);

  const handleSelectLevel = useCallback(
    (levelNum: number) => {
      soundEngine.playButtonClick();
      setActiveModal('none');
      setProgress((prev) => ({
        ...prev,
        currentLevel: levelNum,
      }));
      loadFreshLevel(levelNum);
    },
    [loadFreshLevel]
  );

  const handleClaimDaily = useCallback(() => {
    if (!canClaimDaily) return;
    soundEngine.playCoin();
    triggerVibration(settings.vibrationEnabled, 20);
    const today = getTodayDateString();
    setProgress((prev) => ({
      ...prev,
      coins: prev.coins + DAILY_REWARD_COINS,
      lastDailyRewardDate: today,
    }));
    showToast(`Daily gift claimed: +${DAILY_REWARD_COINS} coins!`);
  }, [canClaimDaily, settings.vibrationEnabled, showToast]);

  const handleResetProgress = useCallback(() => {
    soundEngine.playButtonClick();
    resetAllStorage();
    setProgress({ ...DEFAULT_PROGRESS });
    setActiveModal('none');
    loadFreshLevel(1);
    showToast('Progress reset to Level 1');
  }, [loadFreshLevel, showToast]);

  // Desktop keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showLanding) {
        if (e.key === 'Enter' && activeModal === 'none') {
          setShowLanding(false);
        }
        return;
      }

      if (e.key === 'Escape') {
        if (activeModal !== 'none') {
          setActiveModal('none');
        } else if (selectedIndex !== null) {
          setSelectedIndex(null);
        }
        return;
      }

      if (
        activeModal !== 'none' ||
        winSummary !== null ||
        pourAnim !== null ||
        failReason !== null ||
        activeAdReward !== null
      ) {
        return;
      }

      if (e.key >= '1' && e.key <= '9') {
        const idx = Number(e.key) - 1;
        if (idx < bottles.length) handleSelectBottle(idx);
      } else if (e.key === '0') {
        if (9 < bottles.length) handleSelectBottle(9);
      } else if (e.key.toLowerCase() === 'r') {
        handleRestart();
      } else if (e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'u') {
        handleUndo();
      } else if (e.key.toLowerCase() === 'h') {
        handleHint();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    activeAdReward,
    activeModal,
    bottles.length,
    failReason,
    handleHint,
    handleRestart,
    handleSelectBottle,
    handleUndo,
    pourAnim,
    selectedIndex,
    showLanding,
    winSummary,
  ]);

  return (
    <div className="relative w-full h-[100dvh] flex flex-col overflow-hidden bg-[#050A2D] text-[#F3F8FF]">
      <ParticleBackground />

      {showLanding ? (
        <LandingScreen
          currentLevel={progress.currentLevel}
          coins={progress.coins}
          completedCount={progress.completedLevels.length}
          onPlay={() => {
            soundEngine.unlockAudio();
            soundEngine.playButtonClick();
            setShowLanding(false);
          }}
          onHowToPlay={() => {
            soundEngine.unlockAudio();
            soundEngine.playButtonClick();
            setActiveModal('howto');
          }}
        />
      ) : (
        <>
          <GameHeader
            levelNumber={progress.currentLevel}
            movesLeft={movesLeft}
            timeLeft={timeLeft}
            coins={progress.coins}
            canClaimDaily={canClaimDaily}
            onOpenSettings={() => {
              soundEngine.unlockAudio();
              soundEngine.playButtonClick();
              setActiveModal('settings');
            }}
            onOpenRewards={() => {
              soundEngine.unlockAudio();
              soundEngine.playButtonClick();
              setActiveModal('rewards');
            }}
            onOpenLevels={() => {
              soundEngine.unlockAudio();
              soundEngine.playButtonClick();
              setActiveModal('levels');
            }}
          />

          {/* Non-intrusive Transient Toast Feedback */}
          {toastMessage && (
            <div
              role="status"
              aria-live="polite"
              className="pointer-events-none fixed top-16 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-[#12226B]/95 border border-[#27D9FF]/50 shadow-[0_8px_24px_rgba(0,0,0,0.45)] text-xs sm:text-sm font-semibold text-[#F3F8FF] whitespace-nowrap"
            >
              {toastMessage}
            </div>
          )}

          <GameBoard
            bottles={bottles}
            selectedIndex={selectedIndex}
            invalidShakeIndex={invalidShakeIndex}
            hintMove={hintMove}
            pourAnim={pourAnim}
            colorblindSymbols={settings.colorblindSymbols}
            disabled={
              pourAnim !== null ||
              winSummary !== null ||
              failReason !== null ||
              activeAdReward !== null
            }
            onSelectBottle={handleSelectBottle}
          />

          <GameControls
            canUndo={history.length > 0}
            undoCount={history.length}
            canAddBottle={extraBottlesAdded < 2}
            extraBottlesAdded={extraBottlesAdded}
            coins={progress.coins}
            disabled={
              pourAnim !== null ||
              winSummary !== null ||
              failReason !== null ||
              activeAdReward !== null
            }
            onRestart={handleRestart}
            onUndo={handleUndo}
            onAddBottle={handleAddBottle}
            onHint={handleHint}
          />

          <AdSlot enabled={false} />
        </>
      )}

      {/* Time's Up or Out of Moves Modal (repeatable Watch Ad to continue or Restart) */}
      {failReason !== null && !winSummary && activeAdReward === null && (
        <LevelFailedModal
          reason={failReason}
          levelNumber={progress.currentLevel}
          movesUsed={moves}
          extensionsUsed={adExtensionsUsed}
          onWatchAdToContinue={() =>
            startRewardedAdFlow(
              failReason === 'time_up' ? 'add_time' : 'add_moves'
            )
          }
          onRestartLevel={handleRestart}
        />
      )}

      {/* Built-in Rewarded Ad Player Fallback */}
      {activeAdReward !== null && (
        <RewardedAdModal
          rewardType={activeAdReward}
          onRewardCompleted={() => grantAdReward(activeAdReward)}
          onCancel={() => {
            setActiveAdReward(null);
            showToast('Ad skipped — reward not granted');
          }}
        />
      )}

      {/* Win Celebration Modal */}
      {winSummary && (
        <WinModal
          levelCompleted={winSummary.levelCompleted}
          moves={winSummary.moves}
          coinsEarned={winSummary.coinsEarned}
          streakBonus={winSummary.streakBonus}
          onNextLevel={handleNextLevel}
          onReplay={handleReplayFromWin}
        />
      )}

      {/* Settings Modal */}
      {activeModal === 'settings' && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(next) => {
            soundEngine.playButtonClick();
            setSettings(next);
          }}
          onOpenHowToPlay={() => {
            soundEngine.playButtonClick();
            setActiveModal('howto');
          }}
          onResetProgress={handleResetProgress}
          onClose={() => {
            soundEngine.playButtonClick();
            setActiveModal('none');
          }}
        />
      )}

      {/* How To Play Modal */}
      {activeModal === 'howto' && (
        <HowToPlayModal
          onClose={() => {
            soundEngine.playButtonClick();
            setActiveModal('none');
          }}
        />
      )}

      {/* Rewards Modal */}
      {activeModal === 'rewards' && (
        <RewardModal
          coins={progress.coins}
          streakCount={progress.streakCount}
          canClaimDaily={canClaimDaily}
          onClaimDaily={handleClaimDaily}
          onClose={() => {
            soundEngine.playButtonClick();
            setActiveModal('none');
          }}
        />
      )}

      {/* Level Select Modal */}
      {activeModal === 'levels' && (
        <LevelSelectModal
          currentLevel={progress.currentLevel}
          highestUnlockedLevel={progress.highestUnlockedLevel}
          completedLevels={progress.completedLevels}
          onSelectLevel={handleSelectLevel}
          onClose={() => {
            soundEngine.playButtonClick();
            setActiveModal('none');
          }}
        />
      )}
    </div>
  );
}
