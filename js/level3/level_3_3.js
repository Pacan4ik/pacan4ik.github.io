const level1_3HTML = `<div class="game-container" id="container-level1_3">
            <div id="timer" class="timer">60.000</div>
            <div class="scale">
               <img id="scale-image" src="../../img/balanced.png" alt="Scales">
                <div class="info">Left: <span id="left-weight">0</span> | Right: <span id="right-weight">0</span></div>
                 <div class="number-zone">
                    <div id="main-num" class="number-to-move">123</div>
                    <div id="next-num" class="next-number">0</div>
                </div>
                <div id="bar" class="time-progress-bar"></div>
            </div>
            <div class="number-container" id="number-container-level1_3"></div>
            <div class="drop-zone" id="left-container"></div>
            <div class="drop-zone" id="right-container"></div>
        </div>`;
document.getElementById("body-game").innerHTML = level1_3HTML;


addStyleSheet('../../css/level3.css');

let leftWeight = 0;
let rightWeight = 1;
let gameIsEnded = false;
const INITIAL_DIFF = 100;
const INITIAL_MAX = 400;
let currentNumber = null;
let nextNumber = null;
const RAND_NUM = 50;
const TIMER_BAR = 1500;


const leftContainer = document.getElementById('left-container');
const rightContainer = document.getElementById('right-container');
const scaleImage = document.getElementById('scale-image')
const currentNumberElement = document.getElementById('main-num');
const numberTimerElement = document.getElementById('bar');

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

function handleKeyPress(event) {
  if (gameIsEnded || !currentNumber) return;

  switch (event.key) {
    case 'ArrowLeft':
      leftWeight += currentNumber;
      animateNumberInContainer(leftContainer, currentNumber, 'slide-in-right');
      break;
    case 'ArrowRight':
      rightWeight += currentNumber;
      animateNumberInContainer(rightContainer, currentNumber, 'slide-in-left');
      break;
    case 'ArrowDown':
      break;
    default:
      return;
  }

  updateScale();
  currentNumber = null;
  startNumberSequence();
}

document.addEventListener('keydown', handleKeyPress);


function animateNumberInContainer(container, number, animationClass) {
  const numberElement = document.createElement('div');
  numberElement.className = 'number';
  numberElement.textContent = number;
  numberElement.style.top = Math.random() * 75 + '%';
  updateNumberStyle(numberElement, number);
  numberElement.classList.add(animationClass);
  container.appendChild(numberElement);
  setManagedTimeout(() => {
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(number => {
      let opacity = parseFloat(window.getComputedStyle(number).opacity);
      if (number.id !== 'main-num' && opacity > 0) {
        opacity -= 0.2;
        number.style.opacity = opacity;
      }
    });
  }, 500);

}

function generateRandomNumber() {
  return Math.floor(Math.random() * RAND_NUM) + 1;
}

let numberTimerInterval = null;

function startNumberSequence() {
  if (gameIsEnded) return;

  const currentNumberElement = document.getElementById('main-num');
  const nextNumberElement = document.getElementById('next-num');

  if (!nextNumber) nextNumber = generateRandomNumber();

  currentNumber = nextNumber;
  nextNumber = generateRandomNumber();

  currentNumberElement.style.animation = 'slideUpAndFade 0.5s forwards';
  nextNumberElement.style.animation = 'slideUpAndGrow 0.5s forwards';

  setManagedTimeout(() => {
    currentNumberElement.style.animation = '';
    nextNumberElement.style.animation = '';
    updateNumberStyle(currentNumberElement, currentNumber);
    currentNumberElement.textContent = currentNumber;
    nextNumberElement.textContent = nextNumber;
  }, 500);




  numberTimerElement.style.width = '100%';
  let timeLeft = TIMER_BAR;
  if (numberTimerInterval) clearInterval(numberTimerInterval);
  numberTimerInterval = setManagedInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(numberTimerInterval);
      handleNumberTimeout();
    } else {
      timeLeft -= 100;
      const percentage = (timeLeft / TIMER_BAR) * 100;
      numberTimerElement.style.width = `${percentage}%`;
    }
  }, 100);
}


function handleNumberTimeout() {
  startNumberSequence();
}


function updateNumberStyle(element, value) {
  const maxColorValue = 255;
  const gradient = Math.min(value * 5, maxColorValue);
  element.style.color = `rgb(${gradient}, ${maxColorValue - gradient}, 128)`;

  if (element.id === 'main-num') return;
  const maxFontSize = 50;
  const minFontSize = 10;
  const scaleFactor = 5;

  const fontSize = Math.min(minFontSize + Math.sqrt(value) * scaleFactor, maxFontSize);
  element.style.fontSize = `${fontSize}px`;
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
  startNumberSequence();
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
  leftContainer.style.left = `${scaleRect.left + 57}px`;
  leftContainer.style.top = `${verticalPositionLeft - 120}px`;

  rightContainer.style.position = 'absolute';
  rightContainer.style.left = `${scaleRect.right - 333}px`;
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
  overlay.innerHTML = 'Уровень 3.3<br><br>Управляя стрелками на клавиатуре уравновесьте весы' +
    ' за отведенное время.<br>Left-arrow - левая чаша<br>Right-arrow - правая чаша<br>Down arrow - пропустить число' +
    ' <br><br><br>Нажмите, чтобы начать';

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
        numberTimerElement.style.display = 'none';
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
    clearAllManagedTimers();
    allLevelsComplete();
  });

  document.body.appendChild(overlay);
}



