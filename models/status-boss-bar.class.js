/**
 * Displays the endboss health percentage.
 */
class BossStatusBar extends ProgressStatusBar {
  /**
   * Creates the boss status bar.
   */
  constructor() {
    super({
      images: [
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png",
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png",
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png",
        "assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png",
      ],
      x: 520,
      y: 0,
      initial: 100,
    });
  }
}
