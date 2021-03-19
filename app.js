let gameOver = false;

const board = document.querySelector('.board');
const element = document.getElementById('cells');
const menuSmallFieldSize = document.querySelector('.menu-small');
const menuMediumlFieldSize = document.querySelector('.menu-medium');
const menuBigFieldSize = document.querySelector('.menu-big');
const messageDisplay = document.querySelector('.message');

menuSmallFieldSize.addEventListener("click", smallField);
menuMediumlFieldSize.addEventListener("click", mediumField);
menuBigFieldSize.addEventListener("click", bigField);


// create cells
function addCells(numberOfCells) {
  element.innerHTML = '';
  gameOver = false;
  messageDisplay.classList.remove('gameOver');
  for (let i = 0; i < numberOfCells; i++) {
    const newCell = document.createElement('div');
    newCell.classList.add('cell');
    element.appendChild(newCell);
  }
}

// Рисуем поле 10*10
function smallField() {
  board.classList.add('smallBoard');
  element.classList.add('smallCells');
  addCells(100);
  const cells = document.querySelectorAll('.cell');
  for (let i = 0; i < 100; i++) {
    cells[i].classList.add('small');
  }
  drawField(10, 10, 20);
  messageDisplay.textContent = "20 flags left";
}

// Рисуем поле 17*17
function mediumField() {
  board.classList.add('mediumBoard');
  element.classList.add('mediumCells');
  addCells(17 * 17);
  const cells = document.querySelectorAll('.cell');
  for (let i = 0; i < (17 * 17); i++) {
    cells[i].classList.add('medium');
  }
  drawField(17, 17, 50);
  messageDisplay.textContent = "50 flags left";
}

// Рисуем поле 25*25
function bigField() {
  board.classList.add('bigBoard');
  element.classList.add('bigCells');
  addCells(25 * 25);
  const cells = document.querySelectorAll('.cell');
  for (let i = 0; i < (25 * 25); i++) {
    cells[i].classList.add('big');
  }
  drawField(25, 25, 100);
  messageDisplay.textContent = "100 flags left";
}

// Create a field
function createField(numberOfRows, numberOfColumns, numberOfBombs) {
  let field = plantBombs(numberOfRows, numberOfColumns, numberOfBombs);
  shuffle(field);
  plantNumbers(field, numberOfRows, numberOfColumns);
  return field;
}

// Draw a field
function drawField(numberOfRows, numberOfColumns, numberOfBombs) {
  const cells = document.querySelectorAll('.cell');
  let field = createField(numberOfRows, numberOfColumns, numberOfBombs);
  let numberOfPlantedFlags = 0;
  for (let i = 0; i < field.length; i++) {
    cells[i].classList.remove('num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8', 'bomb', 'clicked', 'flag');
    cells[i].addEventListener('contextmenu', function (event) {
      event.preventDefault();
      if (!gameOver) {
        if (!this.classList.contains('flag')) {
          this.classList.add('flag');
          numberOfPlantedFlags++;
          messageDisplay.textContent = (numberOfBombs - numberOfPlantedFlags) + " " + "flags left";
        } else {
          this.classList.remove('flag');
          numberOfPlantedFlags--;
          messageDisplay.textContent = (numberOfBombs - numberOfPlantedFlags) + " " + "flags left";
        }
      }
    });
    if (field[i] === '*') {
      cells[i].addEventListener('click', function () {
        if (!gameOver) {
          openAllCells(field);
        }
      });
    } else {
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8].includes(field[i])) {
        cells[i].addEventListener('click', function () {
          if (!gameOver) {
            this.classList.add('num' + field[i], 'clicked');
          }
        });
      }
    }
  }
}


//  planting bomb on the field
function plantBombs(numberOfRows, numberOfColumns, numberOfBombs) {
  let fieldWithBomb = [];
  let numberOfPlantingBombs = 0;
  let numberOfFilledCells = 0;
  let numberOfCells = numberOfRows * numberOfColumns;
  for (let i = 0; i < numberOfCells; i++) {
    if (numberOfFilledCells < numberOfCells) {
      if (numberOfPlantingBombs < numberOfBombs) {
        fieldWithBomb.push('*');
        numberOfPlantingBombs++;
        numberOfFilledCells++;
      } else {
        fieldWithBomb.push(' ');
        numberOfFilledCells++;
      }
    }
  }
  //console.log(fieldWithBomb);
  return fieldWithBomb;
}

