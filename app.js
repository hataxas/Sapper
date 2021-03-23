let gameOver = false;
let numberOfPlantedFlags = 0;

const board = document.querySelector('.board');
const cellsContainer = document.getElementById('cellsContainer');
const menuSmallFieldSize = document.querySelector('.menu-small');
const menuMediumlFieldSize = document.querySelector('.menu-medium');
const menuBigFieldSize = document.querySelector('.menu-big');
const messageDisplay = document.querySelector('.message');

menuSmallFieldSize.addEventListener("click", smallField);
menuMediumlFieldSize.addEventListener("click", mediumField);
menuBigFieldSize.addEventListener("click", bigField);
cellsContainer.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});

//! Draw a field
// Field 10*10
function smallField() {
  let numberOfRows = 10;
  let numberOfColumns = 10;
  let numberOfBombs = 20;
  let size = 'small';
  drawFieldRightSize(size, numberOfRows, numberOfColumns, numberOfBombs);
}

// Field 17*17
function mediumField() {
  let numberOfRows = 17;
  let numberOfColumns = 17;
  let numberOfBombs = 50;
  let size = 'medium';
  drawFieldRightSize(size, numberOfRows, numberOfColumns, numberOfBombs);
}

// Field 25*25
function bigField() {
  let numberOfRows = 25;
  let numberOfColumns = 25;
  let numberOfBombs = 100;
  let size = 'big';
  drawFieldRightSize(size, numberOfRows, numberOfColumns, numberOfBombs);
}

function drawFieldRightSize(size, numberOfRows, numberOfColumns, numberOfBombs) {
  board.classList.add(size + 'Board');
  cellsContainer.classList.add(size + 'Cells');
  drawClosedCells(numberOfRows * numberOfColumns);
  const cells = document.querySelectorAll('.cell');
  for (let i = 0; i < (numberOfRows * numberOfColumns); i++) {
    cells[i].classList.add(size);
  }
  createAndDrawField(numberOfRows, numberOfColumns, numberOfBombs);
}

function drawClosedCells(numberOfCells) {
  cellsContainer.innerHTML = '';
  gameOver = false;
  messageDisplay.classList.remove('gameOver');
  for (let i = 0; i < numberOfCells; i++) {
    const newCell = document.createElement('div');
    newCell.classList.add('cell');
    cellsContainer.appendChild(newCell);
  }
}

function createAndDrawField(numberOfRows, numberOfColumns, numberOfBombs) {
  const cells = document.querySelectorAll('.cell');
  let field = createField(numberOfRows, numberOfColumns, numberOfBombs);
  numberOfPlantedFlags = 0;
  messageDisplay.classList.remove('win');
  for (let i = 0; i < field.length; i++) {
    cells[i].classList.remove('num0', 'num1', 'num2', 'num3', 'num4', 'num5', 'num6', 'num7', 'num8', 'bombs', 'open', 'flag');
    setRemoveFlag(cells[i], field, field[i], numberOfBombs, numberOfPlantedFlags);
    openCell(field[i], field, cells[i], numberOfColumns);
  }
}

function setRemoveFlag(cell, arr, arrElement, numberOfBombs) {
  messageDisplay.textContent = numberOfBombs + " flags left";
  cell.addEventListener('contextmenu', function () {
    if (!gameOver && !arrElement.open) {
      if (!arrElement.flag) {
        this.classList.add('flag');
        arrElement.flag = true;
        console.log(arrElement);
        numberOfPlantedFlags++;
      } else {
        this.classList.remove('flag');
        arrElement.flag = false;
        numberOfPlantedFlags--;
      }
      messageDisplay.textContent = (numberOfBombs - numberOfPlantedFlags) + " " + "flags left";
      checkField(arr);
    }
  });
}

function openCell(arrElement, arr, cell, numberOfColumns) {
  if (arrElement.bomb === '*') {
    cell.addEventListener('click', function () {
      if (!gameOver) {
        openAllCells(arr);
      }
    });
  } else {
    if ([0, 1, 2, 3, 4, 5, 6, 7, 8].includes(arrElement.number)) {
      cell.addEventListener('click', function () {
        if (!gameOver) {
          this.classList.add('num' + arrElement.number, 'open');
          openEmptyCells(arrElement, arr, numberOfColumns);
          openCellsWithoutBombs(arrElement, arr, cell, numberOfColumns);
          checkField(arr);
        }
      });
    }
  }
}

