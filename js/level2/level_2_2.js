const level1_2HTML = `<div class="game-container" id="container-level1_2">
            <div id="timer" class="timer">60.000</div>
            <div class="scale">
               <img id="scale-image" src="../../img/balanced.png" alt="Scales">
                <div class="info">Left: <span id="left-weight">0</span> | Right: <span id="right-weight">0</span></div>
            </div>
            <div class="number-container" id="number-container-level1_2"></div>
            <div class="drop-zone" id="left-container"></div>
            <div class="drop-zone" id="right-container"></div>
        </div>`;
document.getElementById("body-game").innerHTML = level1_2HTML;


addStyleSheet('../../css/level2.css');

let leftWeight = 0;
let rightWeight = 1;
let gameIsEnded = false;
const INITIAL_DIFF = 70;
const INITIAL_MAX = 300;
const GROW_INTERVAl = 50;


// document.getElementById('right-container').textContent = rightWeight;

const leftContainer = document.getElementById('left-container');
const rightContainer = document.getElementById('right-container');
const scaleImage = document.getElementById('scale-image')

leftContainer.addEventListener('mousedown', handleMouseDown);
leftContainer.addEventListener('mouseup', handleMouseUp);
leftContainer.addEventListener('mouseleave', handleMouseLeave);

rightContainer.addEventListener('mousedown', handleMouseDown);
rightContainer.addEventListener('mouseup', handleMouseUp);
rightContainer.addEventListener('mouseleave', handleMouseLeave);

function updateScale() {
  const scaleImage = document.getElementById('scale-image');
  if (leftWeight === rightWeight) {
    scaleImage.src = '../../img/balanced.png';
  } else if (leftWeight > rightWeight) {
    scaleImage.src = '../../img/left-heavy.png';
  } else {
    scaleImage.src = '../../img/right-heavy.png';
  }
  document.getElementById('left-weight').textContent = leftWeight;
  document.getElementById('right-weight').textContent = rightWeight;
}


let growingNumber = null;
let growInterval = null;


function handleMouseDown(event) {
  if (gameIsEnded) return;
  const numberContainer = event.target;
  growingNumber = document.createElement('div');
  growingNumber.className = 'number';
  growingNumber.textContent = 1;

  growingNumber.style.position = 'absolute';
  growingNumber.style.left = `${event.clientX - numberContainer.getBoundingClientRect().left - 20}px`;
  growingNumber.style.top = `${event.clientY - numberContainer.getBoundingClientRect().top - 30}px`;
  growingNumber.style.pointerEvents = 'none';
  growingNumber.growing = true;

  numberContainer.appendChild(growingNumber);

  growInterval = setManagedInterval(() => {
    if (!gameIsEnded && growingNumber) {
      let currentValue = parseInt(growingNumber.textContent, 10) + 1;
      growingNumber.textContent = currentValue;
      updateNumberStyle(growingNumber, currentValue);
    }
  }, GROW_INTERVAl);
}

function updateNumberStyle(element, value) {
  const maxColorValue = 255;
  const gradient = Math.min(value * 5, maxColorValue);
  element.style.color = `rgb(${gradient}, ${maxColorValue - gradient}, 128)`;

  const maxFontSize = 50;
  const minFontSize = 10;
  const scaleFactor = 5;

  const fontSize = Math.min(minFontSize + Math.sqrt(value) * scaleFactor, maxFontSize);
  element.style.fontSize = `${fontSize}px`;
}

function handleMouseUp(event) {
  const container = event.target;
  if (growingNumber) {
    clearInterval(growInterval);
    growingNumber.growing = false;
    growingNumber.style.transition = 'top 0.5s';
    growingNumber.style.top = `${container.offsetHeight - growingNumber.offsetHeight + 20
    - parseInt(growingNumber.style.fontSize) * 0.5}px`;
    growingNumber.style.pointerEvents = 'auto';

    if (container.id === 'left-container') {
      leftWeight += parseInt(growingNumber.textContent, 10);
    } else {
      rightWeight += parseInt(growingNumber.textContent, 10);
    }
    updateScale();

    setManagedTimeout(() => {
      const numbers = document.querySelectorAll('.number');
      numbers.forEach(number => {
        let opacity = parseFloat(window.getComputedStyle(number).opacity);
        if (opacity > 0) {
          opacity -= 0.2;
          number.style.opacity = opacity;
        }
      });
    }, 500);
  }
}

function handleMouseLeave(event) {
  if (growingNumber && growingNumber.growing) {
    clearInterval(growInterval);
    growingNumber.remove();
    growingNumber = null;
  }
}


