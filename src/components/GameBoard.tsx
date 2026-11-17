import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BottleState, PourAnimationState } from '../game/types';
import { Bottle, BottlePourTransform } from './Bottle';
import { CentralArtwork } from './CentralArtwork';
import { PourStream, PourStreamGeometry } from './PourStream';

interface GameBoardProps {
  bottles: BottleState[];
  selectedIndex: number | null;
  invalidShakeIndex: number | null;
  hintMove: { fromIndex: number; toIndex: number } | null;
  pourAnim: PourAnimationState | null;
  colorblindSymbols: boolean;
  disabled: boolean;
  onSelectBottle: (index: number) => void;
}

interface BoardDimensions {
  width: number;
  height: number;
}

const BOTTLE_ASPECT = 92 / 224; // ~0.4107

function splitIntoRows(count: number, numRows: number): number[] {
  const base = Math.floor(count / numRows);
  const remainder = count % numRows;
  const rows: number[] = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(base + (i < remainder ? 1 : 0));
  }
  return rows;
}

interface ComputedLayout {
  rows: number[];
  bottleWidth: number;
  bottleHeight: number;
  colGap: number;
  rowGap: number;
}

function computeAdaptiveLayout(
  count: number,
  boardWidth: number,
  boardHeight: number
): ComputedLayout {
  const safeCount = Math.max(1, count);
  const padX = boardWidth < 400 ? 12 : boardWidth < 768 ? 20 : 32;
  const padY = boardHeight < 420 ? 28 : 44;

  const usableW = Math.max(240, Math.min(1080, boardWidth - padX));
  const usableH = Math.max(180, boardHeight - padY);

  // Build candidate row counts depending on total bottles
  const rowCountsToTry: number[] = [2];
  if (safeCount <= 8) {
    rowCountsToTry.unshift(1);
  }
  if (safeCount >= 9) {
    rowCountsToTry.push(3);
  }

  // Max bottle cap scales down gently as bottle count rises so high levels feel proportional
  const viewportCap =
    boardWidth >= 1024 ? 94 : boardWidth >= 768 ? 82 : boardWidth >= 430 ? 72 : 66;
  const densityScale =
    safeCount >= 12 ? 0.84 : safeCount >= 10 ? 0.89 : safeCount >= 8 ? 0.94 : 1;
  const maxBottleCap = Math.round(viewportCap * densityScale);

  let bestLayout: ComputedLayout | null = null;
  let bestScore = -Infinity;

  for (const numRows of rowCountsToTry) {
    const rows = splitIntoRows(safeCount, numRows);
    const maxCols = Math.max(...rows);

    const colGap =
      usableW < 380
        ? maxCols >= 6
          ? 6
          : 9
        : usableW < 680
          ? maxCols >= 6
            ? 10
            : 14
          : maxCols >= 6
            ? 16
            : 22;

    const rowGap =
      numRows === 1 ? 0 : usableH < 360 ? 10 : usableH < 520 ? 16 : 24;

    const maxW = Math.floor((usableW - colGap * (maxCols - 1)) / maxCols);
    const maxH = Math.floor((usableH - rowGap * (numRows - 1)) / numRows);
    const wByH = Math.floor(maxH * BOTTLE_ASPECT);

    const bottleWidth = Math.max(32, Math.min(maxBottleCap, maxW, wByH));
    const bottleHeight = Math.round(bottleWidth / BOTTLE_ASPECT);

    const totalW = bottleWidth * maxCols + colGap * (maxCols - 1);
    const totalH = bottleHeight * numRows + rowGap * (numRows - 1);

    const fitsCleanly = totalW <= usableW + 1 && totalH <= usableH + 1;

    // Score favors largest comfortable bottle size, with slight preference for 1-2 balanced rows when bottles remain readable
    let score = bottleWidth;
    if (!fitsCleanly) score -= 500;
    if (numRows === 1 && safeCount <= 6 && bottleWidth >= 60) score += 5;
    if (numRows === 2 && bottleWidth >= 46) score += 4;

    if (score > bestScore) {
      bestScore = score;
      bestLayout = {
        rows,
        bottleWidth,
        bottleHeight,
        colGap,
        rowGap,
      };
    }
  }

  return (
    bestLayout ?? {
      rows: [safeCount],
      bottleWidth: 48,
      bottleHeight: 117,
      colGap: 10,
      rowGap: 14,
    }
  );
}

