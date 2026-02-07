const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

const GRID = 16;
const TILE = 10;

canvas.width = GRID * TILE;
canvas.height = GRID * TILE;

let snake, direction, food, score, gameOver;

function init() {
  snake = [
    { x: 16, y: 16 },
    { x: 15, y: 16 },
    { x: 14, y: 16 }
  ];
  direction = "RIGHT";
  food = randomFood();
  score = 0;
  gameOver = false;
  scoreText.textContent = score;
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * GRID),
    y: Math.floor(Math.random() * GRID)
  };
}

function setDirection(dir) {
  const opposite = {
    UP: "DOWN",
    DOWN: "UP",
    LEFT: "RIGHT",
    RIGHT: "LEFT"
  };
  if (direction !== opposite[dir]) direction = dir;
}

// keyboard support
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "w") setDirection("UP");
  if (e.key === "ArrowDown" || e.key === "s") setDirection("DOWN");
  if (e.key === "ArrowLeft" || e.key === "a") setDirection("LEFT");
  if (e.key === "ArrowRight" || e.key === "d") setDirection("RIGHT");
});

function update() {
  if (gameOver) return;

  const head = { ...snake[0] };

  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;
  if (direction === "LEFT") head.x--;
  if (direction === "RIGHT") head.x++;

  if (head.x < 0 || head.y < 0 || head.x >= GRID || head.y >= GRID) {
    gameOver = true;
    alert("GAME OVER, ANDA TERKENA TEMBOK");
    return;
  }

  for (let part of snake) {
    if (head.x === part.x && head.y === part.y) {
      gameOver = true;
      alert("GAME OVER, ANDA TERKENA BAGIAN DIRI ANDA");
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreText.textContent = score;
    food = randomFood();
  } else {
    snake.pop();
  }
}

function drawGrid() {
  ctx.strokeStyle = "#222";
  for (let i = 0; i <= GRID; i++) {
    ctx.beginPath();
    ctx.moveTo(i * TILE, 0);
    ctx.lineTo(i * TILE, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * TILE);
    ctx.lineTo(canvas.width, i * TILE);
    ctx.stroke();
  }
}

function drawSnake() {
  snake.forEach((part, i) => {
    if (i === 0) drawHead(part);
    else {
      ctx.fillStyle = "#0f0";
      ctx.fillRect(part.x * TILE, part.y * TILE, TILE, TILE);
    }
  });
}

function drawHead(head) {
  ctx.save();
  ctx.translate(head.x * TILE + TILE / 2, head.y * TILE + TILE / 2);

  if (direction === "UP") ctx.rotate(-Math.PI / 2);
  if (direction === "DOWN") ctx.rotate(Math.PI / 2);
  if (direction === "LEFT") ctx.rotate(Math.PI);
  if (direction === "RIGHT") ctx.rotate(0);

  ctx.fillStyle = "#00ff00";
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(-8, -8);
  ctx.lineTo(-8, 8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawFood() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    food.x * TILE + TILE / 2,
    food.y * TILE + TILE / 2,
    TILE / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  drawSnake();
}

function loop() {
  update();
  draw();
}

function resetGame() {
  init();
}

init();
setInterval(loop, 120);
