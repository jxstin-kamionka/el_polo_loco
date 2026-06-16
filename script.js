/**
 * @file Bootstraps the menu, game session, input, audio, and overlays.
 */

// Global state ---------------------------------------------------------------

/** @type {HTMLCanvasElement | null} Main game canvas. */
let canvas = null;

/** @type {World | null} Active world instance. */
let world = null;

/** @type {Keyboard} Shared keyboard state. */
let keyboard = new Keyboard();

/** @type {MobileControls | null} Touch controls instance. */
let mobileControls = null;

/** @type {OrientationCheck | null} Orientation overlay controller. */
let orientationCheck = null;

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

const SOUND_ICONS = {
  muted: "url(assets/img/9_intro_outro_screens/start/keinen-ton.png)",
  enabled: "url(assets/img/9_intro_outro_screens/start/volumen.png)",
};

// Startup and sessions -------------------------------------------------------

/** Initializes the menu, input handlers, orientation check, and audio state. */
function init() {
  canvas = document.getElementById("canvas");
  registerKeyboardEvents();
  showStartScreen();
  orientationCheck = new OrientationCheck();
  restoreSoundState();
  updateSoundButtons();
  updateDifficultyButton();
}

/** Starts a fresh game from the start screen. */
function startGame() {
  if (gameStarted) return;
  prepareNewSession();
  sounds.playBackground();
}

/** Restarts the game after a win or loss. */
function restartGame() {
  stopActiveWorld();
  sounds.stop("gameOver");
  sounds.stop("youWin");
  prepareNewSession();
  sounds.playBackground();
}

/** Resets state, rebuilds the level, and starts the world loop. */
function prepareNewSession() {
  resetGameState();
  hideStartScreen();
  hideGameEndOverlay();
  initLevel1();

  world = new World(canvas, keyboard);
  initMobileControls();
  gameStarted = true;
  showPauseBtn();
  sounds.play("chicken");
  sounds.setSoundVolume(0.1);
}

/** Creates mobile controls once and refreshes their visibility afterwards. */
function initMobileControls() {
  if (!mobileControls) {
    mobileControls = new MobileControls(keyboard);
  } else {
    mobileControls.updateVisibility();
  }
}

/** Stops and clears the currently active world. */
function stopActiveWorld() {
  if (!world) return;
  world.stop();
  world = null;
}

/** Resets global game flags and keyboard input. */
function resetGameState() {
  gameOver = false;
  youWin = false;
  gameStarted = false;
  isPaused = false;
  resetKeyboardState();
}

/** Clears all gameplay input flags. */
function resetKeyboardState() {
  keyboard.LEFT = false;
  keyboard.RIGHT = false;
  keyboard.UP = false;
  keyboard.DOWN = false;
  keyboard.SPACE = false;
  keyboard.D = false;
}

// Pause and overlays ---------------------------------------------------------

/** Pauses the current game and shows the pause overlay. */
function pauseGame() {
  if (!gameStarted) return;
  isPaused = true;
  hidePauseBtn();
  document.getElementById("pauseOverlay").classList.remove("hidden");
}

/** Resumes a paused game. */
function resumeGame() {
  isPaused = false;
  document.getElementById("pauseOverlay").classList.add("hidden");
  showPauseBtn();
}

/** Shows the pause button. */
function showPauseBtn() {
  document.getElementById("btn-pause").classList.remove("hidden");
}

/** Hides the pause button. */
function hidePauseBtn() {
  document.getElementById("btn-pause").classList.add("hidden");
}

/** Hides the start screen. */
function hideStartScreen() {
  document.getElementById("startScreen").classList.add("hidden");
}

/** Shows the start screen. */
function showStartScreen() {
  document.getElementById("startScreen").classList.remove("hidden");
}

/**
 * Shows the win or loss overlay.
 * @param {"gameOver"|"youWin"} result Result image to display.
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

/** Hides the game end overlay. */
function hideGameEndOverlay() {
  document.getElementById("gameEndOverlay").classList.add("hidden");
}

