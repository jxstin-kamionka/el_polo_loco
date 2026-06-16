/**
 * Player character with movement, jump, idle, hurt, and death animations.
 */
class Character extends MovableObjects {
  /** @type {number} Character height. */
  height = 180;

  /** @type {number} Character width. */
  width = 100;

  /** @type {number} Initial vertical position. */
  y = 60;

  /** @type {number} Horizontal movement speed. */
  speed = 3;

  /** @type {number} Collected coin score. */
  coins = 0;

  /** @type {number} Available bottles. */
  bottles = 0;

  /** @type {number} Timestamp of the last stomp attack. */
  lastStompTime = 0;

  /** @type {number} Timestamp of the last movement input. */
  lastMoveTime = Date.now();

  /** @type {?number} Movement interval id. */
  moveInterval = null;

  /** @type {?number} Animation interval id. */
  animInterval = null;

  /** @type {{top:number,bottom:number,left:number,right:number}} Collision offsets. */
  offset = {
    top: 70,
    bottom: 10,
    left: 15,
    right: 20,
  };

  /** @type {string[]} Idle animation frames. */
  IMAGES_IDLE = [
    "assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "assets/img/2_character_pepe/1_idle/idle/I-8.png",
  ];

  /** @type {string[]} Long idle animation frames. */
  IMAGES_LONG_IDLE = [
    "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
    "assets/img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /** @type {string[]} Walking animation frames. */
  IMAGES_WALKING = [
    "assets/img/2_character_pepe/2_walk/W-21.png",
    "assets/img/2_character_pepe/2_walk/W-22.png",
    "assets/img/2_character_pepe/2_walk/W-23.png",
    "assets/img/2_character_pepe/2_walk/W-24.png",
    "assets/img/2_character_pepe/2_walk/W-25.png",
    "assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  /** @type {string[]} Jumping animation frames. */
  IMAGES_JUMPING = [
    "assets/img/2_character_pepe/3_jump/J-31.png",
    "assets/img/2_character_pepe/3_jump/J-32.png",
    "assets/img/2_character_pepe/3_jump/J-33.png",
    "assets/img/2_character_pepe/3_jump/J-34.png",
    "assets/img/2_character_pepe/3_jump/J-35.png",
    "assets/img/2_character_pepe/3_jump/J-36.png",
    "assets/img/2_character_pepe/3_jump/J-37.png",
    "assets/img/2_character_pepe/3_jump/J-38.png",
    "assets/img/2_character_pepe/3_jump/J-39.png",
  ];

  /** @type {string[]} Hurt animation frames. */
  IMAGES_HURT = [
    "assets/img/2_character_pepe/4_hurt/H-41.png",
    "assets/img/2_character_pepe/4_hurt/H-42.png",
    "assets/img/2_character_pepe/4_hurt/H-43.png",
  ];

  /** @type {string[]} Death animation frames. */
  IMAGES_DEAD = [
    "assets/img/2_character_pepe/5_dead/D-51.png",
    "assets/img/2_character_pepe/5_dead/D-52.png",
    "assets/img/2_character_pepe/5_dead/D-53.png",
    "assets/img/2_character_pepe/5_dead/D-54.png",
    "assets/img/2_character_pepe/5_dead/D-55.png",
    "assets/img/2_character_pepe/5_dead/D-56.png",
    "assets/img/2_character_pepe/5_dead/D-57.png",
  ];

  /** @type {?World} World that owns this character. */
  world;

  /** @type {number} Current animation frame index. */
  currentImage = 1;

  /**
   * Creates the player character and starts gravity plus animation loops.
   */
  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
    this.animate();
  }

  /**
   * Starts movement and sprite animation intervals.
   * @returns {void}
   */
  animate() {
    this.moveInterval = setInterval(() => this.handleMovement(), 1000 / 60);
    this.animInterval = setInterval(() => this.handleAnimation(), 100);
  }

  /**
   * Handles input-driven movement and camera tracking.
   * @returns {void}
   */
  handleMovement() {
    if (isPaused) return;

    if (this.world?.keyboard?.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.lastMoveTime = Date.now();
    } else if (this.world?.keyboard?.LEFT && this.x > 0) {
      this.moveLeft();
      this.lastMoveTime = Date.now();
    }

    if ((this.world?.keyboard?.SPACE || this.world?.keyboard?.UP) && !this.isAboveGround()) {
      this.jump();
      this.lastMoveTime = Date.now();
    }

    if (this.world) this.world.camera_x = -this.x + 100;
  }

  /**
   * Chooses the correct sprite animation for the current state.
   * @returns {void}
   */
  handleAnimation() {
    const idleMs = Date.now() - this.lastMoveTime;

    if (this.energy === 0) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
    } else if (this.world?.keyboard?.RIGHT || this.world?.keyboard?.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
    } else if (idleMs > 5000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Stops movement, animation, and gravity intervals.
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
    this.stopGravity();
  }

  /**
   * Starts a jump by setting upward velocity.
   * @returns {void}
   */
  jump() {
    this.speedY = 22;
  }

  /**
   * Moves the character right and faces right.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  /**
   * Moves the character left and faces left.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }
}
