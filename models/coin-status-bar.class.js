/**
 * Displays collected coins.
 */
class CoinStatusBar extends ProgressStatusBar {
  /**
   * Creates the coin status bar.
   */
  constructor() {
    super({
      images: [
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/0.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/20.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/40.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/60.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
        "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
      ],
      x: 20,
      y: 80,
      initial: 0,
    });
  }
}
