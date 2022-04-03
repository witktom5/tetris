//create empty board///////////
const disabledBtns = document.querySelectorAll('.toggle-disabled');

const gridContainer = document.querySelector('.grid-container');
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 20; j++) {
    const newBlock = document.createElement('div');
    newBlock.setAttribute('data-row', j + 1);
    newBlock.classList.add('block');
    gridContainer.appendChild(newBlock);
    if (i % 2 === 0) newBlock.classList.add('evenColumn');
  }
}
function makeBottomGameBorder() {
  const blocks = document.querySelectorAll('.block');
  for (let i = 19; i < 200; i += 20) {
    blocks[i].classList.add('bottom-block');
  }
}
makeBottomGameBorder();

const b = document.querySelectorAll('.block');
const baseSpawningPoint = [
  b[60],
  b[61],
  b[62],
  b[63],
  b[80],
  b[81],
  b[82],
  b[83],
  b[100],
  b[101],
  b[102],
  b[103],
  b[120],
  b[121],
  b[122],
  b[123],
];

function controls(e) {
  switch (e.key) {
    case ' ':
      if (!e.repeat) hardDropDown();
      break;
    case 'Up':
    case 'ArrowUp':
    case 'w':
      rotatePiece();
      break;
    case 'Down':
    case 'ArrowDown':
    case 's':
      moveDown();
      break;
    case 'Left':
    case 'ArrowLeft':
    case 'a':
      moveLeft();
      break;
    case 'Right':
    case 'ArrowRight':
    case 'd':
      moveRight();
      break;
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    e.preventDefault();
  }
});

//initialize
const scoreDisplay = document.querySelector('.score-display');
const levelDisplay = document.querySelector('.level-display');
const baseGameSpeed = 1050;

let gameSpeed;
let gameFlowInterval;
let hardDropInterval;
let spawningPoint;
let piecePosition;
let spawnedShape;
let spawnedPiece;
let level;
let linesCleared;
let isGameOver;
let score;
let isHardDropDown;
let paused = false;
let firstGame = true;
let windowPause;

disabledBtns.forEach((btn) => (btn.disabled = true));
