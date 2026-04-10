class Character extends MovableObjects {
  height = 180;
  width = 100;
  y = 60;
  speed = 3;
  characterHit = false;
  coins = 0;
  bottles = 0;

  offset = {
    top: 70,
    bottom: 10,
    left: 15,
    right: 20,
  };

  IMAGES_IDLE = [
    "../assets/img/2_character_pepe/1_idle/idle/I-1.png",
    "../assets/img/2_character_pepe/1_idle/idle/I-2.png",
    "../assets/img/2_character_pepe/1_idle/idle/I-3.png",
    "../assets/img/2_character_pepe/1_idle/idle/I-4.png",
    "../assets/img/2_character_pepe/1_idle/idle/I-5.png",
    "../assets/img/2_character_pepe/1_idle/idle/I-6.png",
    "../assets/img/2_character_pepe/1_idle/idle/I-7.png",
    "../assets/img/2_character_pepe/1_idle/idle/I-8.png",
  ];

  IMAGES_WALKING = [
    "../assets/img/2_character_pepe/2_walk/W-21.png",
    "../assets/img/2_character_pepe/2_walk/W-22.png",
    "../assets/img/2_character_pepe/2_walk/W-23.png",
    "../assets/img/2_character_pepe/2_walk/W-24.png",
    "../assets/img/2_character_pepe/2_walk/W-25.png",
    "../assets/img/2_character_pepe/2_walk/W-26.png",
  ];

  IMAGES_JUMPING = [
    "../assets/img/2_character_pepe/3_jump/J-31.png",
    "../assets/img/2_character_pepe/3_jump/J-32.png",
    "../assets/img/2_character_pepe/3_jump/J-33.png",
    "../assets/img/2_character_pepe/3_jump/J-34.png",
    "../assets/img/2_character_pepe/3_jump/J-35.png",
    "../assets/img/2_character_pepe/3_jump/J-36.png",
    "../assets/img/2_character_pepe/3_jump/J-37.png",
    "../assets/img/2_character_pepe/3_jump/J-38.png",
    "../assets/img/2_character_pepe/3_jump/J-39.png",
  ];

  IMAGES_HURT = [
    "../assets/img/2_character_pepe/4_hurt/H-41.png",
    "../assets/img/2_character_pepe/4_hurt/H-42.png",
    "../assets/img/2_character_pepe/4_hurt/H-43.png",
  ];

  IMAGES_DEAD = [
    "../assets/img/2_character_pepe/5_dead/D-51.png",
    "../assets/img/2_character_pepe/5_dead/D-52.png",
    "../assets/img/2_character_pepe/5_dead/D-53.png",
    "../assets/img/2_character_pepe/5_dead/D-54.png",
    "../assets/img/2_character_pepe/5_dead/D-55.png",
    "../assets/img/2_character_pepe/5_dead/D-56.png",
    "../assets/img/2_character_pepe/5_dead/D-57.png",
  ];

  world;

  currentImage = 1;

  constructor() {
    super().loadImage(this.IMAGES_IDLE[0]);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
    this.applyGravity();
    this.animate();
  }

  animate() {
    setInterval(() => {
      if (
        this.world?.keyboard?.RIGHT &&
        this.x < this.world.level.level_end_x
      ) {
        this.moveRight();
      } else if (this.world?.keyboard?.LEFT && this.x > 0) {
        this.moveLeft();
        this.otherDirection = true;
      }

      if (
        (this.world?.keyboard?.SPACE || this.world?.keyboard?.UP) &&
        !this.isAboveGround()
      ) {
        this.jump();
      }

      if (this.world) this.world.camera_x = -this.x + 100;
    }, 1000 / 60);

    setInterval(() => {
      if (this.energy == 0) {
        this.playAnimation(this.IMAGES_DEAD);
      } else if (this.isHurt()) {
        this.playAnimation(this.IMAGES_HURT);
      }
      else if (this.isAboveGround()) {
        this.playAnimation(this.IMAGES_JUMPING);
      } else if (this.world?.keyboard?.RIGHT || this.world?.keyboard?.LEFT) {
        this.playAnimation(this.IMAGES_WALKING);
      } else {
        this.playAnimation(this.IMAGES_IDLE);
      }
    }, 1000 / 10);
  }

  jump() {
    this.speedY = 22;
  }

  moveRight() {
    this.x += this.speed;
    this.otherDirection = false;
  }

  moveLeft() {
    this.x -= this.speed;
    this.otherDirection = true;
  }
}
