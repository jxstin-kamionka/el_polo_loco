/**
 * Standard walking chicken enemy.
 */
class Chicken extends MovableObjects {
  /** @type {number} Current animation frame index. */
  currentImage = 0;

  /** @type {number} Enemy health points. */
  energy = 25;

  /** @type {boolean} Whether the enemy has died. */
  isDeadFlag = false;

  /** @type {?number} Movement interval id. */
  moveInterval = null;

  /** @type {?number} Animation interval id. */
  animInterval = null;

  /** @type {{top:number,bottom:number,left:number,right:number}} Collision offsets. */
  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  /** @type {string[]} Walking animation frames. */
  IMAGES_WALKING = [
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  /** @type {string} Dead sprite image. */
  IMAGE_DEAD = "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  /**
   * Creates a chicken with randomized position and speed.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 230 + Math.random() * 2000;
    this.height = 60;
    this.width = 60;
    this.y = 360;
    this.speed = 0.15 + Math.random() * 0.25;
    this.animate();
  }

  /**
   * Starts movement and walking animation.
   * @returns {void}
   */
  animate() {
    this.moveInterval = setInterval(() => {
      if (isPaused) return;
      if (!this.isDeadFlag) this.moveLeft();
    }, 1000 / 60);

    this.animInterval = setInterval(() => {
      if (!this.isDeadFlag) this.playAnimation(this.IMAGES_WALKING);
    }, 150);
  }

  /**
   * Stops active intervals.
   * @returns {void}
   */
  stop() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
    if (this.animInterval) {
      clearInterval(this.animInterval);
      this.animInterval = null;
    }
  }

  /**
   * Applies damage and triggers death when energy is depleted.
   * @param {number} amount Damage amount.
   * @returns {void}
   */
  takeDamage(amount) {
    if (this.isDeadFlag) return;
    this.energy -= amount;
    if (this.energy <= 0) this.die();
  }

  /**
   * Switches to the death sprite and schedules removal.
   * @returns {void}
   */
  die() {
    this.isDeadFlag = true;
    this.speed = 0;
    this.loadImage(this.IMAGE_DEAD);
    setTimeout(() => { this.removeFromWorld = true; }, 800);
  }

  /**
   * Checks whether this enemy is dead.
   * @returns {boolean} True when dead.
   */
  isDead() {
    return this.isDeadFlag;
  }
}