export const GameBoard: React.FC<GameBoardProps> = ({
  bottles,
  selectedIndex,
  invalidShakeIndex,
  hintMove,
  pourAnim,
  colorblindSymbols,
  disabled,
  onSelectBottle,
}) => {
  const boardRef = useRef<HTMLElement | null>(null);
  const bottleRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [boardSize, setBoardSize] = useState<BoardDimensions>(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height:
      typeof window !== 'undefined'
        ? Math.max(260, window.innerHeight - 210)
        : 540,
  }));
  const [pourTransform, setPourTransform] = useState<BottlePourTransform | null>(
    null
  );
  const [streamGeometry, setStreamGeometry] =
    useState<PourStreamGeometry | null>(null);

  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setBoardSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateSize);
      observer.observe(el);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const layout = useMemo(
    () =>
      computeAdaptiveLayout(bottles.length, boardSize.width, boardSize.height),
    [bottles.length, boardSize.width, boardSize.height]
  );

  // Calculate exact screen coordinates for the animated pour trajectory
  useEffect(() => {
    if (!pourAnim) {
      setPourTransform(null);
      setStreamGeometry(null);
      return;
    }

    const fromEl = bottleRefs.current[pourAnim.fromIndex];
    const toEl = bottleRefs.current[pourAnim.toIndex];
    if (!fromEl || !toEl) return;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const fromCenterX = fromRect.left + fromRect.width / 2;
    const toCenterX = toRect.left + toRect.width / 2;

    const pourRight = toCenterX >= fromCenterX;
    const tiltDeg = pourRight ? 52 : -52;

    const mouthOffsetX = pourRight
      ? -toRect.width * 0.58
      : toRect.width * 0.58;
    const targetX = toCenterX + mouthOffsetX;
    const targetY = toRect.top - fromRect.height * 0.22;

    const tx = targetX - fromCenterX;
    const ty = targetY - fromRect.top;

    if (pourAnim.phase === 'lifting') {
      setPourTransform({ tx, ty, rotate: tiltDeg });
      setStreamGeometry(null);
    } else if (pourAnim.phase === 'pouring') {
      setPourTransform({ tx, ty, rotate: tiltDeg });

      const mouthX = toCenterX + (pourRight ? -6 : 6);
      const mouthY = toRect.top - 10;

      const destBottle = bottles[pourAnim.toIndex];
      const fillRatio = Math.min(
        1,
        (destBottle ? destBottle.colors.length : 1) / 4
      );
      const destBottomY = toRect.bottom - 14;
      const destTopLiquidY =
        destBottomY - fillRatio * (toRect.height * 0.58);

      setStreamGeometry({
        startX: mouthX,
        startY: mouthY,
        endX: toCenterX,
        endY: destTopLiquidY,
        color: pourAnim.color,
      });
    } else if (pourAnim.phase === 'returning') {
      setStreamGeometry(null);
      setPourTransform(null);
    }
  }, [pourAnim, bottles]);

  const rowSlices = useMemo(() => {
    const slices: { bottle: BottleState; globalIndex: number }[][] = [];
    let cursor = 0;
    for (const rowLen of layout.rows) {
      const slice: { bottle: BottleState; globalIndex: number }[] = [];
      for (let i = 0; i < rowLen && cursor < bottles.length; i++) {
        slice.push({ bottle: bottles[cursor], globalIndex: cursor });
        cursor++;
      }
      slices.push(slice);
    }
    return slices;
  }, [bottles, layout.rows]);

  return (
    <main
      ref={boardRef}
      className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-2 sm:px-4 py-2 overflow-visible min-h-0"
    >
      {/* Decorative Fantasy Lotus Centerpiece Behind Bottles */}
      <CentralArtwork />

      {/* Balanced Responsive Bottle Rows */}
      <div
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl"
        style={{ gap: `${layout.rowGap}px` }}
      >
        {rowSlices.map((row, rIdx) => (
          <div
            key={`row-${rIdx}`}
            className="flex items-end justify-center"
            style={{ gap: `${layout.colGap}px` }}
          >
            {row.map(({ bottle, globalIndex }) => {
              const isSource = pourAnim?.fromIndex === globalIndex;
              const hintRole =
                hintMove?.fromIndex === globalIndex
                  ? 'source'
                  : hintMove?.toIndex === globalIndex
                    ? 'dest'
                    : null;

              return (
                <Bottle
                  key={bottle.id}
                  bottle={bottle}
                  index={globalIndex}
                  width={layout.bottleWidth}
                  height={layout.bottleHeight}
                  selected={selectedIndex === globalIndex}
                  isInvalidShake={invalidShakeIndex === globalIndex}
                  hintRole={hintRole}
                  pourTransform={isSource ? pourTransform : null}
                  colorblindSymbols={colorblindSymbols}
                  disabled={disabled}
                  onSelect={onSelectBottle}
                  bottleRef={(el) => {
                    bottleRefs.current[globalIndex] = el;
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Liquid Pouring Stream Overlay */}
      <PourStream stream={streamGeometry} />
    </main>
  );
};
