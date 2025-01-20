const dimensions = 5; // The initial board size is dimensions x dimensions
const winLength = 5; // How many stones needed to win
let dimX = dimensions;
let dimY = dimensions;
const board = []; // The game board
let turn = "X"; // Starting player. The other player is 'O'.

function initializeGame() {
  for (let y = 0; y < dimY; y++) {
    const row = [];
    for (let x = 0; x < dimX; x++) {
      row.push("");
    }
    board.push(row);
  }
}

function nextTurn() {
  if (turn === "X") {
    turn = "O";
  } else {
    turn = "X";
  }
  let turnLabel = document.getElementById("turn");
  turnLabel.textContent = turn;
}

function checkWin(x, y) {
  const currentPlayer = board[y][x];

  // Define the directions to check: horizontal, vertical, and diagonal
  const directions = [
    [0, 1], // Right
    [1, 0], // Down
    [1, 1], // Diagonal down-right
    [-1, 1], // Diagonal down-left
  ];

  for (const [dx, dy] of directions) {
    let count = 1;

    // Check in one direction
    for (let i = 1; i < winLength; i++) {
      const newX = x + i * dx;
      const newY = y + i * dy;

      if (newX >= 0 && newX < dimX && newY >= 0 && newY < dimY) {
        if (board[newY][newX] === currentPlayer) {
          count++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    // Check in the opposite direction
    for (let i = 1; i < winLength; i++) {
      const newX = x - i * dx;
      const newY = y - i * dy;

      if (newX >= 0 && newX < dimX && newY >= 0 && newY < dimY) {
        if (board[newY][newX] === currentPlayer) {
          count++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    if (count >= winLength) {
      document.getElementById("winner").textContent = `${currentPlayer} wins!`;
      return true;
    }
  }

  return false;
}

function expandBoard(direction) {
  if (direction === "LEFT") {
    for (let i = 0; i < board.length; i++) {
      board[i].unshift("");
    }
    dimX++;
  } else if (direction === "RIGHT") {
    for (let i = 0; i < board.length; i++) {
      board[i].push("");
    }
    dimX++;
  } else if (direction === "UP") {
    board.unshift([]);
    for (let i = 0; i < dimX; i++) {
      board[0].push("");
    }
    dimY++;
  } else if (direction === "DOWN") {
    board.push([]);
    for (let i = 0; i < dimX; i++) {
      board[board.length - 1].push("");
    }
    dimY++;
  }

  drawBoard();
}

function handleClick(event) {
  let square = event.target;
  let x = square.dataset.x;
  let y = square.dataset.y;

  if (board[y][x] !== "") return; // Prevent overwriting an already filled square.

  board[y][x] = turn;
  square.textContent = turn;
  square.removeEventListener("click", handleClick);

  if (checkWin(x, y)) return;

  // Expanding the board if clicked on extreme rows or columns
  if (x == 0 && board[y][x] !== "") expandBoard("LEFT");
  if (x == dimX - 1 && board[y][x] !== "") expandBoard("RIGHT");
  if (y == 0 && board[y][x] !== "") expandBoard("UP");
  if (y == dimY - 1 && board[y][x] !== "") expandBoard("DOWN");

  nextTurn();
}

function createSquare(boardDiv, x, y) {
  let element = document.createElement("div");
  element.setAttribute("class", "square");
  element.setAttribute("data-x", x);
  element.setAttribute("data-y", y);
  element.textContent = board[y][x];

  if (board[y][x] === "") {
    element.addEventListener("click", handleClick);
  }

  boardDiv.appendChild(element);
}

function drawBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = ""; // Clear the board first!

  for (let y = 0; y < dimY; y++) {
    for (let x = 0; x < dimX; x++) {
      createSquare(boardDiv, x, y);
    }
  }
}

function newGame() {
  dimX = 5;
  dimY = 5;
  turn = "X";
  document.getElementById("turn").textContent = turn;
  document.getElementById("winner").textContent = "";
  initializeGame();
  drawBoard();
}

document.getElementById("new-game").addEventListener("click", newGame);

initializeGame();
drawBoard();
