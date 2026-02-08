import {
  GRID_SIZE,
  createInitialState,
  queueDirection,
  tick,
  togglePause,
} from './snakeLogic.js';

const boardEl = document.querySelector('#board');
const scoreEl = document.querySelector('#score');
const statusEl = document.querySelector('#status');
const restartEl = document.querySelector('#restart');
const controlButtons = document.querySelectorAll('[data-dir]');

const TICK_MS = 140;
let state = createInitialState();
let timerId;

setupBoard(boardEl, GRID_SIZE);
render();
startLoop();

window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const keyToDirection = {
    arrowup: 'up',
    w: 'up',
    arrowdown: 'down',
    s: 'down',
    arrowleft: 'left',
    a: 'left',
    arrowright: 'right',
    d: 'right',
  };

  if (keyToDirection[key]) {
    event.preventDefault();
    state = queueDirection(state, keyToDirection[key]);
    return;
  }

  if (key === ' ') {
    event.preventDefault();
    state = togglePause(state);
    render();
    return;
  }

  if (key === 'r') {
    event.preventDefault();
    restartGame();
  }
});

controlButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state = queueDirection(state, button.dataset.dir);
  });
});

restartEl.addEventListener('click', restartGame);

function startLoop() {
  clearInterval(timerId);
  timerId = setInterval(() => {
    state = tick(state);
    render();
  }, TICK_MS);
}

function restartGame() {
  state = createInitialState();
  render();
}

function render() {
  const cells = boardEl.children;
  for (let i = 0; i < cells.length; i += 1) {
    cells[i].className = 'cell';
  }

  state.snake.forEach(({ x, y }) => {
    const idx = y * state.size + x;
    cells[idx]?.classList.add('snake');
  });

  if (state.food.x >= 0 && state.food.y >= 0) {
    const foodIdx = state.food.y * state.size + state.food.x;
    cells[foodIdx]?.classList.add('food');
  }

  scoreEl.textContent = String(state.score);

  if (state.isGameOver) {
    statusEl.textContent = 'Game Over';
  } else if (state.isPaused) {
    statusEl.textContent = 'Paused';
  } else {
    statusEl.textContent = 'Running';
  }
}

function setupBoard(container, size) {
  for (let i = 0; i < size * size; i += 1) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    container.appendChild(cell);
  }
}
