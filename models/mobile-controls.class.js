/**
 * Connects touch buttons to the shared keyboard input state.
 */
class MobileControls {
  /**
   * Creates mobile controls for the provided keyboard state.
   * @param {Keyboard} keyboard Shared keyboard state.
   */
  constructor(keyboard) {
    /** @type {Keyboard} Shared keyboard state. */
    this.keyboard = keyboard;

    /** @type {?HTMLElement} Mobile navigation container. */
    this.container = document.querySelector(".mobile-navigation");

    this.init();
    this.updateVisibility();
  }

  /**
   * Checks whether the current device supports touch input.
   * @returns {boolean} True on touch-capable devices.
   */
  isTouchDevice() {
    return navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  }

  /**
   * Binds all mobile control buttons.
   * @returns {void}
   */
  init() {
    if (!this.container) return;
    this.bindButton("btn-left", "LEFT");
    this.bindButton("btn-right", "RIGHT");
    this.bindButton("btn-jump", "SPACE");
    this.bindButton("btn-throw", "D");
  }

  /**
   * Binds one button to one keyboard flag.
   * @param {string} buttonId Button element id.
   * @param {"LEFT"|"RIGHT"|"SPACE"|"D"} keyName Keyboard flag to toggle.
   * @returns {void}
   */
  bindButton(buttonId, keyName) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const press = (event) => {
      event.preventDefault();
      this.keyboard[keyName] = true;
    };
    const release = (event) => {
      event.preventDefault();
      this.keyboard[keyName] = false;
    };

    button.addEventListener("touchstart", press, { passive: false });
    button.addEventListener("touchend", release);
    button.addEventListener("touchcancel", release);
    button.addEventListener("mousedown", press);
    button.addEventListener("mouseup", release);
    button.addEventListener("mouseleave", release);
  }

  /**
   * Shows controls on touch devices and hides them otherwise.
   * @returns {void}
   */
  updateVisibility() {
    if (!this.container) return;
    if (this.isTouchDevice()) {
      this.container.style.display = "flex";
    } else {
      this.container.style.display = "none";
      this.resetKeys();
    }
  }

  /**
   * Clears mobile-related input state.
   * @returns {void}
   */
  resetKeys() {
    this.keyboard.LEFT = false;
    this.keyboard.RIGHT = false;
    this.keyboard.SPACE = false;
    this.keyboard.UP = false;
    this.keyboard.DOWN = false;
    this.keyboard.D = false;
  }
}
