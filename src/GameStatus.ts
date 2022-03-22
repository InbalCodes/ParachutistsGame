export default class GameStatus {
	pointsPerParachute: number;
	remainingLives: number;
	scoreTotal: number;
	
	constructor(maxLives: number, pointsPerParachute: number) {
		this.pointsPerParachute = pointsPerParachute;
		this.remainingLives = maxLives;
		this.scoreTotal = 0;
	}
	
	hitBoat() {
		this.scoreTotal += this.pointsPerParachute;
	}
	
	hitSea() {
		this.remainingLives -= 1;
		return this.remainingLives <= 0;
	}
	
	draw(canvasEl: HTMLCanvasElement, x: number, y: number) {
		const context = canvasEl.getContext('2d');
		
		context.font = "20px Arial";
		context.fillText("Lives: " + this.remainingLives, x, y);
		context.fillText("Score: " + this.scoreTotal, x, y + 50);
	}
}
