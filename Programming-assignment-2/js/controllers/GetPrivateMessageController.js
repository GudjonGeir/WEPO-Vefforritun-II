ChatterClient.controller('GetPrivateMessageCtrl', ['$scope', '$modalInstance', 'socket', 'sender', 'message', function ($scope, $modalInstance, socket, sender, message) {
	$scope.sender = sender;
	$scope.message = message;

	
	$scope.reply = function() {
		$modalInstance.close(sender);
		$modalInstance.dismiss('cancel');
	};

	$scope.dismiss = function() {
		$modalInstance.dismiss('cancel');
	};
}]);

