class MobileControls {
  constructor(keyboard) {
    this.keyboard = keyboard;
    this.container = document.querySelector(".mobile-navigation");

    this.init();
    this.handleResize();
  }

  init() {
    if (!this.container) return;

    this.bindButton("btn-left", "LEFT");
    this.bindButton("btn-right", "RIGHT");
    this.bindButton("btn-jump", "SPACE");
    this.bindButton("btn-throw", "D");
  }

  bindButton(buttonId, keyName) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    const press = (e) => {
      e.preventDefault();
      this.keyboard[keyName] = true;
    };

    const release = (e) => {
      e.preventDefault();
      this.keyboard[keyName] = false;
    };

    button.addEventListener("touchstart", press, { passive: false });
    button.addEventListener("touchend", release);
    button.addEventListener("touchcancel", release);

    button.addEventListener("mousedown", press);
    button.addEventListener("mouseup", release);
    button.addEventListener("mouseleave", release);
  }

  handleResize() {
    window.addEventListener("resize", () => this.toggleVisibility());
    this.toggleVisibility();
  }

  toggleVisibility() {
    if (!this.container) return;

    if (window.innerWidth < 1450) {
      this.container.style.display = "flex";
    } else {
      this.container.style.display = "none";
      this.resetKeys();
    }
  }

  resetKeys() {
    this.keyboard.LEFT = false;
    this.keyboard.RIGHT = false;
    this.keyboard.SPACE = false;
    this.keyboard.UP = false;
    this.keyboard.DOWN = false;
    this.keyboard.D = false;
  }
}
