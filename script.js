const spinButton = document.querySelector(".wheel-action__hit");
const outerWheel = document.querySelector(".outer-wheel");
const wordButton = document.querySelector(".game-buttons__push");
const letterSquare = document.querySelectorAll(".board__letter-square");
const restartButton = document.querySelector(".game-buttons__restart");
const key = document.querySelectorAll(".keyboard__key");
const playerTitle = document.querySelector(".player");
const scorecard = document.querySelector(".score");
const letterPointsIndicator = document.querySelector("#letter-points");
const wheelImage = document.querySelector(".wheelimage");
const keyboard1 = document.querySelector(".keyboard");
const wheelbox = document.querySelector(".wheel-box");
const keyboardSlidein = document.querySelector(".wheel-action__keyboard-slidein");
const hint = document.querySelector("#hint");

// explicitly add spaces in answers to allow for word wrap effect/visual styling 
const guessData = [
  ["SPORTING TERMINOLOGY", "HOLE IN ONE"],   
  ["LANDMARK", "EMPIRE STATEBUILDING"],  
  ["SAYING", "TWO HEADS   ARE BETTER  THAN ONE"],  
  ["OSCAR WINNING FILM", "A BEAUTIFUL MIND "],  
  ["SONG TITLE", "WUTHERING   HEIGHTS"],  
  ["BOOK", "TO KILL A   MOCKING BIRD"],
  ["CAPITAL CITY", "MONTEVIDEO"],  
  ["SCOTTISH FOOTBALL TEAM", "HAMILTON    ACADEMICAL"],  
  ["IN THE KITCHEN", "SOUP LADLE"],
  ["DESSERT", "APPLE       STRUDEL"], 
  ["OCCUPATION", "SOFTWARE    ENGINEER"],  
  ["BRITISH COMEDY SHOW", "RED DWARF"],  
  ["CURRENCY", "CZECH KORUNA"] 
];

let dataCopy = [...guessData]; // copy data array so don't mutate original

let boardArray; // represents letters to guess on board

let boardArrayCopy;  // to check for length comparison with original for winning check

// apply word to board to guess and update hint clue text

wordButton.addEventListener("click", () => {
  clearBoard();
  boardArray = [];
  let guessDataCopy = dataCopy[0][1];
  hint.innerText = dataCopy[0][0];
  let letters = guessDataCopy.split("");
  keyboardReset();

  for (let i = 0; i < letters.length; i++) {
    if (letters[i] !== " ") {
      letterSquare[i].style.backgroundColor = "#fff9f9";
      letterSquare[i].classList.add("board__letter-square--guess");
      letterSquare[i].innerHTML = letters[i];
      letterSquare[i].style.color = "#fff9f9";
    } else {
      letterSquare[i].style.backgroundColor = "#5ce76c";
    }
  }
  boardIndex();
  dataCopy.shift();
  boardArrayCopy = [...boardArray];
});

// clear board

function clearBoard() {
  letterSquare.forEach((square) => {
    square.style.backgroundColor = "#5ce76c";
    square.classList.remove("letter-square_guess");
    square.innerHTML = "";
  });
}

// keyboard reset

function keyboardReset() {
  key.forEach((letter) => {
    letter.style.color = "#fdb805";
    letter.style.backgroundColor = "#7b2cbf";
  });
}

// get index of nodelist board letters

function boardIndex() {
  for (let i = 0; i < letterSquare.length; i++) {
    if (letterSquare[i].innerHTML !== "") {
      boardArray.push(i);
    }
  }
}

// alerts ---> notie.js

const warningAlert = (text,type) => { 
  notie.alert({
  type: type, // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
  text: text,
  stay: false, // optional, default = false
  time: 3, // optional, default = 3, minimum = 1,
  position: "top" // optional, default = 'top', enum: ['top', 'bottom']
})
};

// winning check for round & overall game

const winCheck = () => {
  if (boardArrayCopy.length === 0 && dataCopy.length === 0) {
    if(player1.score === player2.score) {
      warningAlert("It's a drawn game!!!","success")
    } else if(player1.score > player2.score) {
      warningAlert("The overall Champion is:<br>**Player 1**","success");
    } else {
      warningAlert("The overall Champion is:<br>**Player 2**","success");
    }
  } else if (boardArrayCopy.length === 0) {
    warningAlert("You solved the puzzle!<br>Press game to continue to the next round","success");    
  }
};

// onscreen keyboard function

