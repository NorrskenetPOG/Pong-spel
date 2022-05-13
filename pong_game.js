var keyState = {};
let canvas = document.querySelector('canvas');
let score1 = document.querySelector('.player-score');
let round = document.querySelector('.round-number');
let startText = document.querySelector('.start-text');
let vertticalDottedLine = document.querySelector('.vertical-dotted-line');
let scoreComputer = document.querySelector('.computer-score');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = '100%';
canvas.style.height = '100%';

let c = canvas.getContext('2d');
let colour = '#255867';
let startButton = ' ';

// Sidlängd för racketar och radie för bollen
let sizeBall = canvas.height / 30;
let sizeXRackets = canvas.width / 100;
let sizeYRackets = canvas.height / 5;

// Hastighetsvariabel för computer
let computerSpeed = 300;

// Variabel för att checka ifall W eller S är nedtryckta
let keyW = false;
let keyS = false;

// Startläge bollen
let xPosBall = canvas.width / 2;
let yPosBall = canvas.height / 2;

// Hastighet för bollen, i x- och y-led
let dxBall = canvas.width / 250;
let dyBall = canvas.height / 200;

// Startläge till racketar
let computerY = canvas.height / 2 - sizeYRackets / 2;
let p1Y = canvas.height / 2 - sizeYRackets / 2;

// Variabel som avgör om tiden stannar
let setTime = true;

// Variabel som avgör om gameLoop() körs eller avslutas
let loopFunction = gameLoop;

function timer() {
  let minut = 0;
  let sec = 0;
  var timer = setInterval(function () {
    document.getElementById('TimerDisplay').innerHTML = minut + ':' + sec;
    if (setTime == true) {
      sec++;
    }
    if (sec == 60) {
      sec = 0;
      minut = minut + 1;
    }
  }, 1000);
}

document.addEventListener(
  'keydown',
  function (e) {
    keyState[e.key] = true;
  },
  true
);
document.addEventListener(
  'keyup',
  function (e) {
    keyState[e.key] = false;
  },
  true
);

// Fyller bakgrunden
function fillBackground() {
  c.fillStyle = colour;
  c.fillRect(0, 0, canvas.width, canvas.height);
}

// Ritar ut racketar och boll
function paintGeometrics() {
  c.beginPath();
  c.fillStyle = '#faf9f6';
  c.ellipse(
    xPosBall,
    yPosBall,
    sizeBall / 2,
    (0.7 * sizeBall) / 2,
    0,
    0,
    2 * Math.PI
  );
  c.fill();

  // Spelarens racket ritas
  c.fillStyle = '#faf9f6';
  c.fillRect(0 + sizeXRackets * 2, p1Y, sizeXRackets, sizeYRackets);

  // Datorns racket ritas
  c.fillStyle = '#faf9f6';
  c.fillRect(
    canvas.width - sizeXRackets - sizeXRackets * 2,
    computerY,
    sizeXRackets,
    sizeYRackets
  );
}

// Väljer villken riktning bolle ska få från början
function chooseDirectionX() {
  let randomNumber = Math.floor(Math.random() * 2);
  if (randomNumber == 1) {
    dxBall = -dxBall;
  } else {
    dxBall = +dxBall;
  }
}
function chooseDirectionY() {
  let randomNumber = Math.floor(Math.random() * 2);
  if (randomNumber == 1) {
    dyBall = -dyBall;
  } else {
    dyBall = +dyBall;
  }
}

// Ändrar hastighet i y-led med litegran för att ge variation på studsar
function bounceModifyY() {
  let randomNumber = Math.floor(Math.random() * 2);
  if (randomNumber == 1) {
    dyBall = dyBall + canvas.height / 5000;
  } else {
    dyBall = dyBall - canvas.height / 5000;
  }
  console.log(dyBall);
  console.log(canvas.height / 5000);
}

