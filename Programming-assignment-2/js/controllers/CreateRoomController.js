ChatterClient.controller('CreateRoomCtrl', ['$scope', '$modalInstance', 'socket', function ($scope, $modalInstance, socket) {
	var joinObj, path;
	$scope.displayError = false;
	$scope.errorMessage = "";

	$scope.newroomname = "";
	$scope.newroompassword = "";

	$scope.down = function(e) {      
      	if (e.keyCode === 13) {
        	$scope.ok();
      	}
	};


	$scope.ok = function () {
		if ($scope.newroomname === "") {
			$scope.errorMessage = "Please choose a room name";
			$scope.displayError = true;
		}
		else {
			if($scope.newroompassword === "") {
				joinObj = {room : $scope.newroomname};
			} 
			else {
				joinObj = {room : $scope.newroomname, pass : $scope.newroompassword};
			}
			socket.emit('joinroom', joinObj, function (available, error) {
				if(available) {
					$modalInstance.close($scope.newroomname, $scope.newroompassword);
				}
				else {
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