/**
 * Base class for HUD bars that display progress through sprite steps.
 */
class ProgressStatusBar extends DrawableObject {
  /** @type {string[]} Bar images from empty to full. */
  IMAGES = [];

  /** @type {number} Current percentage value. */
  percentage = 100;

  /**
   * Creates a status bar with sprite steps.
   * @param {{images:string[], x:number, y:number, initial:number}} config Bar settings.
   */
  constructor(config) {
    super();
    this.IMAGES = config.images;
    this.x = config.x;
    this.y = config.y;
    this.width = 200;
    this.height = 60;
    this.loadImages(this.IMAGES);
    this.setPercentage(config.initial);
  }

  /**
   * Updates the displayed percentage.
   * @param {number} percentage New percentage value.
   */
  setPercentage(percentage) {
    this.percentage = Math.max(0, Math.min(100, percentage));
    const imagePath = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[imagePath];
  }

  /**
   * Maps the percentage to the matching sprite step.
   * @returns {number} Image index.
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage > 0) return 1;
    return 0;
  }
}

/**
 * Displays the character health percentage.
 */
class StatusBar extends ProgressStatusBar {
  /**
   * Creates the health status bar.
   */
  constructor() {
    super({
      images: [
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
      ],
      x: 20,
      y: 0,
      initial: 100,
    });
  }
}