// Då respektive kvadrat kommer till en ytterkant ska de studsa
function checkBounce() {
  // Flyttar tillbaka bollen till mitten
  if (xPosBall < 0 + sizeBall / 2) {
    scoreComputer.innerHTML = +scoreComputer.innerHTML + 1;
    xPosBall = canvas.width / 2;
    yPosBall = canvas.height / 2;
  }
  if (xPosBall > canvas.width - sizeBall / 2) {
    score1.innerHTML = +score1.innerHTML + 1;
    xPosBall = canvas.width / 2;
    yPosBall = canvas.height / 2;
    bounceModifyY();
  }

  // Checkar ifall bollen träffar en väg
  if (yPosBall < 0 + sizeBall / 4) {
    dyBall = -dyBall;
    yPosBall = 0 + sizeBall / 2;
  }
  if (yPosBall > canvas.height - sizeBall / 4) {
    dyBall = -dyBall;
    yPosBall = canvas.height - sizeBall / 2;
  }

  // Checkar ifall bollen träffar något racket
  if (
    xPosBall < 0 + sizeXRackets * 3 + sizeBall / 2 &&
    xPosBall > 0 + sizeXRackets * 2 + sizeBall / 2 &&
    yPosBall < p1Y + sizeYRackets &&
    yPosBall > p1Y
  ) {
    xPosBall = sizeXRackets * 3 + sizeBall;
    dxBall = -dxBall;
    bounceModifyY();
  }
  if (
    xPosBall > canvas.width - sizeBall / 2 - sizeXRackets * 3 &&
    xPosBall < canvas.width - sizeBall / 2 - sizeXRackets * 2 &&
    yPosBall < computerY + sizeYRackets &&
    yPosBall > computerY
  ) {
    xPosBall = canvas.width - sizeXRackets * 3 - sizeBall;
    dxBall = -dxBall;
    bounceModifyY();
  }

  //Gör att bollen studsar på undersidan av datorn
  if (
    xPosBall < canvas.width - sizeBall / 2 &&
    xPosBall > canvas.width - sizeXRackets - sizeXRackets * 2 &&
    yPosBall < computerY + sizeYRackets + (0.7 * sizeBall) / 2 &&
    yPosBall > computerY
  ) {
    yPosBall = computerY + sizeYRackets + 0.7 * sizeBall;
    dyBall = -dyBall;
  }
  //Gör att bollen studsar på ovansidan av datorn
  if (
    xPosBall < canvas.width - sizeBall / 2 &&
    xPosBall > canvas.width - sizeXRackets - sizeXRackets * 2 &&
    yPosBall < computerY + sizeYRackets &&
    yPosBall > computerY - (0.7 * sizeBall) / 2
  ) {
    yPosBall = computerY - 0.7 * sizeBall;
  }

  //Gör att bollen studsar på undersidan av spelaren
  if (
    xPosBall > 0 + sizeXRackets * 2 &&
    xPosBall < 0 + sizeXRackets * 3 &&
    yPosBall < p1Y + sizeYRackets + (0.7 * sizeBall) / 2 &&
    yPosBall > p1Y + sizeYRackets / 2
  ) {
    yPosBall = p1Y + sizeYRackets + 0.7 * sizeBall;
    dyBall = -dyBall;
  }
  //Gör att bollen studsar på ovansidan av spelaren
  if (
    xPosBall > 0 + sizeXRackets * 2 &&
    xPosBall < 0 + sizeXRackets * 3 &&
    yPosBall < p1Y + sizeYRackets / 2 &&
    yPosBall > p1Y - (0.7 * sizeBall) / 2
  ) {
    yPosBall = p1Y - 0.7 * sizeBall;
    dyBall = -dyBall;
  }
}

// Gör att racket följer efter bollen
function computerMovment() {
  if (computerY + sizeYRackets / 2 > yPosBall) {
    computerY -= canvas.height / computerSpeed;
  }
  if (computerY + sizeYRackets / 2 < yPosBall) {
    computerY += canvas.height / computerSpeed;
  }

  if (computerY < 0) {
    computerY = 0;
  }
  if (computerY + sizeYRackets > canvas.height) {
    computerY = canvas.height - sizeYRackets;
  }
}

//Avgör vad som händer vid 5 poäng
function scoreDeterminant() {
  // Ökar nummer på rundan, ställer tillbaka poängen och ändrar färg på bakgrunden
  //(allt efter att spelaren uppnår 5 poäng)
  if (score1.innerHTML >= 5) {
    computerSpeed -= computerSpeed / 7;
    dxBall =
      canvas.width / 250 + (canvas.width / 250) * (0.1 * round.innerHTML);
    dyBall =
      canvas.height / 200 + (canvas.height / 200) * (0.1 * round.innerHTML);
    round.innerHTML = +round.innerHTML + 1;
    score1.innerHTML = 0;
    scoreComputer.innerHTML = 0;
    let randomNumber = Math.floor(Math.random() * 4) + 1;
    console.log(round.innerHTML);

    if (randomNumber == 1) {
      colour = '#255867';
    } else if (randomNumber == 2) {
      colour = '#c0b21a';
    } else if (randomNumber == 3) {
      colour = '#189f33';
    } else if (randomNumber == 4) {
      colour = '#dada2b';
    }
  }
  if (scoreComputer.innerHTML >= 5) {
    setTime = false;
    loopFunction = 0;

    startText.innerHTML =
      ' - - - - - - Du har förlorat - - - - - - CTRL + R för att kunna spela igen';
  }

  // Avslutar spelet pgaförlust mot datorn vid 5 poäng
}

// Själva huvudloopen
function gameLoop() {
  if (keyState['w'] && p1Y > 0) {
    p1Y -= canvas.height / 300;
  }

  if (keyState['s'] && p1Y < canvas.height - sizeYRackets) {
    p1Y += canvas.height / 300;
  }

  // Ränsar skärmen
  c.clearRect(0, 0, canvas.width, canvas.height);

  fillBackground();
  paintGeometrics();

  // Ritar ut bollen i dess nya position
  xPosBall += dxBall;
  yPosBall += dyBall;

  computerMovment();

  checkBounce();

  scoreDeterminant();

  setTimeout(loopFunction, 10);
}

fillBackground();
paintGeometrics();

// Starta spelet / huvudprogrammet
document.onkeydown = function (e) {
  const key = e.key;
  switch (key) {
    case startButton:
      startText.innerHTML = ' ';
      startButton = 'Nothing';
      chooseDirectionX();
      chooseDirectionY();
      timer();
      gameLoop();
    default:
  }
};
