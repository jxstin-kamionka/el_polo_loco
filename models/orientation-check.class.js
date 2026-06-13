class OrientationCheck {
  constructor() {
    this.overlay = document.getElementById("rotateScreen");
    this.canvas = document.getElementById("gameContainer");
    this.check();

    window.addEventListener("resize", () => this.check());
    window.addEventListener("orientationchange", () => this.check());
  }

  isTouchDevice() {
    return navigator.maxTouchPoints > 0 || "ontouchstart" in window;
  }

  check() {
    if (!this.isTouchDevice()) return;

    const isPortrait = window.innerHeight > window.innerWidth;
    if (isPortrait) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    if (this.overlay) this.overlay.style.display = "flex";
    if (this.canvas) this.canvas.style.display = "none";
    if (world) world.stop();
  }

  hide() {
    if (this.overlay) this.overlay.style.display = "none";
    if (this.canvas) this.canvas.style.display = "block";
  }
}
