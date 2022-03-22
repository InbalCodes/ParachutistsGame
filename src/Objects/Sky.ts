import GameObject from "/src/GameObject"

export default class Sky extends GameObject {
	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
	}
	
	draw(canvasEl: HTMLCanvasElement) {
		super.drawImage(canvasEl, "sky-image");
	}
}