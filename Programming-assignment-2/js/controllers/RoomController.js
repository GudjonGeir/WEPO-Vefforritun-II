ChatterClient.controller("RoomController", ['$scope', '$location', '$rootScope', '$routeParams', 'socket', '$modal',
function ($scope, $location, $rootScope, $routeParams, socket, $modal) {
	$scope.newmsg = "";
	$scope.roomName = $routeParams.roomId;
	$scope.glued = true;
	$scope.focusOn = true;
	$scope.isOP = false;

	var data, roomobj, roomtemp;

	$scope.newmsg = "";
	$scope.roomName = $routeParams.roomId;
	roomtemp = $routeParams.roomId;

	roomobj = {
		room : $routeParams.roomId,
	};

	//created our own reciever in chatserver because of servermessage bug 
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
			else {
				$scope.isOP = false;
			}
		}
	});


	socket.on('servermessage', function (event, room, username) {
		if(room === $routeParams.roomId && username === $routeParams.user){
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

	socket.on('banned', function (room, toBeBanned, Banner) {
		if($routeParams.user === toBeBanned && $routeParams.user !== Banner && room === $routeParams.roomId){
			$location.path("/roomlist/" + $routeParams.user);
		} 
	});


	socket.on('kicked', function (room, toBeKicked, Kicker) {
		if($routeParams.user === toBeKicked && $routeParams.user !== Kicker && room === $routeParams.roomId){
			$location.path("/roomlist/" + $routeParams.user);
		} 
	});

	// socket.on('deop', function (room, toBeDOp, DOpper) {
	// 	if(DOpper !== toBeDOp && room === $routeParams.roomId){
	// 		var data = {
	// 			msg: "Hey i was promoted by " + DOpper + " :(",
	// 			roomName: room
	// 		};
	// 		socket.emit('sendmsg', data);
	// 	}
	// });

	// socket.on('opped', function (room, toBeOp, Opper) {
	// 	if(Opper !== toBeOp && room === $routeParams.roomId){
	// 		var data = {
	// 			msg: "Hey i was demoted by " + Opper + " :(",
	// 			roomName: room
	// 		};
	// 		socket.emit('sendmsg', data);
	// 	}
	// });


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