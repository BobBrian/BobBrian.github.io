const grid = document.querySelector(".grid");
const resultDisplay = document.querySelector(".results");
let currentShooterIndex = 202;
const width = 15;
const aliensRemoved = [];
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;

// Create grid cells
for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    grid.appendChild(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));

// Alien invader positions
const alienInvaders = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39
];

function draw() {
    alienInvaders.forEach((invader, i) => {
        if (!aliensRemoved.includes(i)) {
            squares[invader].classList.add("invader");
        }
    });
}

draw();
squares[currentShooterIndex].classList.add("shooter");

function remove() {
    alienInvaders.forEach(invader => squares[invader].classList.remove("invader"));
}

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter");
    if (e.key === "ArrowLeft" && currentShooterIndex % width !== 0) {
        currentShooterIndex -= 1;
    } else if (e.key === "ArrowRight" && currentShooterIndex % width < width - 1) {
        currentShooterIndex += 1;
    }
    squares[currentShooterIndex].classList.add("shooter");
}

document.addEventListener("keydown", moveShooter);

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    remove();

    if (rightEdge && isGoingRight) {
        alienInvaders.forEach((_, i) => alienInvaders[i] += width + 1);
        direction = -1;
        isGoingRight = false;
    }

    if (leftEdge && !isGoingRight) {
        alienInvaders.forEach((_, i) => alienInvaders[i] += width - 1);
        direction = 1;
        isGoingRight = true;
    }

    alienInvaders.forEach((_, i) => alienInvaders[i] += direction);
    draw();

    if (squares[currentShooterIndex].classList.contains("invader")) {
        resultDisplay.innerHTML = "GAME OVER";
        clearInterval(invadersId);
    }

    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.innerHTML = "YOU WIN!";
        clearInterval(invadersId);
    }
}

invadersId = setInterval(moveInvaders, 600);

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser");
        currentLaserIndex -= width;
        if (currentLaserIndex >= 0) {
            squares[currentLaserIndex].classList.add("laser");
        }

        if (squares[currentLaserIndex]?.classList.contains("invader")) {
            squares[currentLaserIndex].classList.remove("laser", "invader");
            squares[currentLaserIndex].classList.add("boom");

            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 300);
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            resultDisplay.innerHTML = results;
        }
    }

    if (e.key === "ArrowUp") {
        laserId = setInterval(moveLaser, 100);
    }
}

document.addEventListener("keydown", shoot);
