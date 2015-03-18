'use strict';


//Users Controller
angular.module('mftApp')
  .controller('UserIndexCtrl', ['$scope', '$resource', '$routeParams', '$window', '$location', '$rootScope', '$cookies', '$cookieStore', 'UserAuthEndpoint', 'UserAuth', 'UserSession',
	function($scope, $resource, $routeParams, $window, $location, $rootScope, $cookies, $cookieStore, UserAuthEndpoint, UserAuth, UserSession) {
	$rootScope.user = {};
	$scope.loginAttempt = false;
	$scope.user.email = UserSession.username();
	/*UserIndex.get(function() {
		UserAuth.getCredentials();
		$rootScope.loggedIn = true;
		console.log("initial credential test");
	},
	function() {
		$rootScope.loggedIn = false;
		console.log("initial credential test failure");
	});*/
	
	/*if($rootScope.loggedIn) {
		$rootScope.testSessionID = $cookieStore.get('authData');
		if ($rootScope.testSessionID == $rootScope.validSessionID) {
			$rootScope.loggedIn = true;
		}
		else {
			$rootScope.loggedIn = false;
		}
	}*/
	//$scope.loggedIn = false;
	//$rootScope.loggedIn = false;
	//Login Function
	$scope.login = function() {
		$scope.loginAttempt = true;
		$scope.loginForm.$setPristine();
		if ($scope.loginForm.$valid) {
			$rootScope.user.email = $scope.user.email;
			$rootScope.email = $scope.user.email;
			$rootScope.password = $scope.user.password;
			UserSession.create($scope.user.email, $scope.user.password, function(){
				$scope.invalidLogin = false;
				$window.location.href = 'index.html#/';
			},
			function() {
				$scope.invalidLogin = true;
				$scope.loginError = "Invalid Email/Password";
			});
			/*UserAuthEndpoint.get(function() {
				$rootScope.loggedIn = true;
				//$scope.loggedIn = true;
				$location.path('/');
				console.log("Authenticating");
			},
		function() {
			$scope.invalidLogin = true;
			$scope.loginError = "Invalid Email/Password";
			console.log("error");	
		});*/
		}
	};
	
	//Logout Function
	$scope.logout = function() {
		UserSession.destroy();
		$window.location.href = 'indexLogin.html#/';
		$rootScope.editFeedSuccess = false;
	};
	
	//Switch Active class between tabs function
	if ($window.location.hash == '#/monitoringInbounds') {
		$rootScope.activeMonitoringInboundClass = 'active';
		$rootScope.activeInterfaceClass = '';
		$rootScope.activeMonitoringOutboundClass = '';
	}
	else if ($window.location.hash == '#/monitoringOutbounds') {
		$rootScope.activeMonitoringInboundClass = '';
		$rootScope.activeInterfaceClass = '';
		$rootScope.activeMonitoringOutboundClass = 'active';
	}
	else {
		$rootScope.activeMonitoringOutboundClass = '';
		$rootScope.activeMonitoringInboundClass = '';
		$rootScope.activeInterfaceClass = 'active';
	}
	$scope.activate = function(page) {
		if (page == 'monitoringInbound') {
			$rootScope.activeMonitoringOutboundClass = '';
			$rootScope.activeMonitoringInboundClass = 'active';
			$rootScope.activeInterfaceClass = '';
		}
		else if (page == 'monitoringOutbound'){
			$rootScope.activeMonitoringOutboundClass = 'active';
			$rootScope.activeMonitoringInboundClass = '';
			$rootScope.activeInterfaceClass = '';
		}
		else if (page == 'main'){
			$rootScope.activeInterfaceClass = 'active';
			$rootScope.activeMonitoringOutboundClass = '';
			$rootScope.activeMonitoringInboundClass = '';
		}
		//else {
			//$rootScope.activeInterfaceClass = 'active';
			//$rootScope.activeMonitoringClass = '';
		//}
	};
	
  }]);