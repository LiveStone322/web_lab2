const playground = document.getElementsByClassName("playground__box")[0];
const playBtn = document.getElementById("play");
const botBtn = document.getElementById("bot");
const headerText = document.querySelector(".controls__header h1");
const header = document.getElementsByClassName("controls__header")[0];
const bodyText = document.querySelector(".controls p");
const sizeCoeff = 0.6;

let recordName = localStorage.getItem("recordName") 
let recordValue = Number(localStorage.getItem("recordValue"))

let level;
let curTime;
let timer;
let countUp;
let bot;

function resizePlayground() {
  let minDim = Math.min(window.innerWidth, window.innerHeight);
  playground.style.width = playground.style.height = minDim * sizeCoeff + "px";
}
resizePlayground();
playground.style.opacity = 1;

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

function getRandomName() {
  return ['Вася', 'Петя', 'Вова', 'Борис', 'Алекс', 'Махмуд', 'Люся'][random(0, 6)];
}

function setTime(value) {
  bodyText.innerText = `Осталось времени: ${curTime}`
}

function tick(value) {
  curTime--;
  setTime(curTime);
  localStorage.setItem("curTime", curTime)
}

function clear() {
  while(playground.lastChild) {
    playground.removeChild(playground.lastChild);
  }
}

function startTimer() {
  timer = setInterval (() => {
    if (curTime <= 0) {
      clearInterval(timer);
      successfullyEndGame();
      return;
    }
    tick();
  }, 1000)
}

function successfullyEndGame() {
  if (level - 1 === 0) {
    alert(`Игра окончена!\nВаш счет: ${level - 1}`)
  } else if (recordValue >= (level - 1)) {
    alert(`Игра окончена!
Ваш счет: ${level - 1}
Рекорд: ${recordValue} (${recordName})`)
  } else {
    let p = prompt(`Ваш счет: ${level - 1}
Вы установили новый рекорд! Введите Ваше имя...`, getRandomName());
    if (!p) p = "Аноним";
    localStorage.setItem("recordName", p);
    localStorage.setItem("recordValue", level - 1);
  }
  localStorage.removeItem("level");
  localStorage.removeItem("curTime");
  end();
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
      playground.classList.remove("center");
      clear();
      FillBox();
      startTimer();
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

function scoreAnimation() {
  let additionRef = document.createElement("span");
  additionRef.innerText="+1";
  let addition = header.appendChild(additionRef);
  let translateY = 1;
  let opacity = 1;
  addition.style = `opacity: ${opacity}; transform: translateY(${translateY})`;
  let interval = setInterval(() => {
    opacity -= 0.02;
    translateY--;
    addition.style = `opacity: ${opacity}; transform: translateY(${translateY}px);`;
    if (opacity <= 0) {
      clearInterval(interval)
      header.removeChild(additionRef);
    };
  }, 16);
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
    }
    else card.style.background = `rgb(${color.r}, ${color.g}, ${color.b})`;
    card.addEventListener("click", () => onCardClick(i === goodCardId));
    playground.appendChild(card);
  }
}

function onCardClick(isGoodCard) {
  if (isGoodCard) {
    level++;
    localStorage.setItem("level", level);
    localStorage.setItem("curTime", curTime)
    headerText.innerHTML = getScoreText();
    scoreAnimation();
    clear();
    FillBox();
  }
  else {
    successfullyEndGame();
  }
}

function init() {
  clear();
  level = Number(localStorage.getItem("level") || 1);
  curTime = Number(localStorage.getItem("curTime") || 20);
  playBtn.classList.add("transparent");
  playBtn.classList.add("hidden");
  botBtn.classList.add("btn_transparent");
  playground.classList.add("center");
  headerText.innerHTML = getScoreText();
  setTime(curTime);
}

function uninit() {
  clear();
  playBtn.classList.remove("hidden");
  playBtn.classList.remove("transparent");
  botBtn.classList.remove("btn_transparent");
  playground.classList.remove("center");
  headerText.innerHTML = "Цветные квадраты";
  bodyText.innerHTML = "Или страх дальтоника 🌈";
}

function start() {
  init();
  startCounting();
}

function end() {
  clearInterval(countUp);
  clearInterval(timer);
  clearInterval(bot);
  uninit();
}

function playing() {
  return playground.childElementCount >= 4; 
}

function initBot() {
  if (!playing()) {
    start();
    setTimeout(startBot, 3001);
  }
  else startBot();
}

function startBot() {
  if(playing()) {
    bot = setInterval(() => {
      let found = false;
      let color = getMainColor();
      for (let i = 0; !found && i < playground.childElementCount; i++) {
        if (playground.childNodes[i].style.background !== color) {
          playground.childNodes[i].click();
          found = true;
        }
      }
    }, 1000)
  }
}

function getMainColor() {
  if (playground.childElementCount < 4) {
    console.error("Слишком мало квадратов");
    return;
  }
  let col1 = playground.childNodes[0].style.background;
  let col2 = playground.childNodes[1].style.background;
  let col3 = playground.childNodes[2].style.background;
  return col1 === col2 ? col1 : col1 === col3 ? col1 : col2;
}

document.getElementById("controls").style.width = document
  .getElementById("controls")
  .getBoundingClientRect().width;
playBtn.addEventListener("click", start);
botBtn.addEventListener("click", initBot)
document.addEventListener("keyup", (key) => { if (key.key === "Escape") end()})
window.addEventListener("resize", resizePlayground);