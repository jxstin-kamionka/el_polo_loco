class Bottle extends DrawableObject {
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
  constructor(x, y) {
    super();
    this.loadImage(this.getImage());
    this.x = x;
    this.y = 350;
    this.width = 80;
    this.height = 80;
  }

  getImage() {
    return "assets/img/6_salsa_bottle/salsa_bottle.png"; // Platzhalter
  }
}
