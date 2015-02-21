ChatterClient.controller("LoginController", ['$scope', '$location', '$rootScope', '$routeParams', 'socket',
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
}]);

//LoginController.$inject = ['$scope', '$location', '$rootScope', '$routeParams', 'socket'];