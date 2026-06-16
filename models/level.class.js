/**
 * Holds all objects that belong to one level.
 */
class Level {
  /** @type {MovableObjects[]} Enemies in the level. */
  enemies;

  /** @type {Cloud[]} Clouds in the level. */
  clouds;

  /** @type {Coin[]} Collectable coins. */
  coins;

  /** @type {Bottle[]} Collectable bottles. */
  bottles;

  /** @type {BackgroundObject[]} Background layers. */
  backgroundObjects;

  /** @type {number} Horizontal end position of the level. */
  level_end_x = 719 * 3;

  /**
   * Creates a level from its object groups.
   * @param {MovableObjects[]} enemies Level enemies.
   * @param {Cloud[]} clouds Background clouds.
   * @param {BackgroundObject[]} backgroundObjects Background layer segments.
   * @param {Coin[]} coins Collectable coins.
   * @param {Bottle[]} bottles Collectable bottles.
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
