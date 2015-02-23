ChatterClient.controller("RoomListController", ['$scope', '$location', '$rootScope', '$routeParams', '$modal', 'socket',
function ($scope, $location, $rootScope, $routeParams, $modal, socket) {
	$scope.loggedIn = true;
	$scope.currentUser = $routeParams.user;
	$scope.errorMessage = "";
	$scope.displayError = false;

	socket.emit('users');

	//updates the userlist, if a new users signs in the list gets updated
	socket.on('userlist', function (userlist) {
		$scope.users = userlist;
	});
	

	socket.emit("rooms");

	//updates the roomlist
	socket.on("roomlist", function (roomList) {
		$scope.roomList = Object.keys(roomList);
	});

	//open joinroom dialog
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

	//opens createroom dialog
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

	//logs out the user
	$scope.logOut = function() {
		socket.emit('disconnect');
		$location.path('/login');
	};
}]);
