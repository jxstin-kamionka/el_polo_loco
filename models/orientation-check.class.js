/**
 * Shows an overlay on touch devices when the viewport is in portrait mode.
 */
class OrientationCheck {
  /**
   * Creates the orientation checker and registers viewport listeners.
   */
  constructor() {
    /** @type {?HTMLElement} Rotation overlay element. */
    this.overlay = document.getElementById("rotateScreen");

    /** @type {?HTMLElement} Game container element. */
    this.canvas = document.getElementById("gameContainer");

    this.check();

    window.addEventListener("resize", () => this.check());
    window.addEventListener("orientationchange", () => this.check());
  }

  /**
   * Checks whether the current device supports touch input.
   * @returns {boolean} True on touch-capable devices.
   */
  isTouchDevice() {
    return navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  }

  /**
   * Shows or hides the rotate overlay based on viewport orientation.
   * @returns {void}
   */
  check() {
    if (!this.isTouchDevice()) return;

    const isPortrait = window.innerHeight > window.innerWidth;
    if (isPortrait) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * Shows the rotate overlay and stops the current world.
   * @returns {void}
   */
  show() {
    if (this.overlay) this.overlay.style.display = "flex";
    if (this.canvas) this.canvas.style.display = "none";
    if (world) world.stop();
  }

  /**
   * Hides the rotate overlay and shows the game container.
   * @returns {void}
   */
  hide() {
    if (this.overlay) this.overlay.style.display = "none";
    if (this.canvas) this.canvas.style.display = "block";
  }
}
