document.addEventListener('load', () => {

});

const savedName = localStorage.getItem('currentUser');
if (savedName) {
  document.getElementById('username-input').value = savedName;
}
console.log('loaded');

function startGame() {
  const username = document.getElementById('username-input').value.trim();
  if (!username) {
    alert('Пожалуйста, введите ваше имя');
    return;
  }

  localStorage.setItem('currentUser', username);
  localStorage.setItem('currentResult', 0);
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const array = [1, 2, 3];
  const shuffledArray = shuffleArray(array);

  localStorage.setItem('level1', shuffledArray[0]);
  localStorage.setItem('level2', shuffledArray[1]);
  localStorage.setItem('level3', shuffledArray[2]);
  const level1 = localStorage.getItem('level1');
  addScript(`js/level1/level_1_${level1}.js`);
  // addScript(`js/level3/level_3_1.js`);
}

function viewLeaderboard() {
  const leaderboardHTML = `
    <div class="container" id="leader-container">
      <h3>Таблица лидеров</h3>
      <div class="leaderboard-container">
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
      <button id="leader-back-btn" onclick="goBack()">Назад</button>
    </div>
  `;
  document.getElementById("body-game").innerHTML = leaderboardHTML;
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

function addScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.type = 'module';
  script.defer = true;
  document.body.appendChild(script);
}

function addStyleSheet(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function removeStyleSheet(href) {
  const links = document.querySelectorAll(`link[rel="stylesheet"][href="${href}"]`);
  links.forEach(link => link.parentNode.removeChild(link));
}

function gameLost() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'result-message-overlay';
  overlay.innerHTML = `Время вышло!<br><br><br>Нажмите, чтобы продолжить`;

  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay);
    removeStyleSheet('../../css/level1.css');
    removeStyleSheet('../../css/level2.css');
    removeStyleSheet('../../css/level3.css');
    location.reload();
  });

  document.body.appendChild(overlay);
}

function allLevelsComplete() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'result-message-overlay';
  let score = parseInt(localStorage.getItem('currentResult'), 10);
  overlay.innerHTML = `Вы завершили все уровни!<br> Результат ${score}<br><br>Нажмите, чтобы продолжить`;

  addLeaderboardEntry(localStorage.getItem('currentUser'),
    parseInt(localStorage.getItem('currentResult'), 10));

  overlay.addEventListener('click', () => {
    document.body.removeChild(overlay);
    removeStyleSheet('../../css/level1.css');
    removeStyleSheet('../../css/level2.css');
    removeStyleSheet('../../css/level3.css');
    viewLeaderboard();
  });

  document.body.appendChild(overlay);
}

function addLeaderboardEntry(name, score) {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

  leaderboard.push({name, score});

  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function removeLevelScripts(current) {
  const scripts = document.getElementsByTagName('script');
  console.log(scripts);
  for (let i = scripts.length - 1; i >= 0; i--) {
    const script = scripts[i];
    if (script !== current && !script.src.includes('main.js')) {
      script.parentNode.removeChild(script);
    }
  }
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

