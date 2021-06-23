const start = document.querySelector(".start");
const game = document.querySelector(".game");
const gameArea = document.querySelector(".gameArena");
const score = document.querySelector(".score");

const car = document.createElement("div");
car.classList.add("car");

start.addEventListener("click", startGame);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const settings = {
  start: false,
  score: 0,
  speed: 3,
  traffic: 3,
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
  start.classList.add("hidden");
  for (let i = 0; i < getQuantityElements(100); i += 1) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.y = i * 100;
    line.style.top = line.y + "px";
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuantityElements(100 * settings.traffic); i += 1) {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.y = -100 * settings.traffic * (i + 1);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    enemy.style.top = enemy.y + "px";
    enemy.style.background =
      "transparent url(./image/enemy2.png) center / cover no-repeat";
    gameArea.appendChild(enemy);
  }

  settings.start = true;
  gameArea.appendChild(car);
  settings.x = car.offsetLeft;
  settings.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (settings.start) {
    moveRoad();
    moveEnemy();
    if (keys.ArrowLeft && settings.x > 0) {
      settings.x -= settings.speed;
    }
    let offsetX = gameArea.offsetWidth - car.offsetWidth;
    if (keys.ArrowRight && settings.x < offsetX) {
      settings.x += settings.speed;
    }

    if (keys.ArrowUp && settings.y > 0) {
      settings.y -= settings.speed;
    }
    let offsetY = gameArea.offsetHeight - car.offsetHeight;
    if (keys.ArrowDown && settings.y < offsetY) {
      settings.y += settings.speed;
    }

    car.style.left = settings.x + "px";
    car.style.top = settings.y + "px";
    requestAnimationFrame(playGame);
  }
}

function startRun(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function stopRun(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function moveRoad() {
  let lines = document.querySelectorAll(".line");
  lines.forEach((line) => {
    line.y += settings.speed;
    line.style.top = line.y + "px";

    if (line.y > document.documentElement.clientHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll(".enemy");
  enemy.forEach((item) => {
    item.y += settings.speed / 2;
    item.style.top = item.y + "px";
    if (item.y >= document.documentElement.clientHeight) {
      item.y = -100 * settings.traffic;
      item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    }
  });
}
