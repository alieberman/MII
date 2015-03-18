'use strict';
					
/* Query All Feeds From DB For Export Service */
angular.module('mftApp')
.factory('FeedExport', ['$resource', '$rootScope', function($resource, $rootScope) { 
	var getFeedExport = $resource($rootScope.baseUrl + '/FeedsAllExport/:id', {id:'@id'}, 
	{ post: {method: 'POST'}, 
	get: {method: 'GET'}, 
	update: {method:'PUT'}, 
	query: {method:'GET', isArray:false}});
	return getFeedExport;
}]);