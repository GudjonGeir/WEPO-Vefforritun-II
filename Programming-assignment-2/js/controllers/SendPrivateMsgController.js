ChatterClient.controller('SendPrivateMessageCtrl', ['$scope', '$modalInstance', 'socket', 'recepient',
function ($scope, $modalInstance, socket, recepient) {
	var data;
	$scope.recepient = recepient;
	$scope.pmessage = "";
	$scope.displayError = false;
	$scope.errorMessage = "";
	$scope.focusOn = true;

	$scope.down = function(e) {     
      	if (e.keyCode === 13) {
        	$scope.send();
      	}
	};

	$scope.send = function () {
		if ($scope.pmessage === "") {
			$scope.errorMessage = "Message field is empty";
			$scope.displayError = true;
		}
		else {
			data = {
				nick: recepient,
				message : $scope.pmessage
			};
			socket.emit('privatemsg', data, function (success) {
				if (!success) {
					$scope.errorMessage = "Could not send message";
					$scope.displayError = true;
				}
				else {
					$modalInstance.close();
				}
			});
		}
	};
	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};
}]);

