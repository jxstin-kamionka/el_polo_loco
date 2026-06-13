let canvas;
let world;
let keyboard = new Keyboard();
let mobileControls;
let orientationCheck;
let gameStarted = false;
let gameOver = false;
let youWin = false;
let isPaused = false;
let sounds = new Sounds();

function init() {
  canvas = document.getElementById("canvas");
  registerKeyboardEvents();
  showStartScreen();
  orientationCheck = new OrientationCheck();

  // Default: muted — unless user explicitly set it to "false" before
  const muted = localStorage.getItem("muted") !== "false";
  if (muted) {
    sounds.muteAll();
    localStorage.setItem("muted", "true");
  } else {
    sounds.unmuteAll();
  }
  // No audio on page load — playBackground() is called on first user interaction (startGame)
  sounds.setMusicVolume(0.05);
  updateSoundButtons();
}

function startGame() {
  if (gameStarted) return;

  resetGameState();
  hideStartScreen();
  hideGameEndOverlay();
  initLevel1();

  world = new World(canvas, keyboard);
  mobileControls = new MobileControls(keyboard);
  gameStarted = true;
  showPauseBtn();
  sounds.playBackground();
  sounds.play("chicken");
  sounds.setSoundVolume(0.1);
}

function restartGame() {
  if (world) { world.stop(); world = null; }

  sounds.stop("gameOver");
  sounds.stop("youWin");
  resetGameState();
  hideGameEndOverlay();
  initLevel1();

  world = new World(canvas, keyboard);
  mobileControls = new MobileControls(keyboard);
  gameStarted = true;
  showPauseBtn();
  sounds.play("chicken");
  sounds.setSoundVolume(0.1);
  sounds.playBackground();
}

function resetGameState() {
  gameOver = false;
  youWin = false;
  gameStarted = false;
  isPaused = false;
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;
}

function pauseGame() {
  if (!gameStarted) return;
  isPaused = true;
  hidePauseBtn();
  document.getElementById("pauseOverlay").classList.remove("hidden");
}

function resumeGame() {
  isPaused = false;
  document.getElementById("pauseOverlay").classList.add("hidden");
  showPauseBtn();
}

function showPauseBtn() {
  document.getElementById("btn-pause").classList.remove("hidden");
}

function hidePauseBtn() {
  document.getElementById("btn-pause").classList.add("hidden");
}

function hideStartScreen() {
  document.getElementById("startScreen").classList.add("hidden");
}

function showStartScreen() {
  document.getElementById("startScreen").classList.remove("hidden");
}

function showGameEndOverlay(result) {
  hidePauseBtn();
  document.getElementById("pauseOverlay").classList.add("hidden");

  const img = document.getElementById("gameEndImage");
  if (result === "youWin") {
    img.src = "assets/img/You won, you lost/You win B.png";
    img.alt = "Du hast gewonnen";
  } else {
    img.src = "assets/img/You won, you lost/Game over A.png";
    img.alt = "Game Over";
  }
  document.getElementById("gameEndOverlay").classList.remove("hidden");
}

function hideGameEndOverlay() {
  document.getElementById("gameEndOverlay").classList.add("hidden");
}

function returnToStartScreen() {
  isPaused = false;
  if (world) { world.stop(); world = null; }

  sounds.stop("gameOver");
  sounds.stop("youWin");
  resetGameState();
  hideGameEndOverlay();
  document.getElementById("pauseOverlay").classList.add("hidden");
  hidePauseBtn();
  showStartScreen();
  sounds.playBackground();
}

function toggleSound() {
  const muted = localStorage.getItem("muted") === "true";
  if (muted) {
    sounds.unmuteAll();
    localStorage.setItem("muted", "false");
  } else {
    sounds.muteAll();
    localStorage.setItem("muted", "true");
  }
  updateSoundButtons();
}

function updateSoundButtons() {
  const muted = localStorage.getItem("muted") === "true";
  const icon = muted
    ? "url(/assets/img/9_intro_outro_screens/start/keinen-ton.png)"
    : "url(/assets/img/9_intro_outro_screens/start/volumen.png)";

  const btnTon = document.getElementById("btn-ton");
  if (btnTon) btnTon.style.backgroundImage = icon;

  const soundState = document.getElementById("pause-sound-state");
  if (soundState) soundState.textContent = muted ? "Aus" : "An";
}

function toggleInstructions() {
  const instructionsPanel = document.getElementById("instructionsPanel");
  const imprintPanel = document.getElementById("imprintPanel");
  imprintPanel.classList.add("hidden");
  instructionsPanel.classList.toggle("hidden");
}

function toggleImprint() {
  const imprintPanel = document.getElementById("imprintPanel");
  const instructionsPanel = document.getElementById("instructionsPanel");
  instructionsPanel.classList.add("hidden");
  imprintPanel.classList.toggle("hidden");
}

function toggleFullscreen() {
  const container = document.getElementById("gameContainer");
  const menuBox = document.getElementById("menu-box");

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch((err) => {
      console.error("Fehler beim Vollbildmodus:", err);
    });
    menuBox.classList.add("fullscreen");
  } else {
    document.exitFullscreen();
  }
}

window.addEventListener("fullscreenchange", () => {
  const menuBox = document.getElementById("menu-box");
  if (!document.fullscreenElement) {
    menuBox.classList.remove("fullscreen");
  }
});

function registerKeyboardEvents() {
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keyboard.LEFT = true;
    if (e.key === "ArrowRight") keyboard.RIGHT = true;
    if (e.key === "ArrowUp") keyboard.UP = true;
    if (e.key === "ArrowDown") keyboard.DOWN = true;
    if (e.key === " ") keyboard.SPACE = true;
    if (e.key === "d" || e.key === "D") keyboard.D = true;
    if (e.key === "Escape") {
      if (isPaused) resumeGame();
      else if (gameStarted) pauseGame();
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keyboard.LEFT = false;
    if (e.key === "ArrowRight") keyboard.RIGHT = false;
    if (e.key === "ArrowUp") keyboard.UP = false;
    if (e.key === "ArrowDown") keyboard.DOWN = false;
    if (e.key === " ") keyboard.SPACE = false;
    if (e.key === "d" || e.key === "D") keyboard.D = false;
  });
}
