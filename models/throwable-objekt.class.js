/**
 * Throwable salsa bottle that flies, rotates, splashes, and damages enemies.
 */
class ThrowableObject extends MovableObjects {
  /** @type {number} Damage dealt on impact. */
  damage = 25;

  /** @type {boolean} Whether the bottle has already hit something. */
  hasHit = false;

  /** @type {boolean} Whether the world can remove this bottle. */
  readyToRemove = false;

  /** @type {boolean} Whether the splash animation is active. */
  isSplashing = false;

  /** @type {?number} Flight interval id. */
  throwInterval = null;

  /** @type {?number} Animation interval id. */
  animInterval = null;

  /** @type {number} Y threshold at which the bottle hits the ground. */
  GROUND_Y = 365;

  /** @type {string[]} Rotation animation frames. */
  IMAGES_ROTATION = [
    "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /** @type {string[]} Splash animation frames. */
  IMAGES_SPLASH = [
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /** @type {{top:number,bottom:number,left:number,right:number}} Collision offsets. */
  offset = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  /**
   * Creates and immediately throws a bottle.
   * @param {number} x Start x-coordinate.
   * @param {number} y Start y-coordinate.
   * @param {boolean} [otherDirection=false] Whether the bottle flies left.
   */
  constructor(x, y, otherDirection = false) {
    super();
    this.x = x;
    this.y = y;
    this.otherDirection = otherDirection;
    this.height = 50;
    this.width = 50;
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.img = this.imageCache[this.IMAGES_ROTATION[0]];
    this.throw();
  }

  /**
   * Sets initial vertical velocity and starts flight logic.
   * @returns {void}
   */
  throw() {
    this.speedY = 15;
    this.applyGravity();
    this.startFlying();
  }

  /**
   * Starts horizontal movement and rotation animation.
   * @returns {void}
   */
  startFlying() {
    this.throwInterval = setInterval(() => {
      if (isPaused || this.isSplashing) return;
      if (this.y >= this.GROUND_Y) {
        this.splash();
        return;
      }
      this.x += this.otherDirection ? -10 : 10;
    }, 1000 / 25);

    this.animInterval = setInterval(() => {
      if (this.isSplashing) return;
      this.playAnimation(this.IMAGES_ROTATION);
    }, 80);
  }

  /**
   * Plays the ground-impact splash animation, then marks the bottle for removal.
   * @returns {void}
   */
  splash() {
    this.isSplashing = true;
    this.hasHit = true;
    this.stopGravity();
    clearInterval(this.throwInterval);
    this.throwInterval = null;
    clearInterval(this.animInterval);
    this.animInterval = null;

    let frame = 0;
    const splashAnim = setInterval(() => {
      if (frame < this.IMAGES_SPLASH.length) {
        this.img = this.imageCache[this.IMAGES_SPLASH[frame]];
        frame++;
      } else {
        clearInterval(splashAnim);
        this.readyToRemove = true;
      }
    }, 80);
  }

  /**
   * Stops flight, animation, and gravity, then marks the bottle for removal.
   * @returns {void}
   */
  stopThrow() {
    if (this.throwInterval) {
      clearInterval(this.throwInterval);
      this.throwInterval = null;
    }
    if (this.animInterval) {
      clearInterval(this.animInterval);
      this.animInterval = null;
    }
    this.stopGravity();
    this.readyToRemove = true;
  }
}
