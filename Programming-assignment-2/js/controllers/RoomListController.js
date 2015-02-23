ChatterClient.controller("RoomListController", ['$scope', '$location', '$rootScope', '$routeParams', '$modal', 'socket',
function ($scope, $location, $rootScope, $routeParams, $modal, socket) {
	$scope.currentUser = $routeParams.user;
	$scope.errorMessage = "";
	$scope.displayError = false;
	

	socket.emit("rooms");
	socket.on("roomlist", function (roomList) {
		$scope.roomList = Object.keys(roomList);
	});

	$scope.joinRoom = function(room) {		
		var modalInstance = $modal.open({
			templateUrl: 'modal_templates/joinroom.html',
			controller: 'JoinRoomCtrl',
			resolve: {
				room: function() {
					return room;
				}
			}
		});

		modalInstance.result.then(function (roomname) {
			$location.path("/room/" + $scope.currentUser + "/" + roomname);
		}, function () {
			// User cancelled
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
