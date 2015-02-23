ChatterClient.controller("RoomController", ['$scope', '$location', '$rootScope', '$routeParams', 'socket', '$modal',
function ($scope, $location, $rootScope, $routeParams, socket, $modal) {
	$scope.newmsg = "";
	$scope.roomName = $routeParams.roomId;
	$scope.glued = true;
	$scope.focusOn = true;
	$scope.isOP = false;

	var data, roomobj, roomtemp, usertemp;


	$scope.newmsg = "";
	$scope.roomName = $routeParams.roomId;
	roomtemp = $routeParams.roomId;
	usertemp = $routeParams.user;

	roomobj = {
		room : $routeParams.roomId,
	};

	// Called because an issue where the emits from the server after 'joinroom' where emitted to soon
	socket.emit('updateroom', roomobj);
	
	//listens for new messagehistory of room and updates the dialogue
	socket.on('updatechat', function (room, messageHistory){
		if(room === $routeParams.roomId){
			angular.element('.audio').append("<audio id='audio' autoplay='true'><source src='bling.mp3' type='audio/mpeg'></audio>");
			$scope.messages = messageHistory;
			$scope.glued = true;
		}
		setTimeout(function(){
			angular.element('#audio').remove();
		}, 2000);
	});


	//listens for any changes in the userlist of the room and
	//updates it if needed
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

	socket.on('updatetopic', function (room, topic, username) {
		// We changed the emit from settopic so that the username given is "op",
		// we did this to differentiate when it is emmited when a user joins (only 
		// that user gets the topic) and when the op sets a new topic (everyone gets the topic)
		if (room === roomtemp && (username === usertemp || username === "op")) {
			$scope.serverMSG = "Topic - " + topic;	
		}
	});


	//listens for the two events if a member of a room leaves or joins
	//and sends a message for that user introduction or outroduction
	socket.on('servermessage', function (event, room, username) {
		if(room === $routeParams.roomId){
			if (event === "join") {
				$scope.serverMSG = "Attention! - " + username + " has entered the room.";
			}
			else if (event === "part") {
				$scope.serverMSG = "Attention! - " + username + " has left the room.";
			}
			else if (event === "quit") {
				$scope.serverMSG = "Attention! - " + username + " has logged out.";
			}
		}
	});

	//listens for a banned event and checks if an operator wanted to ban this client
	//if so he is redirected to another room
	socket.on('banned', function (room, toBeBanned, Banner) {
		if($routeParams.user === toBeBanned && $routeParams.user !== Banner && room === $routeParams.roomId){
			$location.path("/roomlist/" + $routeParams.user);
		} 
	});

	//listens for a kicked event and checks if an operator wanted to ban this client
	//if so he is redirected to another room
	socket.on('kicked', function (room, toBeKicked, Kicker) {
		if($routeParams.user === toBeKicked && $routeParams.user !== Kicker && room === $routeParams.roomId){
			$location.path("/roomlist/" + $routeParams.user);
		} 
	});


	//if this client is ment to recieve a personal message for his eyes only
	//a modal will appear where he can choose to answer it or not. The message 
	//disappears into the void
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
	

	//if a user exits the room template he has parted the room
	//and therefore other users of room are informed of his abscense
	$scope.$on("$destroy", function() {
		socket.emit('partroom', roomtemp);
	});



	//fabulous enter function for shortening your chatting needs
	$scope.down = function(e) {      
      	if (e.keyCode === 13) {
        	$scope.addMsg();
      	}
	};

	//send message to chatroom
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


	//opens a private message dialog
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

	//opens the roomsetting dialog
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

	// Leave room button, emits the partroom message and reroutes the user
	$scope.leaveRoom = function() {
		socket.emit('partroom', roomtemp);
		$location.path('/roomlist/' + $routeParams.user);
	};

	// Log out button, emits the disconnect button and reroutes the user
	$scope.logOut = function() {
		socket.emit('disconnect');
		$location.path('/login');
	};
}]);

