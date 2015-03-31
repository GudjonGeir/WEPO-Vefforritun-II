window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	//var SPEED = 30; // * 10 pixels per second
	var GRAVITY = 30;
	var JUMPHEIGHT = GRAVITY * 3;
	var WIDTH = 8;
	var HEIGHT = 8;
	// var INITIAL_POSITION_X = 30;
	// var INITIAL_POSITION_Y = 25;

	var Player = function(el, game) {
		console.log('player constructor');
		this.el = el;
		this.game = game;
		this.pos = { x: this.game.WORLD_WIDTH/2 - 8 , y: this.game.WORLD_HEIGHT/2 + 3};
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function(game) {
		this.pos.x = game.WORLD_WIDTH/2 - 8;
		this.pos.y = game.WORLD_HEIGHT/2 + 3;
	};

	Player.prototype.getWidth = function(){
		return WIDTH;
	};

	Player.prototype.onFrame = function(delta, hasStarted) {
		if(hasStarted){
			if (Controls.keys.up || Controls.keys.space) {
				console.log('JIIMP');
				this.pos.y -= delta * JUMPHEIGHT;
			}
			
			/* Gravity */
			this.pos.y += delta * GRAVITY;
		}
		
		this.checkCollisionWithBounds();

		// Update UI
		this.el.css('transform', 'translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};


	Player.prototype.checkCollisionWithBounds = function() {
		/* We only have to end game if player hits ground */
		if (this.pos.y + HEIGHT > this.game.WORLD_HEIGHT) {
			return this.game.gameover();
		}
		/* old block of code
		if (this.pos.x < 0 ||
			this.pos.x + WIDTH > this.game.WORLD_WIDTH ||
			this.pos.y < 0 ||
			this.pos.y + HEIGHT > this.game.WORLD_HEIGHT) {
			return this.game.gameover();
		}*/
	};

	return Player;

})();
