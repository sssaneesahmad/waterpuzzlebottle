import { COLOR_ORDER } from '../game/colors';
import { getLevelMoveLimit, getLevelTimeLimit } from '../game/engine';
import {
  BOTTLE_CAPACITY,
  BottleState,
  GameSettings,
  LiquidColorId,
  PlayerProgress,
  SavedBoardState,
  STARTING_COINS,
} from '../game/types';

const PROGRESS_KEY = 'aqua_alchemy_progress_v1';
const SETTINGS_KEY = 'aqua_alchemy_settings_v1';
const BOARD_KEY = 'aqua_alchemy_board_v1';

const VALID_COLORS = new Set<string>(COLOR_ORDER);

export const DEFAULT_PROGRESS: PlayerProgress = {
  currentLevel: 1,
  highestUnlockedLevel: 1,
  coins: STARTING_COINS,
  completedLevels: [],
  totalMoves: 0,
  lastDailyRewardDate: null,
  streakCount: 0,
};

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: false,
  vibrationEnabled: true,
  colorblindSymbols: false,
};

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore quota or private mode storage restrictions
  }
}

function safeRemoveItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

export function loadProgress(): PlayerProgress {
  const raw = safeGetItem(PROGRESS_KEY);
  if (!raw) return { ...DEFAULT_PROGRESS };

  try {
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    const currentLevel =
      typeof parsed.currentLevel === 'number' && parsed.currentLevel >= 1
        ? Math.floor(parsed.currentLevel)
        : 1;
    const highestUnlockedLevel =
      typeof parsed.highestUnlockedLevel === 'number' &&
      parsed.highestUnlockedLevel >= currentLevel
        ? Math.floor(parsed.highestUnlockedLevel)
        : currentLevel;
    const coins =
      typeof parsed.coins === 'number' && parsed.coins >= 0
        ? Math.floor(parsed.coins)
        : STARTING_COINS;
    const completedLevels = Array.isArray(parsed.completedLevels)
      ? parsed.completedLevels.filter(
          (n): n is number => typeof n === 'number' && n >= 1
        )
      : [];
    const totalMoves =
      typeof parsed.totalMoves === 'number' && parsed.totalMoves >= 0
        ? Math.floor(parsed.totalMoves)
        : 0;
    const lastDailyRewardDate =
      typeof parsed.lastDailyRewardDate === 'string'
        ? parsed.lastDailyRewardDate
        : null;
    const streakCount =
      typeof parsed.streakCount === 'number' && parsed.streakCount >= 0
        ? Math.floor(parsed.streakCount)
        : 0;

    return {
      currentLevel,
      highestUnlockedLevel,
      coins,
      completedLevels,
      totalMoves,
      lastDailyRewardDate,
      streakCount,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveProgress(progress: PlayerProgress): void {
  safeSetItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function loadSettings(): GameSettings {
  const raw = safeGetItem(SETTINGS_KEY);
  if (!raw) return { ...DEFAULT_SETTINGS };

  try {
    const parsed = JSON.parse(raw) as Partial<GameSettings>;
    return {
      soundEnabled:
        typeof parsed.soundEnabled === 'boolean'
          ? parsed.soundEnabled
          : DEFAULT_SETTINGS.soundEnabled,
      musicEnabled:
        typeof parsed.musicEnabled === 'boolean'
          ? parsed.musicEnabled
          : DEFAULT_SETTINGS.musicEnabled,
      vibrationEnabled:
        typeof parsed.vibrationEnabled === 'boolean'
          ? parsed.vibrationEnabled
          : DEFAULT_SETTINGS.vibrationEnabled,
      colorblindSymbols:
        typeof parsed.colorblindSymbols === 'boolean'
          ? parsed.colorblindSymbols
          : DEFAULT_SETTINGS.colorblindSymbols,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: GameSettings): void {
  safeSetItem(SETTINGS_KEY, JSON.stringify(settings));
}

function isValidBottle(b: unknown): b is BottleState {
  if (!b || typeof b !== 'object') return false;
  const candidate = b as Partial<BottleState>;
  if (typeof candidate.id !== 'string') return false;
  if (
    typeof candidate.capacity !== 'number' ||
    candidate.capacity !== BOTTLE_CAPACITY
  ) {
    return false;
  }
  if (!Array.isArray(candidate.colors)) return false;
  if (candidate.colors.length > candidate.capacity) return false;
  return candidate.colors.every(
    (c): c is LiquidColorId => typeof c === 'string' && VALID_COLORS.has(c)
  );
}

export function loadBoardState(expectedLevel: number): SavedBoardState | null {
  const raw = safeGetItem(BOARD_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<SavedBoardState>;
    if (parsed.levelNumber !== expectedLevel) return null;
    if (!Array.isArray(parsed.bottles) || parsed.bottles.length < 3) return null;
    if (!parsed.bottles.every(isValidBottle)) return null;

    const history = Array.isArray(parsed.history)
      ? parsed.history.filter(
          (m) =>
            m &&
            typeof m.fromIndex === 'number' &&
            typeof m.toIndex === 'number' &&
            typeof m.count === 'number' &&
            typeof m.color === 'string' &&
            VALID_COLORS.has(m.color)
        )
      : [];

    const defaultLimit = getLevelTimeLimit(expectedLevel);
    const timeLimit =
      typeof parsed.timeLimit === 'number' && parsed.timeLimit > 0
        ? Math.min(parsed.timeLimit, defaultLimit + 180)
        : defaultLimit;
    const timeLeft =
      typeof parsed.timeLeft === 'number' && parsed.timeLeft >= 0
        ? Math.min(parsed.timeLeft, defaultLimit)
        : defaultLimit;

    const defaultMoveLimit = getLevelMoveLimit(expectedLevel);
    const moveLimit =
      typeof parsed.moveLimit === 'number' && parsed.moveLimit > 0
        ? parsed.moveLimit
        : defaultMoveLimit;
    const movesUsed =
      typeof parsed.moves === 'number' && parsed.moves >= 0 ? parsed.moves : 0;
    const movesLeft =
      typeof parsed.movesLeft === 'number' && parsed.movesLeft >= 0
        ? parsed.movesLeft
        : Math.max(0, moveLimit - movesUsed);

    return {
      levelNumber: expectedLevel,
      bottles: parsed.bottles,
      history,
      moves: movesUsed,
      movesLeft,
      moveLimit,
      extraBottlesAdded:
        typeof parsed.extraBottlesAdded === 'number' && parsed.extraBottlesAdded >= 0
          ? parsed.extraBottlesAdded
          : 0,
      timeLeft,
      timeLimit,
    };
  } catch {
    return null;
  }
}

export function saveBoardState(board: SavedBoardState): void {
  safeSetItem(BOARD_KEY, JSON.stringify(board));
}

export function clearBoardState(): void {
  safeRemoveItem(BOARD_KEY);
}

export function resetAllStorage(): void {
  safeRemoveItem(PROGRESS_KEY);
  safeRemoveItem(BOARD_KEY);
}

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
