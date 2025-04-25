// breakout-game.js

const grid = document.querySelector('.grid')
const scoreDisplay = document.querySelector('.results')
const blockWidth = 100
const blockHeight = 20
const ballDiameter = 20
const boardWidth = 530
const boardHeight = 0.6 * window.innerHeight
let xDirection = -2
let yDirection = 2
const userStart = [200, 10]
let currentPosition = userStart
const ballStart = [240, 40]
let ballCurrentPosition = ballStart
let timerId
let score = 0

class Block {
  constructor(x, y) {
    this.bottomLeft = [x, y]
    this.bottomRight = [x + blockWidth, y]
    this.topRight = [x + blockWidth, y + blockHeight]
    this.topLeft = [x, y + blockHeight]
  }
}

const blocks = []
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 5; col++) {
    blocks.push(new Block(5 + col * 105, 270 - row * 30))
  }
}

function addBlocks() {
  blocks.forEach(block => {
    const blockElement = document.createElement('div')
    blockElement.classList.add('block')
    blockElement.style.left = `${block.bottomLeft[0]}px`
    blockElement.style.bottom = `${block.bottomLeft[1]}px`
    grid.appendChild(blockElement)
  })
}
addBlocks()

const user = document.createElement('div')
user.classList.add('user')
grid.appendChild(user)
drawUser()

const ball = document.createElement('div')
ball.classList.add('ball')
grid.appendChild(ball)
drawBall()

document.addEventListener('keydown', moveUser)

function drawUser() {
  user.style.left = `${currentPosition[0]}px`
  user.style.bottom = `${currentPosition[1]}px`
}

function drawBall() {
  ball.style.left = `${ballCurrentPosition[0]}px`
  ball.style.bottom = `${ballCurrentPosition[1]}px`
}

function moveUser(e) {
  if (e.key === 'ArrowLeft' && currentPosition[0] > 0) {
    currentPosition[0] -= 10
  } else if (e.key === 'ArrowRight' && currentPosition[0] < (boardWidth - blockWidth)) {
    currentPosition[0] += 10
  }
  drawUser()
}

function moveBall() {
  ballCurrentPosition[0] += xDirection
  ballCurrentPosition[1] += yDirection
  drawBall()
  checkForCollisions()
}
timerId = setInterval(moveBall, 30)

function checkForCollisions() {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    if (
      ballCurrentPosition[0] > block.bottomLeft[0] &&
      ballCurrentPosition[0] < block.bottomRight[0] &&
      (ballCurrentPosition[1] + ballDiameter) > block.bottomLeft[1] &&
      ballCurrentPosition[1] < block.topLeft[1]
    ) {
      const allBlocks = Array.from(document.querySelectorAll('.block'))
      allBlocks[i].classList.remove('block')
      blocks.splice(i, 1)
      changeDirection()
      score++
      scoreDisplay.innerHTML = score
      if (blocks.length === 0) {
        scoreDisplay.innerHTML = 'You Win!'
        clearInterval(timerId)
        document.removeEventListener('keydown', moveUser)
      }
      break
    }
  }

  if (
    ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
    ballCurrentPosition[0] <= 0 ||
    ballCurrentPosition[1] >= (boardHeight - ballDiameter)
  ) {
    changeDirection()
  }

  if (
    ballCurrentPosition[0] > currentPosition[0] &&
    ballCurrentPosition[0] < currentPosition[0] + blockWidth &&
    ballCurrentPosition[1] > currentPosition[1] &&
    ballCurrentPosition[1] < currentPosition[1] + blockHeight
  ) {
    changeDirection()
  }

  if (ballCurrentPosition[1] <= 0) {
    clearInterval(timerId)
    scoreDisplay.innerHTML = 'You lose!'
    document.removeEventListener('keydown', moveUser)
  }
}

function changeDirection() {
  if (xDirection === 2 && yDirection === 2) {
    yDirection = -2
  } else if (xDirection === 2 && yDirection === -2) {
    xDirection = -2
  } else if (xDirection === -2 && yDirection === -2) {
    yDirection = 2
  } else if (xDirection === -2 && yDirection === 2) {
    xDirection = 2
  }
}
