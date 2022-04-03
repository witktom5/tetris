const pauseBtn = document.querySelector('#pause');
const upBtn = document.querySelector('#up');
const downBtn = document.querySelector('#down');
const dropBtn = document.querySelector('#drop');
const leftBtn = document.querySelector('#left');
const rightBtn = document.querySelector('#right');
const startBtn = document.querySelector('#start');
const dialogPause = document.querySelector('.dialog-pause');

pauseBtn.addEventListener('click', (e) => {
  if (isGameOver) return;
  dialogPause.classList.toggle('hidden');
  if (!paused) {
    return pause();
  }
  unpause();
  e.target.blur();
});

upBtn.addEventListener('click', (e) => {
  if (isGameOver || paused) return;
  rotatePiece();
  e.target.blur();
});

leftBtn.addEventListener('click', (e) => {
  if (isGameOver || paused) return;
  moveLeft();
  e.target.blur();
});

rightBtn.addEventListener('click', (e) => {
  if (isGameOver || paused) return;
  moveRight();
  e.target.blur();
});

downBtn.addEventListener('click', (e) => {
  if (isGameOver || paused) return;
  moveDown();
  e.target.blur();
});

dropBtn.addEventListener('click', (e) => {
  if (isGameOver || paused) return;
  hardDropDown();
  e.target.blur();
});

startBtn.addEventListener('click', (e) => {
  e.target.blur();
  if (firstGame) return restart();

  dialogGame.classList.toggle('hidden');
  message.textContent = 'Are you sure want to restart?';
  if (!paused) pause();
  pauseBtn.disabled = true;

  yesBtn.addEventListener('click', () => {
    if (paused) unpause();
    restart();
    dialogGame.classList.add('hidden');
  });

  noBtn.addEventListener('click', () => {
    dialogGame.classList.add('hidden');
    if (paused) unpause();
    return;
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'p') pauseBtn.click();
});

window.addEventListener('blur', () => {
  if (!paused) {
    windowPause = true;
    pauseBtn.click();
  }
});

window.addEventListener('focus', () => {
  if (windowPause) {
    windowPause = false;
    pauseBtn.click();
  }
});
