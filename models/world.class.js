/**
 * Coordinates the active game world, loop lifecycle, and shared game state.
 */
class World {
  /** @type {HTMLCanvasElement} Canvas that renders the game. */
  canvas;

  /** @type {CanvasRenderingContext2D} Drawing context for the canvas. */
  ctx;

  /** @type {Keyboard} Shared keyboard input state. */
  keyboard;

  /** @type {number} Camera offset on the x-axis. */
  camera_x = 0;

  /** @type {Level} Currently loaded level. */
  level = level1;

  /** @type {Character} Player character controlled by the user. */
  character;

  /** @type {StatusBar} Player health display. */
  statusBar = new StatusBar();

  /** @type {BottleStatusBar} Bottle inventory display. */
  bottleStatusBar = new BottleStatusBar();

  /** @type {CoinStatusBar} Coin collection display. */
  coinStatusBar = new CoinStatusBar();

  /** @type {BossStatusBar} Boss health display. */
  bossStatusBar = new BossStatusBar();

  /** @type {ThrowableObject[]} Bottles currently flying through the level. */
  throwableObjects = [];

  /** @type {number} Timestamp of the last thrown bottle. */
  lastThrowTime = 0;

  /** @type {boolean} Whether the boss health bar is visible. */
  bossBarVisible = false;

  /** @type {number} Distance at which the boss becomes active. */
  bossActivationDistance = 500;

  /** @type {boolean} Whether the world update loop is active. */
  isRunning = true;

  /** @type {boolean} Whether the world is waiting for the result overlay. */
  isFinishing = false;

  /** @type {?number} Interval id for gameplay checks. */
  gameLoopInterval = null;

  /** @type {?number} Animation frame id for drawing. */
  animationFrameId = null;

  /** @type {?number} Timeout id for the delayed result screen. */
  endScreenTimeout = null;

  /**
   * Creates a world for the provided canvas and keyboard state.
   * @param {HTMLCanvasElement} canvas Canvas used for rendering.
   * @param {Keyboard} keyboard Shared input state.
   */
  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;

    this.character = new Character();
    this.character.world = this;

    this.draw();
    this.run();
  }

  /**
   * Starts the fixed-rate gameplay loop.
   * @returns {void}
   */
  run() {
    this.gameLoopInterval = setInterval(() => {
      if (!this.isRunning || isPaused) return;

      this.checkGameEndConditions();
      if (gameOver || youWin) return;

      this.checkCharacterEnemyCollisions();
      this.checkCoinCollision();
      this.checkBottleCollision();
      this.checkThrowObjects();
      this.checkThrowableObjectHits();
      this.checkBossActivation();
      this.updateBossStatusBar();
      this.removeUsedBottles();
      this.removeDeadEnemies();
      this.checkCharacterIsDead();
    }, 1000 / 25);
  }

  /**
   * Stops world updates, drawing, timers, entities, and thrown objects.
   * @returns {void}
   */
  stop() {
    this.isRunning = false;

    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.endScreenTimeout) {
      clearTimeout(this.endScreenTimeout);
      this.endScreenTimeout = null;
    }

    this.character.stop();
    this.level.enemies.forEach((enemy) => { if (enemy.stop) enemy.stop(); });
    this.level.clouds.forEach((cloud) => { if (cloud.stop) cloud.stop(); });
    this.throwableObjects.forEach((bottle) => bottle.stopThrow());
  }

  /**
   * Routes global win and loss flags into the end-game flow.
   * @returns {void}
   */
  checkGameEndConditions() {
    if (youWin) {
      this.finishGame("youWin");
    } else if (gameOver) {
      this.finishGame("gameOver");
    }
  }

  /**
   * Ends the game and transitions to the result screen after a short delay.
   * @param {"gameOver"|"youWin"} result Result screen to show.
   * @returns {void}
   */
  finishGame(result) {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.isFinishing = true;
    gameStarted = false;
    clearInterval(this.gameLoopInterval);
    this.gameLoopInterval = null;
    this.stopEntities();
    this.playResultSound(result);
    this.endScreenTimeout = setTimeout(() => this.showEndScreen(result), 1500);
  }

  /**
   * Stops enemies, clouds, and in-flight bottles.
   * @returns {void}
   */
  stopEntities() {
    this.level.enemies.forEach((enemy) => { if (enemy.stop) enemy.stop(); });
    this.level.clouds.forEach((cloud) => { if (cloud.stop) cloud.stop(); });
    this.throwableObjects.forEach((bottle) => bottle.stopThrow());
  }

  /**
   * Plays the result sound and freezes character movement as needed.
   * @param {"gameOver"|"youWin"} result Result state that ended the game.
   * @returns {void}
   */
  playResultSound(result) {
    sounds.stop("background");
    if (result === "gameOver") {
      sounds.play("gameOver");
      clearInterval(this.character.moveInterval);
      this.character.moveInterval = null;
    } else {
      sounds.play("youWin");
      this.character.stop();
    }
  }

  /**
   * Stops drawing and opens the result overlay.
   * @param {"gameOver"|"youWin"} result Result screen to show.
   * @returns {void}
   */
  showEndScreen(result) {
    this.isFinishing = false;
    this.character.stop();
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    showGameEndOverlay(result);
  }

  /**
   * Converts depleted character energy into a game-over state.
   * @returns {void}
   */
  checkCharacterIsDead() {
    if (youWin || gameOver) return;

    if (this.character.energy === 0) {
      gameOver = true;
      sounds.play("dead");
      this.character.speedY = 18;
    }
  }
}
