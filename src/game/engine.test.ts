import assert from 'node:assert/strict';
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
  solvePuzzle,
  undoMove,
  validateMove,
} from './engine';
import { BottleState, BOTTLE_CAPACITY } from './types';

function makeBottle(id: string, colors: BottleState['colors']): BottleState {
  return { id, colors, capacity: BOTTLE_CAPACITY };
}

// 1. Valid and invalid moves
{
  const bottles = [
    makeBottle('1', ['cyan', 'pink', 'pink']),
    makeBottle('2', ['yellow', 'pink']),
    makeBottle('3', []),
    makeBottle('4', ['cyan', 'cyan', 'cyan', 'cyan']),
  ];

  // Valid pour onto matching top color (2 units fit)
  assert.equal(validateMove(bottles, 0, 1), true);
  assert.equal(calculatePourAmount(bottles, 0, 1), 2);

  // Valid pour into empty bottle
  assert.equal(validateMove(bottles, 0, 2), true);
  assert.equal(calculatePourAmount(bottles, 0, 2), 2);

  // Invalid pour into full bottle
  assert.equal(validateMove(bottles, 0, 3), false);

  // Invalid pour onto mismatched color
  assert.equal(validateMove(bottles, 1, 0), true); // wait: top of 1 is pink, top of 0 is pink!
  assert.equal(validateMove(bottles, 3, 0), false); // cyan onto pink -> invalid

  // Invalid pour from empty bottle
  assert.equal(validateMove(bottles, 2, 0), false);

  // Invalid self-pour
  assert.equal(validateMove(bottles, 0, 0), false);
}

// 2. Partial capacity pouring (source has 3 matching, dest has 1 free slot)
{
  const bottles = [
    makeBottle('1', ['red', 'cyan', 'cyan', 'cyan']),
    makeBottle('2', ['orange', 'orange', 'cyan']),
  ];
  assert.equal(calculatePourAmount(bottles, 0, 1), 1);
  const res = performPour(bottles, 0, 1);
  assert.ok(res);
  assert.deepEqual(res.bottles[0].colors, ['red', 'cyan', 'cyan']);
  assert.deepEqual(res.bottles[1].colors, ['orange', 'orange', 'cyan', 'cyan']);
}

// 3. Undo move restores exact previous state
{
  const bottles = [
    makeBottle('1', ['red', 'cyan', 'cyan']),
    makeBottle('2', []),
  ];
  const res = performPour(bottles, 0, 1);
  assert.ok(res);
  assert.deepEqual(res.bottles[0].colors, ['red']);
  assert.deepEqual(res.bottles[1].colors, ['cyan', 'cyan']);

  const undone = undoMove(res.bottles, [res.move]);
  assert.ok(undone);
  assert.deepEqual(undone.bottles[0].colors, ['red', 'cyan', 'cyan']);
  assert.deepEqual(undone.bottles[1].colors, []);
  assert.equal(undone.history.length, 0);
}

// 4. Win detection and completed bottle detection
{
  const incomplete = [
    makeBottle('1', ['cyan', 'cyan', 'cyan', 'cyan']),
    makeBottle('2', ['pink', 'pink']),
    makeBottle('3', ['pink', 'pink']),
  ];
  assert.equal(isBottleCompleted(incomplete[0]), true);
  assert.equal(isBottleCompleted(incomplete[1]), false);
  assert.equal(checkWinCondition(incomplete), false);

  const complete = [
    makeBottle('1', ['cyan', 'cyan', 'cyan', 'cyan']),
    makeBottle('2', ['pink', 'pink', 'pink', 'pink']),
    makeBottle('3', []),
  ];
  assert.equal(checkWinCondition(complete), true);
}

// 5. Add extra bottle
{
  const bottles = [makeBottle('1', ['cyan', 'cyan', 'cyan', 'cyan'])];
  const extended = addExtraBottle(bottles);
  assert.equal(extended.length, 2);
  assert.deepEqual(extended[1].colors, []);
  assert.equal(extended[1].isExtra, true);
}

// 6. Level generation & solvability verification across levels 1..35
{
  for (let lvl = 1; lvl <= 35; lvl++) {
    const config = generateLevel(lvl);
    const states = levelConfigToBottleStates(config);

    // Check total counts of each color == 4
    const counts = new Map<string, number>();
    for (const b of states) {
      for (const c of b.colors) {
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
    }
    assert.equal(counts.size, config.colorCount, `Level ${lvl} color count mismatch`);
    for (const [color, count] of counts.entries()) {
      assert.equal(count, BOTTLE_CAPACITY, `Level ${lvl} color ${color} count ${count} != 4`);
    }

    assert.equal(checkWinCondition(states), false, `Level ${lvl} started already solved`);

    const solved = solvePuzzle(states, 12000);
    assert.equal(solved.solvable, true, `Level ${lvl} was not solvable!`);
    assert.ok(
      solved.solutionDepth <= getLevelMoveLimit(lvl),
      `Level ${lvl} took ${solved.solutionDepth} moves, exceeding limit ${getLevelMoveLimit(lvl)}`
    );

    const hint = findHintMove(states);
    assert.ok(hint, `Level ${lvl} should produce a valid hint`);
  }
}

// 7. Complexity-based timer and move-limit scaling
{
  assert.equal(getLevelTimeLimit(1), 25);
  assert.equal(getLevelTimeLimit(2), 35);
  assert.equal(getLevelTimeLimit(4), 45);
  assert.equal(getLevelTimeLimit(5), 60);
  assert.ok(getLevelTimeLimit(35) > getLevelTimeLimit(10));
  assert.ok(getLevelTimeLimit(10) > getLevelTimeLimit(1));

  assert.equal(getLevelMoveLimit(1), 12);
  assert.equal(getLevelMoveLimit(2), 18);
  assert.equal(getLevelMoveLimit(4), 24);
  assert.equal(getLevelMoveLimit(5), 30);
  assert.ok(getLevelMoveLimit(35) > getLevelMoveLimit(10));
}

console.log('ALL_WATER_SORT_ENGINE_TESTS_PASSED');
