function level1Create() {
  const level1_1HTML = `<div class="game-container" id="container-level1_1">
            <div id="timer" class="timer">60.000</div>
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
            <div class="number-container" id="number-container-level1_1"></div>
            <div class="drop-zone" id="left-container"></div>
            <div class="target-number" id="right-container"></div>
        </div>
        <details class="hint-container container" open>
        <summary class="hint-header">Подсказка</summary>
        <div class="hint-content">
            <p>Уравновесьте весы перетаскивая числа на левую чашу весов.</p>
            <p>Чем больше число тем быстрее оно падает, постарайтесь поймать его!</p>
            <p>Вы также можете выбросить ненужные числа с чаши</p>
            <b>Внимание! Остерегайтесь бомб!</b>
        </div>
        </details>`;
  document.getElementById('body-game').innerHTML = level1_1HTML;


  let leftWeight = 0;
  let rightWeight = 1;
  let draggedElement = null;
  let isDragged = false;
  let prevPosition = null;
  let gameIsEnded = false;
  let penalty = 0;

  let maxStart;
  let minStart;

  let possibleValues;
  let createNumInterval;

  let bombChance;

  function setVars() {
    let params;
    switch (curDifficulty) {
      case 1:
        params = gameConfig.type1.easy;
        break;
      case 2:
        params = gameConfig.type1.medium;
        break;
      case 3:
        params = gameConfig.type1.hard;
        break;
    }
    maxStart = params.maxStart;
    minStart = params.minStart;
    possibleValues = params.possibleValues;
    createNumInterval = params.createNumInterval;
    bombChance = params.bombChance;
  }


  document.getElementById('right-container').textContent = rightWeight;
  const leftContainer = document.getElementById('left-container');
  const rightContainer = document.getElementById('right-container');
  const scaleImage = document.getElementById('scale-image');


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


  function createNumber() {
    if (gameIsEnded) return;
    const numberContainer = document.getElementById('number-container-level1_1');
    const number = document.createElement('div');
    number.className = 'number';
    number.draggable = false;

    if (Math.random() < bombChance) {
      number.textContent = '💣';
      number.dataset.value = 'bomb';
      number.speed = Math.floor(Math.random() * 3) + 2;
      number.style.fontSize = '45px';
    } else {
      const value = possibleValues[Math.floor(Math.random() * possibleValues.length)];
      number.textContent = value.numberd;
      number.dataset.value = value.numberd;
      number.speed = value.speed;
      switch (value.numberd) {
        case 1:
          number.style.color = 'blue';
          break;
        case 3:
          number.style.color = 'orange';
          number.style.fontSize = '40px';
          break;
        case 5:
          number.style.color = 'darkgreen';
          number.style.fontSize = '30px';
          break;
        case 7:
          number.style.color = 'red';
          number.style.fontSize = '25px';
          break;
        case 9:
          number.style.color = 'purple';
          number.style.fontSize = '20px';
          break;
        default:
          number.style.color = 'black';
      }
    }
    number.freezed = false;


    number.prevContainer = 'number-container-level1_1';
    number.style.position = 'absolute';
    number.style.top = '0';
    number.style.left = Math.random() * 80 + 5 + '%';
    number.style.zIndex = '30';
    numberContainer.appendChild(number);

    number.addEventListener('mousedown', handleMouseDown);

    restartAnimation(number);
  }

  function bombPenaltyAnimate(target, penalty) {
    cancelAnimationFrame(target.animationId);
    target.textContent = -penalty;
    target.style.color = '#990000';
    target.style.fontSize = '30px';
    target.classList.add('bomb-penalty-showed');
    setManagedTimeout(() => {
      target.remove();
    }, 1000);
  }

  function handleMouseDown(event) {
    draggedElement = event.target;
    if (draggedElement.dataset.value === 'bomb') {
      penalty += 10;
      bombPenaltyAnimate(draggedElement, penaltyScale(10));
      return;
    }

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
      draggedElement.style.left = (event.clientX - draggedElement.getBoundingClientRect().width / 2) + 'px';
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
        draggedElement.style.zIndex = '30';
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
    setVars();
    rightWeight = Math.floor(Math.random() * (maxStart - minStart + 1)) + minStart;
    rightContainer.textContent = rightWeight;
    setManagedInterval(createNumber, createNumInterval);
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
    leftContainer.style.left = `${scaleRect.left + 85}px`;
    leftContainer.style.top = `${verticalPositionLeft-120}px`;

    rightContainer.style.position = 'absolute';
    rightContainer.style.left = `${scaleRect.right - 300}px`;
    rightContainer.style.top = `${verticalPositionRight + 30}px`;

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
    overlay.innerHTML = `Уровень ${curDifficulty}.1<br><br>Перетащите цифры на левую чашу весов за отведенное время` +
      ` так, чтобы весы оказались в равновесии. <br><br><br>Нажмите, чтобы начать`;

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
    penalty = penaltyScale(penalty);
    let penaltyResult = result - penalty;
    penaltyResult = penaltyResult < 0 ? 0 : penaltyResult;
    let currentResult = parseInt(localStorage.getItem('currentResult'), 10) || 0;
    currentResult += penaltyResult;
    localStorage.setItem('currentResult', currentResult);
    curDifficulty++;
    showResultMessage(result, penalty, penaltyResult);
  }
}
