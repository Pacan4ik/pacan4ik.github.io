function level2Create() {
  const level1_2HTML = `
<div class="game-container" id="container-level1_2">
   <div class="timer-container">
      <div id="timer" class="timer">60.000</div>
      <div class="counter-container" id="counter-container">
          <div class="counter-text">Осталось чисел: </div>
          <div id="left-numbers-counter"></div>
      </div>
   </div>
  <div class="scale">
     <img id="scale-image" src="./img/balanced.png" alt="Scales">
      <div class="info">
          <div class="text-side hidden">Left:</div>
          <span id="left-weight">0</span>
          <div class="text-splitter">|</div>
          <div class="text-side hidden">Right:</div>
          <span id="right-weight">0</span>
      </div>
  </div>
  <div class="number-container" id="number-container-level1_2"></div>
  <div class="drop-zone" id="left-container"></div>
  <div class="drop-zone" id="right-container"></div>
</div>
<details class="hint-container container" open>
    <summary class="hint-header">Подсказка</summary>
    <div class="hint-content">
        <p>Уравновесьте весы, удерживая мышь над чашами.</p>
        <p>Чем дольше удерживать, тем больше вырастет число!</p>
        <p>На 2-м и 3-м уровнях у Вас ограниченное количество чисел.</p>
        <p>Вы будете получать штраф за переполнение начального значения весов.</p>
    </div>
</details>`;
  document.getElementById('body-game').innerHTML = level1_2HTML;

  let leftWeight = 0;
  let rightWeight = 1;
  let gameIsEnded = false;

  let initialDiff;
  let initialMax;
  let initialMin;
  let growInterval;
  let numbersCountCap;

  function setVars() {
    let params;
    switch (curDifficulty) {
      case 1:
        params = gameConfig.type2.easy;
        break;
      case 2:
        params = gameConfig.type2.medium;
        break;
      case 3:
        params = gameConfig.type2.hard;
        break;
    }
    initialDiff = params.initialDiff;
    initialMax = params.initialMax;
    initialMin = params.initialMin;
    growInterval = params.growInterval;
    numbersCountCap = params.numbersCountCap === "infinity" ? Infinity : params.numbersCountCap;
  }


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
      scaleImage.src = './img/balanced.png';
    } else if (leftWeight > rightWeight) {
      scaleImage.src = './img/left-heavy.png';
    } else {
      scaleImage.src = './img/right-heavy.png';
    }
    document.getElementById('left-weight').textContent = leftWeight;
    document.getElementById('right-weight').textContent = rightWeight;
  }


  let growingNumber = null;
  let growManagedInterval = null;
  let downed = false;

  function handleMouseDown(event) {
    event.stopPropagation();
    if (gameIsEnded) return;
    // if (falling) return;
    const numberContainer = event.currentTarget;
    downed = true;
    growingNumber = document.createElement('div');
    growingNumber.className = 'number';
    growingNumber.textContent = 1;

    growingNumber.style.position = 'absolute';
    growingNumber.style.left = `${event.clientX - numberContainer.getBoundingClientRect().left - 20}px`;
    growingNumber.style.top = `${event.clientY - numberContainer.getBoundingClientRect().top - 30}px`;
    growingNumber.style.pointerEvents = 'none';
    growingNumber.style.fontSize = '18px';
    growingNumber.growing = true;

    numberContainer.appendChild(growingNumber);

    growManagedInterval = setManagedInterval(() => {
      if (!gameIsEnded && growingNumber) {
        let currentValue = parseInt(growingNumber.textContent, 10) + 1;
        growingNumber.textContent = currentValue;
        updateNumberStyle(growingNumber, currentValue);
      }
    }, growInterval);
  }


  let usedNumbers = 0;

  function handleMouseUp(event) {
    event.stopPropagation();
    const container = event.currentTarget;
    if (!downed) return;
    downed = false;
    if (growingNumber) {
      clearInterval(growManagedInterval);
      growingNumber.growing = false;
      // falling = true;
      growingNumber.style.transition = 'top 0.3s';
      growingNumber.style.top = `${container.offsetHeight - growingNumber.offsetHeight + 10
      - parseInt(growingNumber.style.fontSize) * 0.1}px`;
      growingNumber.style.pointerEvents = 'none';

      if (container.id === 'left-container') {
        leftWeight += parseInt(growingNumber.textContent, 10);
      } else if (container.id === 'right-container') {
        rightWeight += parseInt(growingNumber.textContent, 10);
      }
      usedNumbers++;
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
      clearInterval(growManagedInterval);
      growingNumber.remove();
      growingNumber = null;
    }
  }


  function updateNumberStyle(element, value) {
    const hue = (value * 12) % 360;
    const saturation = 70;
    const lightness = 50;

    element.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    const maxFontSize = 50;
    const minFontSize = 10;
    const scaleFactor = 5;

    const fontSize = Math.min(minFontSize + Math.sqrt(value) * scaleFactor, maxFontSize);
    element.style.fontSize = `${fontSize}px`;
  }

  let initialWeightValueMax;

  function startLevel() {
    let initialLeftWeight = 0;
    let initialRightWeight = 0;
    setVars();

    do {
      initialLeftWeight = Math.floor(Math.random() * (initialMax - initialMin + 1)) + initialMin;
      initialRightWeight = Math.floor(Math.random() * (initialMax - initialMin + 1)) + initialMin;
    } while (Math.abs(initialLeftWeight - initialRightWeight) < initialDiff);


    addInitialNumber(leftContainer, initialLeftWeight);
    addInitialNumber(rightContainer, initialRightWeight);
    initialWeightValueMax = Math.max(initialLeftWeight, initialRightWeight);

    leftWeight = initialLeftWeight;
    rightWeight = initialRightWeight;
    updateScale();
    setManagedInterval(updateScale, 50);
    setManagedInterval(updateContainerPosition, 50);
    if (numbersCountCap < Infinity) {
      setManagedInterval(updateNumbersCount, 50);
    } else {
      document.getElementById('counter-container').style.display = 'none';
    }
  }

  const numbersLeftCounter = document.getElementById('left-numbers-counter');

  function updateNumbersCount() {
    numbersLeftCounter.innerHTML = numbersCountCap - usedNumbers < 0 ? `0` : `${numbersCountCap - usedNumbers}`;
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
    leftContainer.style.left = `${scaleRect.left + 85}px`;
    leftContainer.style.top = `${verticalPositionLeft - 190}px`;

    rightContainer.style.position = 'absolute';
    rightContainer.style.left = `${scaleRect.right - 290}px`;
    rightContainer.style.top = `${verticalPositionRight - 110}px`;

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
    overlay.innerHTML = `Уровень ${curDifficulty}.2<br><br>Удерживая мышь над чашами, уравновесьте весы` +
      ` за отведенное время. <br>За переполнение весов или использование большего количества чисел Вы получите штраф.<br><br><br>Нажмите, чтобы начать`;

    overlay.addEventListener('click', () => {
      document.getElementById('body-game').removeChild(overlay);
      startLevel();
      startTimer();
      document.getElementById('right-container').style.display = 'flex';
      document.getElementById('left-container').style.display = 'flex';
    });

    document.getElementById('body-game').appendChild(overlay);
  }

  showLevelMessage();


  let timeLeft = 60000;
  let penalty = 0;

  function startTimer() {
    const timerElement = document.getElementById('timer');
    const timerInterval = setManagedInterval(() => {
      if (!gameIsEnded) {
        if (leftWeight === rightWeight) {
          gameIsEnded = true;
          penalty = Math.round((leftWeight - initialWeightValueMax));
          gameWin();
        }
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          gameIsEnded = true;
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
    let capPenalty = 0;
    if (numbersCountCap < usedNumbers) {
      capPenalty = Math.round((usedNumbers - numbersCountCap) * 10);
    }
    penalty += capPenalty;
    penalty = penaltyScale(penalty);
    let result = Math.round((timeLeft / 60000) * 1000);
    let penaltyResult = result - penalty;
    penaltyResult = penaltyResult < 0 ? 0 : penaltyResult;
    let currentResult = parseInt(localStorage.getItem('currentResult'), 10) || 0;
    currentResult += penaltyResult;
    localStorage.setItem('currentResult', currentResult);
    curDifficulty++;
    showResultMessage(result, penalty, penaltyResult);
  }


}