key.forEach((letter) => {
  letter.addEventListener("click", () => {
    players[playerIndex].previousScore = +scorecard.innerText; // update previous-score
    boardArray.forEach((index) => {
      if (letter.innerHTML === letterSquare[index].innerHTML) {
        letterSquare[index].style.color = "#0a0707";
        players[playerIndex].score += pointsScore;
        boardArrayCopy.pop();
      }
    });
    letter.style.color = "transparent"; 
    letter.style.backgroundColor = "transparent";
    players[playerIndex].updateScore();
    setTimeout(winCheck, 300);
    if(players[playerIndex].previousScore >= players[playerIndex].score){
      playerTurns();
    }
  });
});

// player class constructor

class Player {
  constructor(name,score,previousScore){
    this.name = name;
    this.score = score;
    this.previousScore = previousScore;
  }
  updateScore() {
    scorecard.innerHTML = this.score;
  }
  updatePlayerStatus() {
    playerTitle.innerHTML = this.name;
  }
}

// players

let player1 = new Player("Player 1", 0, parseInt(scorecard.innerText));
let player2 = new Player("Player 2", 0, parseInt(scorecard.innerText));

// letter points

let pointsScore;

// players array

const players = [player1, player2];

// index for accessing players array

let playerIndex = 0;

// check player score/turn

function playerTurns() {
    warningAlert("Wrong guess!<br>Round goes to the next player","error");  
    if (players[playerIndex] === player1) {
      playerIndex = 1;
      players[playerIndex].updatePlayerStatus();
      players[playerIndex].updateScore();
    } else {
      playerIndex = 0;
      players[playerIndex].updatePlayerStatus();
      players[playerIndex].updateScore();
    }
  }

// wheel object

const pointsSpin = {
  24: 5000,
  23: 600,
  22: 500,
  21: 300,
  20: 500,
  19: 800,
  18: 550,
  17: 400,
  16: 300,
  15: 900,
  14: 500,
  13: 300,
  12: 900,
  11: "You're bankrupt",
  10: 600,
  9: 400,
  8: 300,
  7: "You lose a turn",
  6: 800,
  5: 350,
  4: 450,
  3: 700,
  2: 300,
  1: 600,
  0: 5000,  // 2 of same entry at 0/360deg (keys: 0,24) to account for index 0
};

// spinning function
let pointsSegment;

spinButton.addEventListener("click", () => {
  let x = 1080;
  let y = 9999;
  let deg = Math.floor(Math.random() * (y - x)) + y;
  let wheelSegment = Math.floor(((deg + 7.5)  % 360) / 15); // degree of rotation after last 360 to determine position --> each segment at 15deg (wheel has 24 segments)
  wheelImage.style.transition = "3s ease";                 //  add 7.5 deg for wheel image offset and determine value of wheel segment with index to wheel object
  wheelImage.style.transform = `rotate(${deg}deg)`;       
  pointsSegment = pointsSpin[wheelSegment];
});

wheelImage.addEventListener("transitionend", () => {
  switch (pointsSegment) {
    case "You're bankrupt":
      warningAlert(`${pointsSegment}`,"error");
      players[playerIndex].score = 0;
      letterPointsIndicator.innerHTML = pointsSpin[11];
      setTimeout(playerTurns, 500);
      break;
    case "You lose a turn":
      warningAlert(`${pointsSegment}`,"error");
      letterPointsIndicator.innerHTML = pointsSpin[7];
      setTimeout(playerTurns, 500);
      break;
    default:
      letterPointsIndicator.innerHTML = `Guess a letter for ${pointsSegment} points each`;
  }

  if (typeof pointsSegment !== "string") {
    pointsScore = pointsSegment;
  }
});

// restart game

restartButton.addEventListener("click", () => {
  boardArray = [];
  dataCopy = [...guessData];
  clearBoard();
  keyboardReset();
  player2.score = 0;
  player2.updateScore();
  player1.score = 0;
  player1.updateScore();
  player1.updatePlayerStatus();
  hint.innerHTML = `Press <span class = "text-holder__underline">GAME</span> to begin and <span class = "text-holder__underline">SPIN</span> to start playing`;
  letterPointsIndicator.innerHTML = `Press <span class = "text-holder__underline">KEYBOARD</span> to toggle keyboard <span class = "text-holder__underline">ON/OFF</span>`;
});

// keyboard slide-in

let keyboardCount = 0;  // click counter for initial display of grid 
keyboardSlidein.addEventListener("click", () => {
  if(keyboardCount === 0) {
    keyboard1.style.display = "grid";
    wheelbox.classList.toggle("wheel-box_visibility");
  } else {
    wheelbox.classList.toggle("wheel-box_visibility");
    keyboard1.classList.toggle("slide-bottom");
  }
  keyboardCount += 1;
})

