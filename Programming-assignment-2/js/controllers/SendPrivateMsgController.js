ChatterClient.controller('SendPrivateMessageCtrl', ['$scope', '$modalInstance', 'socket', 'recepient',
function ($scope, $modalInstance, socket, recepient) {
	var data;
	$scope.recepient = recepient;
	$scope.pmessage = "";
	$scope.displayError = false;
	$scope.errorMessage = "";
	$scope.focusOn = true;

	// When the enter button is pressed; send message
	$scope.down = function(e) {     
      	if (e.keyCode === 13) {
        	$scope.send();
      	}
	};

	// Verifies something has been written in the text input then emits the data
	// callback function then closes the modal if the message was sent successfully or 
	// displays error if not
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

