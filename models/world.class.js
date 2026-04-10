class World {
  character = new Character();
  enemies = level1.enemies;
  clouds = level1.clouds;
  backgroundObjects = level1.backgroundObjects;
  coins = level1.coins;
  bottles = level1.bottles;
  canvas;
  keyboard;
  camera_x = 0;
  level = level1;
  statusBar = new StatusBar();
  bottleStatusBar = new BottleStatusBar();
  coinStatusBar = new CoinStatusBar();
  bossStatusBar = new BossStatusBar();
  throwableObjects = [];
  lastThrowTime = 0;
  bossBarVisible = false;
  bossActivationDistance = 500;
  gameEndScreen = new gameEnd();

  isRunning = true;
  gameLoopInterval = null;
  animationFrameId = null;
  endScreenTimeout = null;

  constructor(canvas, keyboard) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.keyboard = keyboard;

    this.character = new Character();
    this.character.world = this;

    this.draw();
    this.run();
  }

  run() {
    this.gameLoopInterval = setInterval(() => {
      if (!this.isRunning) return;

      this.checkGameEndConditions();
      if (gameOver || youWin) return;

      this.checkCharacterEnemyCollisions();
      this.checkCoinCollision();
      this.checkBottleCollision();
      this.checkThrowObjects();
      this.checkThrowableObjectHits();
      this.checkBossActivation();
      this.updateBossStatusBar();
      this.removeUsedBottles();
      this.removeDeadEnemies();
      this.checkCharacterIsDead();
      this.checkGameEndConditions();
    }, 1000 / 25);
  }

  stop() {
    this.isRunning = false;

    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.endScreenTimeout) {
      clearTimeout(this.endScreenTimeout);
      this.endScreenTimeout = null;
    }
  }

  checkGameEndConditions() {
    if (youWin) {
      this.finishGame("youWin");
    } else if (gameOver) {
      this.finishGame("gameOver");
    }
  }

  finishGame(result) {
    if (!this.isRunning) return;

    this.isRunning = false;
    gameStarted = false;

    if (result === "gameOver") {
      this.gameEndScreen.showGameOver();
      sounds.play("gameOver");
      sounds.stop("background");
    }

    if (result === "youWin") {
      sounds.stop("background");
      sounds.play("youWin");
      this.gameEndScreen.showYouWin();
    }

    this.endScreenTimeout = setTimeout(() => {
      returnToStartScreen();
      sounds.playBackground();
    }, 2500);
  }

  checkCharacterIsDead() {
    if (youWin) return;

    if (this.character.energy === 0) {
      gameOver = true;
      sounds.play("dead");
    }
  }

  checkBossActivation() {
    let boss = this.getEndboss();
    if (!boss) return;
    if (boss.isDead()) return;

    if (this.isCharacterNearBoss(boss)) {
      boss.activate();
      sounds.play("endboss");
      this.bossBarVisible = true;
    }
  }

  getEndboss() {
    return this.level.enemies.find((enemy) => enemy instanceof Endboss);
  }

  isCharacterNearBoss(boss) {
    return this.character.x > boss.x - this.bossActivationDistance;
  }

  updateBossStatusBar() {
    let boss = this.getEndboss();
    if (!boss) return;

    this.bossStatusBar.setPercentage(boss.energy);
  }

  checkCharacterEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (!this.character.isColliding(enemy)) return;

      if (this.canStompEnemy(enemy)) {
        this.stompEnemy(enemy);
      } else {
        this.damageCharacter();
      }
    });
  }

  canStompEnemy(enemy) {
    if (!this.isJumpKillable(enemy)) return false;
    if (!this.isCharacterFalling()) return false;
    if (!this.isCharacterAboveEnemy(enemy)) return false;

    return true;
  }

  isJumpKillable(enemy) {
    return enemy instanceof Chicken || enemy instanceof SmallChicken;
  }

  isCharacterFalling() {
    return this.character.speedY < 0;
  }

  isCharacterAboveEnemy(enemy) {
    const characterBottom =
      this.character.y + this.character.height - this.character.offset.bottom;
    const enemyTop = enemy.y + enemy.offset.top;

    return characterBottom < enemyTop + 35;
  }

  stompEnemy(enemy) {
    if (typeof enemy.takeDamage === "function") {
      enemy.takeDamage(enemy.energy);
    }

    this.character.speedY = 15;

    this.character.lastStompTime = Date.now();
  }

  damageCharacter() {
    if (Date.now() - this.character.lastStompTime < 500) return;

    this.character.hit();
    sounds.play("hurt");
    this.statusBar.setPercentage(this.character.energy);
  }

  checkThrowObjects() {
    if (!this.keyboard.D) return;
    if (!this.canThrowBottle()) return;
    if (this.character.bottles <= 0) return;

    this.throwBottle();
  }

  canThrowBottle() {
    return Date.now() - this.lastThrowTime > 500;
  }

  throwBottle() {
    this.character.bottles -= 1;
    this.updateBottleBarAfterThrow();

    const bottle = new ThrowableObject(
      this.getBottleStartX(),
      this.getBottleStartY(),
      this.character.otherDirection,
    );

    this.throwableObjects.push(bottle);
    this.lastThrowTime = Date.now();
  }

  getBottleStartX() {
    if (this.character.otherDirection) {
      return this.character.x;
    }
    return this.character.x + 100;
  }

  getBottleStartY() {
    return this.character.y + 120;
  }

  updateBottleBarAfterThrow() {
    if (this.bottleStatusBar.percentage > 0) {
      this.bottleStatusBar.percentage -= 20;
    }

    if (this.bottleStatusBar.percentage < 0) {
      this.bottleStatusBar.percentage = 0;
    }
  }

  checkCoinCollision() {
    this.level.coins = this.level.coins.filter((coin) => {
      if (!this.character.isColliding(coin)) return true;

      this.collectCoin();
      return false;
    });
  }

  collectCoin() {
    sounds.play("coin");
    this.character.coins += 10;

    if (this.coinStatusBar.percentage < 100) {
      this.coinStatusBar.percentage += 10;
    }

    if (this.coinStatusBar.percentage > 100) {
      this.coinStatusBar.percentage = 100;
    }
  }

  checkBottleCollision() {
    this.level.bottles = this.level.bottles.filter((bottle) => {
      if (!this.character.isColliding(bottle)) return true;

      this.collectBottle();
      return false;
    });
  }

  collectBottle() {
    sounds.play("bottlePickup");
    this.character.bottles += 1;

    if (this.bottleStatusBar.percentage < 100) {
      this.bottleStatusBar.percentage += 20;
    }

    if (this.bottleStatusBar.percentage > 100) {
      this.bottleStatusBar.percentage = 100;
    }
  }

  checkThrowableObjectHits() {
    this.throwableObjects.forEach((bottle) => {
      if (bottle.hasHit) return;
      this.checkBottleHitEnemies(bottle);
    });
  }

  checkBottleHitEnemies(bottle) {
    this.level.enemies.forEach((enemy) => {
      if (bottle.hasHit) return;
      if (!bottle.isColliding(enemy)) return;

      this.handleBottleHit(enemy, bottle);
    });
  }

  handleBottleHit(enemy, bottle) {
    bottle.hasHit = true;
    bottle.stopThrow();

    if (typeof enemy.takeDamage === "function") {
      enemy.takeDamage(bottle.damage);
      sounds.play("deadenemie");
    }
  }

  removeUsedBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => {
      return !bottle.hasHit;
    });
  }

  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter((enemy) => {
      return !enemy.removeFromWorld;
    });
  }

  draw() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);

    this.addObjectToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.bottleStatusBar);
    this.addToMap(this.coinStatusBar);

    if (this.bossBarVisible) {
      this.addToMap(this.bossStatusBar);
    }

    this.ctx.translate(this.camera_x, 0);

    this.addObjectToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectToMap(this.level.enemies);
    this.addObjectToMap(this.throwableObjects);
    this.addObjectToMap(this.level.coins);
    this.addObjectToMap(this.level.bottles);

    this.ctx.translate(-this.camera_x, 0);

    if (gameOver || youWin) {
      this.addToMap(this.gameEndScreen);
    }

    if (this.isRunning || gameOver || youWin) {
      this.animationFrameId = requestAnimationFrame(() => this.draw());
    }
  }

  addObjectToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    // mo.drawFrame(this.ctx);
    // mo.drawFrameOffset(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    this.ctx.restore();
    mo.x = mo.x * -1;
  }
}
