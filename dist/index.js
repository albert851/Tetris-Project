"use strict";
const grid = document.querySelector('.grid');
let squares = document.querySelectorAll('.grid div');
const score = document.querySelector('#score span');
const startBtn = document.querySelector('#start-button');
const displaySquares = document.querySelectorAll('.mini-grid div');
const width = 10;
const displayWidth = 4;
let displayIndex = 0;
let scoreIndex = 0;
let nextRandom = 0;
let on = false;
let timerId;
let sound1 = new Audio("./sound.mp3");
let sound2 = new Audio("./sound2.mp3");
let sound3 = new Audio("./sound3.mp3");
const colors = ['orange', 'red', 'purple', 'green', 'blue'];
const lShape = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
];
const zShape = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
];
const tShape = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];
const oShape = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
];
const iShape = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
];
const theShapes = [lShape, zShape, tShape, oShape, iShape];
let currentPosition = 4;
let currentRotation = 0;
let random = Math.floor(Math.random() * theShapes.length);
let current = theShapes[random][currentRotation];
let draw = () => {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('shape');
        squares[currentPosition + index].style.backgroundColor = colors[random];
    });
};
let undraw = () => {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('shape');
        squares[currentPosition + index].style.backgroundColor = '';
    });
};
let control = (e) => {
    if (e.keyCode === 37)
        moveLeft();
    else if (e.keyCode === 38)
        rotate();
    else if (e.keyCode === 39)
        moveRight();
    else if (e.keyCode === 40)
        moveDown();
};
document.addEventListener('keyup', control);
let freeze = () => {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'));
        sound2.play();
        random = nextRandom;
        nextRandom = Math.floor(Math.random() * theShapes.length);
        current = theShapes[random][currentRotation];
        currentPosition = 4;
        draw();
        displayShape();
        scoreCalculate();
        gameOver();
    }
};
let moveDown = () => {
    undraw();
    currentPosition += width;
    draw();
    freeze();
};
let moveLeft = () => {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);
    if (!isAtLeftEdge)
        currentPosition -= 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
        currentPosition += 1;
    draw();
};
let moveRight = () => {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === width - 1);
    if (!isAtLeftEdge)
        currentPosition += 1;
    if (current.some(index => squares[currentPosition + index].classList.contains('taken')))
        currentPosition -= 1;
    draw();
};
let rotate = () => {
    undraw();
    currentRotation++;
    if (currentRotation === current.length)
        currentRotation = 0;
    current = theShapes[random][currentRotation];
    sound1.play();
    draw();
};
const upNextShape = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]
];
let displayShape = () => {
    displaySquares.forEach(square => {
        square.classList.remove('shape');
        square.style.backgroundColor = '';
    });
    upNextShape[nextRandom].forEach(index => {
        displaySquares[displayIndex + index].classList.add('shape');
        displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
};
startBtn.addEventListener('click', () => {
    if (on == true) {
        clearInterval(timerId);
        timerId = null;
        on = false;
    }
    else {
        timerId = setInterval(moveDown, 1000);
        nextRandom = Math.floor(Math.random() * theShapes.length);
        on = true;
        displayShape();
    }
});
let scoreCalculate = () => {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
        if (row.every(index => squares[index].classList.contains('taken'))) {
            scoreIndex += 10;
            score.innerHTML = scoreIndex.toString();
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].style.backgroundColor = '';
            });
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid === null || grid === void 0 ? void 0 : grid.appendChild(cell));
        }
    }
};
let gameOver = () => {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        score.innerHTML = 'Gane Over';
        sound3.play();
        clearInterval(timerId);
    }
};
