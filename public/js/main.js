document.addEventListener("DOMContentLoaded", function () {
  const pageHeading = document.querySelector("h1");
  const playerXRadio = document.querySelector("#player-x");
  const playerORadio = document.querySelector("#player-o");
  const playVsCPUBtn = document.querySelector(".js-play-vs-cpu");
  const playMultiPlayer = document.querySelector(".js-play-vs-player");
  const gameSection = document.querySelector(".js-game");
  const newGameSection = document.querySelector(".js-new-game");
  const restartGameButton = document.querySelector(".js-restart");
  const oWinsDialog = document.querySelector(".js-dialog-o-wins");
  const oWinsYourResult = document.querySelector(".js-dialog-o-your-result");
  const xWinsDialog = document.querySelector(".js-dialog-x-wins");
  const xWinsYourResult = document.querySelector(".js-dialog-x-your-result");
  const tiesDialog = document.querySelector(".js-dialog-ties");
  const quitGame = document.querySelectorAll(".js-quit");
  const nextRound = document.querySelectorAll(".js-next-round");
  const restartDialog = document.querySelector(".js-dialog-restart");
  const cancelRestart = document.querySelector(".js-cancel-restart");
  const confirmRestart = document.querySelector(".js-confirm-restart");
  const gameButtons = Array.from(document.querySelectorAll(".js-game-play"));
  const playerXLabel = document.querySelector(".js-player-x-label");
  const playerOLabel = document.querySelector(".js-player-o-label");
  const playerXScore = document.querySelector(".js-player-x-score");
  const playerOScore = document.querySelector(".js-player-o-score");
  const numberOfTies = document.querySelector(".js-ties-count");

  // Game States
  let currentPlayer = "X";
  let xScore = 0;
  let oScore = 0;
  let tieScore = 0;
  let isCPUGame = false;
  let playerIsX = true;
  let gameOver = false;

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  function startGame(mode) {
    gameSection.classList.add("game");
    gameSection.classList.remove("hidden");
    newGameSection.classList.add("hidden");
    newGameSection.classList.remove("new-game");
    pageHeading.textContent = mode;
    pageHeading.focus();
  }

  function resetGameToMenu() {
    restartDialog.close();
    oWinsDialog.close();
    xWinsDialog.close();
    tiesDialog.close();
    gameSection.classList.remove("game");
    gameSection.classList.add("hidden");
    newGameSection.classList.add("new-game");
    newGameSection.classList.remove("hidden");
    pageHeading.textContent =
      "Game Setup: You can Choose Your Side and Opponent";
    pageHeading.focus();
    resetGame();
  }

  function resetGame() {
    currentPlayer = "X";
    gameOver = false;
    gameButtons.forEach((button) => {
      button.innerHTML = "";
      button.setAttribute("data-player", "");
      button.classList.remove("fill", "o--turn", "win-x", "win-o");
      button.classList.add("empty", "x--turn");
      button.removeAttribute("disabled");
    });
  }

  function toggleTurn() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    gameButtons.forEach((button) => {
      if (button.getAttribute("data-player") === "") {
        button.classList.remove("x--turn", "o--turn");
        button.classList.add(`${currentPlayer.toLowerCase()}--turn`);
      }
    });
  }

  function checkWin(player) {
    for (let combination of winningCombinations) {
      if (
        combination.every(
          (index) => gameButtons[index].getAttribute("data-player") === player
        )
      ) {
        if (player === "X") {
          combination.forEach((index) =>
            gameButtons[index].classList.add("win-x")
          );
        } else {
          combination.forEach((index) =>
            gameButtons[index].classList.add("win-o")
          );
        }
        return true;
      }
    }
    return false;
  }

  function disableAllButtons() {
    gameButtons.forEach((button) => {
      button.setAttribute("disabled", true);
      button.classList.remove("x--turn", "o--turn");
    });
  }

  function updateScores(winner) {
    if (winner === "X") {
      xScore++;
      playerXScore.textContent = xScore;
    } else if (winner === "O") {
      oScore++;
      playerOScore.textContent = oScore;
    } else {
      tieScore++;
      numberOfTies.textContent = tieScore;
    }
  }

  function showWinDialog(winner) {
    if (isCPUGame) {
      if (playerIsX) {
        if (winner === "X") {
          xWinsDialog.showModal();
          xWinsYourResult.textContent = "You won!";
        } else {
          oWinsDialog.showModal();
          oWinsYourResult.textContent = "Oh no, You lost ...";
        }
      } else {
        if (winner === "O") {
          oWinsDialog.showModal();
          oWinsYourResult.textContent = "You won!";
        } else {
          xWinsDialog.showModal();
          xWinsYourResult.textContent = "Oh no, You lost ...";
        }
      }
    } else {
      if (playerXLabel.textContent === "x (p1)") {
        if (winner === "X") {
          xWinsDialog.showModal();
          xWinsYourResult.textContent = "Player 1 wins!";
        } else {
          oWinsDialog.showModal();
          oWinsYourResult.textContent = "Player 2 wins!";
        }
      } else {
        if (winner === "X") {
          xWinsDialog.showModal();
          xWinsYourResult.textContent = "Player 2 wins!";
        } else {
          oWinsDialog.showModal();
          oWinsYourResult.textContent = "Player 1 wins!";
        }
      }
    }
  }

  function handleWin(currentPlayer) {
    gameOver = true;
    showWinDialog(currentPlayer);
    updateScores(currentPlayer);
    disableAllButtons();
  }

  function checkTie() {
    return gameButtons.every((button) => !button.classList.contains("empty"));
  }

  function handleTie() {
    gameOver = true;
    tiesDialog.showModal();
    updateScores("tie");
  }

  function handleButtonClick(gameButton) {
    if (gameOver) return;
    gameButton.innerHTML =
      currentPlayer === "X"
        ? `<img src="/assets/images/icon-x.svg" alt="" />`
        : `<img src="/assets/images/icon-o.svg" alt="" />`;

    gameButton.setAttribute("data-player", currentPlayer);
    gameButton.classList.remove("empty");
    gameButton.classList.add("fill");
    gameButton.setAttribute("disabled", true);

    if (checkWin(currentPlayer)) {
      handleWin(currentPlayer);
    } else if (checkTie()) {
      handleTie();
    } else {
      toggleTurn();
      if (isCPUGame && !gameOver) {
        if (
          (currentPlayer === "X" && !playerIsX) ||
          (currentPlayer === "O" && playerIsX)
        ) {
          handleCPUTurn();
        }
      }
    }
  }

  function handleCPUTurn() {
    disableAllButtons();

    const emptyButtons = gameButtons.filter((button) =>
      button.classList.contains("empty")
    );
    if (emptyButtons.length === 0) return;

    const randomButton =
      emptyButtons[Math.floor(Math.random() * emptyButtons.length)];

    setTimeout(() => {
      handleButtonClick(randomButton, true);

      if (!gameOver) {
        gameButtons.forEach((button) => {
          if (button.classList.contains("empty")) {
            button.removeAttribute("disabled");
          }
        });
      }
    }, 500);
  }

  function attachListeners() {
    gameButtons.forEach((gameButton) => {
      gameButton.removeEventListener("click", handleButtonClick);
      gameButton.addEventListener("click", function () {
        handleButtonClick(gameButton);
      });
    });
  }

  attachListeners();

  playVsCPUBtn.addEventListener("click", function () {
    startGame("Play solo game");
    playerXScore.textContent = "0";
    playerOScore.textContent = "0";
    numberOfTies.textContent = "0";
    xScore = 0;
    oScore = 0;
    tieScore = 0;

    playerIsX = playerXRadio.checked;
    isCPUGame = true;
    playerXLabel.textContent = playerXRadio.checked ? "x (you)" : "x (cpu)";
    playerOLabel.textContent = playerXRadio.checked ? "o (cpu)" : "o (you)";
    resetGame();
    if (!playerIsX) {
      handleCPUTurn();
    }
  });

  playMultiPlayer.addEventListener("click", function () {
    startGame("Play vs Player");
    resetGame();
    xScore = 0;
    oScore = 0;
    tieScore = 0;
    playerXScore.textContent = "0";
    playerOScore.textContent = "0";
    numberOfTies.textContent = "0";

    playerXLabel.textContent = playerXRadio.checked ? "x (p1)" : "x (p2)";
    playerOLabel.textContent = playerXRadio.checked ? "o (p2)" : "o (p1)";
    isCPUGame = false;
  });

  quitGame.forEach((button) => {
    button.addEventListener("click", resetGameToMenu);
  });

  nextRound.forEach((button) => {
    button.addEventListener("click", function () {
      oWinsDialog.close();
      xWinsDialog.close();
      tiesDialog.close();
      resetGame();

      currentPlayer = "X";
      if (isCPUGame && !playerIsX) {
        handleCPUTurn();
      }
    });
  });

  restartGameButton.addEventListener("click", function () {
    restartDialog.showModal();
  });

  cancelRestart.addEventListener("click", function () {
    restartDialog.close();
  });

  confirmRestart.addEventListener("click", function () {
    restartDialog.close();
    resetGameToMenu();
  });
});
