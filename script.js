const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

// ==================
// CONFIG
// ==================
const GRID = 10;          // grid kecil
let TILE = 30;           // KOTAK GEDE (nanti auto scale)

let snake, direction, food, score, gameOver;

// ==================
// RESPONSIVE CANVAS
// ==================
function resizeCanvas() {
  const maxSize = Math.min(window.innerWidth, 500);
  TILE = Math.floor(maxSize / GRID);

  canvas.width = GRID * TILE;
  canvas.height = GRID * TILE;
}

window.addEventListener("resize", resizeCanvas);

// ==================
// INIT GAME
// ==================
function init() {
  resizeCanvas();

  const startX = Math.floor(GRID / 2);
  const startY = Math.floor(GRID / 2);

  snake = [
    { x: startX, y: startY },
    { x: startX - 1, y: startY },
    { x: startX - 2, y: startY },
    { x: startX - 3, y: startY }
  ];

  direction = "RIGHT";
  food = spawnFood();
  score = 0;
  gameOver = false;

  scoreText.textContent = score;
}

// ==================
function spawnFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID)
    };
  } while (snake.some(p => p.x === pos.x && p.y === pos.y));
  return pos;
}

// ==================
function setDirection(dir) {
  const opposite = {
    UP: "DOWN",
    DOWN: "UP",
    LEFT: "RIGHT",
    RIGHT: "LEFT"
  };
  if (dir !== opposite[direction]) direction = dir;
}

// keyboard support
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" || e.key === "w") setDirection("UP");
  if (e.key === "ArrowDown" || e.key === "s") setDirection("DOWN");
  if (e.key === "ArrowLeft" || e.key === "a") setDirection("LEFT");
  if (e.key === "ArrowRight" || e.key === "d") setDirection("RIGHT");
});

// ==================
function update() {
  if (gameOver) return;

  const head = { ...snake[0] };

  if (direction === "UP") head.y--;
  if (direction === "DOWN") head.y++;
  if (direction === "LEFT") head.x--;
  if (direction === "RIGHT") head.x++;

  // wall collision
  if (
    head.x < 0 || head.y < 0 ||
    head.x >= GRID || head.y >= GRID
  ) {
    gameOver = true;
    alert("GAME OVER, MAP KECIL MASIH NUBRUK");
    return;
  }

  // self collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
      alert("GAME OVER, MAKAN DIRI SENDIRI");
      return;
    }
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreText.textContent = score;
    food = spawnFood();
  } else {
    snake.pop();
  }
}

// ==================
function drawGrid() {
  ctx.strokeStyle = "#333";
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

// ==================
function drawHead(head) {
  ctx.save();
  ctx.translate(
    head.x * TILE + TILE / 2,
    head.y * TILE + TILE / 2
  );

  if (direction === "UP") ctx.rotate(-Math.PI / 2);
  if (direction === "DOWN") ctx.rotate(Math.PI / 2);
  if (direction === "LEFT") ctx.rotate(Math.PI);
  if (direction === "RIGHT") ctx.rotate(0);

  ctx.fillStyle = "#00ff00";
  ctx.beginPath();
  ctx.moveTo(TILE / 2.2, 0);
  ctx.lineTo(-TILE / 2.2, -TILE / 2.2);
  ctx.lineTo(-TILE / 2.2, TILE / 2.2);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// ==================
function drawSnake() {
  snake.forEach((p, i) => {
    if (i === 0) drawHead(p);
    else {
      ctx.fillStyle = "#0f0";
      ctx.fillRect(
        p.x * TILE,
        p.y * TILE,
        TILE,
        TILE
      );
    }
  });
}

// ==================
function drawFood() {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    food.x * TILE + TILE / 2,
    food.y * TILE + TILE / 2,
    TILE / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// ==================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawFood();
  drawSnake();
}

// ==================
function loop() {
  update();
  draw();
}

// ==================
function resetGame() {
  init();
}

// ==================
init();
setInterval(loop, 300);
