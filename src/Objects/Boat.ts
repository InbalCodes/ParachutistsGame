import GameObject from "/src/GameObject"

export default class Sea extends GameObject {
	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
	}
	
	draw(canvasEl: HTMLCanvasElement) {
		this.drawImage(canvasEl, "boat-image");
	}
	
	move(boatMovement: number, gameWidth: number) {
		if (boatMovement == 0) {
			return;
		}
		
		this.x = this.x + boatMovement;
		
		if (this.x > (gameWidth - this.width)) {
			this.x = (gameWidth - this.width);
		}
		
		if (this.x < 0) {
			this.x = 0;
		}
	}
}