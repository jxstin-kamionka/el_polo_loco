class Cloud extends MovableObjects {
    constructor() {
        super();
        this.loadImage("../assets/img/5_background/layers/4_clouds/1.png");
        this.x = 0 + Math.random() * 500;
        this.y = 20 + Math.random() * 100;
        this.height = 250;
        this.width = 350;

        this.animate();
    }

    animate() {
       this.moveLeft();
    }
}
