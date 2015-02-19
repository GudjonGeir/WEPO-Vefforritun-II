var ChatterClient = angular.module("ChatterClient", ['ngRoute', 'ui.bootstrap']);

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
	var data, obj;
	$scope.newmsg = "";
	$scope.roomName = $routeParams.roomId;


	obj = {
		room : $routeParams.roomId,
		pass : ""
	};



	socket.on('updatechat', function (room, messageHistory){
		$scope.messages = messageHistory;
	});

	socket.on('updateusers', function (room, users, ops) {
		$scope.users = users;
	});

	console.log("roomctrl");

	socket.on('servermessage', function (event, room, username) {
		if (event === "join") {
			data = {
				msg: username + " has joined the channel",
				roomName: room
			};
			socket.emit('sendmsg', data);
		} 
	});
	


	$scope.down = function(e) {      
      	if (e.keyCode === 13) {
      		console.log(e.keyCode);
        	$scope.addMsg();
      	}
	};

	$scope.addMsg = function() {
		if($scope.newmsg === ""){
			console.log("sd;f");
		} 
		else {
			data = {
				msg : $scope.newmsg,
				roomName : $scope.roomName
			};
			console.log(data);
			socket.emit('sendmsg', data);
			$scope.newmsg = "";
		}
	};
});

ChatterClient.controller("RoomListController", 
function ($scope, $location, $rootScope, $routeParams, $modal, socket) {

	$scope.currentUser = $routeParams.user;
	$scope.errorMessage = "";
	$scope.displayError = false;
	

	socket.emit("rooms");
	socket.on("roomlist", function (roomList) {
		$scope.roomList = Object.keys(roomList);
	});

	$scope.createRoom = function () {
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
});

ChatterClient.controller('CreateRoomCtrl', function ($scope, $modalInstance, socket) {
	var joinObj, path;
	$scope.displayError = false;
	$scope.errorMessage = "";

	$scope.newroomname = "";
	$scope.newroompassword = "";

	$scope.ok = function () {
		if ($scope.newroomname === "") {
			$scope.errorMessage = "Please choose a room name";
			$scope.displayError = true;
		}
		else {
			if($scope.newPass === "") {
				joinObj = {room : $scope.newroomname};
			} 
			else {
				joinObj = {room : $scope.newroomname, pass : $scope.newroompassword};
			}
			socket.emit('joinroom', joinObj, function (available, error) {
				if(available) {
					path = "/room/" + $scope.currentUser + "/" + $scope.newRoom;
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
});
