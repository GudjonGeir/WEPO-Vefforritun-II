
window.Sfx = (function() {
	'use strict';

	//TODO: Delete this file and move logic to controls

	var Sfx = function() {
		this.mute = false;
		this.flap = $('.Flap');
		this.sound = $('.Audio');
	};

	Sfx.prototype.flap = function() {
		//this.flap.trigger('play');
		console.log('FLAP');
		$('.Flap').trigger('play');
		return false;
	};


	$('.mute-btn').click(function(){
		// Do something here!
		if(this.mute){
			this.mute = false;
			$('.Audio').trigger('play');
		}
		else{
			this.mute = true;
			$('.Audio').trigger('pause');
		}
		
		//var audio = $('.Audio');
		//console.log('audio.muted: ');
		//console.log($('.Audio').muted);
	});

	

	// Export singleton.
	return new Sfx();
})();
