let canvas;
let world;
let keyboard = new Keyboard();
let mobileControls
let orientationCheck;
let gameStarted = false;
let gameOver = false;
let youWin = false;
let sounds = new Sounds();

function init() {
  canvas = document.getElementById("canvas");
  registerKeyboardEvents();
  showStartScreen();
  sounds.playBackground();
  sounds.setMusicVolume(0.05);
  orientationCheck = new OrientationCheck();
}

function startGame() {
  if (gameStarted) return;

  resetGameState();
  hideStartScreen();
  world = new World(canvas, keyboard);
  mobileControls = new MobileControls(keyboard);
  gameStarted = true;
  sounds.play("chicken");
  sounds.setSoundVolume(0.1);
}

function resetGameState() {
  gameOver = false;
  youWin = false;
  gameStarted = false;

  keyboard.LEFT = false;
  keyboard.RIGHT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;
}

function hideStartScreen() {
  document.getElementById("startScreen").classList.add("hidden");
}

function showStartScreen() {
  document.getElementById("startScreen").classList.remove("hidden");
}

function returnToStartScreen() {
  if (world) {
    world.stop();
    world = null;
  }

  resetGameState();
  showStartScreen();
}

function toggleInstructions() {
  let instructionsPanel = document.getElementById("instructionsPanel");
  let imprintPanel = document.getElementById("imprintPanel");

  imprintPanel.classList.add("hidden");
  instructionsPanel.classList.toggle("hidden");
}

function toggleImprint() {
  let imprintPanel = document.getElementById("imprintPanel");
  let instructionsPanel = document.getElementById("instructionsPanel");

  instructionsPanel.classList.add("hidden");
  imprintPanel.classList.toggle("hidden");
}

function toggleFullscreen() {
  let container = document.getElementById("gameContainer");
  let startScreen = document.getElementById("menu-box");

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch((error) => {
      console.error("Fehler beim Vollbildmodus:", error);
    });
    startScreen.classList.add("fullscreen");
  } else {
    document.exitFullscreen();
  }
}

function toggleSound() {
  if (sounds.muted) {
    sounds.unmuteAll();
    document.getElementById("btn-ton").style.backgroundImage =
      "url(/assets/img/9_intro_outro_screens/start/volumen.png)";
  } else {
    sounds.muteAll();
    document.getElementById("btn-ton").style.backgroundImage =
      "url(/assets/img/9_intro_outro_screens/start/keinen-ton.png)";
  }
}

window.addEventListener("fullscreenchange", () => {
  let startScreen = document.getElementById("menu-box");
  if (!document.fullscreenElement) {
    startScreen.classList.remove("fullscreen");
  }
});

function registerKeyboardEvents() {
  window.addEventListener("keydown", (e) => {
    if (e.key == "ArrowLeft") keyboard.LEFT = true;
    if (e.key == "ArrowRight") keyboard.RIGHT = true;
    if (e.key == "ArrowUp") keyboard.UP = true;
    if (e.key == "ArrowDown") keyboard.DOWN = true;
    if (e.key == " ") keyboard.SPACE = true;
    if (e.key == "d" || e.key == "D") keyboard.D = true;
  });

  window.addEventListener("keyup", (e) => {
    if (e.key == "ArrowLeft") keyboard.LEFT = false;
    if (e.key == "ArrowRight") keyboard.RIGHT = false;
    if (e.key == "ArrowUp") keyboard.UP = false;
    if (e.key == "ArrowDown") keyboard.DOWN = false;
    if (e.key == " ") keyboard.SPACE = false;
    if (e.key == "d" || e.key == "D") keyboard.D = false;
  });
}
