const playground = document.getElementsByClassName("playground__box")[0];
const play_btn = document.getElementById("play");
const bot_btn = document.getElementById("bot");
const header_text = document.querySelector(".controls__header h1");
const body_text = document.querySelector(".controls p");
const sizeCoeff = 0.6;

let level = Number(localStorage.getItem("level") || 0);
let countUp;

function getPlaygroundSize() {
  return playground.style.width;
}

function getN() {
  return level + 2;
}

function getN2() {
  return getN() * getN();
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
    if (Math.random() - 0.5 > 0) {
      return color - diff;
    }
    else if (color <= 255 - diff) return color + diff;
    else return color - diff;
  }
  else return color + diff;
}

function FillBox() {
  let n = getN2();

  let goodCardId = random(0, n);

  let color = {
    r: random(0, 255),
    g: random(0, 255),
    b: random(0, 255),
  };

  let goodColor = {
    r: shiftColor(color.r),
    g: shiftColor(color.g),
    b: shiftColor(color.b) 
  }

  for (let i = 0; i < n; i++) {
    let card = document.createElement("div");
    card.classList.add("box__card");
    
    if (i === goodCardId) {
      card.style.background = `rgb(${goodColor.r}, ${goodColor.g}, ${goodColor.b})`;
      card.addEventListener = function () {
        level++;
        FillBox();
      }
    }
    else card.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
    playground.appendChild(card);
  }
}

function init() {
  clear();
  play_btn.classList.add("transparent");
  play_btn.classList.add("hidden");
  bot_btn.classList.add("btn_transparent");
  header_text.innerHTML = "Ваш счет:";
  body_text.innerHTML = "Осталось времени:";
}
function uninit() {
  clear();
  play_btn.classList.remove("hidden");
  play_btn.classList.remove("transparent");
  bot_btn.classList.remove("btn_transparent");
  header_text.innerHTML = "Цветные квадраты";
  body_text.innerHTML = "Или страх дальтоника 🌈";
}
function start() {
  init();
  startCounting();
  setTimeout(() => {
    clear();
    FillBox();
  }, 3000);
}

function end() {
  stopCounting();
  uninit();
}

document.getElementById("controls").style.width = document
  .getElementById("controls")
  .getBoundingClientRect().width;
play_btn.addEventListener("click", start);
document.addEventListener("keyup", (key) => { if (key.key === "Escape") end()})
window.addEventListener("resize", resizePlayground);