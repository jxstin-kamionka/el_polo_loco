/**
 * Displays the character health percentage.
 */
class StatusBar extends DrawableObject {
  /** @type {string[]} Health bar images from empty to full. */
  IMAGES = [
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  /** @type {number} Current health percentage. */
  percentage = 100;

  /**
   * Creates the health status bar.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(100);
    this.x = 20;
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
