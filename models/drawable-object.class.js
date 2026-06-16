/**
 * Base class for every object that can be drawn on the canvas.
 */
class DrawableObject {
  /** @type {HTMLImageElement} Currently rendered image. */
  img;

  /** @type {Object.<string, HTMLImageElement>} Loaded image cache by path. */
  imageCache = {};

  /** @type {number} Current animation frame index. */
  currentImage = 0;

  /** @type {number} Horizontal position. */
  x = 120;

  /** @type {number} Vertical position. */
  y = 180;

  /** @type {number} Rendered height. */
  height = 200;

  /** @type {number} Rendered width. */
  width = 100;

  /**
   * Loads a single image as the current sprite.
   * @param {string} path Image path.
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads a list of images into the cache.
   * @param {string[]} paths Image paths.
   * @returns {void}
   */
  loadImages(paths) {
    paths.forEach((path) => {
      const img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  /**
   * Draws the current image to the canvas.
   * @param {CanvasRenderingContext2D} ctx Canvas context.
   * @returns {void}
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}
