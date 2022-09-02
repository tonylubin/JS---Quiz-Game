"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var spinButton = document.querySelector(".wheel-action__hit");
var outerWheel = document.querySelector(".outer-wheel");
var wordButton = document.querySelector(".game-buttons__push");
var letterSquare = document.querySelectorAll(".board__letter-square");
var restartButton = document.querySelector(".game-buttons__restart");
var key = document.querySelectorAll(".keyboard__key");
var playerTitle = document.querySelector(".player");
var scorecard = document.querySelector(".score");
var letterPointsIndicator = document.querySelector("#letter-points");
var wheelImage = document.querySelector(".wheelimage");
var keyboard1 = document.querySelector(".keyboard");
var wheelbox = document.querySelector(".wheel-box");
var keyboardSlidein = document.querySelector(".wheel-action__keyboard-slidein");
var hint = document.querySelector("#hint"); // explicitly add spaces in answers to allow for word wrap effect/visual styling 

var guessData = [["SPORTING TERMINOLOGY", "HOLE IN ONE"], ["LANDMARK", "EMPIRE STATEBUILDING"], ["SAYING", "TWO HEADS   ARE BETTER  THAN ONE"], ["OSCAR WINNING FILM", "A BEAUTIFUL MIND "], ["SONG TITLE", "WUTHERING   HEIGHTS"], ["BOOK", "TO KILL A   MOCKING BIRD"], ["CAPITAL CITY", "MONTEVIDEO"], ["SCOTTISH FOOTBALL TEAM", "HAMILTON    ACADEMICAL"], ["IN THE KITCHEN", "SOUP LADLE"], ["DESSERT", "APPLE       STRUDEL"], ["OCCUPATION", "SOFTWARE    ENGINEER"], ["BRITISH COMEDY SHOW", "RED DWARF"], ["CURRENCY", "CZECH KORUNA"]];
var dataCopy = [].concat(guessData); // copy data array so don't mutate original

var boardArray; // represents letters to guess on board

var boardArrayCopy; // to check for length comparison with original for winning check
// apply word to board to guess and update hint clue text

wordButton.addEventListener("click", function () {
  clearBoard();
  boardArray = [];
  var guessDataCopy = dataCopy[0][1];
  hint.innerText = dataCopy[0][0];
  var letters = guessDataCopy.split("");
  keyboardReset();

  for (var i = 0; i < letters.length; i++) {
    if (letters[i] !== " ") {
      letterSquare[i].style.backgroundColor = "#fff9f9";
      letterSquare[i].classList.add("board__letter-square--guess");
      letterSquare[i].innerText = letters[i];
      letterSquare[i].style.color = "#fff9f9";
    } else {
      letterSquare[i].style.backgroundColor = "#5ce76c";
    }
  }

  boardIndex();
  dataCopy.shift();
  boardArrayCopy = _toConsumableArray(boardArray);
}); // clear board

function clearBoard() {
  letterSquare.forEach(function (square) {
    square.style.backgroundColor = "#5ce76c";
    square.classList.remove("letter-square_guess");
    square.innerText = "";
  });
} // keyboard reset


function keyboardReset() {
  key.forEach(function (letter) {
    letter.style.color = "#fdb805";
    letter.style.backgroundColor = "#7b2cbf";
  });
} // get index of nodelist board letters


function boardIndex() {
  for (var i = 0; i < letterSquare.length; i++) {
    if (letterSquare[i].innerText !== "") {
      boardArray.push(i);
    }
  }
} // alerts ---> notie.js


var warningAlert = function warningAlert(text, type) {
  notie.alert({
    type: type,
    // optional, default = 4, enum: [1, 2, 3, 4, 5, 'success', 'warning', 'error', 'info', 'neutral']
    text: text,
    stay: false,
    // optional, default = false
    time: 3,
    // optional, default = 3, minimum = 1,
    position: "top" // optional, default = 'top', enum: ['top', 'bottom']

  });
}; // winning check for round & overall game


var winCheck = function winCheck() {
  if (boardArrayCopy.length === 0 && dataCopy.length === 0) {
    if (player1.score === player2.score) {
      warningAlert("It's a drawn game!!!", "success");
    } else if (player1.score > player2.score) {
      warningAlert("The overall Champion is:<br>**Player 1**", "success");
    } else {
      warningAlert("The overall Champion is:<br>**Player 2**", "success");
    }
  } else if (boardArrayCopy.length === 0) {
    warningAlert("You solved the puzzle!<br>Press game to continue to the next round", "success");
  }
}; // onscreen keyboard function


