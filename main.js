const start = document.querySelector('.start');
const game = document.querySelector('.game');
const gameArena = document.querySelector('.gameArena');
const score = document.querySelector('.score');

const car = document.createElement('div');
car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
}

const settings = {
    start: false,
    score: 0,
    speed: 3,
}

function startGame() {
    start.classList.add('hidden');
    settings.start = true;
    gameArena.appendChild(car);
    requestAnimationFrame(playGame);
}

function playGame() {
    if (settings.start) {
        requestAnimationFrame(playGame);
    }
}

function startRun (e){
    e.preventDefault();
    keys[e.key] = true;
}

function stopRun(e) {
    e.preventDefault();
    keys[e.key] = false;
}