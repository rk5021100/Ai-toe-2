const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

let board = ["", "", "", "", "", "", "", "", ""];
const human = "X";
const ai = "O";
let gameActive = true;

const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function startGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  message.textContent = "";
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("taken");
    cell.addEventListener("click", handleClick, { once: true });
  });
}

function handleClick(e) {
  const index = e.target.getAttribute('data-index');
  if (!gameActive || board[index] !== "") return;

  makeMove(index, human);
  if (!checkGameOver(human)) {
    setTimeout(() => {
      const bestMove = getBestMove();
      makeMove(bestMove, ai);
      checkGameOver(ai);
    }, 300);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add('taken');
}

function checkGameOver(player) {
  if (checkWin(board, player)) {
    message.textContent = player === human ? "🎉 You win!" : "🤖 AI wins!";
    gameActive = false;
    return true;
  } else if (isDraw()) {
    message.textContent = "It's a draw!";
    gameActive = false;
    return true;
  }
  return false;
}

function checkWin(board, player) {
  return winCombos.some(combo => {
    return combo.every(i => board[i] === player);
  });
}

function isDraw() {
  return board.every(cell => cell !== "");
}

function getBestMove() {
  return minimax(board, ai).index;
}

function minimax(newBoard, player) {
  const availSpots = newBoard
    .map((val, idx) => (val === "" ? idx : null))
    .filter(v => v !== null);

  if (checkWin(newBoard, human)) return { score: -10 };
  if (checkWin(newBoard, ai)) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = availSpots[i];
    newBoard[availSpots[i]] = player;

    if (player === ai) {
      move.score = minimax(newBoard, human).score;
    } else {
      move.score = minimax(newBoard, ai).score;
    }

    newBoard[availSpots[i]] = "";
    moves.push(move);
  }

  let bestMove;
  if (player === ai) {
    let bestScore = -Infinity;
    moves.forEach((move, i) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((move, i) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}

restartBtn.addEventListener('click', startGame);
startGame();
