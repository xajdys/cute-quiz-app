const startScreen = document.querySelector("#screen-start");
const quizScreen = document.querySelector("#screen-quiz");
const startBtn = document.querySelector("#btn-start");
const loading = document.querySelector("#loading");
const questions = [
  {
    text: "Which tag shows how far along a task is?",
    options: ["<meter>", "<progress>", "<output>", "<data>"],
    answer: 1,
  },
  {
    text: "Which tag stays invisible until JS clones it?",
    options: ["<slot>", "<noscript>", "<template>", "<base>"],
    answer: 2,
  },
  {
    text: "Which tag marks a measurement inside a known range?",
    options: ["<meter>", "<progress>", "<time>", "<dfn>"],
    answer: 0,
  },
];

const template = document.querySelector("#question-card");
const area = document.querySelector("#question-area");
const qNumber = document.getElementById("q-number");
const progress = document.getElementById("q-progress");
const meter = document.getElementById("score-meter");
const timerOut = document.getElementById("timer");
const nextBtn = document.getElementById("btn-next");
const skipBtn = document.getElementById("btn-skip");

let current = 0;
let score = 0;
let timerLeft = 30;
let timerId;

function showQuestion() {
  const q = questions[current];
  const card = template.textContent.cloneNode(true);

  card.querySelector(".q-text").textContent = q.text;
  card.querySelectorAll(".opt-text").forEach((span, i) => {
    span.textContent = q.options[i];
  });

  card.querySelectorAll("input").forEach((input, i) => {
    input.value = i;
  });

  area.replaceChildren(card);
  qNumber.textContent = current + 1;
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timerLeft = 30;
  timerOut.textContent = timerLeft;

  timerId = setInterval(() => {
    timerLeft--;
    timerOut.textContent = timerLeft;
    if (timerLeft === 0) goNext();
  }, 1000);
}

function goNext() {
  const picked = document.querySelector('input[name="answer"]:checked');
  if (picked && Number(picked.value) === questions[current].answer) {
    score++;
    meter.value = score;
  }
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    clearInterval(timerId);
    console.log("Quiz finished. Score:", score);
  }
}

startBtn.addEventListener("click", () => {
  // startScreen.style.animation="slide 0.8s ease-in-out 0.3s";
  startScreen.hidden = true;
  quizScreen.hidden = false;
});

nextBtn.addEventListener("click", goNext);
skipBtn.addEventListener("click", goNext);
