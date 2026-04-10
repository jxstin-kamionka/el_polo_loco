const level1 = new Level(
  enemies = [new Endboss()],
  [new Cloud(), new Cloud(), new Cloud(), new Cloud(), new Cloud()],
  [
    new BackgroundObject("../assets/img/5_background/layers/air.png", -719),
    new BackgroundObject(
      "../assets/img/5_background/layers/3_third_layer/2.png",
      -719,
    ),
    new BackgroundObject(
      "../assets/img/5_background/layers/2_second_layer/2.png",
      -719,
    ),
    new BackgroundObject(
      "../assets/img/5_background/layers/1_first_layer/2.png",
      -719,
    ),

    new BackgroundObject("../assets/img/5_background/layers/air.png", 0),
    new BackgroundObject(
      "../assets/img/5_background/layers/3_third_layer/1.png",
      0,
    ),
    new BackgroundObject(
      "../assets/img/5_background/layers/2_second_layer/1.png",
      0,
    ),
    new BackgroundObject(
      "../assets/img/5_background/layers/1_first_layer/1.png",
      0,
    ),

    new BackgroundObject("../assets/img/5_background/layers/air.png", 719),
    new BackgroundObject(
      "../assets/img/5_background/layers/3_third_layer/2.png",
      719,
    ),
    new BackgroundObject(
      "../assets/img/5_background/layers/2_second_layer/2.png",
      719,
    ),
    new BackgroundObject(
      "../assets/img/5_background/layers/1_first_layer/2.png",
      719,
    ),

    new BackgroundObject("../assets/img/5_background/layers/air.png", 719 * 2),
    new BackgroundObject(
      "../assets/img/5_background/layers/3_third_layer/1.png",
      719 * 2,
    ),
    new BackgroundObject(
      "../assets/img/5_background/layers/2_second_layer/1.png",
      719 * 2,
    ),
    new BackgroundObject(
      "../assets/img/5_background/layers/1_first_layer/1.png",
      719 * 2,
    ),

    new BackgroundObject("../assets/img/5_background/layers/air.png", 719 * 3),
    new BackgroundObject(
      "../assets/img/5_background/layers/3_third_layer/2.png",
      719 * 3,
    ),
    new BackgroundObject(
      "../assets/img/5_background/layers/2_second_layer/2.png",
      719 * 3,
    ),
    new BackgroundObject(
      "../assets/img/5_background/layers/1_first_layer/2.png",
      719 * 3,
    ),
  ],
  generateCoins(20),
  generateBottles(18),
  generateChicken(5, 5),
);

function generateCoins(amount) {
  let coins = [];
  for (let i = 0; i < amount; i++) {
    coins.push(new Coin(randomX(), randomY()));
  }
  return coins;
}

function generateBottles(amount) {
  let bottles = [];
  for (let i = 0; i < amount; i++) {
    bottles.push(new Bottle(randomX(), randomY()));
  }
  return bottles;
}

function generateChicken(amount, smallAmount) {
    for (let i = 0; i < amount; i++) {
      enemies.push(new Chicken(randomX(), randomY()));
    }
    for (let i = 0; i < smallAmount; i++) {
      enemies.push(new SmallChicken(randomX(), randomY()));
    }
}

function randomX() {
  return Math.random() * 2000 + 200;
}

function randomY() {
  return Math.random() * 200 + 100;
}