/** Stops the game and returns to the start screen. */
function returnToStartScreen() {
  isPaused = false;
  stopActiveWorld();
  sounds.stop("gameOver");
  sounds.stop("youWin");
  resetGameState();
  hideGameEndOverlay();
  document.getElementById("pauseOverlay").classList.add("hidden");
  hidePauseBtn();
  showStartScreen();
  sounds.playBackground();
}

// Sound ----------------------------------------------------------------------

/** Restores the persisted mute preference and music volume. */
function restoreSoundState() {
  const muted = localStorage.getItem("muted") !== "false";
  localStorage.setItem("muted", muted ? "true" : "false");
  muted ? sounds.muteAll() : sounds.unmuteAll();
  sounds.setMusicVolume(0.05);
}

/** Toggles all sounds and persists the mute preference. */
function toggleSound() {
  const muted = localStorage.getItem("muted") === "true";
  localStorage.setItem("muted", muted ? "false" : "true");
  muted ? sounds.unmuteAll() : sounds.muteAll();
  updateSoundButtons();
}

/** Updates menu and pause sound buttons to match the mute state. */
function updateSoundButtons() {
  const muted = localStorage.getItem("muted") === "true";
  const btnTon = document.getElementById("btn-ton");
  const soundState = document.getElementById("pause-sound-state");

  if (btnTon) btnTon.style.backgroundImage = muted ? SOUND_ICONS.muted : SOUND_ICONS.enabled;
  if (soundState) soundState.textContent = muted ? "Aus" : "An";
}

// Menu panels and fullscreen -------------------------------------------------

/** Toggles the instructions panel and closes the imprint panel. */
function toggleInstructions() {
  const instructionsPanel = document.getElementById("instructionsPanel");
  const imprintPanel = document.getElementById("imprintPanel");
  imprintPanel.classList.add("hidden");
  instructionsPanel.classList.toggle("hidden");
}

/** Toggles the imprint panel and closes the instructions panel. */
function toggleImprint() {
  const imprintPanel = document.getElementById("imprintPanel");
  const instructionsPanel = document.getElementById("instructionsPanel");
  instructionsPanel.classList.add("hidden");
  imprintPanel.classList.toggle("hidden");
}

/** Toggles fullscreen mode for the game container. */
function toggleFullscreen() {
  const container = document.getElementById("gameContainer");
  const menuBox = document.getElementById("menu-box");

  if (!document.fullscreenElement) {
    container.requestFullscreen().catch((err) => console.error("Fehler beim Vollbildmodus:", err));
    menuBox.classList.add("fullscreen");
  } else {
    document.exitFullscreen();
  }
}

/** Removes fullscreen-specific styling after leaving fullscreen mode. */
function handleFullscreenChange() {
  const menuBox = document.getElementById("menu-box");
  if (!document.fullscreenElement) menuBox.classList.remove("fullscreen");
}

// Keyboard -------------------------------------------------------------------

/** Registers keydown and keyup handlers for gameplay input. */
function registerKeyboardEvents() {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
}

/**
 * Applies a keyboard event to the shared input state.
 * @param {KeyboardEvent} event Keyboard event.
 * @param {boolean} pressed Whether the key is currently pressed.
 */
function setMovementKey(event, pressed) {
  if (event.key === "ArrowLeft") keyboard.LEFT = pressed;
  if (event.key === "ArrowRight") keyboard.RIGHT = pressed;
  if (event.key === "ArrowUp") keyboard.UP = pressed;
  if (event.key === "ArrowDown") keyboard.DOWN = pressed;
  if (event.key === " ") keyboard.SPACE = pressed;
  if (event.key === "d" || event.key === "D") keyboard.D = pressed;
}

/**
 * Applies a pressed key to the shared input state.
 * @param {KeyboardEvent} event Keydown event.
 */
function handleKeyDown(event) {
  setMovementKey(event, true);
  if (event.key === "Escape") togglePauseFromKeyboard();
}

/**
 * Releases a key from the shared input state.
 * @param {KeyboardEvent} event Keyup event.
 */
function handleKeyUp(event) {
  setMovementKey(event, false);
}

/** Toggles pause state when Escape is pressed. */
function togglePauseFromKeyboard() {
  if (isPaused) {
    resumeGame();
  } else if (gameStarted) {
    pauseGame();
  }
}

window.addEventListener("fullscreenchange", handleFullscreenChange);
