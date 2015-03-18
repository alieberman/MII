'use strict';
					
/* Query All Feeds From DB Service */
angular.module('mftApp')
.service('UserSession', ['$cookies', '$cookieStore', '$rootScope', 'UserAuthEndpoint', 'UserAuth', function($cookies, $cookieStore, $rootScope, UserAuthEndpoint, UserAuth) { 
	//Create user session
	this.create = function(username, password, success, failure) {
		UserAuth.setCredentials(username, password);
		UserAuthEndpoint.get(function() {
			//$rootScope.isValid = true;
			$cookieStore.put('Username', username);
			$cookieStore.put('Authorized', "true");
			success();			
		},
		function() {
			//$rootScope.isValid = false;
			failure();
			console.log("failed login");
		});
	};
	//Check Validity of User Session
	this.isValid = function() {	
		/*//var self = this;
		UserAuthEndpoint.get(function() {
			$rootScope.isValid = true;
			//$rootScope.loggedIn = $rootScope.isValid;
			success();
		},
		function() {
			$rootScope.isValid = false;
			//$rootScope.loggedIn = $rootScope.isValid;
			failure();
		});
		//return isValid;*/
		return $cookieStore.get('Authorized');
	};
	//Destroy User Session
	this.destroy = function() {
	    $cookieStore.put('Authorized', "");
		$cookieStore.remove('Username');
		UserAuth.clearCredentials();
	};
	//Store username in cookie to use in the app
	this.username = function() {
		return $cookieStore.get('Username');
	};
}]);
