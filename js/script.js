/** @type {HTMLCanvasElement} Main game canvas. */
let canvas;

/** @type {?World} Active world instance. */
let world;

/** @type {Keyboard} Shared keyboard state. */
let keyboard = new Keyboard();

/** @type {?MobileControls} Touch controls instance. */
let mobileControls;

/** @type {?OrientationCheck} Orientation overlay controller. */
let orientationCheck;

/** @type {boolean} Whether a game session is active. */
let gameStarted = false;

/** @type {boolean} Whether the player lost. */
let gameOver = false;

/** @type {boolean} Whether the player won. */
let youWin = false;

/** @type {boolean} Whether the game is paused. */
let isPaused = false;

/** @type {Sounds} Shared sound manager. */
let sounds = new Sounds();

/**
 * Initializes the game UI, input handlers, orientation checks, and sound state.
 * @returns {void}
 */
function init() {
  canvas = document.getElementById("canvas");
  registerKeyboardEvents();
  showStartScreen();
  orientationCheck = new OrientationCheck();

  const muted = localStorage.getItem("muted") !== "false";
  if (muted) {
    sounds.muteAll();
    localStorage.setItem("muted", "true");
  } else {
    sounds.unmuteAll();
  }
  sounds.setMusicVolume(0.05);
  updateSoundButtons();
  updateDifficultyButton();
}

/**
 * Starts a new game from the start screen.
 * @returns {void}
 */
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

/**
 * Restarts the game after a win or loss.
 * @returns {void}
 */
function restartGame() {
  if (world) {
    world.stop();
    world = null;
  }

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

/**
 * Resets global game flags and keyboard input.
 * @returns {void}
 */
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

/**
 * Pauses the current game and shows the pause overlay.
 * @returns {void}
 */
function pauseGame() {
  if (!gameStarted) return;
  isPaused = true;
  hidePauseBtn();
  document.getElementById("pauseOverlay").classList.remove("hidden");
}

/**
 * Resumes a paused game.
 * @returns {void}
 */
function resumeGame() {
  isPaused = false;
  document.getElementById("pauseOverlay").classList.add("hidden");
  showPauseBtn();
}

/**
 * Shows the pause button.
 * @returns {void}
 */
function showPauseBtn() {
  document.getElementById("btn-pause").classList.remove("hidden");
}

/**
 * Hides the pause button.
 * @returns {void}
 */
function hidePauseBtn() {
  document.getElementById("btn-pause").classList.add("hidden");
}

/**
 * Hides the start screen.
 * @returns {void}
 */
function hideStartScreen() {
  document.getElementById("startScreen").classList.add("hidden");
}

/**
 * Shows the start screen.
 * @returns {void}
 */
function showStartScreen() {
  document.getElementById("startScreen").classList.remove("hidden");
}

/**
 * Shows the win or loss overlay.
 * @param {"gameOver"|"youWin"} result Result image to display.
 * @returns {void}
 */
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

/**
 * Hides the game end overlay.
 * @returns {void}
 */
function hideGameEndOverlay() {
  document.getElementById("gameEndOverlay").classList.add("hidden");
}

/**
 * Stops the game and returns to the start screen.
 * @returns {void}
 */
function returnToStartScreen() {
  isPaused = false;
  if (world) {
    world.stop();
    world = null;
  }

  sounds.stop("gameOver");
  sounds.stop("youWin");
  resetGameState();
  hideGameEndOverlay();
  document.getElementById("pauseOverlay").classList.add("hidden");
  hidePauseBtn();
  showStartScreen();
  sounds.playBackground();
}

/**
 * Toggles all sounds and persists the mute preference.
 * @returns {void}
 */
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

/**
 * Updates sound buttons to match the persisted mute state.
 * @returns {void}
 */
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

/**
 * Toggles the instructions panel and closes the imprint panel.
 * @returns {void}
 */
function toggleInstructions() {
  const instructionsPanel = document.getElementById("instructionsPanel");
  const imprintPanel = document.getElementById("imprintPanel");
  imprintPanel.classList.add("hidden");
  instructionsPanel.classList.toggle("hidden");
}

/**
 * Toggles the imprint panel and closes the instructions panel.
 * @returns {void}
 */
function toggleImprint() {
  const imprintPanel = document.getElementById("imprintPanel");
  const instructionsPanel = document.getElementById("instructionsPanel");
  instructionsPanel.classList.add("hidden");
  imprintPanel.classList.toggle("hidden");
}

/**
 * Toggles fullscreen mode for the game container.
 * @returns {void}
 */
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

/**
 * Removes fullscreen-specific styling after leaving fullscreen mode.
 * @returns {void}
 */
function handleFullscreenChange() {
  const menuBox = document.getElementById("menu-box");
  if (!document.fullscreenElement) {
    menuBox.classList.remove("fullscreen");
  }
}

/**
 * Registers keydown and keyup handlers for gameplay input.
 * @returns {void}
 */
function registerKeyboardEvents() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

/**
 * Applies a pressed keyboard key to the shared input state.
 * @param {KeyboardEvent} event Keydown event.
 * @returns {void}
 */
function handleKeyDown(event) {
  if (event.key === "ArrowLeft") keyboard.LEFT = true;
  if (event.key === "ArrowRight") keyboard.RIGHT = true;
  if (event.key === "ArrowUp") keyboard.UP = true;
  if (event.key === "ArrowDown") keyboard.DOWN = true;
  if (event.key === " ") keyboard.SPACE = true;
  if (event.key === "d" || event.key === "D") keyboard.D = true;
  if (event.key === "Escape") togglePauseFromKeyboard();
}

/**
 * Releases a keyboard key from the shared input state.
 * @param {KeyboardEvent} event Keyup event.
 * @returns {void}
 */
function handleKeyUp(event) {
  if (event.key === "ArrowLeft") keyboard.LEFT = false;
  if (event.key === "ArrowRight") keyboard.RIGHT = false;
  if (event.key === "ArrowUp") keyboard.UP = false;
  if (event.key === "ArrowDown") keyboard.DOWN = false;
  if (event.key === " ") keyboard.SPACE = false;
  if (event.key === "d" || event.key === "D") keyboard.D = false;
}

/**
 * Toggles pause state when Escape is pressed.
 * @returns {void}
 */
function togglePauseFromKeyboard() {
  if (isPaused) {
    resumeGame();
  } else if (gameStarted) {
    pauseGame();
  }
}

window.addEventListener("fullscreenchange", handleFullscreenChange);
