import GameConfig from "/src/GameConfig"
import InputState from "/src/InputState"
import GameStatus from "/src/GameStatus"
import Sky from "/src/Objects/Sky"
import Sea from "/src/Objects/Sea"
import Boat from "/src/Objects/Boat"
import Plane from "/src/Objects/Plane"
import Parachute from "/src/Objects/Parachute"

export default class Game {
	GameConfig config;
	HTMLCanvasElement canvasEl;
	InputState input;
	GameStatus status;
	
	Sky sky;
	Sea sea;
	Boat boat;
	Plane plane;
	Parachute[] parachutes;
	
	nextParachuteMillis: number;
	gameInterval: number;
	
	constructor(config: GameConfig, canvasEl: HTMLCanvasElement) {
		this.config = config;
		this.canvasEl = canvasEl;
		this.input = new InputState(config.boatSpeed);
		
		this.canvasEl.width = config.gameWidth;
		this.canvasEl.height = config.gameHeight;
		
		this.status = new GameStatus(config.maxLives, config.pointsPerParachute);
		
		this.sky = new Sky(
				0, 
				0, 
				config.gameWidth, 
				config.gameHeight - config.seaHeight);
		
		this.sea = new Sea(
				0, 
				config.gameHeight - config.seaHeight - config.wavesHeight, 
				config.gameWidth, 
				config.seaHeight + config.wavesHeight);
		
		this.boat = new Boat(
				(config.gameWidth / 2) - (config.boatWidth / 2), 
				config.gameHeight - config.seaHeight - config.boatHeight,
				config.boatWidth,
				config.boatHeight);
		
		this.plane = new Plane(
				config.gameWidth - config.planeWidth,
				config.planeGap,
				config.planeWidth,
				config.planeHeight);
		
		this.parachutes = [];
		
		this.scheduleNextParachuteDrop();
	}
	
	restart() {
		let newGame = new Game(this.config, this.canvasEl);
		newGame.start();
	}
	
	start() {
		this.gameInterval = setInterval(this.refreshGame.bind(this), this.config.gameRefreshRate);
	}
	
	refreshGame() {
		let owner = this;
		
		if (this.shouldDropParachute()) {
			this.dropParachute();
			this.scheduleNextParachuteDrop();
		}
		
		this.boat.move(this.input.boatMovement, this.config.gameWidth);
		this.plane.move(this.config.planeSpeed, this.config.gameWidth);
		this.parachutes.forEach((parachute) => { parachute.move(owner.config.parachuteSpeed) });
		
		this.calculateParachutesHits();
		
		this.sky.draw(this.canvasEl);
		this.sea.draw(this.canvasEl);
		this.boat.draw(this.canvasEl);
		this.plane.draw(this.canvasEl);
		this.parachutes.forEach((parachute) => { parachute.draw(owner.canvasEl) });
		this.status.draw(this.canvasEl, 50, 50);
	}
	
	scheduleNextParachuteDrop() {
		let parachuteDropRangeMillis = this.config.parachuteDropMaxMillis - this.config.parachuteDropMinMillis;
		let relativeNextParachuteMillis = this.config.parachuteDropMinMillis + Math.floor(Math.random() * Math.floor(parachuteDropRangeMillis));
		let nowMillis = new Date().getTime();
		
		this.nextParachuteMillis = nowMillis + relativeNextParachuteMillis;
	}
	
	shouldDropParachute() {
		let nowMillis = new Date().getTime();
        
		if (this.nextParachuteMillis > nowMillis) {
            return false;
        }
        
        if (!this.plane.isPlaneFullyInBoard(this.config.gameWidth)) {
            this.scheduleNextParachuteDrop();
            return false;
        } 
        
        return true;
	}
	
	dropParachute() {
		let parachute = this.plane.dropParachute(this.config.parachuteWidth, this.config.parachuteHeight);
		this.parachutes.push(parachute);
	}
	
	calculateParachutesHits() {
		let index = 0;
		
		while (index < this.parachutes.length) {
			let parachute = this.parachutes[index];
			
			if (this.boat.intersect(parachute)) {
				this.status.hitBoat();
				this.parachutes.splice(index, 1);
				continue;
			}
			
			if (this.sea.intersect(parachute)) {
				if (this.status.hitSea()) {
					clearInterval(this.gameInterval);
					alert("Game Over!");
					this.restart();
				}
				
				this.parachutes.splice(index, 1);
				continue;
			}
			
			index++;
		}
	}
}