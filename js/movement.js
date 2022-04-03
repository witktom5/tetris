function moveDown() {
  const currentGrid = document.querySelectorAll('.block');
  const currentPiece = document.querySelectorAll('.piece');
  for (let block of [...currentPiece].reverse()) {
    const newIndex = [...currentGrid].indexOf(block) + 1;
    if (!checkCollision(currentPiece, currentGrid, 1)) return;
    block.classList.remove('piece', spawnedPiece.color);
    currentGrid[newIndex].classList.add('piece', spawnedPiece.color);
  }
  piecePosition.y += 1;
}

function hardDropDown() {
  if (isHardDropDown) return;
  clearInterval(gameFlowInterval);
  hardDropInterval = setInterval(moveDown, 18);
  isHardDropDown = true;
}

function moveLeft() {
  const currentGrid = document.querySelectorAll('.block');
  const currentPiece = document.querySelectorAll('.piece');
  for (let block of currentPiece) {
    const newIndex = [...currentGrid].indexOf(block) - 20;
    if (!checkCollision(currentPiece, currentGrid, -20)) return;
    block.classList.remove('piece', spawnedPiece.color);
    currentGrid[newIndex].classList.add('piece', spawnedPiece.color);
  }
  piecePosition.x -= 1;
}

function moveRight() {
  const currentGrid = document.querySelectorAll('.block');
  const currentPiece = document.querySelectorAll('.piece');
  for (let block of [...currentPiece].reverse()) {
    const newIndex = [...currentGrid].indexOf(block) + 20;
    if (!checkCollision(currentPiece, currentGrid, 20)) return;
    block.classList.remove('piece', spawnedPiece.color);
    currentGrid[newIndex].classList.add('piece', spawnedPiece.color);
  }
  piecePosition.x += 1;
}

function rotatePiece() {
  const saveSpawnedShape = spawnedShape;
  spawnedShape += 1;

  if (spawnedShape >= spawnedPiece.shape.length) spawnedShape = 0;
  spawningPoint = getPiecePosition();

  for (let [index, block] of spawnedPiece.shape[spawnedShape].entries()) {
    if (
      block === 1 &&
      spawningPoint[index].classList.contains('dropped-piece')
    ) {
      spawnedShape = saveSpawnedShape;
      return;
    }
  }

  const currentPiece = document.querySelectorAll('.piece');
  currentPiece.forEach((block) =>
    block.classList.remove('piece', spawnedPiece.color)
  );
  spawnPiece();
}
