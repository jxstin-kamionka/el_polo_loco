class World {
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

  isRunning = true;
  isFinishing = false;
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
      if (!this.isRunning || isPaused) return;

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

    this.character.stop();
    this.level.enemies.forEach((enemy) => { if (enemy.stop) enemy.stop(); });
    this.level.clouds.forEach((cloud) => { if (cloud.stop) cloud.stop(); });
    this.throwableObjects.forEach((bottle) => bottle.stopThrow());
  }

  checkGameEndConditions() {
    if (youWin) {
      this.finishGame("youWin");
    } else if (gameOver) {
      this.finishGame("gameOver");
    }
  }

  /**
   * Ends the game and transitions to the result screen after a short delay.
   * @param {"gameOver"|"youWin"} result
   */
  finishGame(result) {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.isFinishing = true;
    gameStarted = false;
    clearInterval(this.gameLoopInterval);
    this.gameLoopInterval = null;
    this.stopEntities();
    this.playResultSound(result);
    this.endScreenTimeout = setTimeout(() => this.showEndScreen(result), 1500);
  }

  /** Stops all enemies, clouds, and in-flight bottles. */
  stopEntities() {
    this.level.enemies.forEach((e) => { if (e.stop) e.stop(); });
    this.level.clouds.forEach((c) => { if (c.stop) c.stop(); });
    this.throwableObjects.forEach((b) => b.stopThrow());
  }

  /**
   * Plays the end sound and freezes the character appropriately.
   * On game over the move interval is cleared so gravity can play the death jump.
   * @param {"gameOver"|"youWin"} result
   */
  playResultSound(result) {
    sounds.stop("background");
    if (result === "gameOver") {
      sounds.play("gameOver");
      clearInterval(this.character.moveInterval);
      this.character.moveInterval = null;
    } else {
      sounds.play("youWin");
      this.character.stop();
    }
  }

  /**
   * Tears down the draw loop and shows the end-screen overlay.
   * @param {"gameOver"|"youWin"} result
   */
  showEndScreen(result) {
    this.isFinishing = false;
    this.character.stop();
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    showGameEndOverlay(result);
  }

  checkCharacterIsDead() {
    if (youWin || gameOver) return;

    if (this.character.energy === 0) {
      gameOver = true;
      sounds.play("dead");
      this.character.speedY = 18;
    }
  }

  checkBossActivation() {
    const boss = this.getEndboss();
    if (!boss || boss.isDead() || boss.isActivated) return;

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
    const boss = this.getEndboss();
    if (!boss) return;

    const percentage = Math.round((boss.energy / 120) * 100);
    this.bossStatusBar.setPercentage(Math.min(100, percentage));
  }

  checkCharacterEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy.removeFromWorld) return;
      if (enemy.isHittable === false) return;
      if (enemy.isDead && enemy.isDead()) return;
      if (!this.character.isColliding(enemy)) return;

      if (this.canStompEnemy(enemy)) {
        this.stompEnemy(enemy);
      } else {
        this.damageCharacter();
      }
    });
  }

  stompEnemy(enemy) {
    if (typeof enemy.takeDamage === "function") {
      enemy.takeDamage(enemy.energy);
    }
    enemy.isHittable = false;
    this.character.speedY = 10;
    this.character.lastStompTime = Date.now();
  }

  canStompEnemy(enemy) {
    if (Date.now() - this.character.lastStompTime < 200) return false;
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
    const characterBottom = this.character.y + this.character.height - this.character.offset.bottom;
    const enemyTop = enemy.y + enemy.offset.top;
    return characterBottom < enemyTop + 35;
  }

  damageCharacter() {
    if (Date.now() - this.character.lastStompTime < 500) return;
    if (this.character.isHurt()) return;

    this.character.hit(20);
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
    return Date.now() - this.lastThrowTime > 800;
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
    return this.character.otherDirection ? this.character.x : this.character.x + 100;
  }

  getBottleStartY() {
    return this.character.y + 80;
  }

  updateBottleBarAfterThrow() {
    this.bottleStatusBar.percentage = Math.max(0, this.bottleStatusBar.percentage - 20);
    this.bottleStatusBar.setPercentage(this.bottleStatusBar.percentage);
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
    this.coinStatusBar.percentage = Math.min(100, this.coinStatusBar.percentage + 10);
    this.coinStatusBar.setPercentage(this.coinStatusBar.percentage);
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
    this.bottleStatusBar.percentage = Math.min(100, this.bottleStatusBar.percentage + 20);
    this.bottleStatusBar.setPercentage(this.bottleStatusBar.percentage);
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
    bottle.readyToRemove = true;
    bottle.stopThrow();

    if (typeof enemy.takeDamage === "function") {
      enemy.takeDamage(bottle.damage);
      sounds.play("deadenemie");
    }
  }

  removeUsedBottles() {
    this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.readyToRemove);
  }

  removeDeadEnemies() {
    this.level.enemies = this.level.enemies.filter((enemy) => !enemy.removeFromWorld);
  }

  draw() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.backgroundObjects);
    this.addObjectToMap(this.level.clouds);
    this.addToMap(this.character);
    this.addObjectToMap(this.level.enemies);
    this.addObjectToMap(this.throwableObjects);
    this.addObjectToMap(this.level.coins);
    this.addObjectToMap(this.level.bottles);
    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusBar);
    this.addToMap(this.bottleStatusBar);
    this.addToMap(this.coinStatusBar);
    if (this.bossBarVisible) this.addToMap(this.bossStatusBar);

    if (this.isRunning || this.isFinishing) {
      this.animationFrameId = requestAnimationFrame(() => this.draw());
    }
  }

  addObjectToMap(objects) {
    objects.forEach((object) => this.addToMap(object));
  }

  addToMap(mo) {
    if (mo.otherDirection) this.flipImage(mo);
    mo.draw(this.ctx);
    if (mo.otherDirection) this.flipImageBack(mo);
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
