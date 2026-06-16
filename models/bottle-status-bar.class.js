/**
 * Displays collected bottle ammunition.
 */
class BottleStatusBar extends DrawableObject {
  /** @type {string[]} Bottle bar images from empty to full. */
  IMAGES = [
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  /** @type {number} Current bottle percentage. */
  percentage = 100;

  /**
   * Creates the bottle status bar.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.setPercentage(0);
    this.x = 20;
    this.y = 40;
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
