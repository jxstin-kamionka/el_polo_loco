/**
 * Collectable coin pickup.
 */
class Coin extends DrawableObject {
  /** @type {{top:number,bottom:number,left:number,right:number}} Collision offsets. */
  offset = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25,
  };

  /**
   * Creates a coin at the provided x-position and a random height.
   * @param {number} x Horizontal pickup position.
   */
  constructor(x) {
    super();
    this.loadImage("../assets/img/8_coin/coin_1.png");
    this.x = x;
    this.y = Math.random() * 200 + 180;
    this.width = 80;
    this.height = 80;
  }
}
