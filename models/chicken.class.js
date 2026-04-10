class Chicken extends MovableObjects {
  currentImage = 0;
  energy = 25;
  isDeadFlag = false;

  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  IMAGES_WALKING = [
    "../assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "../assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "../assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGE_DEAD =
    "../assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png";

  constructor() {
    super();
    this.loadImage(this.IMAGES_WALKING[0]);
    this.x = 230 + Math.random() * 2000;
    this.height = 60;
    this.width = 60;
    this.y = 360;
    this.speed = 0.15 + Math.random() * 0.25;

    this.loadImages(this.IMAGES_WALKING);
    this.animate();
    this.moveLeft();
  }

  animate() {
    this.playAnimation(this.IMAGES_WALKING);

    setInterval(() => {
      if (!this.isDeadFlag) {
        this.moveLeft();
      }
    }, 1000 / 60);
  }

  takeDamage(amount) {
    if (this.isDeadFlag) return;

    this.energy -= amount;

    if (this.energy <= 0) {
      this.die();
    }
  }

  die() {
    this.isDeadFlag = true;
    this.speed = 0;

    this.loadImage(this.IMAGE_DEAD);

    setTimeout(() => {
      this.removeFromWorld = true;
    }, 1000);
  }

  isDead() {
    return this.isDeadFlag;
  }
}