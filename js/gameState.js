const dialogGame = document.querySelector('.dialog-game');
const yesBtn = document.querySelector('#yes');
const noBtn = document.querySelector('#no');
const message = document.querySelector('#message');

function getPiecePosition() {
  const b = document.querySelectorAll('.block');
  let i = piecePosition.x * 20 + piecePosition.y;
  let multiplier;

  if (piecePosition.x >= 7) {
    multiplier = piecePosition.x - 7;
    if (spawnedPiece === pieceI) multiplier += 1;
    i -= 20 * multiplier;
    piecePosition.x -= 1 * multiplier;
  }

  if (piecePosition.x < 0) {
    multiplier = piecePosition.x + 2;
    if (multiplier === 0) multiplier = 2;
    i += 20 * multiplier;
    piecePosition.x += 1 * multiplier;
  }

  if (piecePosition.y >= 17) {
    multiplier = piecePosition.y - 17;
    if (spawnedPiece === pieceI) multiplier += 1;
    i -= 1 * multiplier;
    piecePosition.y -= 1 * multiplier;
  }
  return [
    b[i],
    b[i + 1],
    b[i + 2],
    b[i + 3],
    b[i + 20],
    b[i + 21],
    b[i + 22],
    b[i + 23],
    b[i + 40],
    b[i + 41],
    b[i + 42],
    b[i + 43],
    b[i + 60],
    b[i + 61],
    b[i + 62],
    b[i + 63],
  ];
}

function spawnPiece() {
  for (let [index, block] of spawnedPiece.shape[spawnedShape].entries()) {
    if (block === 1) {
      spawningPoint[index].classList.add('piece', spawnedPiece.color);
    }
  }
}

function checkGameOver(checkGameOverBlock) {
  for (let block of checkGameOverBlock) {
    if (block.classList.contains('dropped-piece')) {
      isGameOver = true;
      checkGameOverBlock.forEach((block) => {
        if (block.classList.contains('evenColumn')) {
          block.className = 'dropped-piece death block evenColumn';
        } else {
          block.className = 'dropped-piece death block';
        }
      });
      return true;
    }
  }
}

async function placePiece(piece) {
  piece.forEach((block) => {
    block.classList.remove('piece');
    block.classList.add('dropped-piece');
  });

  if (isHardDropDown) {
    isHardDropDown = false;
    clearInterval(hardDropInterval);
    gameFlowInterval = setInterval(moveDown, gameSpeed);
  }

  await checkRows();
  piecePosition = { x: 3, y: 0 };
  spawningPoint = baseSpawningPoint;
  spawnedShape = 0;
  spawnedPiece = allPieces[Math.floor(Math.random() * 7)];
  clearInterval(gameFlowInterval);
  gameFlowInterval = setInterval(moveDown, gameSpeed);

  for (let [index, block] of spawnedPiece.shape[spawnedShape].entries()) {
    if (block === 1) {
      spawningPoint[index].classList.add('check-game-over');
    }
  }

  const checkGameOverBlock = document.querySelectorAll('.check-game-over');
  if (checkGameOver(checkGameOverBlock)) return gameOver();
  checkGameOverBlock.forEach((block) =>
    block.classList.remove('check-game-over')
  );

  spawnPiece();
}

function checkCollision(currentPiece, currentGrid, direction) {
  for (let block of currentPiece) {
    const newIndex = [...currentGrid].indexOf(block) + direction;
    if (direction === 1) {
      if (
        block.classList.contains('bottom-block') ||
        block.nextElementSibling.classList.contains('dropped-piece')
      ) {
        placePiece(currentPiece);
        return false;
      }
    }
    if (
      newIndex < 0 ||
      newIndex > 199 ||
      currentGrid[newIndex].classList.contains('dropped-piece')
    ) {
      return false;
    }
  }
  return true;
}

