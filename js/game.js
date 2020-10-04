const playground = document.getElementsByClassName("playground__box")[0];
const playBtn = document.getElementById("play");
const botBtn = document.getElementById("bot");
const headerText = document.querySelector(".controls__header h1");
const bodyText = document.querySelector(".controls p");
const sizeCoeff = 0.6;

let level = Number(localStorage.getItem("level") || 1);
let countUp;
let timer;

function getPlaygroundSize() {
  return playground.style.width;
}

function getN() {
  return level + 1;
}

function getN2() {
  return getN() ** 2;
}

function getScoreText() {
  return `Ваш счет: ${level - 1}`
}

function resizePlayground() {
  let minDim = Math.min(window.innerWidth, window.innerHeight);
  playground.style.width = playground.style.height = minDim * sizeCoeff + "px";
}
resizePlayground();

function clear() {
  while(playground.lastChild) {
    playground.removeChild(playground.lastChild);
  }
}

function stopCounting() {
  clearInterval(countUp);
}

function startCounting() {
  let counterRef = document.createElement("h1");
  let counter = playground.appendChild(counterRef);
  counter.classList.add("box__counter");

  let value = 1;
  counter.textContent = value++;
  
  requestAnimationFrame(() => {
    counter.classList.add("box__counter_big");
  });

  countUp = setInterval(() => {
    if (value > 3) {
      clearInterval(countUp);
      return;
    }

    requestAnimationFrame(() => {
      counter.textContent = value++;
      counter.classList.remove("box__counter_big");
      requestAnimationFrame(() => {
        counter.classList.add("box__counter_big");
      });
    });
  }, 1000)
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shiftColor(color) {
  let diff = 100 / level;
  if (color >= diff) {
    if ((Math.random() - 0.5) > 0) {
      return color - diff;
    }
    else if (color <= 255 - diff) return color + diff;
    else return color - diff;
  }
  else return color + diff;
}

function FillBox() {
  let N = getN2();
  let n = getN();

  let goodCardId = random(0, N - 1);

  let color = {
    r: random(0, 255),
    g: random(0, 255),
    b: random(0, 255),
  };

  let goodColor = {
    r: shiftColor(color.r),
    g: shiftColor(color.g),
    b: shiftColor(color.b) 
  };

  for (let i = 0; i < N; i++) {
    let card = document.createElement("div");
    card.classList.add("box__card");
    card.style.width = `calc(${100/getN()}% - 4px)`;

    switch (i) {
      case 0:
        card.style.borderRadius = "10px 0 0 0"
        break;
      case (n-1):
        card.style.borderRadius = "0 10px 0 0"
        break;
      case (n * (n-1)):
        card.style.borderRadius = "0 0 0 10px"
        break;
      case (N - 1):
        card.style.borderRadius = "0 0 10px 0"
        break;
      default: break;
    }
    
    if (i === goodCardId) {
      card.style.background = `rgb(${goodColor.r}, ${goodColor.g}, ${goodColor.b})`;
      card.addEventListener("click", () => {
        level++;
        headerText.innerHTML = getScoreText();
        clear();
        FillBox();
      });
    }
    else card.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
    playground.appendChild(card);
  }
}

function init() {
  clear();
  playBtn.classList.add("transparent");
  playBtn.classList.add("hidden");
  botBtn.classList.add("btn_transparent");
  headerText.innerHTML = getScoreText();
  bodyText.innerHTML = "Осталось времени:";
}
function uninit() {
  clear();
  playBtn.classList.remove("hidden");
  playBtn.classList.remove("transparent");
  botBtn.classList.remove("btn_transparent");
  headerText.innerHTML = "Цветные квадраты";
  bodyText.innerHTML = "Или страх дальтоника 🌈";
}
function start() {
  init();
  playground.classList.add("center");
  startCounting();
  setTimeout(() => {
    playground.classList.remove("center");
    clear();
    FillBox();
  }, 3000);
}

function end() {
  playground.classList.remove("center");
  stopCounting();
  uninit();
}

document.getElementById("controls").style.width = document
  .getElementById("controls")
  .getBoundingClientRect().width;
playBtn.addEventListener("click", start);
document.addEventListener("keyup", (key) => { if (key.key === "Escape") end()})
window.addEventListener("resize", resizePlayground);