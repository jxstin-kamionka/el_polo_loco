/**
 * Drawable result-screen image helper.
 */
class gameEnd extends DrawableObject {
  /** @type {string[]} Game-over images. */
  IMAGES_GAMEOVER = [
    "../assets/img/You won, you lost/Game over A.png",
    "../assets/img/You won, you lost/Game Over.png",
  ];

  /** @type {string[]} Win images. */
  IMAGES_YOUWIN = [
    "../assets/img/You won, you lost/You win B.png",
    "../assets/img/You won, you lost/You won A.png",
  ];

  /**
   * Creates a full-canvas result image helper.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_GAMEOVER);
    this.loadImages(this.IMAGES_YOUWIN);

    this.x = 0;
    this.y = 0;
    this.width = 750;
    this.height = 480;
  }

  /**
   * Shows the default winning image.
   * @returns {void}
   */
  showYouWin() {
    this.img = this.imageCache[this.IMAGES_YOUWIN[0]];
  }
}
