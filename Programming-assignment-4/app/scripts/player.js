window.Player = (function() {
	'use strict';

	var Controls = window.Controls;
	var Sfx = window.Sfx;
	console.log('CONTROLS');
	console.log(Controls);
	console.log('Sfx');
	console.log(Sfx);

	// All these constants are in em's, multiply by 10 pixels
	// for 640x420px canvas.
	//var SPEED = 30; // * 10 pixels per second
	//var GRAVITY = 30;
	//var JUMPHEIGHT = GRAVITY * 3;
	var WIDTH = 5;
	var HEIGHT = 5;
	var VERTSPEED = 0;
	var JUMPSPEED = 50;
	var GRAVITY = 250;


	// var INITIAL_POSITION_X = 30;
	// var INITIAL_POSITION_Y = 25;

	var Player = function(el, game) {
		console.log('player constructor');
		this.el = el;
		this.game = game;
		this.pos = { x: this.game.WORLD_WIDTH/2 - 8 , y: this.game.WORLD_HEIGHT/2 + 3};
		this.score = 0;
		// Contains number of jump events registered since the key was first pressed
		this.lastFrameKeyPressed = false;
		this.yb4 = this.pos.y;
		this.continuousJump = false;

		this.rotate = 15;
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
			// Check if the control keys or mouse is pressed
			if (Controls.isKeyPressed()) {
				// Check if the key was pressed in last frame
				// Assume fresh jump if not
				if(!this.lastFrameKeyPressed) {
					VERTSPEED = JUMPSPEED;
					this.lastFrameKeyPressed = true;
					this.yB4 = this.pos.y;
					$('.Flap').trigger('play');
				}

				// If the key was pressed in last frame, make sure it finishes 
				// the first jump and set continous jump on
				else if(this.yB4 < this.pos.y) {
					VERTSPEED = JUMPSPEED;
					this.continuousJump = true;
				}

				// If continous jump is on, go to the sky!
				else if(this.continuousJump) {
					VERTSPEED = JUMPSPEED;
				}

				// Upward motion, reset rotation
				this.rotate = 15;
			}

			// Reset jump settings
			else {
				this.lastFrameKeyPressed = false;
				this.continuousJump = false;

				// Only start rotating when jump is finished and rayman starts descending
				if (this.yB4 < this.pos.y) {
					this.rotate = Math.max((this.rotate -5), -30);
				}
			}

			/* Gravity */
			this.pos.y -= delta * VERTSPEED;
			if(VERTSPEED > -180){
				VERTSPEED -= GRAVITY * delta;
			}
		}
		this.checkCollisionWithBounds();

		// Update UI

		// var rotate;

		// if(VERTSPEED < -60){
		// 	rotate = -30;
		// }
		// else if(VERTSPEED < 0)
		// {
		// 	rotate = (VERTSPEED * 0.75);
		// }
		// else {
		// 	rotate = 15;
		// }


		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate(' + (-this.rotate) + 'deg)');


		/*if(VERTSPEED > 0){
			this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate(-10deg)');
		}
		else if(VERTSPEED < 0){
			this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em) rotate(10deg)');
		}
		else{
			this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
		}*/
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
		if (this.pos.y + HEIGHT > this.game.WORLD_HEIGHT - 12) {
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
