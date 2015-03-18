'use strict';
					
/* Query All Feeds From DB Service */
angular.module('mftApp')
.factory('Feed', ['$resource', '$rootScope', function($resource, $rootScope) { 
	var getFeed = $resource($rootScope.baseUrl + '/Feeds/:id', {id:'@id'}, 
	{ post: {method: 'POST'}, 
	get: {method: 'GET'}, 
	update: {method:'PUT'}, 
	query: {method:'GET', isArray:false}});
	return getFeed;
}]);