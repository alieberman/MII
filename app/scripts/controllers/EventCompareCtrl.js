'use strict';

/* Log Events Controller */
angular.module('mftApp')
  .controller('EventCompareCtrl', ['$scope', '$resource', 'SingleEvent', 'UserAuth', '$routeParams', '$route', '$location', '$filter', 
  function($scope, $resource, SingleEvent, UserAuth, $routeParams, $route, $location, $filter) {
	$scope.params = $routeParams;
	$scope.singleEvent = [];
	SingleEvent.get({id:$routeParams.id}, function(results){
		angular.forEach(results.results, function(value, key){
			value.DATA = angular.fromJson(value.DATA);
			var d = value.CREATED_AT;
			var created_at = new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), d.substr(11, 2), d.substr(14, 2), d.substr(17, 2));
			value.CREATED_AT = (created_at.setDate(created_at.getDate()));
			$scope.singleEvent.push(value);
		});
		//Sort Event Array By Time 
		$scope.singleEvent.sort(function(a,b){
		  a = new Date(a.CREATED_AT);
		  b = new Date(b.CREATED_AT);
		  return a<b?-1:a>b?1:0;
		});
		//Sort Events into new and Old Event to compare values
		$scope.routeNumber = parseInt($routeParams.index);
		$scope.newIndex = $scope.routeNumber;
		$scope.oldIndex = $scope.routeNumber - 1;
		console.log($scope.singleEvent[$scope.newIndex]);
		var newEvent = $scope.singleEvent[$scope.newIndex].DATA;
		var oldEvent = $scope.singleEvent[$scope.oldIndex].DATA;
		console.log(newEvent);
		console.log(oldEvent);
		
		$scope.differences = [];
		$scope.values = [];
		//Get Keys That Are Different
		angular.forEach(Object.keys(newEvent), function(key){
			if (key == 'LAST_CHANGE_BY' || key == 'CREATED_AT' || key == 'UPDATED_AT' || key == 'ID' || key == 'COMMENTS') {
				//Do nothing - Don't display these keys because they are only for tracking
			}
			else if (newEvent[key] != oldEvent[key]) {
				$scope.differences.push({attribute:key, newValue:newEvent[key], oldValue:oldEvent[key]});
			}
			
		});
	}, 
		function() {
			console.log("error");
		}
	);
	
  }
]);

/*var keysThatAreDifferent = function(newEvent, oldEvent) {
	var differences = [];
	angular.forEach(Object.keys(newEvent), function(key){
		if (newEvent[key] != oldEvent[key]) {
			differences.push(key);
		}
	});
	return differences;
};

var oldAndNewValue = function(newEvent, oldEvent) {
	var values = [];
	angular.forEach(Object.keys(newEvent), function(key){
		if (newEvent[key] != oldEvent[key]) {
			values.push({newValue:newEvent[key], oldValue:oldEvent[key]});
		}
	});
	return values;
};*/


