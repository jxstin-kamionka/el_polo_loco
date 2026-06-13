let level1;

function initLevel1() {
  level1 = new Level(
    createEnemies(),
    createClouds(),
    createBackgroundObjects(),
    createCoins(),
    createBottles(),
  );
}

// ─── Enemies ─────────────────────────────────────────────────────────────────
// Zone 1 (x 400–800):  2 normal chickens  — easy warm-up
// Zone 2 (x 850–1400): 2 normal + 2 small — mid challenge
// Zone 3 (x 1450–2050): 1 normal + 2 small — boss approach
// x 2157: Endboss

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

function placeChicken(enemies, minX, maxX) {
  const chicken = new Chicken();
  chicken.x = minX + Math.random() * (maxX - minX);
  enemies.push(chicken);
}

function placeSmallChicken(enemies, minX, maxX) {
  const chicken = new SmallChicken();
  chicken.x = minX + Math.random() * (maxX - minX);
  enemies.push(chicken);
}

// ─── Bottles ─────────────────────────────────────────────────────────────────
// 12 Flaschen gleichmäßig über das Level verteilt, mehr Cluster vor dem Boss

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

// ─── Coins ───────────────────────────────────────────────────────────────────
// 12 Münzen gleichmäßig über das Level verteilt

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

// ─── Clouds ──────────────────────────────────────────────────────────────────

function createClouds() {
  return Array.from({ length: 8 }, () => new Cloud());
}

// ─── Background ──────────────────────────────────────────────────────────────

function createBackgroundObjects() {
  return [
    new BackgroundObject("../assets/img/5_background/layers/air.png", -719),
    new BackgroundObject("../assets/img/5_background/layers/3_third_layer/2.png", -719),
    new BackgroundObject("../assets/img/5_background/layers/2_second_layer/2.png", -719),
    new BackgroundObject("../assets/img/5_background/layers/1_first_layer/2.png", -719),

    new BackgroundObject("../assets/img/5_background/layers/air.png", 0),
    new BackgroundObject("../assets/img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("../assets/img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("../assets/img/5_background/layers/1_first_layer/1.png", 0),

    new BackgroundObject("../assets/img/5_background/layers/air.png", 719),
    new BackgroundObject("../assets/img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("../assets/img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("../assets/img/5_background/layers/1_first_layer/2.png", 719),

    new BackgroundObject("../assets/img/5_background/layers/air.png", 719 * 2),
    new BackgroundObject("../assets/img/5_background/layers/3_third_layer/1.png", 719 * 2),
    new BackgroundObject("../assets/img/5_background/layers/2_second_layer/1.png", 719 * 2),
    new BackgroundObject("../assets/img/5_background/layers/1_first_layer/1.png", 719 * 2),

    new BackgroundObject("../assets/img/5_background/layers/air.png", 719 * 3),
    new BackgroundObject("../assets/img/5_background/layers/3_third_layer/2.png", 719 * 3),
    new BackgroundObject("../assets/img/5_background/layers/2_second_layer/2.png", 719 * 3),
    new BackgroundObject("../assets/img/5_background/layers/1_first_layer/2.png", 719 * 3),
  ];
}
