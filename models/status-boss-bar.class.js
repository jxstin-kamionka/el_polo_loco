/**
 * Displays the endboss health percentage.
 */
class BossStatusBar extends DrawableObject {
  /** @type {string[]} Boss health bar images from empty to full. */
  IMAGES = [
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
    "assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
  ];

  /** @type {number} Current boss health percentage. */
  percentage = 100;

  /**
   * Creates the boss status bar.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
    this.x = 520;
    this.y = 0;
    this.width = 200;
    this.height = 60;
  }

  /**
   * Updates the displayed percentage.
   * @param {number} percentage New percentage value.
   * @returns {void}
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    const imagePath = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[imagePath];
  }

  /**
   * Maps the percentage to the matching image index.
   * @returns {number} Image index.
   */
  resolveImageIndex() {
    if (this.percentage == 100) return 5;
    if (this.percentage > 80) return 4;
    if (this.percentage > 60) return 3;
    if (this.percentage > 40) return 2;
    if (this.percentage > 20) return 1;
    return 0;
  }
}
