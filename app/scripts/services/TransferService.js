'use strict';
					
/* Query All Transfers  */
angular.module('mftApp')
.factory('Transfers', ['$resource', '$rootScope', function($resource, $rootScope) { 
	var getTransfers = $resource($rootScope.baseUrl + '/Transfers/:id', {id:'@id'}, 
	{ post: {method: 'POST'}, 
	get: {method: 'GET'}, 
	update: {method:'PUT'}, 
	query: {method:'GET', isArray:false}});
	return getTransfers;
}]);