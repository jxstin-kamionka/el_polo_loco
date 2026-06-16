/**
 * Draws the full world and schedules the next frame while the game is active.
 * @returns {void}
 */
World.prototype.draw = function () {
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
};

/**
 * Draws a list of drawable objects.
 * @param {DrawableObject[]} objects Objects to render.
 * @returns {void}
 */
World.prototype.addObjectToMap = function (objects) {
  objects.forEach((object) => this.addToMap(object));
};

/**
 * Draws one object and mirrors it when it faces left.
 * @param {DrawableObject} movableObject Object to render.
 * @returns {void}
 */
World.prototype.addToMap = function (movableObject) {
  if (movableObject.otherDirection) this.flipImage(movableObject);
  movableObject.draw(this.ctx);
  if (movableObject.otherDirection) this.flipImageBack(movableObject);
};

/**
 * Mirrors the canvas for a left-facing sprite.
 * @param {DrawableObject} movableObject Object being rendered.
 * @returns {void}
 */
World.prototype.flipImage = function (movableObject) {
  this.ctx.save();
  this.ctx.translate(movableObject.width, 0);
  this.ctx.scale(-1, 1);
  movableObject.x = movableObject.x * -1;
};

/**
 * Restores the canvas after drawing a mirrored sprite.
 * @param {DrawableObject} movableObject Object that was rendered.
 * @returns {void}
 */
World.prototype.flipImageBack = function (movableObject) {
  this.ctx.restore();
  movableObject.x = movableObject.x * -1;
};
