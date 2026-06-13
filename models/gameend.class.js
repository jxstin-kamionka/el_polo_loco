class gameEnd extends DrawableObject {
  IMAGES_YOUWIN = [
    "../assets/img/You won, you lost/You win B.png",
    "../assets/img/You won, you lost/You won A.png",
  ];

  constructor() {
    super();
    this.loadImages(this.IMAGES_GAMEOVER);
    this.loadImages(this.IMAGES_YOUWIN);

    this.x = 0;
    this.y = 0;
    this.width = 750;
    this.height = 480;
  }

  showYouWin() {
    this.img = this.imageCache[this.IMAGES_YOUWIN[0]];
  }
}
