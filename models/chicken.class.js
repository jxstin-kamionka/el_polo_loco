class Chicken extends MovableObjects {
  currentImage = 0;
  energy = 25;
  isDeadFlag = false;
  moveInterval = null;
  animInterval = null;

  offset = {
    top: 5,
    bottom: 5,
    left: 5,
    right: 5,
  };

  IMAGES_WALKING = [
    "../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGE_DEAD = "../assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

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

  animate() {
    this.moveInterval = setInterval(() => {
      if (isPaused) return;
      if (!this.isDeadFlag) this.moveLeft();
    }, 1000 / 60);

    this.animInterval = setInterval(() => {
      if (!this.isDeadFlag) this.playAnimation(this.IMAGES_WALKING);
    }, 150);
  }

  stop() {
    if (this.moveInterval) { clearInterval(this.moveInterval); this.moveInterval = null; }
    if (this.animInterval) { clearInterval(this.animInterval); this.animInterval = null; }
  }

  takeDamage(amount) {
    if (this.isDeadFlag) return;
    this.energy -= amount;
    if (this.energy <= 0) this.die();
  }

  die() {
    this.isDeadFlag = true;
    this.speed = 0;
    this.loadImage(this.IMAGE_DEAD);
    setTimeout(() => { this.removeFromWorld = true; }, 800);
  }

  isDead() {
    return this.isDeadFlag;
  }
}
