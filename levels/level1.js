/** @type {?Level} Active first level instance. */
let level1;

/**
 * Recreates the first level with fresh enemies, pickups, clouds, and background.
 * @returns {void}
 */
function initLevel1() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundObjects(),
    createCoins(),
    createBottles(),
  );
}

/**
 * Creates all enemies for the level.
 * @returns {MovableObjects[]} Enemy list including the boss.
 */
function createEnemies() {
  const enemies = [new Endboss()];

  placeChicken(enemies, 420, 580);
  placeChicken(enemies, 680, 800);

  placeChicken(enemies, 900, 1050);
  placeSmallChicken(enemies, 1050, 1200);
  placeChicken(enemies, 1250, 1400);
  placeSmallChicken(enemies, 1300, 1450);

  placeChicken(enemies, 1500, 1650);
  placeSmallChicken(enemies, 1700, 1850);
  placeSmallChicken(enemies, 1950, 2050);

  return enemies;
}

/**
 * Adds a normal chicken at a random position inside a zone.
 * @param {MovableObjects[]} enemies Enemy list to mutate.
 * @param {number} minX Minimum x-position.
 * @param {number} maxX Maximum x-position.
 * @returns {void}
 */
function placeChicken(enemies, minX, maxX) {
  const chicken = new Chicken();
  chicken.x = minX + Math.random() * (maxX - minX);
  enemies.push(chicken);
}

/**
 * Adds a small chicken at a random position inside a zone.
 * @param {MovableObjects[]} enemies Enemy list to mutate.
 * @param {number} minX Minimum x-position.
 * @param {number} maxX Maximum x-position.
 * @returns {void}
 */
function placeSmallChicken(enemies, minX, maxX) {
  const chicken = new SmallChicken();
  chicken.x = minX + Math.random() * (maxX - minX);
  enemies.push(chicken);
}

/**
 * Creates bottle pickups distributed over the level.
 * @returns {Bottle[]} Bottle pickups.
 */
function createBottles() {
  const zones = [
    [280, 420],
    [500, 650],
    [750, 900],
    [950, 1100],
    [1150, 1300],
    [1350, 1500],
    [1500, 1620],
    [1620, 1750],
    [1750, 1870],
    [1870, 1980],
    [1980, 2080],
    [2080, 2150],
  ];
  return zones.map(([min, max]) => new Bottle(min + Math.random() * (max - min)));
}

/**
 * Creates coin pickups distributed over the level.
 * @returns {Coin[]} Coin pickups.
 */
function createCoins() {
  const count = 12;
  const levelWidth = 1900;
  const startX = 300;
  const step = levelWidth / count;
  return Array.from({ length: count }, (_, i) => {
    const x = startX + i * step + Math.random() * (step * 0.6);
    return new Coin(x);
  });
}

/**
 * Creates background clouds.
 * @returns {Cloud[]} Cloud objects.
 */
function createClouds() {
  return Array.from({ length: 8 }, () => new Cloud());
}

/**
 * Creates the repeated parallax background layers.
 * @returns {BackgroundObject[]} Background objects in draw order.
 */
function createBackgroundObjects() {
  return [
    new BackgroundObject("assets/img/5_background/layers/air.png", -719),
    new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", -719),
    new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", -719),
    new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", -719),

    new BackgroundObject("assets/img/5_background/layers/air.png", 0),
    new BackgroundObject("assets/img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("assets/img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("assets/img/5_background/layers/1_first_layer/1.png", 0),

    new BackgroundObject("assets/img/5_background/layers/air.png", 719),
    new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", 719),

    new BackgroundObject("assets/img/5_background/layers/air.png", 719 * 2),
    new BackgroundObject("assets/img/5_background/layers/3_third_layer/1.png", 719 * 2),
    new BackgroundObject("assets/img/5_background/layers/2_second_layer/1.png", 719 * 2),
    new BackgroundObject("assets/img/5_background/layers/1_first_layer/1.png", 719 * 2),

    new BackgroundObject("assets/img/5_background/layers/air.png", 719 * 3),
    new BackgroundObject("assets/img/5_background/layers/3_third_layer/2.png", 719 * 3),
    new BackgroundObject("assets/img/5_background/layers/2_second_layer/2.png", 719 * 3),
    new BackgroundObject("assets/img/5_background/layers/1_first_layer/2.png", 719 * 3),
  ];
}
