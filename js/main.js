document.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('currentUser');
  if (savedName && savedName !== 'debug') {
    document.getElementById('username-input').value = savedName;
  }
});

const userInputContainer = document.getElementById('userinput-container');

var level1type;
var level2type;
var level3type;
var curDifficulty;

function nextLevel() {
  if (curDifficulty === 4) {
    allLevelsComplete();
    return;
  }

  if (!shuffledArray) {
    // alert('Следующий уровень не был определен');
    showDebug();
    return;
  }

  let next = shuffledArray[curDifficulty - 1];
  switch (next) {
    case 1:
      level1Create();
      break;
    case 2:
      level2Create();
      break;
    case 3:
      level3Create();
      break;
  }
}

var shuffledArray;

function changeBackground() {
  document.getElementById('body-game').style.backgroundImage = 'none, url(img/ariphmeticbackground-filter.jpg)';
}

function setUser(username) {
  localStorage.setItem('currentUser', username.trim());
  localStorage.setItem('currentResult', 0);
}

function startGame() {
  const usernameInput = document.getElementById('username-input');
  const username = usernameInput.value.trim();
  if (!username) {
    usernameInput.focus();
    userInputContainer.classList.add('red-border-flash');
    setTimeout(() => {
      userInputContainer.classList.remove('red-border-flash');
    }, 1000);
    return;
  }
  changeBackground();
  setUser(username);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const array = [1, 2, 3];
  shuffledArray = shuffleArray(array);

  level1type = shuffledArray[0];
  level2type = shuffledArray[1];
  level3type = shuffledArray[2];

  curDifficulty = 1;
  nextLevel();
}

function viewLeaderboard() {
  const leaderboardHTML = `
    <div class="container">
      <h1>Таблица лидеров</h1>
      <div class="leaderboard-table-container">
      <table id="leaderboard-table">
        <thead>
          <tr>
            <th>Имя</th>
            <th>Очки</th>
          </tr>
        </thead>
        <tbody id="leaderboard-body"></tbody>
      </table>
      </div>
      <button id="leader-back-btn" class="animated-btn" onclick="goBack()">Назад</button>
    </div>
  `;
  document.getElementById('body-game').innerHTML = leaderboardHTML;
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  const leaderboardBody = document.getElementById('leaderboard-body');

  leaderboard
    .sort((a, b) => b.score - a.score)
    .forEach(entry => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const scoreCell = document.createElement('td');
      nameCell.textContent = entry.name;
      scoreCell.textContent = entry.score;
      row.appendChild(nameCell);
      row.appendChild(scoreCell);
      leaderboardBody.appendChild(row);
    });
}

function goBack() {
  location.reload();
}


function gameLost() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'result-message-overlay';
  overlay.innerHTML = `Время вышло!<br><br><br>Вы проиграли!<br><br><br>Нажмите, чтобы вернуться в начало`;

  overlay.addEventListener('click', () => {
    document.getElementById('body-game').removeChild(overlay);
    location.reload();
  });

  document.getElementById('body-game').appendChild(overlay);
}

function allLevelsComplete() {
  document.getElementById('body-game').innerHTML = '';
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'result-message-overlay';
  let score = parseInt(localStorage.getItem('currentResult'), 10);
  overlay.innerHTML = `Вы завершили все уровни!<br> Результат ${score}<br><br>Нажмите, чтобы продолжить`;

  addLeaderboardEntry(localStorage.getItem('currentUser'),
    parseInt(localStorage.getItem('currentResult'), 10));

  overlay.addEventListener('click', () => {
    document.getElementById('body-game').removeChild(overlay);
    document.getElementById('body-game').style.backgroundImage =
      'radial-gradient(circle, transparent, rgba(0, 0, 0, 0.2)), url(img/ariphmeticbackground.jpg)';
    viewLeaderboard();
  });

  document.getElementById('body-game').appendChild(overlay);
}

function addLeaderboardEntry(name, score) {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

  leaderboard.push({name, score});

  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}


let timers = [];
let intervals = [];


function setManagedTimeout(callback, delay) {
  const id = setTimeout(callback, delay);
  timers.push(id);
  return id;
}

function setManagedInterval(callback, interval) {
  const id = setInterval(callback, interval);
  intervals.push(id);
  return id;
}

function clearAllManagedTimers() {
  timers.forEach(clearTimeout);
  intervals.forEach(clearInterval);
  timers = [];
  intervals = [];
}

function penaltyScale(pen) {
  return Math.round(pen * curDifficulty);
}

function showResultMessage(result, penalty, penaltyResult) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'result-message-overlay';
  let finalMessage = `Игра окончена!<br><br>Ваш результат: ${result} очков<br><br><br>Нажмите, чтобы продолжить`;
  if (penalty !== 0) {
    finalMessage = `Игра окончена!<br><br>Ваш результат: ${result} очков<br>Штраф: ${penalty} очков<br>Итого: ${penaltyResult} очков<br><br>Нажмите, чтобы продолжить`;
  }
  overlay.innerHTML = finalMessage;

  overlay.addEventListener('click', () => {
    document.getElementById('body-game').removeChild(overlay);
    clearAllManagedTimers();
    nextLevel();
  });

  document.getElementById('body-game').appendChild(overlay);
}
