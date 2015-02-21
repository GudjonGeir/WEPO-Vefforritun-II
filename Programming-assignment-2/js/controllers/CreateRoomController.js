ChatterClient.controller('CreateRoomCtrl', ['$scope', '$modalInstance', 'socket', function ($scope, $modalInstance, socket) {
	var joinObj, path;
	$scope.focusOn = true;			
	$scope.displayError = false;
	$scope.errorMessage = "";

	$scope.newroomname = "";
	$scope.newroompassword = "";

	//When textbox is in focus and enter is pressed, $scope.ok() is called
	$scope.down = function(e) {     
      	if (e.keyCode === 13) {
        	$scope.ok();
      	}
	};

	//Tries to create a new chatRoom if sufficient information was given
	$scope.ok = function () {
		if ($scope.newroomname === "") {	//not enough information was given
			$scope.errorMessage = "Please choose a room name";
			$scope.displayError = true;
		}
		else {
			if($scope.newroompassword === "") {	//no need for secrecy
				joinObj = {room : $scope.newroomname};
			} 
			else {	//someone is shy
				joinObj = {room : $scope.newroomname, pass : $scope.newroompassword};
			}
			socket.emit('joinroom', joinObj, function (available, error) {	//request sent to server
				if(available) {	//create window instance is closed
					$modalInstance.close($scope.newroomname, $scope.newroompassword);
				}
				else {	//not enough information, display error
					$scope.errorMessage = error;
					$scope.displayError = true;
				}
			});
		}
	};
	
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);