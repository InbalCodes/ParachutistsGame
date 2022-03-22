export default abstract class GameObject {
	x: number;
	y: number;
	width: number;
	height: number;
	
	constructor(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
    
    drawImage(canvasEl: HTMLCanvasElement, imageId: String) {
		const context = canvasEl.getContext('2d');
		let elementImageEl = document.getElementById(imageId);
		
		context.drawImage(elementImageEl, this.x, this.y, this.width, this.height);
	}
	
	intersect(other) {
		return other.x + other.width > this.x && 
			other.x < this.x + this.width &&
			other.y + other.height > this.y &&
			other.y < this.y + this.height;
	}
}