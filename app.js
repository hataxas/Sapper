let gameOver = false;
// let cell = {
//   open: false,
//   closed: true,
//   flag: false,
//   bomb: "",
//   number: '',
//   neighbours: []
// };

const board = document.querySelector('.board');
const element = document.getElementById('cells');
const menuSmallFieldSize = document.querySelector('.menu-small');
const menuMediumlFieldSize = document.querySelector('.menu-medium');
const menuBigFieldSize = document.querySelector('.menu-big');
const messageDisplay = document.querySelector('.message');

menuSmallFieldSize.addEventListener("click", smallField);
menuMediumlFieldSize.addEventListener("click", mediumField);
menuBigFieldSize.addEventListener("click", bigField);

//! Draw a field
// Рисуем поле 10*10
function smallField() {
  board.classList.add('smallBoard');
  element.classList.add('smallCells');
  drawCells(100);
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
  drawCells(17 * 17);
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
  drawCells(25 * 25);
  const cells = document.querySelectorAll('.cell');
  for (let i = 0; i < (25 * 25); i++) {
    cells[i].classList.add('big');
  }
  drawField(25, 25, 100);
  messageDisplay.textContent = "100 flags left";
}

// Draw cells
function drawCells(numberOfCells) {
  element.innerHTML = '';
  gameOver = false;
  messageDisplay.classList.remove('gameOver');
  for (let i = 0; i < numberOfCells; i++) {
    const newCell = document.createElement('div');
    newCell.classList.add('cell');
    element.appendChild(newCell);
  }
}

// Draw field
function drawField(numberOfRows, numberOfColumns, numberOfBombs) {
  const cells = document.querySelectorAll('.cell');
  let field = createField(numberOfRows, numberOfColumns, numberOfBombs);
  let numberOfPlantedFlags = 0;
  for (let i = 0; i < field.length; i++) {
    cells[i].classList.remove('num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8', 'bombs', 'clicked', 'flag');
    cells[i].addEventListener('contextmenu', function (event) {
      event.preventDefault();
      if (!gameOver) {
        if (!field[i].flag && !field[i].open) {
          this.classList.add('flag');
          field[i].flag = true;
          console.log(field[i]);
          numberOfPlantedFlags++;
        } else {
          this.classList.remove('flag');
          field[i].flag = false;
          console.log(field[i]);
          numberOfPlantedFlags--;
        }
        messageDisplay.textContent = (numberOfBombs - numberOfPlantedFlags) + " " + "flags left";
      }
    });
    if (field[i].bomb === '*') {
      cells[i].addEventListener('click', function () {
        if (!gameOver) {
          openAllCells(field);
        }
      });
    } else {
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8].includes(field[i].number)) {
        cells[i].addEventListener('click', function () {
          if (!gameOver) {
            this.classList.add('num' + field[i].number, 'clicked');
            field[i].open = true;
            checkField(field);
          }
        });
      }
    }
  }
}

function checkField(arr) {
  gameOver = true;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].flag && arr[i].bomb !== '*') {
      gameOver = false;
      break;
    }
    if (!arr[i].open && !arr[i].flag) {
      gameOver = false;
      break;
    }
  }
  if (gameOver) {
    win(arr);
  }
}

//! Create a field
function createField(numberOfRows, numberOfColumns, numberOfBombs) {
  let field = plantBombs(numberOfRows, numberOfColumns, numberOfBombs);
  shuffle(field);
  plantNumbers(field, numberOfRows, numberOfColumns);
  return field;
}

// add cells on the field
function addCells(numberOfRows, numberOfColumns) {
  let fieldWithCells = [];
  let numberOfCells = numberOfRows * numberOfColumns;
  for (let i = 0; i < numberOfCells; i++) {
    let cell = {
      open: false,
      flag: false,
      bomb: "",
      number: '',
      neighbours: []
    };
    fieldWithCells.push(cell);
  }
  return fieldWithCells;
}

//  planting bomb on the field
function plantBombs(numberOfRows, numberOfColumns, numberOfBombs) {
  let fieldWithCells = addCells(numberOfRows, numberOfColumns);
  let numberOfPlantingBombs = 0;
  let fieldWithBomb = fieldWithCells.map(function (cell) {
    if (numberOfPlantingBombs < numberOfBombs) {
      cell['bomb'] = '*';  //!
      numberOfPlantingBombs++;
      return cell;
    } else {
      cell['bomb'] = ' ';  //!
      return cell;
    }
  });
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
  let neighbours = []; //!
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
    arr[i].neighbours = neighbours; //!
    if (arr[i].bomb !== '*') { //!
      let num = 0;
      for (let j = 0; j < neighbours.length; j++) {
        let neighbourI = coordsToIndex(neighbours[j], numberOfColumns)
        if (arr[neighbourI].bomb === '*') {
          num++;
        }
      }
      arr[i].number = num; //!
    } else {
      arr[i].number = ''; //!
    }
  }
  return arr;
}

//! Game over
function openAllCells(arr) {
  const cells = document.querySelectorAll('.cell');
  gameOver = true;
  messageDisplay.textContent = "Game over!!!";
  messageDisplay.classList.add('gameOver');
  for (let i = 0; i < arr.length; i++) {
    arr[i].open = true;
    if (arr[i].bomb === '*') {
      cells[i].classList.add('bombs');
    } else {
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8].includes(arr[i].number)) {
        cells[i].classList.add('num' + arr[i].number, 'clicked');
      }
    }
  }
}

function win(arr) {
  const cells = document.querySelectorAll('.cell');
  gameOver = true;
  messageDisplay.textContent = "You won!!!";
  messageDisplay.classList.add('win');
}
