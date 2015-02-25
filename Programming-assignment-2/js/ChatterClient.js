angular.module("ChatterClient", ['ngRoute', 'ui.bootstrap', 'luegg.directives', 'ui.select', 'ngSanitize']);


angular.module("ChatterClient").config( ['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when("/login", { templateUrl: "views/login.html", controller: "LoginController" })
			.when("/roomlist/:user", { templateUrl: "views/rooms.html", controller: "RoomListController" })
			.when("/room/:user/:roomId", { templateUrl: "views/room.html", controller: "RoomController" })
			.otherwise({
				redirectTo: "/login"
			});
}]);