export default class InputState {
	boatSpeed: number;
	boatMovement: number;
    leftDown: Boolean;
    righDown: Boolean;
	
	constructor(boatSpeed: number) {
		this.boatSpeed = boatSpeed;
		this.boatMovement = 0;
        this.leftDown = false;
        this.righDown = false;
		
		window.addEventListener('keydown', this.keydownListener.bind(this));
		window.addEventListener('keyup', this.keyupListener.bind(this));
	}
	
	keydownListener(event) {
		if (event.code == "ArrowLeft") {
            this.leftDown = true;
			this.boatMovement = 0 - this.boatSpeed;
		} else if (event.code == "ArrowRight") {
            this.rightDown = true;
			this.boatMovement = this.boatSpeed;
		}
	}
	
	keyupListener(event) {
		if (event.code == "ArrowLeft") {
            this.leftDown = false;
            this.boatMovement = this.rightDown ? this.boatSpeed : 0;
		} else if (event.code == "ArrowRight") {
            this.rightDown = false;
			this.boatMovement = this.leftDown ? (0 - this.boatSpeed) : 0;
		}
	}
}
