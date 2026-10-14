const startScreen = document.querySelector("#screen-start");
const quizScreen = document.querySelector("#screen-quiz");
const startBtn = document.querySelector("#btn-start");
const loading = document.querySelector("#loading");

startBtn.addEventListener("click", () => {
  startScreen.style.animation="slide 0.8s ease-in-out 0.3s";
  startScreen.hidden = true;
  quizScreen.hidden = false;

});
