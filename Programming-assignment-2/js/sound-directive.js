ChatterClient.directive('sound', [ 'socket', '$routeParams', function (socket, $routeParams) {
    return function ($scope, element, attrs) {
  		socket.on('updatechat', function(room, messageHistory){
  			console.log("K");
  			if(room === $routeParams.roomId){
				angular.element('.audio').append("<audio id='audio' autoplay='true'><source src='bling.mp3' type='audio/mpeg'></audio>");
				setTimeout(function(){
					angular.element('#audio').remove();
				}, 2000);
			}
		});
  	};
}]);