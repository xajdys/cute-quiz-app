const startScreen = document.getElementById("screen-start");
const quizScreen = document.getElementById("screen-quiz");
const startBtn = document.getElementById("btn-start");
const resultsScreen = document.getElementById("screen-results");
const finalScore = document.getElementById("final-score");
const verdict = document.getElementById("verdict");
const chart = document.getElementById("score-chart");
const resultsBody = document.getElementById("results-body");
const finishedAt = document.getElementById("finished-at");
const retryBtn = document.getElementById("btn-retry");

const PASS_MARK = 8;
let results = [];

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
  {
    text: "Which CSS property is used to tint built-in form controls like range inputs, checkboxes, and progress bars?",
    options: ["accent-color", "control-tint", "theme-color", "ui-color"],
    answer: 0,
  },
  {
    text: "Which method is used on a template's content property to create a copy of its nodes?",
    options: ["copyNode()", "duplicateNode()", "cloneNode()", "renderNode()"],
    answer: 2,
  },
  {
    text: "What does the 'true' argument inside cloneNode(true) signify?",
    options: [
      "To execute embedded scripts automatically",
      "A deep copy including all child elements",
      "To trigger CSS animations on clone",
      "To copy inline event listeners",
    ],
    answer: 1,
  },
  {
    text: "Which element is specifically designed to display the result of a calculation or user action?",
    options: ["<data>", "<output>", "<result>", "<compute>"],
    answer: 1,
  },
  {
    text: "Which HTML element represents an inert container of content meant to be duplicated via JavaScript?",
    options: ["<slot>", "<content>", "<template>", "<fragment>"],
    answer: 2,
  },
  {
    text: "What is the primary semantic difference between <progress> and <meter>?",
    options: [
      "<progress> tracks task completion, while <meter> measures a value in a known range",
      "<meter> is animated by default, while <progress> is static",
      "<progress> requires a maximum attribute, while <meter> does not",
      "<meter> represents time duration, while <progress> represents file size",
    ],
    answer: 0,
  },
  {
    text: "Which method clears out all children of an element and replaces them with a new set of nodes in a single step?",
    options: [
      "innerHTML",
      "appendChild()",
      "replaceChildren()",
      "swapContent()",
    ],
    answer: 2,
  }
];

const template = document.getElementById("question-card");
const area = document.getElementById("question-area");
const qNumber = document.getElementById("q-number");
const progress = document.getElementById("q-progress");
const meter = document.getElementById("score-meter");
const timerOut = document.getElementById("timer");
const nextBtn = document.getElementById("btn-next");
const skipBtn = document.getElementById("btn-skip");

let current = 0;
let score = 0;
let timeLeft = 30;
let timerId;

function showQuestion() {
  const q = questions[current];
  const card = template.content.cloneNode(true);

  card.querySelector(".q-next").textContent = q.text;
  card.querySelectorAll(".opt-text").forEach((span, i) => {
    span.textContent = q.options[i];
  });

  area.replaceChildren(card);
  qNumber.textContent = current + 1;
  progress.value = current + 1;
  startTimer();
}

function startTimer() {
  clearInterval(timerId);
  timeLeft = 30;
  timerOut.textContent = timeLeft;
  timerId = setInterval(() => {
    timeLeft--;
    timerOut.textContent = timeLeft;
    if (timeLeft === 0) goNext();
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
  startScreen.classList.add("slide-out");

    startScreen.addEventListener("animationend", () => {
        startScreen.hidden = true;
        startScreen.classList.remove("slide-out");
        quizScreen.hidden = false;
        showQuestion();
    }, { once: true });

});

nextBtn.addEventListener("click", goNext);

skipBtn.addEventListener("click", () => {
    document
        .querySelectorAll('input[name="answer"]')
        .forEach(input => input.checked = false);

    goNext();
});

function finishQuiz() {
  clearInterval(timerId);
  quizScreen.hidden = true;
  resultsScreen.hidden = false;

  finalScore.textContent = `${score}/${questions.length}`;
  verdict.textContent = score >= PASS_MARK ? "Passed! 🎉" : "Keep practicing 🌱";

  const now = new Date();
  finishedAt.dateTime = now.toISOString();
  finishedAt.textContent = now.toLocaleString();

  renderTable();
  drawChart();
}

function renderTable() {
  const rows = results.map((r) => {
    const tr = document.createElement("tr");
    const numTd = document.createElement("td");
    const textTd = document.createElement("td");
    const resTd = document.createElement("td");
    const data = document.createElement("data");

    numTd.textContent = r.number;
    textTd.textContent = r.text;
    data.value = r.status === "correct" ? 1 : 0;
    data.dataset.state = r.status;
    data.textContent = r.status;

    resTd.append(data);
    tr.append(numTd, textTd, resTd);
    return tr;
  });
  resultsBody.replaceChildren(...rows);
}

function drawChart() {
  const ctx = chart.getContext("2d");
  const css = getComputedStyle(document.documentElement);
  const colors = {
    correct: css.getPropertyValue("--correct").trim(),
    wrong: css.getPropertyValue("--wrong").trim(),
    skipped: css.getPropertyValue("--accent").trim(),
  };

  const counts = { correct: 0, wrong: 0, skipped: 0 };
  results.forEach((r) => counts[r.status]++);

  const cx = chart.width / 2;
  const cy = chart.height / 2;
  let start = -Math.PI / 2;

  ctx.clearRect(0, 0, chart.width, chart.height);
  ctx.lineWidth = 30;

  for (const key in counts) {
    if (counts[key] === 0) continue;
    const slice = (counts[key] / results.length) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 90, start, start + slice);
    ctx.strokeStyle = colors[key];
    ctx.stroke();
    start += slice;
  }

  ctx.fillStyle = css.getPropertyValue("--text").trim();
  ctx.font = "600 32px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${score}/${results.length}`, cx, cy);
}

retryBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  results = [];
  meter.value = 0;
  resultsScreen.hidden = true;
  quizScreen.hidden = false;
  showQuestion();
});