function openEmptyCells(cell, arr, numberOfColumns) {
  cell.open = true;
  if (cell.number === 0) {
    const cells = document.querySelectorAll('.cell');
    for (let j = 0; j < cell.neighbours.length; j++) {
      let k = cell.neighbours[j];
      let neighbourIndex = coordsToIndex(k, numberOfColumns);
      if ([0, 1, 2, 3, 4, 5, 6, 7, 8].includes(arr[neighbourIndex].number) && !arr[neighbourIndex].open) {
        cells[neighbourIndex].classList.add('num' + arr[neighbourIndex].number, 'open');
        arr[neighbourIndex].open = true;
        openEmptyCells(arr[neighbourIndex], arr, numberOfColumns);
      }
    }
  }
}

function openCellsWithoutBombs(arrElement, arr, cell, numberOfColumns) {
  const cells = document.querySelectorAll('.cell');
  cell.addEventListener('dblclick', function () {
    if (arrElement.open && !gameOver) {
      let allowToOpen = true;
      for (let j = 0; j < arrElement.neighbours.length; j++) {
        let k = arrElement.neighbours[j];
        let neighbourIndex = coordsToIndex(k, numberOfColumns);
        if (arr[neighbourIndex].bomb === '*' && !arr[neighbourIndex].flag) {
          allowToOpen = false;
        }
      }
      if (allowToOpen) {
        for (let j = 0; j < arrElement.neighbours.length; j++) {
          let k = arrElement.neighbours[j];
          let neighbourIndex = coordsToIndex(k, numberOfColumns);
          cells[neighbourIndex].classList.add('num' + arr[neighbourIndex].number, 'open');
          cell.open = true;
          openEmptyCells(arr[neighbourIndex], arr, numberOfColumns);
        }
      }
    }
  });
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
    showWinningMessage(arr);
  }
}

function showWinningMessage(arr) {
  const cells = document.querySelectorAll('.cell');
  gameOver = true;
  messageDisplay.textContent = "You won!!!";
  messageDisplay.classList.add('win');
}

//! Create a field
function createField(numberOfRows, numberOfColumns, numberOfBombs) {
  let field = createUnshaffledField(numberOfRows, numberOfColumns, numberOfBombs);
  shuffleArray(field);
  plantNumbers(field, numberOfRows, numberOfColumns);
  return field;
}

// add cells on the field
function createEmptyField(numberOfRows, numberOfColumns) {
  let fieldWithCells = [];
  let numberOfCells = numberOfRows * numberOfColumns;
  for (let i = 0; i < numberOfCells; i++) {
    let cell = {
      open: false,
      flag: false,
      bomb: "",
      number: 0,
      neighbours: []
    };
    fieldWithCells.push(cell);
  }
  return fieldWithCells;
}

// planting bomb on the field
function createUnshaffledField(numberOfRows, numberOfColumns, numberOfBombs) {
  let fieldWithCells = createEmptyField(numberOfRows, numberOfColumns);
  let numberOfPlantingBombs = 0;
  let fieldWithBomb = fieldWithCells.map(function (cell) {
    if (numberOfPlantingBombs < numberOfBombs) {
      cell['bomb'] = '*';
      numberOfPlantingBombs++;
      return cell;
    } else {
      cell['bomb'] = ' ';
      return cell;
    }
  });
  return fieldWithBomb;
}

//shuffle field одна из вариаций алгоритма Фишера-Йетса
function shuffleArray(arr) {
  let j;
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
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
    arr[i].neighbours = neighbours;
    if (arr[i].bomb !== '*') {
      let num = 0;
      for (let j = 0; j < neighbours.length; j++) {
        let neighbourI = coordsToIndex(neighbours[j], numberOfColumns)
        if (arr[neighbourI].bomb === '*') {
          num++;
        }
      }
      arr[i].number = num;
    } else {
      arr[i].number = '';
    }
  }
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
        cells[i].classList.add('num' + arr[i].number, 'open');
      }
    }
  }
}
