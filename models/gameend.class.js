class gameEnd extends DrawableObject {
  IMAGES_GAMEOVER = [
    "../assets/img/You won, you lost/Game over A.png",
    "../assets/img/You won, you lost/You lost b.png",
  ];

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

    this.showGameOver();
  }

  showGameOver() {
    this.img = this.imageCache[this.IMAGES_GAMEOVER[0]];
  }

  showYouWin() {
    this.img = this.imageCache[this.IMAGES_YOUWIN[0]];
  }
}
