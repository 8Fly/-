import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, queueDirection, tick, spawnFood } from '../src/snakeLogic.js';

function fixedRandom(value) {
  return () => value;
}

test('moves one step in current direction', () => {
  const state = createInitialState(10, fixedRandom(0));
  const next = tick(state, fixedRandom(0));

  assert.deepEqual(next.snake[0], { x: 6, y: 5 });
  assert.equal(next.score, 0);
  assert.equal(next.isGameOver, false);
});

test('cannot reverse direction instantly', () => {
  const state = createInitialState(10, fixedRandom(0));
  const queued = queueDirection(state, 'left');
  const next = tick(queued, fixedRandom(0));

  assert.equal(next.direction, 'right');
  assert.deepEqual(next.snake[0], { x: 6, y: 5 });
});

test('grows and scores when eating food', () => {
  const state = {
    size: 8,
    snake: [
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
    ],
    direction: 'right',
    queuedDirection: 'right',
    food: { x: 4, y: 3 },
    score: 0,
    isGameOver: false,
    isPaused: false,
  };

  const next = tick(state, fixedRandom(0));

  assert.equal(next.snake.length, 4);
  assert.equal(next.score, 1);
  assert.deepEqual(next.snake[0], { x: 4, y: 3 });
  assert.notDeepEqual(next.food, { x: 4, y: 3 });
});

test('sets game over on wall collision', () => {
  const state = {
    size: 5,
    snake: [{ x: 4, y: 0 }],
    direction: 'right',
    queuedDirection: 'right',
    food: { x: 0, y: 0 },
    score: 0,
    isGameOver: false,
    isPaused: false,
  };

  const next = tick(state, fixedRandom(0));
  assert.equal(next.isGameOver, true);
});

test('spawnFood picks an empty cell only', () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
  ];

  const food = spawnFood(2, snake, fixedRandom(0));
  assert.deepEqual(food, { x: 1, y: 1 });
});
