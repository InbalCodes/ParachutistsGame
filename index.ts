import Game from "/src/Game"
import GameConfig from "/src/GameConfig"

let canvasEl = document.getElementById("game");

let gameConfig = new GameConfig();
let game = new Game(gameConfig, canvasEl);

game.start();
