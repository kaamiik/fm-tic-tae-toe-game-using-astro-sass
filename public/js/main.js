document.addEventListener("DOMContentLoaded", function () {
  const pageHeading = document.querySelector("h1");
  const playerXRadio = document.querySelector("#player-x");
  const playerORadio = document.querySelector("#player-o");
  const playVsCPUBtn = document.querySelector(".js-play-vs-cpu");
  const playMultiPlayer = document.querySelector(".js-play-vs-player");
  const gameSection = document.querySelector(".js-game");
  const newGameSection = document.querySelector(".js-new-game");
  const gameTurn = document.querySelector(".js-game-turn-text");
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
  const screenReaderClickButton = document.querySelector(".js-sr-click-button");
  const dialogScreenReader = Array.from(
    document.querySelectorAll(".js-dialog-sr")
  );

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
    gameSection.parentElement.classList.remove("hidden");
    newGameSection.parentElement.classList.add("hidden");
    pageHeading.textContent = mode;
    pageHeading.focus();
  }

  function resetGameToMenu() {
    restartDialog.close();
    oWinsDialog.close();
    xWinsDialog.close();
    tiesDialog.close();
    gameSection.parentElement.classList.add("hidden");
    newGameSection.parentElement.classList.remove("hidden");
    pageHeading.textContent =
      "Game Setup: You can Choose Your Side and Opponent";
    pageHeading.focus();
    resetGame();
  }

  function resetGame() {
    currentPlayer = "X";
    gameOver = false;
    gameTurn.innerHTML = `
      <svg
      aria-hidden="true"
      focusable="false"
      width="16"
      height="16"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      ><path
        d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"
        fill="#A8BFC9"
        fill-rule="evenodd"></path></svg
    >
    turn
    `;
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

    if (currentPlayer === "X") {
      gameTurn.innerHTML = `
        <svg
          aria-hidden="true"
          focusable="false"
          width="16"
          height="16"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M15.002 1.147 32 18.145 48.998 1.147a3 3 0 0 1 4.243 0l9.612 9.612a3 3 0 0 1 0 4.243L45.855 32l16.998 16.998a3 3 0 0 1 0 4.243l-9.612 9.612a3 3 0 0 1-4.243 0L32 45.855 15.002 62.853a3 3 0 0 1-4.243 0L1.147 53.24a3 3 0 0 1 0-4.243L18.145 32 1.147 15.002a3 3 0 0 1 0-4.243l9.612-9.612a3 3 0 0 1 4.243 0Z"
            fill="#A8BFC9"
            fill-rule="evenodd">
          </path>
        </svg>
        turn
      `;
    } else {
      gameTurn.innerHTML = `
        <svg
          aria-hidden="true"
          focusable="false"
          width="16"
          height="16"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          ><path
            d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0Zm0 18.963c-7.2 0-13.037 5.837-13.037 13.037 0 7.2 5.837 13.037 13.037 13.037 7.2 0 13.037-5.837 13.037-13.037 0-7.2-5.837-13.037-13.037-13.037Z"
            fill="#A8BFC9">
          </path>
        </svg>
        turn
      `;
    }
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
          // Say the results for screen readers
          dialogScreenReader[1].innerHTML = `The result is ${
            xScore + 1
          } for x and ${oScore} for o. Number of ties is ${tieScore}`;
        } else {
          oWinsDialog.showModal();
          oWinsYourResult.textContent = "Oh no, You lost ...";
          // Say the results for screen readers
          dialogScreenReader[0].innerHTML = `The result is ${xScore} for x and ${
            oScore + 1
          } for o. Number of ties is ${tieScore}`;
        }
      } else {
        if (winner === "O") {
          oWinsDialog.showModal();
          oWinsYourResult.textContent = "You won!";
          // Say the results for screen readers
          dialogScreenReader[0].innerHTML = `The result is ${xScore} for x and ${
            oScore + 1
          } for o. Number of ties is ${tieScore}`;
        } else {
          xWinsDialog.showModal();
          xWinsYourResult.textContent = "Oh no, You lost ...";
          // Say the results for screen readers
          dialogScreenReader[1].innerHTML = `The result is ${
            xScore + 1
          } for x and ${oScore} for o. Number of ties is ${tieScore}`;
        }
      }
    } else {
      if (playerXLabel.textContent === "x (p1)") {
        if (winner === "X") {
          xWinsDialog.showModal();
          xWinsYourResult.textContent = "Player 1 wins!";
          // Say the results for screen readers
          dialogScreenReader[1].innerHTML = `The result is ${
            xScore + 1
          } for x and ${oScore} for o. Number of ties is ${tieScore}`;
        } else {
          oWinsDialog.showModal();
          oWinsYourResult.textContent = "Player 2 wins!";
          // Say the results for screen readers
          dialogScreenReader[0].innerHTML = `The result is ${xScore} for x and ${
            oScore + 1
          } for o. Number of ties is ${tieScore}`;
        }
      } else {
        if (winner === "X") {
          xWinsDialog.showModal();
          xWinsYourResult.textContent = "Player 2 wins!";
          // Say the results for screen readers
          dialogScreenReader[1].innerHTML = `The result is ${
            xScore + 1
          } for x and ${oScore} for o. Number of ties is ${tieScore}`;
        } else {
          oWinsDialog.showModal();
          oWinsYourResult.textContent = "Player 1 wins!";
          // Say the results for screen readers
          dialogScreenReader[0].innerHTML = `The result is ${xScore} for x and ${
            oScore + 1
          } for o. Number of ties is ${tieScore}`;
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
    dialogScreenReader[2].innerHTML = `The result is ${xScore} for x and ${oScore} for o. Number of ties is ${tieScore}`;
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
    let gameButtonLabel = gameButton.getAttribute("aria-label");
    let turn = currentPlayer === "X" ? "player o turn" : "player x turn";
    screenReaderClickButton.innerHTML = `${gameButtonLabel} filled for ${currentPlayer}. Now ${turn}`;

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
    }, 1000);
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
    startGame("Play solo game - x turn");
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
    startGame("Play vs Player - x turn");
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
