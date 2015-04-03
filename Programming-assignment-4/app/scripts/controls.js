
window.Controls = (function() {
	'use strict';

	/**
	 * Key codes we're interested in.
	 */
	var KEYS = {
		32: 'space',
		38: 'up'
	};


	/**
	 * A singleton class which abstracts all player input,
	 * should hide complexity of dealing with keyboard, mouse
	 * and touch devices.
	 * @constructor
	 */
	var Controls = function() {
		this.keyPressed = false;
		this.keys = {};
		$(window)
			.on('keydown', this._onKeyDown.bind(this))
			.on('keyup', this._onKeyUp.bind(this))
			.on('touchstart mousedown', this._onMouseDown.bind(this))
			.on('touchend mouseup', this._onMouseUp.bind(this));
	};

	Controls.prototype._onKeyDown = function(e) {
		// Only jump if space wasn't pressed.
        // if (e.keyCode === 32 && (!this.keys.space && !this.keys.up)) {
        //     this._didJump = true;
        // }
		// Remember that this button is down.
		if (e.keyCode in KEYS) {
			this.keyPressed = true;
			var keyName = KEYS[e.keyCode];
			this.keys[keyName] = true;
			return false;
		}
	};

	Controls.prototype._onKeyUp = function(e) {
		if (e.keyCode in KEYS) {
			this.keyPressed = false;
			var keyName = KEYS[e.keyCode];
			this.keys[keyName] = false;
			return false;
		}
	};

	Controls.prototype._onMouseDown = function() {
		console.log('mousedown');
		this.keyPressed = true;
		this.keys.click = true;
		return false;
	};

	Controls.prototype._onMouseUp = function() {
		this.keyPressed = false;
		this.keys.click = false;
		return false;
	};

	/**
	 * Only answers true once until a key is pressed again.
	 */
	Controls.prototype.isKeyPressed = function() {
		return this.keyPressed;
	};

	
	// Export singleton.
	return new Controls();
})();
