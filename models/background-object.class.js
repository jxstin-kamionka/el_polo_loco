/**
 * Static background layer segment.
 */
class BackgroundObject extends MovableObjects {
  /**
   * Creates one background image segment.
   * @param {string} imagePath Image path for the segment.
   * @param {number} x Horizontal segment position.
   */
  constructor(imagePath, x) {
    super();
    this.loadImage(imagePath);
    this.height = 480;
    this.width = 720;
    this.x = x;
    this.y = 480 - this.height;
  }
}
