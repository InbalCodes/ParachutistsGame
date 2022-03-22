import GameObject from "/src/GameObject"

export default class Parachute extends GameObject {
	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
	}
	
	draw(canvasEl: HTMLCanvasElement) {
		super.drawImage(canvasEl, "parachute-image");
	}
	
	move(parachuteSpeed: number) {
		this.y = this.y + parachuteSpeed;
	}
}