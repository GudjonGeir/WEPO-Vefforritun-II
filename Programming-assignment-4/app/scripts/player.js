window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 640x420px canvas.
	//var SPEED = 30; // * 10 pixels per second
	//var GRAVITY = 30;
	//var JUMPHEIGHT = GRAVITY * 3;
	var WIDTH = 5;
	var HEIGHT = 5;
	var VERTSPEED = 0;
	var JUMPSPEED = 40;
	var GRAVITY = 250;

	// var INITIAL_POSITION_X = 30;
	// var INITIAL_POSITION_Y = 25;

	var Player = function(el, game) {
		console.log('player constructor');
		this.el = el;
		this.game = game;
		this.pos = { x: this.game.WORLD_WIDTH/2 - 8 , y: this.game.WORLD_HEIGHT/2 + 3};
		this.score = 0;
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function(game) {
		this.pos.x = game.WORLD_WIDTH/2 - 8;
		this.pos.y = game.WORLD_HEIGHT/2 + 3;
		this.score = 0;
		$('.Score').html(this.score);
	};

	Player.prototype.getWidth = function(){
		return WIDTH;
	};

	Player.prototype.getHeight = function(){
		return HEIGHT;
	};

	Player.prototype.onFrame = function(delta, hasStarted) {
		if(hasStarted){
			if (Controls.keys.up || Controls.keys.space) {
				VERTSPEED = JUMPSPEED;
			}
			
			/* Gravity */
			this.pos.y -= delta * VERTSPEED;
			VERTSPEED -= GRAVITY * delta;
			//console.log(vertSpeed);
		}
		
		this.checkCollisionWithBounds();

		// Update UI

		if(VERTSPEED > 0){
			this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate(-10deg)');
		}
		else if(VERTSPEED < 0){
			this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate(10deg)');
		}
		else{
			this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
		}
	};

/*method Update()
{
     if (PlayerTappedScreen)
     {
            vertSpeed = jumpSpeed;
     }
     Position.Y += vertSpeed * deltaTime;
     vertSpeed -= fallingConstant * deltaTime;
}*/
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
