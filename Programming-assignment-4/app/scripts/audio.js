
window.Audio = (function() {
	'use strict';

	var Audio = function() {
		this.mute = false;
	};

	$('button.mute-btn').click(function(){
		// Do something here!
		console.log('MUTE');
	});

	

	
	// Export singleton.
	return new Audio();
})();
