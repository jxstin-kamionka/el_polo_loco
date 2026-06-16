/**
 * Moving background cloud.
 */
class Cloud extends MovableObjects {
  /** @type {?number} Movement interval id. */
  moveInterval = null;

  /** @type {{top:number,bottom:number,left:number,right:number}} Collision offsets. */
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Creates a cloud with randomized position and speed.
   */
  constructor() {
    super();
    this.loadImage("assets/img/5_background/layers/4_clouds/1.png");
    this.x = Math.random() * 2000;
    this.y = 20 + Math.random() * 100;
    this.height = 250;
    this.width = 350;
    this.speed = 0.08 + Math.random() * 0.07;
    this.animate();
  }

  /**
   * Starts cloud movement.
   * @returns {void}
   */
  animate() {
    this.moveInterval = setInterval(() => {
      if (isPaused) return;
      this.moveLeft();
    }, 1000 / 60);
  }

  /**
   * Stops cloud movement.
   * @returns {void}
   */
  stop() {
    if (this.moveInterval) {
      clearInterval(this.moveInterval);
      this.moveInterval = null;
    }
  }
}
