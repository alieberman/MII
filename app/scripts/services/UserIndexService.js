'use strict';

/* Get username from IS session */
angular.module('mftApp')
.factory('UserAuthEndpoint', ['$resource', '$rootScope', function($resource, $rootScope) {
   	var getUserInfo = $resource('http://zeus.bigcompass.com\:5555/rest/ShuttleApp/UserAuth', {}, 
		{ post: {method: 'POST', 
		  transformRequest:function(data, headersGetter){
			var result = JSON.stringify(data);             
		}}, 
		get: {method: 'GET'}, 
		update: {method:'PUT'}, 
		query: {method:'GET', isArray:false}});	
		return getUserInfo;
}]);