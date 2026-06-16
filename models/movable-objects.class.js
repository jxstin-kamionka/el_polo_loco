/**
 * Base class for drawable objects that move, collide, or take damage.
 */
class MovableObjects extends DrawableObject {
  /** @type {number} Horizontal movement speed. */
  speed = 0.15;

  /** @type {number} Vertical movement speed. */
  speedY = 0;

  /** @type {number} Gravity acceleration. */
  acceleration = 1.5;

  /** @type {boolean} Whether the sprite faces left. */
  otherDirection = false;

  /** @type {number} Remaining health points. */
  energy = 100;

  /** @type {number} Timestamp of the last received hit. */
  lastHit = 0;

  /** @type {?number} Gravity interval id. */
  gravityInterval = null;

  /**
   * Starts gravity simulation for this object.
   * @returns {void}
   */
  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (isPaused) return;
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
      if (!(this instanceof ThrowableObject) && !this.isAboveGround() && this.speedY <= 0) {
        this.y = 240;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  /**
   * Stops gravity simulation.
   * @returns {void}
   */
  stopGravity() {
    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
      this.gravityInterval = null;
    }
  }

  /**
   * Checks whether the object is above its ground line.
   * @returns {boolean} True when the object is above ground.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) return true;
    return this.y < 240;
  }

  /**
   * Moves the object to the right.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves the object to the left.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Displays the next image in an animation sequence.
   * @param {string[]} images Animation image paths.
   * @returns {void}
   */
  playAnimation(images) {
    const i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  /**
   * Checks rectangle collision using each object's offset.
   * @param {MovableObjects|DrawableObject} movableObject Object to test against.
   * @returns {boolean} True when the objects overlap.
   */
  isColliding(movableObject) {
    return (
      this.x + this.width - this.offset.right > movableObject.x + movableObject.offset.left &&
      this.y + this.height - this.offset.bottom > movableObject.y + movableObject.offset.top &&
      this.x + this.offset.left < movableObject.x + movableObject.width - movableObject.offset.right &&
      this.y + this.offset.top < movableObject.y + movableObject.height - movableObject.offset.bottom
    );
  }

  /**
   * Reduces this object's energy.
   * @param {number} [amount=1] Damage amount.
   * @returns {void}
   */
  hit(amount = 1) {
    this.energy = Math.max(0, this.energy - amount);
    if (this.energy > 0) {
      this.lastHit = Date.now();
    }
  }

  /**
   * Checks whether this object was hit recently.
   * @returns {boolean} True during the hurt window.
   */
  isHurt() {
    return (Date.now() - this.lastHit) / 1000 < 1;
  }

  /**
   * Checks whether this object has no energy left.
   * @returns {boolean} True when energy is zero.
   */
  isDead() {
    return this.energy === 0;
  }
}
