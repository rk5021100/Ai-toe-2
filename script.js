const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

// 🔊 Sound elements
const moveSound = document.getElementById('moveSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');
let soundAllowed = false; // Prevent autoplay block

let board = ["", "", "", "", "", "", "", "", ""];
const human = "X";
const ai = "O";
let gameActive = true;

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// ✅ Safe sound playback
function playSound(sound) {
  if (!soundAllowed || !sound) return;
  sound.currentTime = 0;
  sound.play().catch(err => {
    console.warn("Sound blocked:", err);
  });
}

// 🟢 Start or restart the game
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

// ⬅️ Handle human click
function handleClick(e) {
  soundAllowed = true; // Allow sound after user click
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

// 🧠 Make a move
function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add('taken');
  playSound(moveSound);
}

// 🏁 Check win or draw
function checkGameOver(player) {
  if (checkWin(board, player)) {
    message.textContent = player === human ? "🎉 You win!" : "🤖 AI wins!";
    playSound(winSound);
    gameActive = false;
    return true;
  } else if (isDraw()) {
    message.textContent = "It's a draw!";
    playSound(drawSound);
    gameActive = false;
    return true;
  }
  return false;
}

// 🏆 Check winning combo
function checkWin(board, player) {
  return winCombos.some(combo => combo.every(i => board[i] === player));
}

// ⏸️ Check for draw
function isDraw() {
  return board.every(cell => cell !== "");
}

// 🤖 Minimax AI
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

    move.score = (player === ai)
      ? minimax(newBoard, human).score
      : minimax(newBoard, ai).score;

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
