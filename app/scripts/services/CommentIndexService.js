'use strict';

/* Query Comments From DB Service */
angular.module('mftApp')
.factory('Comment', ['$resource', '$routeParams', '$rootScope', function($resource, $routeParams, $rootScope) {
 	var getComment = $resource($rootScope.baseUrl + '/Comments/:id', {id: '@FEED_ID'}, 
		{ post: {method: 'POST',
		transformRequest:function(data, headersGetter){
			var result = JSON.stringify(data);           
		}}, 
		get: {method: 'GET', isArray:false}, 
		update: {method:'PUT'}, 
		query: {method:'GET', isArray:true}});	
	return getComment;
}]);