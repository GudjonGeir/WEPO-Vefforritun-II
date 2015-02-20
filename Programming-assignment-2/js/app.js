var ChatterClient = angular.module("ChatterClient", ['ngRoute', 'ui.bootstrap', 'luegg.directives']);


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

	$scope.down = function(e) {      
      	if (e.keyCode === 13) {
        	$scope.login();
      	}
	};

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
function ($scope, $location, $rootScope, $routeParams, socket, $modal) {
	$scope.newmsg = "";
	$scope.roomName = $routeParams.roomId;
	$scope.glued = true;

	var data, obj, roomtemp;

	$scope.newmsg = "";
	$scope.roomName = $routeParams.roomId;
	roomtemp = $routeParams.roomId;
	obj = {
		room : $routeParams.roomId,
		pass : ""
	};

	socket.on('updatechat', function (room, messageHistory){
		$scope.messages = messageHistory;
		$scope.glued = true;
	});


	socket.on('updateusers', function (room, users, ops) {
		$scope.users = users;
		$scope.ops = ops;
	});


	socket.on('servermessage', function (event, room, username) {
		if (event === "join") {
			data = {
				msg: username + " has joined the channel",
				roomName: room
			};
			socket.emit('sendmsg', data);
		} else if(event === "part") {
			data = {
				msg: username + " has decided to leave :/",
				roomName: room
			};
			socket.emit('sendmsg', data);
		}
	});

	socket.on('kicked', function (room, toBeKicked, Kicker) {
		if($routeParams.user === toBeKicked){
			$location.path("/roomlist/" + $routeParams.user);
		} 
	});

	socket.on('deop', function (room, toBeDOp, DOpper) {
		if(DOpper !== toBeDOp){
			var data = {
				msg: "Hey i was promoted by " + DOpper + " :(",
				roomName: room
			};
			socket.emit('sendmsg', data);
		}
	});

	socket.on('opped', function (room, toBeOp, Opper) {
		if(Opper !== toBeOp){
			var data = {
				msg: "Hey i was promoted by " + Opper + ", thank you!",
				roomName: room
			};
			socket.emit('sendmsg', data);
		}
	});

	// users[msgObj.nick].socket.emit('recv_privatemsg', socket.username, msgObj.message);

	socket.on('recv_privatemsg', function (from, recievedMsg) {
		var modalInstance = $modal.open({
			templateUrl: 'modal_templates/getpmsg.html',
			controller: 'GetPrivateMessageCtrl',
			resolve: {
				sender: function() {
					return from;
				},
				message: function() {
					return recievedMsg;
				}
			}
		});

		modalInstance.result.then(function (sender) {
			$scope.pmsg(sender)


		}, function () {
			// User dismissed message
		});
	})
	

	$scope.$on("$destroy", function() {
		$scope.exit();
	});

	$scope.kick = function() {
		console.log($scope.toBeKicked);
		console.log($routeParams.roomId);
		if($scope.toBeKicked !== ""){
			var kickObj = {
				user: $scope.toBeKicked,
				room: $routeParams.roomId
			};
			socket.emit('kick', kickObj, function (available) {
				if(available){
					var data = {
						msg: $scope.toBeKicked + " has been kicked for bad behavior",
						roomName: kickObj.room
					};
					socket.emit('sendmsg', data);
				} else {
					console.log("oops");
				}
			});
		}
	};

	$scope.op = function() {
		if($scope.toBeOp !== ""){
			var opObj = {
				user: $scope.toBeOp,
				room: $routeParams.roomId
			};
			socket.emit('op', opObj, function(available) {
				if(available){
					console.log(opObj.user + "has been promoted");
				} else {
					console.log("op ooops");
				}
			});
		}
	};

	$scope.deop = function() {
		if($scope.toBeDOp !== ""){
			var opObj = {
				user: $scope.toBeDOp,
				room: $routeParams.roomId
			};
			socket.emit('deop', opObj, function(available) {
				if(available){
					console.log(opObj.user + "has been demoted");
				} else {
					console.log("deop ooops");
				}
			});
		}
	};

	$scope.exit = function() {
		socket.emit('partroom', roomtemp);
	};

	$scope.down = function(e) {      
      	if (e.keyCode === 13) {
        	$scope.addMsg();
      	}
	};

	$scope.addMsg = function() {
		if($scope.newmsg === ""){
		} 
		else {
			data = {
				msg : $scope.newmsg,
				roomName : $scope.roomName
			};
			socket.emit('sendmsg', data);
			$scope.newmsg = "";
		}
	};

	$scope.pmsg = function(toUser) {
		var modalInstance = $modal.open({
			templateUrl: 'modal_templates/sendpmsg.html',
			controller: 'SendPrivateMessageCtrl',
			resolve: {
				recepient: function() {
					return toUser;
				}
			}
		});
	};
});

ChatterClient.controller("RoomListController", 
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
});

ChatterClient.controller('CreateRoomCtrl', function ($scope, $modalInstance, socket) {
	var joinObj, path;
	$scope.displayError = false;
	$scope.errorMessage = "";

	$scope.newroomname = "";
	$scope.newroompassword = "";

	$scope.down = function(e) {      
      	if (e.keyCode === 13) {
        	$scope.ok();
      	}
	};


	$scope.ok = function () {
		if ($scope.newroomname === "") {
			$scope.errorMessage = "Please choose a room name";
			$scope.displayError = true;
		}
		else {
			if($scope.newroompassword === "") {
				joinObj = {room : $scope.newroomname};
			} 
			else {
				joinObj = {room : $scope.newroomname, pass : $scope.newroompassword};
			}
			socket.emit('joinroom', joinObj, function (available, error) {
				if(available) {
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

ChatterClient.controller('SendPrivateMessageCtrl', function ($scope, $modalInstance, socket, recepient) {
	var data;
	$scope.recepient = recepient;
	$scope.pmessage = "";
	$scope.displayError = false;
	$scope.errorMessage = "";

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
});

ChatterClient.controller('GetPrivateMessageCtrl', function ($scope, $modalInstance, socket, sender, message) {
	$scope.sender = sender;
	$scope.message = message;

	$scope.reply = function() {
		$modalInstance.close(sender);
	}

	$scope.dismiss = function() {
		$modalInstance.dismiss('cancel');
	}
});
