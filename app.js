const startScreen = document.querySelector("#screen-start");
const quizScreen = document.querySelector("#screen-quiz");
const startBtn = document.querySelector("#btn-start");

startBtn.addEventListener("click", () => {
  startScreen.hidden = true;
  quizScreen.hidden = false;
});
