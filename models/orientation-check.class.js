class OrientationCheck {
  constructor() {
    this.overlay = document.getElementById("rotateScreen");
    this.canvas = document.getElementById("gameContainer");
    this.check();

    window.addEventListener("resize", () => this.check());
    window.addEventListener("orientationchange", () => this.check());
  }

  check() {
    const isMobile = window.innerWidth < 1450;
    const isPortrait = window.innerHeight > window.innerWidth;

    if (isMobile && isPortrait) {
      this.show();
    } else {
      this.hide();
    }
  }

  show() {
    if (this.overlay) {
      this.overlay.style.display = "flex";
      this.canvas.style.display = "none";
    }

    if (world) {
      world.stop();
    }
  }

  hide() {
    if (this.overlay) {
      this.overlay.style.display = "none";
      this.canvas.style.display = "block";
    }

    if (world && !world.isRunning) {
      world.run();
    }
  }
}
