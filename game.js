const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
  x: 50,
  y: canvas.height - 70,
  width: 30,
  height: 30,
  color: "white",
  velocityY: 0,
  gravity: 0.5,
  jumpPower: -10,
  onGround: false
};

const obstacles = [];
const powerUps = [];
let score = 0;
let gameRunning = true;

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function drawPowerUps() {
  ctx.fillStyle = "yellow";
  powerUps.forEach(powerUp => {
    ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
  });
}

function updatePlayer() {
  player.velocityY += player.gravity;
  player.y += player.velocityY;

  if (player.y >= canvas.height - 70) {
    player.y = canvas.height - 70;
    player.velocityY = 0;
    player.onGround = true;
  }
}

function spawnObstacle() {
  if (Math.random() < 0.02) {
    obstacles.push({ x: canvas.width, y: canvas.height - 70, width: 20, height: 30 });
  }
}

function spawnPowerUp() {
  if (Math.random() < 0.01) {
    powerUps.push({ x: canvas.width, y: Math.random() * (canvas.height - 100) + 50, width: 15, height: 15 });
  }
}

function updateObstacles() {
  obstacles.forEach(obstacle => obstacle.x -= 5);
  if (obstacles.length > 0 && obstacles[0].x < -20) {
    obstacles.shift();
    score++;
  }
}

function updatePowerUps() {
  powerUps.forEach(powerUp => powerUp.x -= 5);
  if (powerUps.length > 0 && powerUps[0].x < -20) {
    powerUps.shift();
  }
}

function checkCollision() {
  obstacles.forEach(obstacle => {
    if (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    ) {
      gameRunning = false;
    }
  });

  powerUps.forEach((powerUp, index) => {
    if (
      player.x < powerUp.x + powerUp.width &&
      player.x + player.width > powerUp.x &&
      player.y < powerUp.y + powerUp.height &&
      player.y + player.height > powerUp.y
    ) {
      powerUps.splice(index, 1);
      score += 5; // Power-up megszerzésével extra pont
    }
  });
}

function gameLoop() {
  if (!gameRunning) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Game Over! Score: " + score, canvas.width / 2 - 100, canvas.height / 2);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacles();
  drawPowerUps();
  updatePlayer();
  spawnObstacle();
  spawnPowerUp();
  updateObstacles();
  updatePowerUps();
  checkCollision();

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && player.onGround) {
    player.velocityY = player.jumpPower;
    player.onGround = false;
  }
});

gameLoop(); 