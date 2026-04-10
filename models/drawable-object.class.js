class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 180;
  height = 200;
  width = 100;

  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  // drawFrame(ctx) {
  //   if (
  //     // this instanceof Character ||
  //     // this instanceof Chicken ||
  //     // this instanceof SmallChicken ||
  //     this instanceof Endboss
  //   ) {
  //     ctx.beginPath();
  //     ctx.lineWidth = 5;
  //     ctx.strokeStyle = "blue";
  //     ctx.strokeRect(this.x, this.y, this.width, this.height);
  //     ctx.stroke();
  //   }
  // }
  
  // drawFrameOffset(ctx) {
  //   if (
  //     // this instanceof Character ||
  //     // this instanceof Chicken ||
  //     // this instanceof SmallChicken ||
  //     this instanceof Endboss
  //   ) {
  //     ctx.beginPath();
  //     ctx.lineWidth = 5;
  //     ctx.strokeStyle = "red";
  //     ctx.strokeRect(
  //       this.x + this.offset.left,
  //       this.y + this.offset.top,
  //       this.width - this.offset.left - this.offset.right,
  //       this.height - this.offset.top - this.offset.bottom,
  //     );
  //     ctx.stroke();
  //   }
  // }
}
