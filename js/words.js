let draggedElement = null;
let prevPosition = null;
let isDragged = false;

document.getElementById('buttonParse').addEventListener('click', parse);
document.getElementById('buttonParse').addEventListener('click', clear);

function clear() {
    document.getElementById('wordsContainer').innerHTML = '';
}

function parse() {
    const input = document.getElementById('inputText').value;
    if (!input) return;

    const { awords, bwords, nwords } = classifyWords(input);
    const associativeArray = buildAssociativeArray(awords, bwords, nwords);

    displayWords(associativeArray);
}

function classifyWords(text) {
    const awords = [], bwords = [], nwords = [];

    text.split('-').forEach(word => {
        const trimmedWord = word.trim();

        if (!isNaN(trimmedWord)) {
            nwords.push(Number(trimmedWord));
        } else if (trimmedWord[0] === trimmedWord[0].toLowerCase()) {
            awords.push(trimmedWord);
        } else {
            bwords.push(trimmedWord);
        }
    });

    return {
        awords: awords.sort(),
        bwords: bwords.sort(),
        nwords: nwords.sort()
    };
}

function buildAssociativeArray(awords, bwords, nwords) {
    const associativeArray = {};

    awords.forEach((word, index) => associativeArray[`a${index + 1}`] = word);
    bwords.forEach((word, index) => associativeArray[`b${index + 1}`] = word);
    nwords.forEach((num, index) => associativeArray[`n${index + 1}`] = num);

    return associativeArray;
}


function displayWords(array) {
    const block = document.getElementById('block2');
    block.innerHTML = '';

    for (const [key, value] of Object.entries(array)) {
        const element = createWordElement(key, value);
        block.appendChild(element);
    }
}

function createWordElement(key, value) {
    const element = document.createElement('div');
    setupElementAttributes(element, key, value);
    applyRandomColors(element);
    element.addEventListener('mousedown', handleMouseDown);

    return element;
}

function setupElementAttributes(element, key, value) {
    element.className = 'word-item';
    element.textContent = `${key} ${value}`;
    element.setAttribute('data-key', key);
    element.setAttribute('data-value', value);
}

function applyRandomColors(element) {
    const { backgroundColor, textColor } = getRandomColorWithContrast();
    element.style.backgroundColor = backgroundColor;
    element.style.color = textColor;
    element.setAttribute('data-original-color', backgroundColor);
    element.setAttribute('data-original-text-color', textColor);
}



function handleClick(event) {
    if (isDragged) {
        return;
    }
    const block1 = document.getElementById('wordsContainer');
    const element = document.createElement('span');
    element.textContent = event.target.dataset.value;

    element.style.marginLeft = '10px';
    block1.appendChild(element);
}


function getRandomColorWithContrast() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    const randomColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

    const textColor = brightness > 128 ? '#000000' : '#FFFFFF';

    return {
        backgroundColor: randomColor,
        textColor: textColor
    };
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

function handleMouseDown(event) {
    draggedElement = event.target;
    const pos = draggedElement.getBoundingClientRect();
    prevPosition = {
        block: isMouseOverBlock(event, 'block3') ? 'block3' : 'block2',
        x: pos.x,
        y: pos.y
    };
    draggedElement.style.position = 'absolute';
    draggedElement.style.zIndex = '100';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(event) {
    if (draggedElement) {
        isDragged = true; //dragged
        draggedElement.style.left = (event.clientX - draggedElement.getBoundingClientRect().width / 2) + 'px';
        draggedElement.style.top = (event.clientY - draggedElement.getBoundingClientRect().height / 2) + 'px';
    }
}

function resetElementPosition(element, block) {
    if (block === 'block2') {
        element.style.position = 'relative';
        element.style.left = '';
        element.style.top = '';
    } else {
        element.style.position = 'absolute';
        element.style.left = prevPosition.x + 'px';
        element.style.top = prevPosition.y + 'px';
    }
}

function handleMouseUp(event) {
    if (draggedElement) {
        draggedElement.style.zIndex = '';
        if (isMouseOverBlock(event, 'block2')) {
            resetElementPosition(draggedElement, 'block2');
            draggedElement.style.backgroundColor = draggedElement.getAttribute('data-original-color');
            draggedElement.style.color = draggedElement.getAttribute('data-original-text-color');
            draggedElement.removeEventListener('click', handleClick);
        } else if (isMouseOverBlock(event, 'block3', draggedElement)) {
            draggedElement.addEventListener('click', handleClick);
            draggedElement.style.backgroundColor = '#ccffcf';
            draggedElement.style.color = '#000000';
        } else {
            resetElementPosition(draggedElement, prevPosition.block);
        }

        setTimeout(() => { //is dragged
            isDragged = false;
        }, 100);

        draggedElement = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
}

