var ChatterClient = angular.module("ChatterClient", ['ngRoute']);

ChatterClient.config(
	function ($routeProvider) {
		$routeProvider
			.when("/login", { templateUrl: "views/login.html", controller: "LoginController" })
			.when("/roomlist/:user", {templateUrl: "views/rooms.html", controller: "RoomListController" })
			.otherwise({
				redirectTo: "/login"
			});
	});

ChatterClient.controller("LoginController", function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.username = "";
	$scope.errorMessage = "";
	$scope.displayError = false;
	$scope.login = function() {
		if ($scope.username === "") {
			$scope.errorMessage = "Please choose a username";
			$scope.displayError = true;
		}
		else {
			socket.emit('adduser', $scope.username, function (available) {
				if (available) {
					$location.path("/roomlist/" + $scope.username);
				}
				else {
					$scope.errorMessage = "Selected username is already taken";
					$scope.displayError = true;
				}
			});
		}
	};
});

ChatterClient.controller("RoomListController", function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.currentUser = $routeParams.user;
	socket.emit("rooms");
	socket.on("roomlist", function (roomList) {
		$scope.roomList = roomList;
	});
});