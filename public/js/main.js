document.addEventListener("DOMContentLoaded", function () {
  const playVsCPUBtn = document.querySelector(".js-play-vs-cpu");
  const playMultiPlayer = document.querySelector(".js-play-vs-player");
  const gameSection = document.querySelector(".js-game");
  const newGameSection = document.querySelector(".js-new-game");
  const restartGameButton = document.querySelector(".js-restart");
  const restartDialog = document.querySelector(".js-dialog-restart");
  const cancelRestart = document.querySelector(".js-cancel-restart");
  const confirmRestart = document.querySelector(".js-confirm-restart");

  playVsCPUBtn.addEventListener("click", function () {
    gameSection.classList.add("game");
    gameSection.classList.remove("hidden");
    newGameSection.classList.remove("new-game");
    newGameSection.classList.add("hidden");
  });

  playMultiPlayer.addEventListener("click", function () {
    gameSection.classList.add("game");
    gameSection.classList.remove("hidden");
    newGameSection.classList.remove("new-game");
    newGameSection.classList.add("hidden");
  });

  restartGameButton.addEventListener("click", function () {
    restartDialog.showModal();
  });

  cancelRestart.addEventListener("click", function () {
    restartDialog.close();
  });

  confirmRestart.addEventListener("click", function () {
    restartDialog.close();
    gameSection.classList.remove("game");
    gameSection.classList.add("hidden");
    newGameSection.classList.add("new-game");
    newGameSection.classList.remove("hidden");
  });
});
