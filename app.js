const stBtn = document.querySelector("#start-btn");
const container = document.querySelector(".container");

const hide = (evt) => {
  evt.target.classList.add("hide");
};

const nextSection = (evt) => {
  container.style.animation = "slide 0.8s ease-in-out 0.3s";
  container.addEventListener("animationend", hide);
};

stBtn.addEventListener("click", nextSection);
