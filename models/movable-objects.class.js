class MovableObjects extends DrawableObject {
  speed = 0.15;
  speedY = 0;
  acceleration = 1.5;
  otherDirection = false;
  energy = 100;
  lastHit = 0;
  gravityInterval = null;

  applyGravity() {
    this.gravityInterval = setInterval(() => {
      if (isPaused) return;
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
      // Snap non-throwable objects to the exact ground line to prevent float variation
      if (!(this instanceof ThrowableObject) && !this.isAboveGround() && this.speedY <= 0) {
        this.y = 240;
        this.speedY = 0;
      }
    }, 1000 / 25);
  }

  stopGravity() {
    if (this.gravityInterval) {
      clearInterval(this.gravityInterval);
      this.gravityInterval = null;
    }
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) return true;
    return this.y < 240;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    this.img = this.imageCache[images[i]];
    this.currentImage++;
  }

  isColliding(mo) {
    return (
      this.x + this.width - this.offset.right > mo.x + mo.offset.left &&
      this.y + this.height - this.offset.bottom > mo.y + mo.offset.top &&
      this.x + this.offset.left < mo.x + mo.width - mo.offset.right &&
      this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom
    );
  }

  hit(amount = 1) {
    this.energy = Math.max(0, this.energy - amount);
    if (this.energy > 0) {
      this.lastHit = Date.now();
    }
  }

  isHurt() {
    return (Date.now() - this.lastHit) / 1000 < 1;
  }

  isDead() {
    return this.energy === 0;
  }
}
