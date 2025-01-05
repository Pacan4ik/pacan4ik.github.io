const DEBUG_HTML = `
    <div class="slider-container container">
      <label for="range-slider">Сложность:</label> <span id="slider-value">1</span> <br>
      <input type="range" id="range-slider" min="1" max="3" value="1" step="1" onchange="updateSliderValue()">
      <div class="buttons-wrapper">
        Уровень:
        <button onclick="jumpToLevel(1)">1</button>
        <button onclick="jumpToLevel(2)">2</button>
        <button onclick="jumpToLevel(3)">3</button>
      </div>
    </div>
  `;

const debCnt = document.createElement('div');
debCnt.id = 'navigate-test';
debCnt.innerHTML = DEBUG_HTML;

showDebug();

function showDebug() {
  document.getElementById('body-game').appendChild(debCnt);
}

const container = document.getElementById('navigate-test');

container.style.display = 'flex'; //show container

const slider = document.getElementById('range-slider');
const sliderValue = document.getElementById('slider-value');

function updateSliderValue() {
  sliderValue.textContent = slider.value;
}

function jumpToLevel(level) {
  const diff = slider.value;
  curDifficulty = Number.parseInt(diff, 10);
  setUser('debug')
  changeBackground();
  switch (level) {
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

