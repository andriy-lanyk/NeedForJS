const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;
const start = document.querySelector(".start");
const game = document.querySelector(".game");
const gameArea = document.querySelector(".gameArena");
const score = document.querySelector(".score");
const startButtons = document.querySelectorAll(".btn");
const music = new Audio("audio.mp3");

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
  record: localStorage.getItem("best-record"),
};

let startSpeed = 0;

function changeLevel(lvl) {
  switch (lvl) {
    case "1":
      settings.traffic = 5;
      settings.speed = 3;
      break;
    case "2":
      settings.traffic = 4;
      settings.speed = 4;
      break;
    case "3":
      settings.traffic = 4;
      settings.speed = 5;
      break;
  }
  startSpeed = settings.speed;
}

function getQuantityElements(heightElement) {
  return gameArea.offsetHeight / heightElement + 1;
}

function getRandomEnemy(max) {
  return Math.floor(Math.random() * max + 1);
}

function startGame(e) {
  const target = e.target;

  if (!target.classList.contains("btn")) return;

  const levelGame = target.dataset.levelGame;

  changeLevel(levelGame);

  music.play();
  music.volume = 0.1;

  gameArea.style.minHeight =
    Math.floor(
      (document.documentElement.clientHeight - HEIGHT_ELEM) / HEIGHT_ELEM
    ) * HEIGHT_ELEM;

  startButtons.forEach((btn) => (btn.disabled = true));
  gameArea.innerHTML = "";
  for (let i = 0; i < getQuantityElements(HEIGHT_ELEM); i += 1) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.y = i * HEIGHT_ELEM;
    line.style.top = line.y + "px";
    line.style.height = HEIGHT_ELEM / 2 + "px";
    gameArea.append(line);
  }

  for (
    let i = 0;
    i < getQuantityElements(HEIGHT_ELEM * settings.traffic) + 1;
    i += 1
  ) {
    const enemy = document.createElement("div");
    enemy.classList.add("enemy");

    enemy.y = (-HEIGHT_ELEM + 20) * settings.traffic * (i + 1);
    console.log("enemy.y: ", enemy.y);
    enemy.style.left =
      Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    enemy.style.top = enemy.y + "px";
    enemy.style.background = `transparent url(./image/enemy${getRandomEnemy(
      MAX_ENEMY
    )}.png) center / cover no-repeat`;
    gameArea.append(enemy);
  }

  settings.score = 0;
  settings.start = true;
  gameArea.append(car);
  let carLeftSettings = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.left = carLeftSettings + "px";
  car.style.top = "auto";
  car.style.bottom = "10px";
  settings.x = car.offsetLeft;
  settings.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (settings.start) {
    settings.score += settings.speed;
    score.innerHTML = `<p>SCORE: ${settings.score}</p>
    ${settings.record ? `<p>Best record: ${settings.record}</p>` : ""}`;

    settings.speed = startSpeed + Math.floor(settings.score / 5000);

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
  if (keys.hasOwnProperty(e.key)) {
    e.preventDefault();
    keys[e.key] = true;
  }
}

function stopRun(e) {
  if (keys.hasOwnProperty(e.key)) {
    e.preventDefault();
    keys[e.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll(".line");
  lines.forEach((line) => {
    line.y += settings.speed;
    line.style.top = line.y + "px";

    if (line.y > gameArea.offsetHeight) {
      line.y = -HEIGHT_ELEM;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll(".enemy");
  enemy.forEach((item) => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      settings.start = false;
      music.pause();
      if (settings.score > settings.record) {
        localStorage.setItem("best-record", settings.score);
        alert(
          `Ура, новый рекорд! Вы набрали на ${
            settings.score - settings.record
          } очков больше!`
        );
        settings.record = settings.score;
      }
      startButtons.forEach((btn) => (btn.disabled = false));
    }

    item.y += settings.speed / 2;
    item.style.top = item.y + "px";
    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ELEM * settings.traffic;
      item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + "px";
    }
  });
}
