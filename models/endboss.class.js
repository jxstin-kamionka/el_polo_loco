/**
 * Final boss enemy with alert, attack, hurt, and death states.
 */
class Endboss extends MovableObjects {
  /** @type {number} Boss height. */
  height = 350;

  /** @type {number} Boss width. */
  width = 250;

  /** @type {number} Boss vertical position. */
  y = 100;

  /** @type {number} Boss health points. */
  energy = 120;

  /** @type {number} Boss maximum health points. */
  maxEnergy = 120;

  /** @type {number} Damage dealt to the character on contact. */
  contactDamage = 20;

  /** @type {boolean} Whether the boss is dead. */
  isDeadFlag = false;

  /** @type {boolean} Whether the boss currently shows the hurt animation. */
  isHurtFlag = false;

  /** @type {boolean} Whether the boss has been activated by proximity. */
  isActivated = false;

  /** @type {?World} World that owns this boss. */
  world = null;

  /** @type {number} Horizontal movement speed. */
  speed = 1.2;

  /** @type {?number} Movement interval id. */
  moveInterval = null;

  /** @type {?number} Animation interval id. */
  animInterval = null;

  /** @type {{top:number,bottom:number,left:number,right:number}} Collision offsets. */
  offset = {
    top: 50,
    bottom: 10,
    left: 20,
    right: 20,
  };

  /** @type {string[]} Alert animation frames. */
  IMAGES_ALERT = [
    "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /** @type {string[]} Walking and attack animation frames. */
  IMAGES_WALKING = [
    "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "assets/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /** @type {string[]} Hurt animation frames. */
  IMAGES_HIT = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /** @type {string[]} Death animation frames. */
  IMAGES_DEAD = [
    "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Creates the boss and starts its animation loops.
   */
  constructor() {
    super();
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HIT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyDifficulty();
    this.x = 719 * 3;
    this.animate();
  }

  /**
   * Applies the selected difficulty values to the boss.
   * @returns {void}
   */
  applyDifficulty() {
    const difficulty = getCurrentDifficultyConfig();
    this.energy = difficulty.bossEnergy;
    this.maxEnergy = difficulty.bossEnergy;
    this.speed = difficulty.bossSpeed;
    this.contactDamage = difficulty.bossDamage;
  }

  /**
   * Starts movement and animation intervals.
   * @returns {void}
   */
  animate() {
    this.moveInterval = setInterval(() => {
      if (isPaused) return;
      if (this.isActivated && !this.isDeadFlag) this.followCharacter();
    }, 1000 / 60);

    this.animInterval = setInterval(() => {
      this.playBossAnimation();
    }, 100);
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
   * Selects the animation matching the boss state.
   * @returns {void}
   */
  playBossAnimation() {
    if (this.isDeadFlag) {
      this.playAnimation(this.IMAGES_DEAD);
    } else if (this.isHurtFlag) {
      this.playAnimation(this.IMAGES_HIT);
    } else if (this.isActivated) {
      this.playAnimation(this.IMAGES_WALKING);
    } else {
      this.playAnimation(this.IMAGES_ALERT);
    }
  }

  /**
   * Moves the boss toward the character while staying inside the level.
   * @returns {void}
   */
  followCharacter() {
    const character = this.world?.character;
    if (!character) return;

    const bossLeft = this.x + this.offset.left;
    const bossRight = this.x + this.width - this.offset.right;
    const characterLeft = character.x + character.offset.left;
    const characterRight = character.x + character.width - character.offset.right;

    if (bossLeft > characterRight) {
      this.moveLeft();
    } else if (bossRight < characterLeft) {
      this.moveRight();
    }

    this.keepInsideLevel();
  }

  /**
   * Moves the boss right and mirrors the left-facing boss sprite.
   * @returns {void}
   */
  moveRight() {
    this.x += this.speed;
    this.otherDirection = true;
  }

  /**
   * Moves the boss left using the original left-facing boss sprite.
   * @returns {void}
   */
  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = false;
  }

  /**
   * Keeps the boss fully inside the drawn level.
   * @returns {void}
   */
  keepInsideLevel() {
    this.x = Math.min(Math.max(this.x, 0), this.getLevelMaxX());
  }

  /**
   * Calculates the rightmost x-position the boss may use.
   * @returns {number} Maximum boss x-position.
   */
  getLevelMaxX() {
    return Math.max(0, this.getLevelRightEdge() - this.width);
  }

  /**
   * Reads the visible map width from background segments.
   * @returns {number} Right edge of the drawn level.
   */
  getLevelRightEdge() {
    const backgroundObjects = this.world?.level?.backgroundObjects || [];
    if (backgroundObjects.length === 0) return this.world?.level?.level_end_x || 719 * 3;

    return Math.max(...backgroundObjects.map((object) => object.x + object.width));
  }

  /**
   * Activates boss movement and attack animation.
   * @returns {void}
   */
  activate() {
    this.isActivated = true;
    this.keepInsideLevel();
  }

  /**
   * Applies damage to the boss.
   * @param {number} amount Damage amount.
   * @returns {void}
   */
  takeDamage(amount) {
    if (this.isDeadFlag) return;
    this.energy = Math.max(0, this.energy - amount);
    if (this.energy === 0) {
      this.die();
    } else {
      this.showHitAnimation();
    }
  }

  /**
   * Temporarily shows the hurt animation.
   * @returns {void}
   */
  showHitAnimation() {
    this.isHurtFlag = true;
    setTimeout(() => { this.isHurtFlag = false; }, 400);
  }

  /**
   * Marks the boss as defeated and schedules the win flag.
   * @returns {void}
   */
  die() {
    this.isDeadFlag = true;
    this.isHurtFlag = false;
    setTimeout(() => {
      this.removeFromWorld = true;
      youWin = true;
      gameStarted = false;
    }, 1000);
  }

  /**
   * Checks whether the boss is dead.
   * @returns {boolean} True when the boss is dead.
   */
  isDead() {
    return this.isDeadFlag;
  }
}
