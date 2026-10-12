const stBtn = document.querySelector("#start-btn");
const container = document.querySelector(".container");

const nextSection = (evt) => {
  container.style.animation = "slide 0.8s ease-in-out 0.3s";
  
};

stBtn.addEventListener("click", nextSection);