key.forEach(function (letter) {
  letter.addEventListener("click", function () {
    players[playerIndex].previousScore = +scorecard.innerText; // update previous-score

    boardArray.forEach(function (index) {
      if (letter.innerText === letterSquare[index].innerText) {
        letterSquare[index].style.color = "#0a0707";
        players[playerIndex].score += pointsScore;
        boardArrayCopy.pop();
      }
    });
    letter.style.color = "transparent";
    letter.style.backgroundColor = "transparent";
    players[playerIndex].updateScore();
    setTimeout(winCheck, 300);

    if (players[playerIndex].previousScore >= players[playerIndex].score) {
      warningAlert("Wrong Guess!<br>Round goes to the next player", "error");
      playerTurns();
    }
  });
}); // player class constructor

var Player =
/*#__PURE__*/
function () {
  function Player(name, score, previousScore) {
    _classCallCheck(this, Player);

    this.name = name;
    this.score = score;
    this.previousScore = previousScore;
  }

  _createClass(Player, [{
    key: "updateScore",
    value: function updateScore() {
      scorecard.innerText = this.score;
    }
  }, {
    key: "updatePlayerStatus",
    value: function updatePlayerStatus() {
      playerTitle.innerText = this.name;
    }
  }]);

  return Player;
}(); // players


var player1 = new Player("Player 1", 0, parseInt(scorecard.innerText));
var player2 = new Player("Player 2", 0, parseInt(scorecard.innerText)); // letter points

var pointsScore; // players array

var players = [player1, player2]; // index for accessing players array

var playerIndex = 0; // check player score/turn

function playerTurns() {
  if (players[playerIndex] === player1) {
    playerIndex = 1;
    players[playerIndex].updatePlayerStatus();
    players[playerIndex].updateScore();
  } else {
    playerIndex = 0;
    players[playerIndex].updatePlayerStatus();
    players[playerIndex].updateScore();
  }
} // wheel object


var pointsSpin = {
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
  0: 5000 // 2 of same entry at 0/360deg (keys: 0,24) to account for index 0

}; // spinning function

var pointsSegment;
spinButton.addEventListener("click", function () {
  var x = 1080;
  var y = 9999;
  var deg = Math.floor(Math.random() * (y - x)) + y;
  var wheelSegment = Math.floor((deg + 7.5) % 360 / 15); // degree of rotation after last 360 to determine position --> each segment at 15deg (wheel has 24 segments)

  wheelImage.style.transition = "3s ease"; //  add 7.5 deg for wheel image offset and determine value of wheel segment with index to wheel object

  wheelImage.style.transform = "rotate(".concat(deg, "deg)");
  pointsSegment = pointsSpin[wheelSegment];
});
wheelImage.addEventListener("transitionend", function () {
  switch (pointsSegment) {
    case "You're bankrupt":
      warningAlert("".concat(pointsSegment, "<br>Round goes to the next player"), "error");
      players[playerIndex].score = 0;
      letterPointsIndicator.innerText = pointsSpin[11];
      setTimeout(playerTurns, 500);
      break;

    case "You lose a turn":
      warningAlert("".concat(pointsSegment, "<br>Round goes to the next player"), "error");
      letterPointsIndicator.innerText = pointsSpin[7];
      setTimeout(playerTurns, 500);
      break;

    default:
      letterPointsIndicator.innerText = "Guess a letter for ".concat(pointsSegment, " points each");
  }

  if (typeof pointsSegment !== "string") {
    pointsScore = pointsSegment;
  }
}); // restart game

restartButton.addEventListener("click", function () {
  boardArray = [];
  dataCopy = [].concat(guessData);
  clearBoard();
  keyboardReset();
  player2.score = 0;
  player2.updateScore();
  player1.score = 0;
  player1.updateScore();
  player1.updatePlayerStatus();
  hint.innerHTML = "Press <span class = \"text-holder__underline\">GAME</span> to begin and <span class = \"text-holder__underline\">SPIN</span> to start playing";
  letterPointsIndicator.innerHTML = "Press <span class = \"text-holder__underline\">KEYBOARD</span> to toggle keyboard <span class = \"text-holder__underline\">ON/OFF</span>";
}); // keyboard slide-in

var keyboardCount = 0; // click counter for initial display of grid 

keyboardSlidein.addEventListener("click", function () {
  if (keyboardCount === 0) {
    keyboard1.style.display = "grid";
    wheelbox.classList.toggle("wheel-box_visibility");
  } else {
    wheelbox.classList.toggle("wheel-box_visibility");
    keyboard1.classList.toggle("slide-bottom");
  }

  keyboardCount += 1;
});