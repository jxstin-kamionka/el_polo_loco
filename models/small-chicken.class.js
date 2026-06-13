class SmallChicken extends MovableObjects {
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
    "../assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "../assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "../assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGE_DEAD = "../assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png";

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 230 + Math.random() * 1800;
    this.height = 50;
    this.width = 50;
    this.y = 370;
    this.speed = 0.2 + Math.random() * 0.3;
    this.animate();
  }

  animate() {
    this.moveInterval = setInterval(() => {
      if (isPaused) return;
      if (!this.isDeadFlag) this.moveLeft();
    }, 1000 / 60);

    this.animInterval = setInterval(() => {
      if (!this.isDeadFlag) this.playAnimation(this.IMAGES_WALKING);
    }, 120);
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
