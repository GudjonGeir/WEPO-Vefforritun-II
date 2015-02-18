var ChatterClient = angular.module("ChatterClient", ['ngRoute']);

ChatterClient.config(
	function ($routeProvider) {
		$routeProvider
			.when("/login", { templateUrl: "views/login.html", controller: "LoginController" })
			.when("/roomlist/:user", { templateUrl: "views/rooms.html", controller: "RoomListController" })
			.when("/room/:user/:roomId", { templateUrl: "views/room.html", controller: "RoomController" })
			.otherwise({
				redirectTo: "/login"
			});
	});

ChatterClient.controller("LoginController", 
function ($scope, $location, $rootScope, $routeParams, socket) {
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

ChatterClient.controller("RoomController", 
function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.roomName = $routeParams.roomId;
	$scope.displayError = false;

	var obj = {
		room : $routeParams.roomId,
		pass : ""
	};

	socket.emit("joinroom", obj, function (accepted, errorMessage) {
		if (!accepted) {
			$scope.displayError = true;
			$scope.errorMessage = errorMessage;
		}
		
		socket.on('updatechat', function (room, messageHistory){
			$scope.messages = messageHistory;
		});
	});
	
	$scope.down = function(e) {
		console.log(e.srcElement);
      
      	if (e.keyCode === 13) {
        	$scope.addMsg();
      	}
	};

	$scope.addMsg = function() {
		if($scope.msg === ""){
			//$scope.errorMessage = "Say sumthin";
			//$scope.displayError = true;
		} else {
			var data = {
				msg : $scope.msg,
				roomName : $scope.roomName
			};
			socket.emit('sendmsg', data);
		}
		$scope.msg = "";
	};

});

ChatterClient.controller("RoomListController", 
function ($scope, $location, $rootScope, $routeParams, socket) {

	$scope.currentUser = $routeParams.user;
	$scope.errorMessage = "";
	$scope.displayError = false;
	var joinObj;

	socket.emit("rooms");
	socket.on("roomlist", function (roomList) {
		$scope.roomList = Object.keys(roomList);
	});

	$scope.addRoom = function() {
		if($scope.newRoom === "") {
			$scope.errorMessage = "Please choose a room name";
			$scope.displayError = true;
		}
		else {
			if($scope.newPass === ""){
				joinObj = {room : $scope.newRoom};
			} else {
				joinObj = {room : $scope.newRoom, pass : $scope.newPass};
			}
			socket.emit('joinroom', joinObj, function(available) {
				if(available) {
					$location.path("/room/" + $scope.currentUser + "/" + $scope.newRoom);
				}
				else {
					$scope.errorMessage = "HerpaDerp";
					$scope.displayError = true;
				}

			});
		}
	};
});