class ThrowableObject extends MovableObjects {
  damage = 25;
  hasHit = false;
  readyToRemove = false;
  isSplashing = false;
  throwInterval = null;
  animInterval = null;

  /** Y threshold at which the bottle hits the ground. */
  GROUND_Y = 365;

  IMAGES_ROTATION = [
    "../assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "../assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "../assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "../assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "../assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

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
    this.height = 50;
    this.width = 50;
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.img = this.imageCache[this.IMAGES_ROTATION[0]];
    this.throw();
  }

  throw() {
    this.speedY = 15;
    this.applyGravity();
    this.startFlying();
  }

  startFlying() {
    this.throwInterval = setInterval(() => {
      if (isPaused || this.isSplashing) return;
      if (this.y >= this.GROUND_Y) {
        this.splash();
        return;
      }
      this.x += this.otherDirection ? -10 : 10;
    }, 1000 / 25);

    this.animInterval = setInterval(() => {
      if (this.isSplashing) return;
      this.playAnimation(this.IMAGES_ROTATION);
    }, 80);
  }

  /** Plays the ground-impact splash animation, then marks the bottle for removal. */
  splash() {
    this.isSplashing = true;
    this.hasHit = true;
    this.stopGravity();
    clearInterval(this.throwInterval); this.throwInterval = null;
    clearInterval(this.animInterval); this.animInterval = null;

    let frame = 0;
    const splashAnim = setInterval(() => {
      if (frame < this.IMAGES_SPLASH.length) {
        this.img = this.imageCache[this.IMAGES_SPLASH[frame]];
        frame++;
      } else {
        clearInterval(splashAnim);
        this.readyToRemove = true;
      }
    }, 80);
  }

  stopThrow() {
    if (this.throwInterval) { clearInterval(this.throwInterval); this.throwInterval = null; }
    if (this.animInterval) { clearInterval(this.animInterval); this.animInterval = null; }
    this.stopGravity();
    this.readyToRemove = true;
  }
}
