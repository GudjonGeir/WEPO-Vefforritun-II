window.Coin = (function() {
	'use strict';

	// All these constants are in em's, multiply by 10 pixels
	// for 640x420px canvas.
	var posArr = [0, 5, 10, 15, 20, 25, 30, 35, 40];

	var SPEED = 25;// * 10 pixels per second
	var WIDTH = 16;
	//var HEIGHT = 30;

	var INITIAL_POSITION_X = 51;
	var INITIAL_POSITION_Y = posArr[Math.floor(Math.random() * posArr.length)];

	

	var Coin = function(el, game) {
		this.el = el;
		this.game = game;
		this.player = game.player;
		this.pos = { x: 0, y: 0 };
	};

	/*
	 * Resets the state of the Coin for a new game.
	 */
	Coin.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
	};

	Coin.prototype.onFrame = function(delta, hasStarted) {
		if(hasStarted){
			this.pos.x -= delta * SPEED;
		}

		// Checks if the element has passed the left side of the game screen completely and respawns it on the right
		// side with a random y position from posArr
		if(this.pos.x < -WIDTH){
			//var newY = Math.floor(Math.random() * (this.game.WORLD_HEIGHT));
			var newY = posArr[Math.floor(Math.random() * posArr.length)];
			this.pos.y = newY;
			this.pos.x = INITIAL_POSITION_X;
		}
		this.updateScore();

		// Update UI
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Coin.prototype.updateScore = function() {
		var difx = Math.abs(this.player.pos.x - this.pos.x);
		var dify = Math.abs(this.player.pos.y - this.pos.y);
		if(difx < 4 && dify < 4) {
			console.log('COINS');
			this.player.score++;
			$('.Score').html(this.player.score);
			var newY = posArr[Math.floor(Math.random() * posArr.length)];
			this.pos.y = newY;
			this.pos.x = INITIAL_POSITION_X;
		}
	};

	return Coin;

})();
