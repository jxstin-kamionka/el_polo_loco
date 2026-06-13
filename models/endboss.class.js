class Endboss extends MovableObjects {
  height = 350;
  width = 250;
  y = 100;
  energy = 120;
  isDeadFlag = false;
  isHurtFlag = false;
  isActivated = false;
  speed = 2.5;
  moveInterval = null;
  animInterval = null;

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
    "../assets/img/4_enemie_boss_chicken/3_attack/G13.png",
    "../assets/img/4_enemie_boss_chicken/3_attack/G14.png",
    "../assets/img/4_enemie_boss_chicken/3_attack/G15.png",
    "../assets/img/4_enemie_boss_chicken/3_attack/G16.png",
    "../assets/img/4_enemie_boss_chicken/3_attack/G17.png",
    "../assets/img/4_enemie_boss_chicken/3_attack/G18.png",
    "../assets/img/4_enemie_boss_chicken/3_attack/G19.png",
    "../assets/img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  IMAGES_HIT = [
    "../assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
    "../assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
    "../assets/img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  IMAGES_DEAD = [
    "../assets/img/4_enemie_boss_chicken/5_dead/G24.png",
    "../assets/img/4_enemie_boss_chicken/5_dead/G25.png",
    "../assets/img/4_enemie_boss_chicken/5_dead/G26.png",
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
    this.moveInterval = setInterval(() => {
      if (isPaused) return;
      if (this.isActivated && !this.isDeadFlag) this.moveLeft();
    }, 1000 / 60);

    this.animInterval = setInterval(() => {
      this.playBossAnimation();
    }, 100);
  }

  stop() {
    if (this.moveInterval) { clearInterval(this.moveInterval); this.moveInterval = null; }
    if (this.animInterval) { clearInterval(this.animInterval); this.animInterval = null; }
  }

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

  activate() {
    this.isActivated = true;
  }

  takeDamage(amount) {
    if (this.isDeadFlag) return;
    this.energy = Math.max(0, this.energy - amount);
    if (this.energy === 0) {
      this.die();
    } else {
      this.showHitAnimation();
    }
  }

  showHitAnimation() {
    this.isHurtFlag = true;
    setTimeout(() => { this.isHurtFlag = false; }, 400);
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