//shuffle field одна из вариаций алгоритма Фишера-Йетса
function shuffle(arr) {
  let j;
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

// converting one-dimensional coordinates to two-dimensional
function indexToCoords(i, numberOfColumns) {
  let x = Math.floor(i / numberOfColumns);
  let y = i - (Math.floor(i / numberOfColumns)) * numberOfColumns;
  let k = [x, y];
  return k;
}
// converting two-dimensional coordinates to one-dimensional
function coordsToIndex(k, numberOfColumns) {
  let i = k[0] * numberOfColumns + k[1];
  return i;
}

// finding neighbous
function findNeighbours(numberOfRows, numberOfColumns, k) {
  let x = k[0];
  let y = k[1];
  let neighbours = [];
  if (x !== 0 && y !== 0 && x !== (numberOfRows - 1) && y !== (numberOfColumns - 1)) {
    neighbours = [[x, y - 1], [x, y + 1], [x - 1, y], [x + 1, y], [x - 1, y - 1], [x - 1, y + 1], [x + 1, y - 1], [x + 1, y + 1]];
  }
  if (x === 0 && y === 0) {
    neighbours = [[x, y + 1], [x + 1, y], [x + 1, y + 1]]
  }
  if (x === 0 && y === (numberOfColumns - 1)) {
    neighbours = [[x, y - 1], [x + 1, y], [x + 1, y - 1]]
  }
  if (x === (numberOfRows - 1) && y === 0) {
    neighbours = [[x, y + 1], [x - 1, y], [x - 1, y + 1]]
  }
  if (x === (numberOfRows - 1) && y === (numberOfColumns - 1)) {
    neighbours = [[x, y - 1], [x - 1, y], [x - 1, y - 1]]
  }
  if (x === 0 && y !== 0 && y !== (numberOfColumns - 1)) {
    neighbours = [[x, y - 1], [x, y + 1], [x + 1, y], [x + 1, y - 1], [x + 1, y + 1]];
  }
  if (x === (numberOfRows - 1) && y !== 0 && y !== (numberOfColumns - 1)) {
    neighbours = [[x, y - 1], [x, y + 1], [x - 1, y], [x - 1, y - 1], [x - 1, y + 1]];
  }
  if (y === 0 && x !== 0 && x !== (numberOfRows - 1)) {
    neighbours = [[x, y + 1], [x - 1, y], [x + 1, y], [x - 1, y + 1], [x + 1, y + 1]];
  }
  if (y === (numberOfColumns - 1) && x !== 0 && x !== (numberOfRows - 1)) {
    neighbours = [[x, y - 1], [x - 1, y], [x + 1, y], [x - 1, y - 1], [x + 1, y - 1]];
  }
  return neighbours;
}

// planting numbers
function plantNumbers(arr, numberOfRows, numberOfColumns) {
  for (let i = 0; i < arr.length; i++) {
    let k = indexToCoords(i, numberOfColumns);
    let neighbours = findNeighbours(numberOfRows, numberOfColumns, k);
    if (arr[i] !== '*') {
      let num = 0;
      for (let j = 0; j < neighbours.length; j++) {
        let neighbourI = coordsToIndex(neighbours[j], numberOfColumns)
        if (arr[neighbourI] === '*') {
          num++;
        }
      }
      arr[i] = num;
    } else {
      arr[i] = '*';
    }
  }
  return arr;
}

function openAllCells(arr) {
  const cells = document.querySelectorAll('.cell');
  gameOver = true;
  messageDisplay.textContent = "Game over!!!";
  messageDisplay.classList.add('gameOver');
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === '*') {
      cells[i].classList.add('bomb');
    } else {
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8].includes(arr[i])) {
        cells[i].classList.add('num' + arr[i], 'clicked');
      }
    }
  }
}
