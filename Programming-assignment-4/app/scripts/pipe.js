window.Pipe = (function() {
	'use strict';

	// All these constants are in em's, multiply by 10 pixels
	// for 640x420px canvas.
	var posArr = [-28.5, -24.85, -21.5, -17.85, -14.2, -10.55, -6.9, -3.25, 0.4];

	var SPEED = 30;// * 10 pixels per second
	var WIDTH = 16;
	//var HEIGHT = 30;
	var INITIAL_POSITION_X = 120;
	var INITIAL_POSITION_Y = posArr[3];
	

	var Pipe = function(el, game) {
		this.el = el;
		this.game = game;
		this.player = game.player;
		this.pos = { x: 0, y: 0 };
	};

	/**
	 * Resets the state of the Pipe for a new game.
	 */
	Pipe.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
	};

	Pipe.prototype.onFrame = function(delta, hasStarted) {
		if(hasStarted){
			this.pos.x -= delta * SPEED;
		}
		if(this.pos.x < -WIDTH ){
			//var newY = Math.floor(Math.random() * (this.game.WORLD_HEIGHT));
			var newY = posArr[Math.floor(Math.random() * posArr.length)];
			console.log(newY);
			this.pos.y = newY;
			this.pos.x = INITIAL_POSITION_X;
		}
		this.checkCollisionWithBounds();

		// Update UI
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Pipe.prototype.checkCollisionWithBounds = function() {

		/* TODO: Implement pipe hit detection */
		/* End game if player hits pipe */
		
		//if((this.player.pos.x + this.player.getWidth()) > this.pos.x){
		//	return this.game.gameover();
		//}

		/*if (this.pos.x + WIDTH < Player.pos.x ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT > this.game.WORLD_HEIGHT) {
			return this.game.gameover();
		}*/
	};

	return Pipe;

})();
