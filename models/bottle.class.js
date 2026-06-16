/**
 * Collectable salsa bottle pickup.
 */
class Bottle extends DrawableObject {
  /** @type {{top:number,bottom:number,left:number,right:number}} Collision offsets. */
  offset = {
    top: 18,
    bottom: 18,
    left: 18,
    right: 18,
  };

  /**
   * Creates a bottle pickup at the provided x-position.
   * @param {number} x Horizontal pickup position.
   */
  constructor(x) {
    super();
    this.loadImage("../assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png");
    this.x = x;
    this.y = 350;
    this.width = 60;
    this.height = 80;
  }
}
