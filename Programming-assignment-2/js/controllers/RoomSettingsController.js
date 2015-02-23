ChatterClient.controller("RoomSettingsCtrl", ['$scope', '$modalInstance', 'socket', 'room',
function ($scope, $modalInstance, socket, room) {

	// Use the 'users' listener to get a list of everyone logged into the chat application
	socket.emit('users');
	socket.on('userlist', function (userlist) {
		// Map the userlist to an array for select
		$scope.users = Object.keys(userlist).map(function (key) {return userlist[key];});
	});

	$scope.room = room;
	$scope.user = {};
	$scope.newtopic = "";
	$scope.newpassord = "";
	$scope.errorMessage = "";
	$scope.displayError = false;
	$scope.successMessage = "";
	$scope.displaySuccess = false;

	// For when the user presses enter
	$scope.settopicDown = function(e) {      
		if (e.keyCode === 13) {
			$scope.setTopic();
		}
	};

	// For when the user presses enter
	$scope.setpasswordDown = function(e) {      
		if (e.keyCode === 13) {
			$scope.setPassword();
		}
	};

	// When the user wants to set a new topic,
	// verify the input field is not empty and emit the data
	$scope.setTopic = function () {
		if ($scope.newtopic === "") {
			$scope.errorMessage = "Please choose a topic";
			$scope.displayError = true;
		}
		else {
			var topicObj = {
				room: room,
				topic: $scope.newtopic
			};
			socket.emit('settopic', topicObj, function (success) {
				if (success) {
					$scope.successMessage = "A new topic has successfully been set";
					$scope.displaySuccess = true;
					$scope.newtopic = "";
				}
				else {
					$scope.errorMessage = "Something went wrong";
					$scope.displayError = true;
				}
			});
		}
	};

	// When the user wants to set a new password,
	// verify the input field is not empty and emit the data
	$scope.setPassword = function () {
		if ($scope.newpassword === "") {
			$scope.errorMessage = "Please choose a password. If you want to remove the password use the given button";
			$scope.displayError = true;
		}
		else {
			var passwordObj = {
				room: room,
				password:  $scope.newpassword
			};
			socket.emit('setpassword', passwordObj, function (success) {
				if (success) {
					$scope.successMessage = "A new password has successfully been set";
					$scope.displaySuccess = true;
					$scope.newpassword = "";
				}
				else {
					$scope.errorMessage = "Something went wrong";
					$scope.displayError = true;
				}
			});
		}
	};

	// Remove password button
	$scope.removePassword = function () {
		var remObj = {
			room: room
		};
		socket.emit('removepassword', remObj, function (success) {
			if (success) {
				$scope.successMessage = "The password has been successfully removed";
				$scope.displaySuccess = true;
			}
			else {
				$scope.errorMessage = "Something went wrong";
				$scope.displayError = true;
			}
		});
	};

	// Various user privilege settings, the requested action recieved in parameter
	// and proceed accordingly.
	// Sends a message to the chatroom as op notifying everyone of the change
	$scope.userStatus = function (action) {
		var msg;
		var userObj = {
			user: $scope.user.selected,
			room: $scope.room
		};		
		socket.emit(action, userObj, function(success) {
			if(success){
				if(action === 'kick'){
					msg = $scope.user.selected + " has been kicked for bad behavior.";
					$scope.successMessage = "You have successfully kicked " + $scope.user.selected;
				}
				else if(action === 'op') {
					msg = $scope.user.selected + " has been promoted.";
					$scope.successMessage = "You have successfully promoted " + $scope.user.selected;
				}
				else if(action === 'deop') {
					msg = $scope.user.selected + " has been demoted.";
					$scope.successMessage = "You have successfully demoted " + $scope.user.selected;
				}
				else if(action === 'ban') {
					msg = $scope.user.selected + " has been banned from " + userObj.room + ".";
					$scope.successMessage = "You have successfully banned " + $scope.user.selected;
				}
				else if(action === 'unban') {
					msg = $scope.user.selected + " has been granted a second chance.";
					$scope.successMessage = "You have successfully unbanned " + $scope.user.selected;
				}
				else {
					msg = "wut?";
				}
				var data = {
					msg: msg,
					roomName: userObj.room
				};
				socket.emit('sendmsg', data);
				$scope.displaySuccess = true;
			} 
			else {
				$scope.errorMessage = "Something went wrong";
				$scope.displayError = true;
			}
		});
	};

	// Close modal button
	$scope.close = function() {
		$modalInstance.dismiss('cancel');
	};
}]);