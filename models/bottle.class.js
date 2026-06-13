class Bottle extends DrawableObject {
  offset = {
    top: 18,
    bottom: 18,
    left: 18,
    right: 18,
  };

  constructor(x) {
    super();
    this.loadImage("../assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.x = x;
    this.y = 350;
    this.width = 60;
    this.height = 80;
  }
}
