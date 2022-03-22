import GameObject from "/src/GameObject"
import Parachute from "/src/Objects/Parachute"

export default class Plane extends GameObject {
	initialPlaneX: number;
	
	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
		this.initialPlaneX = x;
	}
	
	draw(canvasEl: HTMLCanvasElement) {
		super.drawImage(canvasEl, "plane-image");
	}
	
	move(planeSpeed: number, gameWidth: number) {
		this.x = this.x - planeSpeed;
		
		if (this.x < (0 - this.width)) {
			this.x = this.initialPlaneX + this.width;
		}
	}
	
	isPlaneFullyInBoard(gameWidth: number) {
		return this.x > this.width/2 && this.x < (gameWidth - this.width/2);
	}
	
	dropParachute(parachuteWidth: number, parachuteHeight: number) {
		return new Parachute(
			this.x + (this.width / 2) - (parachuteWidth / 2), 
			this.y + this.height,
			parachuteWidth,
			parachuteHeight);
	}
}