function startLevel() {
  let initialLeftWeight = 0;
  let initialRightWeight = 0;

  do {
    initialLeftWeight = Math.floor(Math.random() * INITIAL_MAX) + 1;
    initialRightWeight = Math.floor(Math.random() * INITIAL_MAX) + 1;
  } while (Math.abs(initialLeftWeight - initialRightWeight) < INITIAL_DIFF);


  addInitialNumber(leftContainer, initialLeftWeight);
  addInitialNumber(rightContainer, initialRightWeight);

  leftWeight = initialLeftWeight;
  rightWeight = initialRightWeight;
  updateScale();
  setManagedInterval(updateScale, 50);
  setManagedInterval(updateContainerPosition, 50);
}


function addInitialNumber(container, value) {
  const numberElement = document.createElement('div');
  numberElement.className = 'number';
  numberElement.textContent = value;

  updateNumberStyle(numberElement, value);

  numberElement.style.position = 'relative';
  numberElement.style.transition = 'top 0.5s';
  numberElement.style.top = `${container.offsetHeight - numberElement.offsetHeight + 70}px`;
  numberElement.style.pointerEvents = 'none';

  container.appendChild(numberElement);
}


function updateContainerPosition() {
  const scaleRect = scaleImage.getBoundingClientRect();
  let prevPos = parseInt(leftContainer.style.top, 10);
  let verticalPositionLeft = scaleRect.top + scaleRect.height / 2 - leftContainer.offsetHeight;
  let verticalPositionRight = scaleRect.top + scaleRect.height / 2 - rightContainer.offsetHeight;
  let offset = 0;
  if (leftWeight > rightWeight) {
    offset = 60;
  } else if (leftWeight < rightWeight) {
    offset = 20;
  } else {
    offset = 40;
  }
  verticalPositionLeft += offset;
  verticalPositionRight -= offset;
  leftContainer.style.position = 'absolute';
  leftContainer.style.left = `${scaleRect.left + 55}px`;
  leftContainer.style.top = `${verticalPositionLeft - 120}px`;

  rightContainer.style.position = 'absolute';
  rightContainer.style.left = `${scaleRect.right - 330}px`;
  rightContainer.style.top = `${verticalPositionRight - 40}px`;

  let offsetNumbers = prevPos - verticalPositionLeft;
  const freezedNumbers = Array.from(document.getElementsByClassName('number'));
  freezedNumbers.forEach(number => {
    if (number.freezed) {
      number.style.top = parseInt(number.style.top, 10) - offsetNumbers + 'px';
    }
  });
}


function showLevelMessage() {
  rightContainer.style.display = 'none';
  leftContainer.style.display = 'none';
  const overlay = document.createElement('div');
  overlay.id = 'level-message-overlay';
  overlay.className = 'overlay';
  overlay.innerHTML = 'Уровень 2.2<br><br>Удерживая мышь над чашами, уравновесьте весы' +
      ' за отведенное время. <br><br><br>Нажмите, чтобы начать';

  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay);
    startLevel();
    startTimer();
    document.getElementById('right-container').style.display = 'flex';
    document.getElementById('left-container').style.display = 'flex';
  });

  document.body.appendChild(overlay);
}

showLevelMessage();


let timeLeft = 60000;

function startTimer() {
  const timerElement = document.getElementById('timer');
  const timerInterval = setManagedInterval(() => {
    if (!gameIsEnded) {
      if (leftWeight === rightWeight) {
        gameIsEnded = true;
        gameWin();
      }
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        gameIsEnded = true;
        alert('Время вышло!');
        gameLost();
      } else {
        timeLeft -= 10;
        const seconds = Math.floor(timeLeft / 1000);
        const milliseconds = timeLeft % 1000;
        timerElement.textContent = `${seconds}.${milliseconds.toString().padStart(3, '0')}`;
      }
    }
  }, 10);
}

function gameWin() {
  let result = Math.round((timeLeft / 60000) * 1000);
  let currentResult = parseInt(localStorage.getItem('currentResult'), 10) || 0;
  currentResult += result;
  localStorage.setItem('currentResult', currentResult);
  showResultMessage(result);
}

function showResultMessage(result) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'result-message-overlay';
  overlay.innerHTML = `Игра окончена!<br><br>Ваш результат: ${result} очков<br><br><br>Нажмите, чтобы продолжить`;

  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay);
    removeStyleSheet('../../css/level2.css');
    let nextLevel = localStorage.getItem('level3');
    clearAllManagedTimers();
    addScript(`js/level3/level_3_${nextLevel}.js`);
  });

  document.body.appendChild(overlay);
}


