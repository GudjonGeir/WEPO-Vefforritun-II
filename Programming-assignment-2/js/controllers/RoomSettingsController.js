ChatterClient.controller("RoomSettingsCtrl", ['$scope', '$location', '$rootScope', '$routeParams', '$modal', 'socket', 'room',
function ($scope, $location, $rootScope, $routeParams, $modal, socket, room) {
	socket.emit('users');
	socket.on('userlist', function (userlist) {
		$scope.users = Object.keys(userlist).map(function (key) {return userlist[key];});
	});
	$scope.room = room;
	$scope.user = {};
	// $scope.currentUser = $routeParams.user;
	// $scope.errorMessage = "";
	// $scope.displayError = false;
	

	// socket.emit("rooms");
	// socket.on("roomlist", function (roomList) {
	// 	$scope.roomList = Object.keys(roomList);
	// });

	// $scope.joinRoom = function(room) {
	// 	var modalInstance = $modal.open({
	// 		templateUrl: 'modal_templates/joinroom.html',
	// 		controller: 'JoinRoomCtrl',
	// 		resolve: {
	// 			room: function() {
	// 				return room;
	// 			}
	// 		}
	// 	});

	// 	modalInstance.result.then(function (roomname) {
	// 		$location.path("/room/" + $scope.currentUser + "/" + roomname);
	// 	}, function () {
	// 		// User cancelled
	// 	});
	// };

	// $scope.createRoom = function() {
	// 	var modalInstance = $modal.open({
	// 		templateUrl: 'modal_templates/createroom.html',
	// 		controller: 'CreateRoomCtrl'
	// 	});

	// 	modalInstance.result.then(function (newroomname, newroompassword) {
	// 		$location.path("/room/" + $scope.currentUser + "/" + newroomname);


	// 	}, function () {
	// 		// User cancelled
	// 	});
	// };
}]);