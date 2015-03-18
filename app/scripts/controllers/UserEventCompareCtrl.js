'use strict';

/* Log Events Controller */
angular.module('mftApp')
  .controller('UserEventCompareCtrl', ['$scope', '$resource', 'SingleUserEvent', 'SingleEvent', 'UserAuth', '$routeParams', '$route', '$location', '$filter', 
  function($scope, $resource, SingleUserEvent, SingleEvent, UserAuth, $routeParams, $route, $location, $filter) {
	$scope.params = $routeParams;
	$scope.singleUserEvent = [];
	SingleUserEvent.get({id:$routeParams.userId}, function(results){
		angular.forEach(results.results, function(value, key){
			value.DATA = angular.fromJson(value.DATA);
			var d = value.CREATED_AT;
			var created_at = new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), d.substr(11, 2), d.substr(14, 2), d.substr(17, 2));
			value.CREATED_AT = (created_at.setDate(created_at.getDate()));
			$scope.singleUserEvent.push(value);
		});
		//Sort Event Array By Time 
		$scope.singleUserEvent.sort(function(a,b){
		  a = new Date(a.CREATED_AT);
		  b = new Date(b.CREATED_AT);
		  return a<b?-1:a>b?1:0;
		});
		//Only compare an IS_FIRST_CHANGE=false against true or false against false of like ID's, never true against false.
		//Sort Events into new and Old Event to compare values
		$scope.routeNumber = parseInt($routeParams.userIndex);
		$scope.newIndex = $scope.routeNumber;
		$scope.oldIndex = $scope.routeNumber - 1;
		if ($scope.singleUserEvent[$scope.newIndex].FEED_ID == $scope.singleUserEvent[$scope.oldIndex].FEED_ID) {
			console.log("if");
			var newEvent = $scope.singleUserEvent[$scope.newIndex].DATA;
			var oldEvent = $scope.singleUserEvent[$scope.oldIndex].DATA;
		}
		else if ($scope.singleUserEvent[$scope.newIndex].IS_FIRST_CHANGE == "true") {
			$scope.newIndex = $scope.routeNumber - 1;
			console.log("else if");
			var newEvent = $scope.singleUserEvent[$scope.newIndex].DATA;
			for (var i = 1; i < $scope.singleUserEvent.length; i++) {	
				if ($scope.singleUserEvent[$scope.newIndex].FEED_ID == $scope.singleUserEvent[$scope.oldIndex - i].FEED_ID)	{		
					var oldEvent = $scope.singleUserEvent[$scope.oldIndex - i].DATA;
					break;
				}
			}
		}
		else {
			console.log("else");
			var newEvent = $scope.singleUserEvent[$scope.newIndex].DATA;
			for (var i = 1; i < $scope.singleUserEvent.length; i++) {	
				if ($scope.singleUserEvent[$scope.newIndex].FEED_ID == $scope.singleUserEvent[$scope.oldIndex - i].FEED_ID)	{		
					var oldEvent = $scope.singleUserEvent[$scope.oldIndex - i].DATA;
					break;
				}
			}			
		}
		
		
		/*$scope.number = parseInt($routeParams.userIndex);
		$scope.dataLength = parseInt(results.results.length);
		$scope.newIndex = $scope.dataLength - 1 - $scope.number;
		$scope.oldIndex = $scope.dataLength - 2 - $scope.number;
		if ($scope.singleUserEvent[$scope.newIndex].FEED_ID == $scope.singleUserEvent[$scope.oldIndex].FEED_ID) {
			var newEvent = $scope.singleUserEvent[$scope.newIndex].DATA;
			var oldEvent = $scope.singleUserEvent[$scope.oldIndex].DATA;
		}
		else if ($scope.singleUserEvent[$scope.newIndex].IS_FIRST_CHANGE == 'false') {
			var newEvent = $scope.singleUserEvent[$scope.newIndex].DATA;
			for (var i = 3; i < results.results.length; i++) {
				if ($scope.singleUserEvent[$scope.newIndex].FEED_ID == $scope.singleUserEvent[$scope.dataLength - i - $scope.number].FEED_ID) {
				var oldEvent = $scope.singleUserEvent[$scope.dataLength - i - $scope.number].DATA;
				break;
				}
			}
		}
		else {
			//Iterate one item further in the array
			var newEvent = $scope.singleUserEvent[$scope.oldIndex].DATA;
			for (var i = 3; i < results.results.length; i++) {
				if ($scope.singleUserEvent[$scope.oldIndex].FEED_ID == $scope.singleUserEvent[$scope.dataLength - i - $scope.number].FEED_ID) {	
				var oldEvent = $scope.singleUserEvent[$scope.dataLength - i - $scope.number].DATA;
				break;
				}
			}
		}*/
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
		console.log($scope.differences);
		}, 
		function() {
			console.log("error");
		}
	);
	
  }
]);