class Endboss extends MovableObjects {
  height = 350;
  width = 250;
  y = 100;
  energy = 120;
  isDeadFlag = false;
  isHurtFlag = false;
  isActivated = false;
  speed = 0.5;

  offset = {
    top: 50,
    bottom: 10,
    left: 20,
    right: 20,
  };

  IMAGES_ALERT = [
    "../assets/img/4_enemie_boss_chicken/2_alert/G5.png",
    "../assets/img/4_enemie_boss_chicken/2_alert/G6.png",
    "../assets/img/4_enemie_boss_chicken/2_alert/G7.png",
    "../assets/img/4_enemie_boss_chicken/2_alert/G8.png",
    "../assets/img/4_enemie_boss_chicken/2_alert/G9.png",
    "../assets/img/4_enemie_boss_chicken/2_alert/G10.png",
    "../assets/img/4_enemie_boss_chicken/2_alert/G11.png",
    "../assets/img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

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

  IMAGES_HIT = [
    "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "assets/img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  constructor() {
    super();
    this.loadImage(this.IMAGES_ALERT[0]);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HIT);
    this.loadImages(this.IMAGES_DEAD);
    this.x = 719 * 3;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.updateMovement();
    }, 1000 / 60);

    setInterval(() => {
      this.playBossAnimation();
    }, 200);
  }

  updateMovement() {
    if (!this.isActivated) return;
    if (this.isDeadFlag) return;

    this.moveLeft();
  }

  playBossAnimation() {
    if (this.isDeadFlag) {
      this.playAnimation(this.IMAGES_DEAD);
      return;
    }

    if (this.isHurtFlag) {
      this.playAnimation(this.IMAGES_HIT);
      return;
    }

    if (this.isActivated) {
      this.playAnimation(this.IMAGES_WALKING);
      return;
    }

    this.playAnimation(this.IMAGES_ALERT);
  }

  activate() {
    this.isActivated = true;
  }

  takeDamage(amount) {
    if (this.isDeadFlag) return;

    this.energy -= amount;

    if (this.energy < 0) {
      this.energy = 0;
    }

    if (this.energy === 0) {
      this.die();
      return;
    }

    this.showHitAnimation();
  }

  showHitAnimation() {
    this.isHurtFlag = true;

    setTimeout(() => {
      this.isHurtFlag = false;
    }, 400);
  }

  die() {
    this.isDeadFlag = true;
    this.isHurtFlag = false;

    setTimeout(() => {
      this.removeFromWorld = true;
      youWin = true;
      gameStarted = false;
    }, 1000);
  }

  isDead() {
    return this.isDeadFlag;
  }
}
