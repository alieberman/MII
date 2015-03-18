'use strict';
					
/* Query All Transfers  */
angular.module('mftApp')
.factory('TransferByIstrat', ['$resource', '$rootScope', function($resource, $rootScope) { 
	var getTransfers = $resource($rootScope.baseUrl + '/TransferByIstrat/:id', {id:'@id'}, 
	{ post: {method: 'POST'}, 
	get: {method: 'GET'}, 
	update: {method:'PUT'}, 
	query: {method:'GET', isArray:false}});
	return getTransfers;
}]);