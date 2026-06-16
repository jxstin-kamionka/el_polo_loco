/**
 * Activates the boss when the character reaches the boss area.
 * @returns {void}
 */
World.prototype.checkBossActivation = function () {
  const boss = this.getEndboss();
  if (!boss || boss.isDead() || boss.isActivated) return;

  if (this.isCharacterNearBoss(boss)) {
    boss.activate();
    sounds.play("endboss");
    this.bossBarVisible = true;
  }
};

/**
 * Finds the endboss in the current level.
 * @returns {?Endboss} Active endboss or null when none exists.
 */
World.prototype.getEndboss = function () {
  return this.level.enemies.find((enemy) => enemy instanceof Endboss) || null;
};

/**
 * Checks whether the character is close enough to activate the boss.
 * @param {Endboss} boss Boss to compare against.
 * @returns {boolean} True when the character has reached the activation zone.
 */
World.prototype.isCharacterNearBoss = function (boss) {
  return this.character.x > boss.x - this.bossActivationDistance;
};

/**
 * Synchronizes the visible boss health bar with the boss energy.
 * @returns {void}
 */
World.prototype.updateBossStatusBar = function () {
  const boss = this.getEndboss();
  if (!boss) return;

  const percentage = Math.round((boss.energy / boss.maxEnergy) * 100);
  this.bossStatusBar.setPercentage(Math.min(100, percentage));
};

/**
 * Checks collisions between the character and enemies.
 * @returns {void}
 */
World.prototype.checkCharacterEnemyCollisions = function () {
  this.level.enemies.forEach((enemy) => {
    if (enemy.removeFromWorld) return;
    if (enemy.isHittable === false) return;
    if (enemy.isDead && enemy.isDead()) return;
    if (!this.character.isColliding(enemy)) return;

    if (this.canStompEnemy(enemy)) {
      this.stompEnemy(enemy);
    } else {
      this.damageCharacter(enemy);
    }
  });
};

/**
 * Applies stomp damage to a stompable enemy.
 * @param {MovableObjects} enemy Enemy hit from above.
 * @returns {void}
 */
World.prototype.stompEnemy = function (enemy) {
  if (typeof enemy.takeDamage === "function") {
    enemy.takeDamage(enemy.energy);
  }
  enemy.isHittable = false;
  this.character.speedY = 10;
  this.character.lastStompTime = Date.now();
};

/**
 * Checks whether an enemy can be defeated by the current jump collision.
 * @param {MovableObjects} enemy Enemy being collided with.
 * @returns {boolean} True when the enemy can be stomped.
 */
World.prototype.canStompEnemy = function (enemy) {
  if (Date.now() - this.character.lastStompTime < 200) return false;
  if (!this.isJumpKillable(enemy)) return false;
  if (!this.isCharacterFalling()) return false;
  if (!this.isCharacterAboveEnemy(enemy)) return false;
  return true;
};

/**
 * Checks whether an enemy type is vulnerable to jump attacks.
 * @param {MovableObjects} enemy Enemy to inspect.
 * @returns {boolean} True for stompable enemies.
 */
World.prototype.isJumpKillable = function (enemy) {
  return enemy instanceof Chicken || enemy instanceof SmallChicken;
};

/**
 * Checks whether the character is moving downward.
 * @returns {boolean} True when the character is falling.
 */
World.prototype.isCharacterFalling = function () {
  return this.character.speedY < 0;
};

/**
 * Checks whether the character is above an enemy's hit zone.
 * @param {MovableObjects} enemy Enemy being collided with.
 * @returns {boolean} True when the character is above the enemy.
 */
World.prototype.isCharacterAboveEnemy = function (enemy) {
  const characterBottom = this.character.y + this.character.height - this.character.offset.bottom;
  const enemyTop = enemy.y + enemy.offset.top;
  return characterBottom < enemyTop + 35;
};

/**
 * Applies enemy contact damage to the character.
 * @param {MovableObjects} enemy Enemy that touched the character.
 * @returns {void}
 */
World.prototype.damageCharacter = function (enemy) {
  if (Date.now() - this.character.lastStompTime < 500) return;
  if (this.character.isHurt()) return;

  const damage = enemy instanceof Endboss ? enemy.contactDamage : 20;
  this.character.hit(damage);
  sounds.play("hurt");
  this.statusBar.setPercentage(this.character.energy);
};

/**
 * Throws a bottle when input, cooldown, and inventory allow it.
 * @returns {void}
 */
World.prototype.checkThrowObjects = function () {
  if (!this.keyboard.D) return;
  if (!this.canThrowBottle()) return;
  if (this.character.bottles <= 0) return;

  this.throwBottle();
};

