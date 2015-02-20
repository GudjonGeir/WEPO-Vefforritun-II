ChatterClient.controller("RoomListController", ['$scope', '$location', '$rootScope', '$routeParams', '$modal', 'socket',
function ($scope, $location, $rootScope, $routeParams, $modal, socket) {
	var joinObj;

	$scope.currentUser = $routeParams.user;
	$scope.errorMessage = "";
	$scope.displayError = false;
	

	socket.emit("rooms");
	socket.on("roomlist", function (roomList) {
		$scope.roomList = Object.keys(roomList);
	});

	$scope.joinRoom = function(room) {
		joinObj = { room: room };
		socket.emit('joinroom', joinObj, function (available, error) {
			if(available) {
				$location.path("/room/" + $scope.currentUser + "/" + room);
			}
			else {
				// TODO: error message
				// $scope.errorMessage = error;
				// $scope.displayError = true;
			}
		});
	};

	$scope.createRoom = function() {
		var modalInstance = $modal.open({
			templateUrl: 'modal_templates/createroom.html',
			controller: 'CreateRoomCtrl'
		});

		modalInstance.result.then(function (newroomname, newroompassword) {
			$location.path("/room/" + $scope.currentUser + "/" + newroomname);


		}, function () {
			// User cancelled
		});
	};
}]);
