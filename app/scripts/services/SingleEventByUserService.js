'use strict';
					
/* Query All Events with User_Name @Username  */
angular.module('mftApp')
.factory('SingleUserEvent', ['$resource', '$rootScope', function($resource, $rootScope) { 
	//var getFeed = $resource('JSON/feeds.json', {id:'@id', status:'@status', interface:'@interface'},
	var getEvent = $resource($rootScope.baseUrl + '/UserEvents/:id', {id:'@id'}, 
	{ post: {method: 'POST', params:{DATA:''}, 
	transformRequest:function(data, headersGetter){
		var result = JSON.stringify(data);
		console.log("Result:" + result);             
	}}, 
	get: {method: 'GET'}, 
	update: {method:'PUT'}, 
	query: {method:'GET', isArray:false}});
	return getEvent;
}]);