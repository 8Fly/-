export const GRID_SIZE = 20;

export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

export const OPPOSITES = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function createInitialState(size = GRID_SIZE, randomFn = Math.random) {
  const center = Math.floor(size / 2);
  const snake = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];

  return {
    size,
    snake,
    direction: 'right',
    queuedDirection: 'right',
    food: spawnFood(size, snake, randomFn),
    score: 0,
    isGameOver: false,
    isPaused: false,
  };
}

export function queueDirection(state, nextDirection) {
  if (!DIRECTIONS[nextDirection]) return state;
  if (OPPOSITES[state.direction] === nextDirection) return state;
  return { ...state, queuedDirection: nextDirection };
}

export function togglePause(state) {
  if (state.isGameOver) return state;
  return { ...state, isPaused: !state.isPaused };
}

export function tick(state, randomFn = Math.random) {
  if (state.isGameOver || state.isPaused) return state;

  const direction = state.queuedDirection;
  const move = DIRECTIONS[direction];
  const nextHead = {
    x: state.snake[0].x + move.x,
    y: state.snake[0].y + move.y,
  };

  if (!isInside(state.size, nextHead)) {
    return { ...state, direction, isGameOver: true };
  }

  const willEat = samePos(nextHead, state.food);
  const nextSnake = [nextHead, ...state.snake];
  if (!willEat) nextSnake.pop();

  const bodyWithoutHead = nextSnake.slice(1);
  if (bodyWithoutHead.some((segment) => samePos(segment, nextHead))) {
    return { ...state, direction, isGameOver: true };
  }

  const nextState = {
    ...state,
    direction,
    snake: nextSnake,
    score: state.score + (willEat ? 1 : 0),
  };

  if (!willEat) return nextState;

  return {
    ...nextState,
    food: spawnFood(state.size, nextSnake, randomFn),
  };
}

export function spawnFood(size, snake, randomFn = Math.random) {
  const occupied = new Set(snake.map((seg) => `${seg.x},${seg.y}`));
  const empty = [];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const key = `${x},${y}`;
      if (!occupied.has(key)) empty.push({ x, y });
    }
  }

  if (empty.length === 0) {
    return { x: -1, y: -1 };
  }

  const idx = Math.floor(randomFn() * empty.length);
  return empty[Math.min(idx, empty.length - 1)];
}

function isInside(size, pos) {
  return pos.x >= 0 && pos.y >= 0 && pos.x < size && pos.y < size;
}

function samePos(a, b) {
  return a.x === b.x && a.y === b.y;
}
