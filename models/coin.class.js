class Coin extends DrawableObject {
  offset = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25,
  };

  constructor(x) {
    super();
    this.loadImage("../assets/img/8_coin/coin_1.png");
    this.x = x;
    this.y = Math.random() * 200 + 180;
    this.width = 80;
    this.height = 80;
  }
}
