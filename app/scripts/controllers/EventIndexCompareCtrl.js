'use strict';

/* Log Events Controller */
angular.module('mftApp')
  .controller('EventIndexCompareCtrl', ['$scope', '$resource', 'Event', 'UserAuth', '$routeParams', '$route', '$location', '$filter', 
  function($scope, $resource, Event, UserAuth, $routeParams, $route, $location, $filter) {
	$scope.params = $routeParams;
	$scope.eventList = [];
	Event.get(function(results){
		angular.forEach(results.results, function(value, key){
			value.DATA = angular.fromJson(value.DATA);
			var d = value.CREATED_AT;
			var created_at = new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), d.substr(11, 2), d.substr(14, 2), d.substr(17, 2));
			value.CREATED_AT = (created_at.setDate(created_at.getDate()));
			$scope.eventList.push(value);
		});
		//Sort Event Array By Time 
		$scope.eventList.sort(function(a,b){
		  a = new Date(a.CREATED_AT);
		  b = new Date(b.CREATED_AT);
		  return a<b?-1:a>b?1:0;
		});
		//Only compare an IS_FIRST_CHANGE=false against true or false against false of like ID's, never true against false.
		//Sort Events into new and Old Event to compare values
		$scope.routeNumber = parseInt($routeParams.changeIndex);
		$scope.newIndex = $scope.routeNumber;
		$scope.oldIndex = $scope.routeNumber - 1;
		if ($scope.eventList[$scope.newIndex].FEED_ID == $scope.eventList[$scope.oldIndex].FEED_ID) {
			console.log("if");
			var newEvent = $scope.eventList[$scope.newIndex].DATA;
			var oldEvent = $scope.eventList[$scope.oldIndex].DATA;
		}
		else if ($scope.eventList[$scope.newIndex].IS_FIRST_CHANGE == "true") {
			$scope.newIndex = $scope.routeNumber - 1;
			console.log("else if");
			var newEvent = $scope.eventList[$scope.newIndex].DATA;
			for (var i = 1; i < $scope.eventList.length; i++) {	
				if ($scope.eventList[$scope.newIndex].FEED_ID == $scope.eventList[$scope.oldIndex - i].FEED_ID)	{		
					var oldEvent = $scope.eventList[$scope.oldIndex - i].DATA;
					break;
				}
			}
		}
		else {
			console.log("else");
			var newEvent = $scope.eventList[$scope.newIndex].DATA;
			for (var i = 1; i < $scope.eventList.length; i++) {	
				if ($scope.eventList[$scope.newIndex].FEED_ID == $scope.eventList[$scope.oldIndex - i].FEED_ID)	{		
					var oldEvent = $scope.eventList[$scope.oldIndex - i].DATA;
					break;
				}
			}			
		}
		
		
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