async function checkRows() {
  let rowsRemoved = 0;
  for (let i = 1; i <= 20; i++) {
    const droppedPieces = document.querySelectorAll(
      `.dropped-piece[data-row="${i}"]`
    );
    if (droppedPieces.length === 10) {
      const rowBlocks = document.querySelectorAll(`.block[data-row="${i}"]`);
      rowBlocks.forEach((block) => block.classList.add('removed'));
      await new Promise((resolve) => setTimeout(resolve, 200));
      rowsRemoved++;
      linesCleared++;
      if (linesCleared === 5) {
        level++;
        levelDisplay.textContent = level;
        linesCleared = 0;
        setSpeed();
      }
      const allBlocks = document.querySelectorAll('.block');
      const evenColumns = [...allBlocks].filter((block) =>
        block.classList.contains('evenColumn')
      );
      droppedPieces.forEach((block) => (block.className = 'block'));
      moveDroppedPieces(i);
      evenColumns.forEach((block) => block.classList.add('evenColumn'));
    }
  }
  updateScore(rowsRemoved);
}

function setSpeed() {
  if (gameSpeed > 50) gameSpeed = baseGameSpeed - level * 35;
}

function updateScore(rowsRemoved) {
  switch (rowsRemoved) {
    case 0:
      break;
    case 1:
      score += 40 * level;
      break;
    case 2:
      score += 100 * level;
      break;
    case 3:
      score += 300 * level;
      break;
    case 4:
      score += 1200 * level;
      break;
  }
  scoreDisplay.textContent = score;
}

function moveDroppedPieces(removedRow) {
  for (let i = removedRow; i >= 0; i--) {
    const piecesToMove = document.querySelectorAll(
      `.dropped-piece[data-row="${i}"]`
    );
    for (let block of piecesToMove) {
      const saveClass = block.className;
      block.className = 'block';
      block.nextElementSibling.className = saveClass;
      makeBottomGameBorder();
    }
  }
}

async function gameOver() {
  isGameOver = true;
  await new Promise((resolve) => setTimeout(resolve, 600));
  message.textContent = `Game Over! Your score is ${score}. Do you want to play again?`;
  dialogGame.classList.toggle('hidden');
  disabledBtns.forEach((btn) => (btn.disabled = true));
  clearInterval(gameFlowInterval);
  document.removeEventListener('keydown', controls);
  yesBtn.addEventListener('click', () => {
    dialogGame.classList.add('hidden');
    isGameOver = false;
    restart();
  });
  noBtn.addEventListener('click', () => {
    dialogGame.classList.add('hidden');
  });
}

function restart() {
  if (paused) unpause();
  if (gameFlowInterval) clearInterval(gameFlowInterval);
  if (hardDropInterval) clearInterval(hardDropInterval);
  if (firstGame) firstGame = false;
  if (!isGameOver) {
    document.removeEventListener('keydown', controls);
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block) => {
      if (block.classList.contains('evenColumn')) {
        block.className = 'block evenColumn';
      } else {
        block.className = 'block';
      }
    });
  } else {
    isGameOver = false;
  }
  startBtn.textContent = 'Restart';
  disabledBtns.forEach((btn) => (btn.disabled = false));
  makeBottomGameBorder();
  gameSpeed = baseGameSpeed;
  gameFlowInterval = setInterval(moveDown, gameSpeed);
  spawningPoint = baseSpawningPoint;
  piecePosition = { x: 3, y: 0 };
  spawnedShape = 0;
  spawnedPiece = allPieces[Math.floor(Math.random() * 7)];
  level = 1;
  linesCleared = 0;
  score = 0;
  isHardDropDown = false;
  document.addEventListener('keydown', controls);
  spawnPiece();
}

function pause() {
  pauseBtn.textContent = 'Unpause';
  clearInterval(gameFlowInterval);
  document.removeEventListener('keydown', controls);
  isHardDropDown = false;
  disabledBtns.forEach((btn) => (btn.disabled = true));
  pauseBtn.disabled = false;
  startBtn.disabled = true;
  paused = true;
}

function unpause() {
  pauseBtn.textContent = 'Pause';
  gameFlowInterval = setInterval(moveDown, gameSpeed);
  document.addEventListener('keydown', controls);
  disabledBtns.forEach((btn) => (btn.disabled = false));
  startBtn.disabled = false;
  paused = false;
}