/**
 * Checks the bottle throw cooldown.
 * @returns {boolean} True when another bottle can be thrown.
 */
World.prototype.canThrowBottle = function () {
  return Date.now() - this.lastThrowTime > 800;
};

/**
 * Creates and launches a new throwable bottle.
 * @returns {void}
 */
World.prototype.throwBottle = function () {
  this.character.bottles -= 1;
  this.updateBottleBarAfterThrow();

  const bottle = new ThrowableObject(
    this.getBottleStartX(),
    this.getBottleStartY(),
    this.character.otherDirection,
  );

  this.throwableObjects.push(bottle);
  this.lastThrowTime = Date.now();
};

/**
 * Calculates the throw origin on the x-axis.
 * @returns {number} Bottle start x-coordinate.
 */
World.prototype.getBottleStartX = function () {
  return this.character.otherDirection ? this.character.x + 20 : this.character.x + 60;
};

/**
 * Calculates the throw origin on the y-axis.
 * @returns {number} Bottle start y-coordinate.
 */
World.prototype.getBottleStartY = function () {
  return this.character.y + 90;
};

/**
 * Reduces the bottle status bar after throwing.
 * @returns {void}
 */
World.prototype.updateBottleBarAfterThrow = function () {
  this.bottleStatusBar.percentage = Math.max(0, this.bottleStatusBar.percentage - 20);
  this.bottleStatusBar.setPercentage(this.bottleStatusBar.percentage);
};

/**
 * Collects coins that collide with the character.
 * @returns {void}
 */
World.prototype.checkCoinCollision = function () {
  this.level.coins = this.level.coins.filter((coin) => {
    if (!this.character.isColliding(coin)) return true;
    this.collectCoin();
    return false;
  });
};

/**
 * Adds one coin reward to the character and HUD.
 * @returns {void}
 */
World.prototype.collectCoin = function () {
  sounds.play("coin");
  this.character.coins += 10;
  this.coinStatusBar.percentage = Math.min(100, this.coinStatusBar.percentage + 10);
  this.coinStatusBar.setPercentage(this.coinStatusBar.percentage);
};

/**
 * Collects bottles that collide with the character.
 * @returns {void}
 */
World.prototype.checkBottleCollision = function () {
  this.level.bottles = this.level.bottles.filter((bottle) => {
    if (!this.character.isColliding(bottle)) return true;
    this.collectBottle();
    return false;
  });
};

/**
 * Adds one bottle to the character and HUD.
 * @returns {void}
 */
World.prototype.collectBottle = function () {
  sounds.play("bottlePickup");
  this.character.bottles += 1;
  this.bottleStatusBar.percentage = Math.min(100, this.bottleStatusBar.percentage + 20);
  this.bottleStatusBar.setPercentage(this.bottleStatusBar.percentage);
};

/**
 * Checks every active bottle against enemies.
 * @returns {void}
 */
World.prototype.checkThrowableObjectHits = function () {
  this.throwableObjects.forEach((bottle) => {
    if (bottle.hasHit) return;
    this.checkBottleHitEnemies(bottle);
  });
};

/**
 * Checks one bottle against all enemies.
 * @param {ThrowableObject} bottle Bottle being checked.
 * @returns {void}
 */
World.prototype.checkBottleHitEnemies = function (bottle) {
  this.level.enemies.forEach((enemy) => {
    if (bottle.hasHit) return;
    if (!bottle.isColliding(enemy)) return;
    this.handleBottleHit(enemy, bottle);
  });
};

/**
 * Applies bottle hit effects to an enemy and the bottle.
 * @param {MovableObjects} enemy Enemy hit by a bottle.
 * @param {ThrowableObject} bottle Bottle that caused the hit.
 * @returns {void}
 */
World.prototype.handleBottleHit = function (enemy, bottle) {
  bottle.hasHit = true;
  bottle.readyToRemove = true;
  bottle.stopThrow();

  if (typeof enemy.takeDamage === "function") {
    enemy.takeDamage(bottle.damage);
    sounds.play("deadenemie");
  }
};

/**
 * Removes bottles marked for cleanup.
 * @returns {void}
 */
World.prototype.removeUsedBottles = function () {
  this.throwableObjects = this.throwableObjects.filter((bottle) => !bottle.readyToRemove);
};

/**
 * Removes enemies marked for cleanup.
 * @returns {void}
 */
World.prototype.removeDeadEnemies = function () {
  this.level.enemies = this.level.enemies.filter((enemy) => !enemy.removeFromWorld);
};
