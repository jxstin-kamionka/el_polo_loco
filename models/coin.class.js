class Coin extends DrawableObject {
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
    this.y = Math.random() * 200 + 180;
    this.width = 100;
    this.height = 100;
  }

  getImage() {
    return ("assets/img/8_coin/coin_1.png", "assets/img/8_coin/coin_2.png"); // Platzhalter
  }
}
