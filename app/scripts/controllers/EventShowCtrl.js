'use strict';

/* Log Events Controller */
angular.module('mftApp')
  .controller('EventShowCtrl', ['$scope', '$resource', 'SingleEvent', 'UserAuth', '$routeParams', '$route', '$location', '$filter', 
  function($scope, $resource, SingleEvent, UserAuth, $routeParams, $route, $location, $filter) {
	$scope.params = $routeParams;
	$scope.singleEvent = [];
	$scope.eventData = [];
	$scope.oldEvent = [];
	$scope.newEvent = [];
	SingleEvent.get({id:$routeParams.id}, function(results){
		angular.forEach(results.results, function(value, key){
			value.DATA = angular.fromJson(value.DATA);
			var d = value.CREATED_AT;
			var created_at = new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), d.substr(11, 2), d.substr(14, 2), d.substr(17, 2));
			//var created_at = new Date(value.CREATED_AT);
			value.CREATED_AT = (created_at.setDate(created_at.getDate()));
			$scope.singleEvent.push(value);
			if (value.IS_FIRST_CHANGE == 'false') {
				$scope.eventData.push(value);
			}
		});
		//Sort Event Array By Time 
		$scope.singleEvent.sort(function(a,b){
		  a = new Date(a.CREATED_AT);
		  b = new Date(b.CREATED_AT);
		  return a<b?-1:a>b?1:0;
		});
		$scope.eventData.sort(function(a,b){
		  a = new Date(a.CREATED_AT);
		  b = new Date(b.CREATED_AT);
		  return a<b?-1:a>b?1:0;
		});
			$scope.lastEvent = $scope.eventData[results.results.length - 2];
		}, 
		function() {
			console.log("error");
		}
	);
	$scope.myIndexOf = function(object, array) {
		for (var i = 0; i < array.length; i++) {
			if (object == array[i]) {
				return i;
			}
		}
	};
	
	$scope.sortOrder = '-CREATED_AT';
	$scope.reverse = false;
	//Order the Feeds by each column
	$scope.sort = function(newSortOrder) {
		$scope.sortOrder = newSortOrder;
	  if ($scope.sortOrder == newSortOrder) {
	    $scope.reverse = !$scope.reverse;
	    $scope.sortOrder = newSortOrder;
	        // icon reset
			$('th i').each(function(){
			        // icon reset
			        $(this).removeClass().addClass('icon-chevron-down icon-white');
			});
			if ($scope.reverse) {
	        	$('th.' + newSortOrder + '.sortable i').removeClass().addClass('icon-chevron-up icon-white');
			}
	        else {
				$scope.sortOrder = ('-' + newSortOrder);
	            $('th.' + newSortOrder + '.sortable i').removeClass().addClass('icon-chevron-down icon-white');
			}
	  } 
	};
	
  }
]);



 
