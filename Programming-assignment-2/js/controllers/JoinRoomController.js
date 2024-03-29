angular.module("ChatterClient").controller('JoinRoomCtrl', ['$scope', '$modalInstance', 'socket', 'room', function ($scope, $modalInstance, socket, room) {
	var joinObj;
	$scope.displayError = false;
	$scope.errorMessage = "";
	$scope.focusOn = true;

	$scope.roomname = room;
	$scope.roompassword = "";

	//fabulous enter function sends to ok()
	$scope.down = function(e) {      
      	if (e.keyCode === 13) {
        	$scope.ok();
      	}
	};

	//promps the user to type in password, even though password is not required
	$scope.ok = function () {
		if ($scope.roompassword === "") {
			joinObj = { room: room };
		}
		else {
			joinObj = { room: room, pass: $scope.roompassword };
		}
		socket.emit('joinroom', joinObj, function (available, error) {
			if(available) {
				$modalInstance.close($scope.roomname);
			}
			else {
				if(error === 'banned') {
					$scope.errorMessage = "You have been banned from " + room;
					$scope.displayError = true;					
				} else if(error === 'wrong password'){
					$scope.errorMessage = "The password you typed for " + room + " does not match the required password ";
					$scope.displayError = true;		
				}
			}
		});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);