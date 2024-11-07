const questions = [{
    id: 1,
    question: "А когда с человеком может произойти дрожемент?",
    answers: [{text: "Когда он влюбляется", isCorrect: false, status: "not_selected"}, {
        text: "Когда он идет шопиться", isCorrect: false
    }, {
        text: "Когда он слышит смешную шутку", isCorrect: false
    }, {text: "Когда он боится, пугается", isCorrect: true, status: "not_selected"}],
    status: "not_answered",
    explanation: "Лексема «дрожемент» имплицирует состояние крайнего напряжения и страха: «У меня всегда дрожемент в ногах, когда копы подходят»."
}, {
    id: 2,
    question: "Говорят, Антон заовнил всех. Это еще как понимать?",
    answers: [{
        text: "Как так, заовнил? Ну и хамло. Кто с ним теперь дружить-то будет?", isCorrect: false
    }, {
        text: "Антон очень надоедливый и въедливый человек, всех задолбал", isCorrect: false
    }, {text: "Молодец, Антон, всех победил!", isCorrect: true, status: "not_selected"}, {
        text: "Нет ничего плохого в том, что Антон тщательно выбирает себе друзей", isCorrect: false
    }],
    status: "not_answered",
    explanation: "Термин «заовнить» заимствован из английского языка, он происходит от слова own и переводится как «победить», «завладеть», «получить»."
}, {
    id: 3,
    question: "А фразу «заскамить мамонта» как понимать?",
    answers: [{
        text: "Разозлить кого-то из родителей", isCorrect: false
    }, {text: "Увлекаться археологией", isCorrect: false}, {
        text: "Развести недотепу на деньги", isCorrect: true
    }, {text: "Оскорбить пожилого человека", isCorrect: false}],
    status: "not_answered",
    explanation: "Заскамить мамонта — значит обмануть или развести на деньги. Почему мамонта? Потому что мошенники часто выбирают в жертвы пожилых людей (древних, как мамонты), которых легко обвести вокруг пальца."
}, {
    id: 4,
    question: "Кто такие бефефе?",
    answers: [{text: "Вши?", isCorrect: false}, {
        text: "Милые котики, такие милые, что бефефе", isCorrect: false
    }, {text: "Лучшие друзья", isCorrect: true}, {
        text: "Люди, которые не держат слово", isCorrect: false
    }],
    status: "not_answered",
    explanation: "Бефефе — это лучшие друзья. Этакая аббревиатура от английского выражения best friends forever."
}];

let shuffled_questions = questions
    .map(value => ({value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => {
        value.answers = value.answers
            .map(answer => ({...answer, sort: Math.random()}))
            .sort((a, b) => a.sort - b.sort)
            .map(({sort, ...rest}) => rest);
        return value;
    });

const questionList = document.getElementById('question-list');
const answerList = document.getElementById('answer-list');
const button = document.getElementById('question-button');
const result = document.getElementById('result-container');
const notification = document.getElementById('notification');
button.addEventListener('click', displayQuestions);

let correctCount = 0;
let answeredCount = 0;

function displayQuestions() {
    clear();
    shuffled_questions.forEach((question, index) => {
        let questionElement = document.createElement('div');
        questionElement.className = "block-question";
        let textElement = document.createElement("label");
        textElement.textContent = index + 1 + '. ' + question.question;
        textElement.className = "question-text";
        questionElement.appendChild(textElement);
        let statusElement = document.createElement("label");
        switch (question.status) {
            case "correct":
                statusElement.textContent = '✅';
                break;
            case "incorrect":
                statusElement.textContent = '❌';
                break;
            default:
                break;
        }
        questionElement.appendChild(statusElement);

        if (question.status === 'not_answered') {
            questionElement.addEventListener('click', () => {
                displayAnswers(index);
            });
        } else {
            if (answeredCount === shuffled_questions.length) {
                questionElement.addEventListener('click', () => {
                    let correctAnswer = question.answers.find(answer => answer.isCorrect);
                    if (correctAnswer) {
                        answerList.innerHTML = '';
                        let answerElement = document.createElement('div');
                        answerElement.className = "block-answer";
                        answerElement.textContent = correctAnswer.text;
                        answerList.appendChild(answerElement);
                    }
                });
            }
        }
        questionList.appendChild(questionElement);

    });

    if (answeredCount === shuffled_questions.length) {
        notification.textContent = 'Вопросы закончились!';
        result.style.visibility = 'visible';
        let stat = document.getElementById('stat-box');
        stat.textContent = correctCount + ' из ' + shuffled_questions.length;
    }
}


function displayAnswers(index) {
    clear();
    button.disabled = true;
    let questionElement = document.createElement('div');
    questionElement.className = "block-question";
    let textElement = document.createElement("label");
    let question = shuffled_questions[index];
    textElement.textContent = index + 1 + '. ' + question.question;
    textElement.className = "question-text";
    questionElement.appendChild(textElement);
    questionList.appendChild(questionElement);

    question.answers.forEach((answer) => {
        let answerElement = document.createElement('div');
        answerElement.className = "block-answer";
        answerElement.textContent = answer.text;
        answerList.appendChild(answerElement);
        answerElement.addEventListener('click', () => {
            if (answer.isCorrect) {
                handleCorrectAnswer(answerElement, question);
            } else {
                handleIncorrectAnswer(answerElement, question);
            }

        });
    });
}

function handleCorrectAnswer(element, question) {
    element.classList.add('enlarge');
    let explanationElement = document.createElement('div');
    explanationElement.textContent = 'Правильно! ' + question.explanation;
    if (question.status === 'not_answered') {
        element.appendChild(explanationElement);
        correctCount++;
        answeredCount++;
        console.log(correctCount, answeredCount);
    }
    question.status = 'correct';


    let remainingAnswers = document.querySelectorAll('.block-answer');
    let remainingCount = remainingAnswers.length - 1;

    remainingAnswers.forEach(answerElement => {
        if (answerElement !== element) {
            moveRight(answerElement, () => {
                remainingCount--;
                if (remainingCount === 0) {
                    let statusElement = document.createElement('label');
                    statusElement.textContent = '✅';
                    document.querySelectorAll('.block-question')[0].appendChild(statusElement);

                }
            });
        }
    });
    button.disabled = false;
}

function handleIncorrectAnswer(element, question) {

    let remainingAnswers = document.querySelectorAll('.block-answer');
    let remainingCount = remainingAnswers.length - 1;

    if (question.status === 'not_answered') {
        answeredCount++;
        console.log(correctCount, answeredCount);
        question.status = 'incorrect';
    }

    remainingAnswers.forEach(answerElement => {
        moveRight(answerElement, () => {
            remainingCount--;
            if (remainingCount === 0) {
                let statusElement = document.createElement('label');
                statusElement.textContent = '❌';
                document.querySelectorAll('.block-question')[0].appendChild(statusElement);
            }
        });
    });
    button.disabled = false;
}

function moveRight(element, callback) {
    element.classList.add('slide-out-right');
    element.addEventListener('animationend', () => {
        if (callback) callback();
    });
}

function clear() {
    questionList.innerHTML = '';
    answerList.innerHTML = '';
}