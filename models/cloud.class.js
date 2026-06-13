class Cloud extends MovableObjects {
  moveInterval = null;

  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  constructor() {
    super();
    this.loadImage("../assets/img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 2000;
    this.y = 20 + Math.random() * 100;
    this.height = 250;
    this.width = 350;
    this.speed = 0.08 + Math.random() * 0.07;
    this.animate();
  }

  animate() {
    this.moveInterval = setInterval(() => {
      if (isPaused) return;
      this.moveLeft();
    }, 1000 / 60);
  }

  stop() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
  }
}
