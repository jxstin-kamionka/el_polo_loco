class ThrowableObject extends MovableObjects {
  damage = 25;
  hasHit = false;
  throwInterval = null;

  offset = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  constructor(x, y, otherDirection = false) {
    super();
    this.x = x;
    this.y = y;
    this.otherDirection = otherDirection;

    this.loadImage(
      "../assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );

    this.height = 50;
    this.width = 50;

    this.throw(this.x, this.y);
  }

  throw(x, y) {
    this.x = x;
    this.y = y;
    this.speedY = 15;
    this.speedX = 10;
    this.applyGravity();
    this.startFlying();
  }

  startFlying() {
    this.throwInterval = setInterval(() => {
      this.x += this.getFlyDirection();
    }, 1000 / 25);
  }

  getFlyDirection() {
    if (this.otherDirection) {
      return -this.speedX;
    }
    return this.speedX;
  }

  stopThrow() {
    clearInterval(this.throwInterval);
  }
}