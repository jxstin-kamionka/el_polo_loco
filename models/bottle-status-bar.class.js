/**
 * Displays collected bottle ammunition.
 */
class BottleStatusBar extends ProgressStatusBar {
  /**
   * Creates the bottle status bar.
   */
  constructor() {
    super({
      images: [
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
        "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
      ],
      x: 20,
      y: 40,
      initial: 0,
    });
  }
}
