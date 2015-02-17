var ChatterClient = angular.module("ChatterClient", ['ngRoute']);

ChatterClient.config(
	function ($routeProvider) {
		$routeProvider
			.when("/login", { templateUrl: "views/login.html", controller: "LoginController"})
			.otherwise({
				redirectTo: "/login"
			});
	});

ChatterClient.controller("LoginController", function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.bla = "";
	$scope.login = function() {
		$scope.bla = $scope.username;
	}
});