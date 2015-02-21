ChatterClient.controller("RoomController", ['$scope', '$location', '$rootScope', '$routeParams', 'socket', '$modal',
function ($scope, $location, $rootScope, $routeParams, socket, $modal) {
	$scope.newmsg = "";
	$scope.roomName = $routeParams.roomId;
	$scope.glued = true;
	$scope.isOP = false;

	var data, roomobj, roomtemp;

	$scope.newmsg = "";
	$scope.roomName = $routeParams.roomId;
	roomtemp = $routeParams.roomId;

	roomobj = {
		room : $routeParams.roomId,
	};
	socket.emit('updateroom', roomobj);
	
	socket.on('updatechat', function (room, messageHistory){
		if(room === $routeParams.roomId){
			$scope.messages = messageHistory;
			$scope.glued = true;
		}
	});


	socket.on('updateusers', function (room, users, ops) {
		if(room === $routeParams.roomId){
			$scope.users = users;
			$scope.ops = ops;
			if (ops[$routeParams.user] === $routeParams.user) {
				$scope.isOP = true;
			}
		}
	});


	socket.on('servermessage', function (event, room, username) {
		if(room === $routeParams.roomId && username === $routeParams.user){
			var number = Math.floor((Math.random() * 4) + 1);
			var msg;
			// if(number === 1){
			// 	msg = "Hi " + username + ", welcome to " + room + " :)";
			// } else if(number === 2){
			// 	msg = "Hey guys! " + username + ", is here! :D";
			// } else if(number === 3){
			// 	msg = "Oh no," + username + " is here";
			// } else if(number === 4){
			// 	msg = "Bonjourno, Mr. " + username + " welcome to the family";
			// } 

			// if(username === $routeParams.user){
			// 	msg = "Thank you very much, I am honored to be a guest at " + room;
			// }

			if (event === "join") {
				data = {
					msg: "Hi y'all, I just entered " + room,
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
		}
	});

	socket.on('kicked', function (room, toBeKicked, Kicker) {
		if($routeParams.user === toBeKicked && room === $routeParams.roomId){
			$location.path("/roomlist/" + $routeParams.user);
		} 
	});

	socket.on('deop', function (room, toBeDOp, DOpper) {
		if(DOpper !== toBeDOp && room === $routeParams.roomId){
			var data = {
				msg: "Hey i was promoted by " + DOpper + " :(",
				roomName: room
			};
			socket.emit('sendmsg', data);
		}
	});

	socket.on('opped', function (room, toBeOp, Opper) {
		if(Opper !== toBeOp && room === $routeParams.roomId){
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
			$scope.pmsg(sender);


		}, function () {
			// User dismissed message
		});
	});
	

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

	$scope.settingsDialog = function () {
		var modalInstance = $modal.open({
			templateUrl: 'modal_templates/roomsettings.html',
			controller: 'RoomSettingsCtrl',
			resolve: {
				room: function() {
					return $scope.roomName;
				}
			}
		});
	};
}]);

// RoomController.$inject = ['$scope', '$location', '$rootScope', '$routeParams', 'socket', '$modal'];