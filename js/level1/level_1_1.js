const level1_1HTML = `<div class="game-container" id="container-level1_1">
            <div id="timer" class="timer">60.000</div>
            <div class="scale">
               <img id="scale-image" src="../../img/balanced.png" alt="Scales">
                <div class="info">Left: <span id="left-weight">0</span> | Right: <span id="right-weight">0</span></div>
            </div>
            <div class="number-container" id="number-container-level1_1"></div>
            <div class="drop-zone" id="left-container"></div>
            <div class="target-number" id="right-container"></div>
        </div>`;
document.getElementById("body-game").innerHTML = level1_1HTML;

addStyleSheet('../../css/level1.css');


let leftWeight = 0;
let rightWeight = 1;
let draggedElement = null;
let isDragged = false;
let prevPosition = null;
let gameIsEnded = false;
const MAX_START = 40;
const SPEED1 = 2;
const SPEED2 = 3;
const SPEED3 = 4;

document.getElementById('right-container').textContent = rightWeight;
const leftContainer = document.getElementById('left-container');
const rightContainer = document.getElementById('right-container');
const scaleImage = document.getElementById('scale-image');


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

const possibleValues = [1, 3, 5];




function createNumber() {
  if (gameIsEnded) return;
  const numberContainer = document.getElementById('number-container-level1_1');
  const number = document.createElement('div');
  number.className = 'number';
  number.draggable = false;

  const value = possibleValues[Math.floor(Math.random() * possibleValues.length)];
  number.textContent = value;
  number.dataset.value = value;
  number.speed = 2;
  number.freezed = false;


  switch (value) {
    case 1:
      number.style.color = 'blue';
      number.speed = SPEED1;
      break;
    case 3:
      number.style.color = 'orange';
      number.style.fontSize = '40px';
      number.speed = SPEED2;
      break;
    case 5:
      number.style.color = 'darkgreen';
      number.style.fontSize = '30px';
      number.speed = SPEED3;
      break;
    default:
      number.style.color = 'black';
  }

  number.prevContainer = 'number-container-level1_1';
  number.style.position = 'absolute';
  number.style.top = '0';
  number.style.left = Math.random() * 80 + 5 + '%';
  numberContainer.appendChild(number);

  number.addEventListener('mousedown', handleMouseDown);

  restartAnimation(number);
}

function handleMouseDown(event) {
  draggedElement = event.target;
  const pos = draggedElement.getBoundingClientRect();
  prevPosition = {
    block: isMouseOverBlock(event, 'left-container') ? 'left-container' : 'number-container-level1_1',
    x: pos.x,
    y: pos.y
  };
  draggedElement.style.position = 'absolute';
  draggedElement.style.zIndex = '100';
  draggedElement.prevContainer = prevPosition.block;
  cancelAnimationFrame(draggedElement.animationId);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
}


function isMouseOverBlock(event, blockId, element) {
  const block = document.getElementById(blockId);
  const blockRect = block.getBoundingClientRect();
  const elementRect = element ? element.getBoundingClientRect() : {width: 0, height: 0};
  const mouseX = event.clientX - elementRect.width / 2;
  const mouseY = event.clientY - elementRect.height / 2;

  return (
      mouseX >= blockRect.left &&
      mouseX + elementRect.width <= blockRect.right &&
      mouseY >= blockRect.top &&
      mouseY + elementRect.height <= blockRect.bottom
  );
}

function handleMouseMove(event) {
  if (draggedElement) {
    isDragged = true; //dragged
    draggedElement.style.left = (event.clientX - draggedElement.getBoundingClientRect().width / 2 - 27) + 'px';
    draggedElement.style.top = (event.clientY - draggedElement.getBoundingClientRect().height / 2 - 120) + 'px';
  }
}

function handleMouseUp(event) {
  if (draggedElement) {
    if (isMouseOverBlock(event, 'left-container')) {
      if (draggedElement.prevContainer === 'number-container-level1_1') {
        leftWeight += parseInt(draggedElement.dataset.value, 10);
      }
      draggedElement.freezed = true;
      resetElementPosition(draggedElement, 'left-container');
    } else {
      resetElementPosition(draggedElement, 'number-container-level1_1');
      draggedElement.freezed = false;
    }

    setManagedTimeout(() => { //is dragged
      isDragged = false;
    }, 100);


    draggedElement = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }
}

function resetElementPosition(element, block) {
  if (block === 'left-container') {
    //просто оставляем его на этом месте
  } else {
    restartAnimation(element);
    if (element.freezed) {
      leftWeight -= parseInt(element.dataset.value, 10);
    }
  }
}

function restartAnimation(element) {
  const animate = () => {
    const currentTop = parseInt(element.style.top, 10);
    if (currentTop >= document.getElementById('number-container-level1_1').offsetHeight - 95) {
      element.remove();
      cancelAnimationFrame(element.animationId);
    } else {
      element.style.top = currentTop + element.speed + 'px';
      element.animationId = requestAnimationFrame(animate);
    }
  };

  element.animationId = requestAnimationFrame(animate);
}



function startLevel() {
  rightWeight = Math.floor(Math.random() * MAX_START + 10);
  rightContainer.textContent = rightWeight;
  setManagedInterval(createNumber, 1000);
  setManagedInterval(updateScale, 50);
  setManagedInterval(updateContainerPosition, 50);
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
  leftContainer.style.left = `${scaleRect.left + 60}px`;
  leftContainer.style.top = `${verticalPositionLeft - 120}px`;

  rightContainer.style.position = 'absolute';
  rightContainer.style.left = `${scaleRect.right - 315}px`;
  rightContainer.style.top = `${verticalPositionRight + 20}px`;

  let offsetNumbers = prevPos - verticalPositionLeft + 120;
  const freezedNumbers = Array.from(document.getElementsByClassName('number'));
  freezedNumbers.forEach(number => {
    if (number.freezed) {
      number.style.top = parseInt(number.style.top, 10) - offsetNumbers + 'px';
    }
  });
}


updateContainerPosition();

function showLevelMessage() {
  rightContainer.style.display = 'none';
  leftContainer.style.display = 'none';
  const overlay = document.createElement('div');
  overlay.id = 'level-message-overlay';
  overlay.className = 'overlay';
  overlay.innerHTML = 'Уровень 1.1<br><br>Перетащите цифры на левую чашу весов за отведенное время' +
      ' так, чтобы весы оказались в равновесии. <br><br><br>Нажмите, чтобы начать';

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
    removeStyleSheet('../../css/level1.css');
    let nextLevel = localStorage.getItem('level2');
    clearAllManagedTimers();
    addScript(`js/level2/level_2_${nextLevel}.js`);
  });

  document.body.appendChild(overlay);
}
