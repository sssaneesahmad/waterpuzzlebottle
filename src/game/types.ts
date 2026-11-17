export type LiquidColorId =
  | 'cyan'
  | 'royal'
  | 'purple'
  | 'magenta'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'lime'
  | 'emerald';

export interface LiquidColorDef {
  id: LiquidColorId;
  name: string;
  symbol: string;
  topHex: string;
  midHex: string;
  bottomHex: string;
  meniscusHex: string;
  glowHex: string;
}

export interface BottleState {
  id: string;
  colors: LiquidColorId[]; // Bottom to top (index 0 is bottom)
  capacity: number;
  isExtra?: boolean;
}

export interface MoveRecord {
  fromIndex: number;
  toIndex: number;
  color: LiquidColorId;
  count: number;
}

export interface PourAnimationState {
  fromIndex: number;
  toIndex: number;
  color: LiquidColorId;
  count: number;
  phase: 'lifting' | 'pouring' | 'returning';
}

export interface LevelConfig {
  levelNumber: number;
  colorCount: number;
  emptyCount: number;
  bottles: LiquidColorId[][];
  seed: number;
}

export interface PlayerProgress {
  currentLevel: number;
  highestUnlockedLevel: number;
  coins: number;
  completedLevels: number[];
  totalMoves: number;
  lastDailyRewardDate: string | null;
  streakCount: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  vibrationEnabled: boolean;
  colorblindSymbols: boolean;
}

export interface SavedBoardState {
  levelNumber: number;
  bottles: BottleState[];
  history: MoveRecord[];
  moves: number;
  movesLeft: number;
  moveLimit: number;
  extraBottlesAdded: number;
  timeLeft: number;
  timeLimit: number;
}

export type AdRewardType = 'add_time' | 'add_moves' | 'add_bottle';

export const BOTTLE_CAPACITY = 4;
export const EXTRA_BOTTLE_COST = 20;
export const HINT_COST = 15;
export const LEVEL_REWARD_COINS = 10;
export const STREAK_BONUS_COINS = 5;
export const DAILY_REWARD_COINS = 25;
export const STARTING_COINS = 40;
export const ADD_TIME_SECONDS = 20;
export const ADD_MOVES_COUNT = 5;
