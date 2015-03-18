'use strict';
					
/* Query All Events From DB For Auditing Service */
angular.module('mftApp')
.factory('Event', ['$resource', '$rootScope', function($resource, $rootScope) { 
	var getEvent = $resource($rootScope.baseUrl + '/Event/:id', {id:'@id'}, 
	{ post: {method: 'POST', 
	transformRequest:function(data, headersGetter){
		var result = JSON.stringify(data);             
	}}, 
	get: {method: 'GET'}, 
	update: {method:'PUT'}, 
	query: {method:'GET', isArray:false}});
	return getEvent;
}]);