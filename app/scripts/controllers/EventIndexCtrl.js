'use strict';

/* Log Events Controller */
angular.module('mftApp')
  .controller('EventIndexCtrl', ['$scope', '$resource', 'Event', 'UserAuth', '$routeParams', '$route', '$location', '$filter', 
  function($scope, $resource, Event, UserAuth, $routeParams, $route, $location, $filter) {
	$scope.params = $routeParams;
	$scope.eventList = [];
	$scope.eventData = [];
	Event.query(function(results){
		angular.forEach(results.results, function(value, key){
			value.DATA = angular.fromJson(value.DATA);
			var d = value.CREATED_AT;
			var created_at = new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), d.substr(11, 2), d.substr(14, 2), d.substr(17, 2));
			value.CREATED_AT = (created_at.setDate(created_at.getDate()));
			$scope.eventData.push(value);
			if (value.IS_FIRST_CHANGE == 'false') {
				$scope.eventList.push(value);
			}	
		});
		$scope.eventData.sort(function(a,b){
		  a = new Date(a.CREATED_AT);
		  b = new Date(b.CREATED_AT);
		  return a<b?-1:a>b?1:0;
		});
		$scope.eventList.sort(function(a,b){
		  a = new Date(a.CREATED_AT);
		  b = new Date(b.CREATED_AT);
		  return a<b?-1:a>b?1:0;
		});
		$scope.numberOfChanges = $scope.eventList.length;
		$scope.master = $scope.eventList;
		$scope.lastEvent = $scope.eventList.length - 1;
	});
	$scope.myIndexOf = function(object, array) {
		for (var i = 0; i < array.length; i++) {
			if (object == array[i]) {
				return i;
			}
		}
	};
	
	//Filter Changes By Time Period
	$scope.filterChanges = "All";
	$scope.filterDate = function() {
		$scope.eventList = $scope.master;
		$scope.sortDates = [];
		var currentDate = new Date();
		if ($scope.filterChanges == "One Day") {
			var oneDay = currentDate.setDate(currentDate.getDate() - 1);
			for (var i = 0; i < $scope.eventList.length; i++) {
				var compare = $scope.eventList[i].CREATED_AT;
				if (oneDay < compare) {
					$scope.sortDates.push($scope.eventList[i]);
				}
			}
			$scope.eventList = $scope.sortDates;
			$scope.lastEvent = $scope.eventList.length - 1;
		}
		else if ($scope.filterChanges == "One Month") {
			var oneMonth = currentDate.setDate(currentDate.getDate() - 31);
			for (var i = 0; i < $scope.eventList.length; i++) {
				var compare = $scope.eventList[i].CREATED_AT;
				if (oneMonth < compare) {
					$scope.sortDates.push($scope.eventList[i]);
				}
			}
			$scope.eventList = $scope.sortDates;
			$scope.lastEvent = $scope.eventList.length - 1;
		}
		else if ($scope.filterChanges == "One Year") {
			var oneYear = currentDate.setDate(currentDate.getDate() - 365);
			//var oneYear = new Date(subtract);
			for (var i = 0; i < $scope.eventList.length; i++) {
				//var compare = new Date($scope.eventList[i].CREATED_AT);
				var compare = $scope.eventList[i].CREATED_AT;
				if (oneYear < compare) {
					$scope.sortDates.push($scope.eventList[i]);
				}
			}
			$scope.eventList = $scope.sortDates;
			$scope.lastEvent = $scope.eventList.length - 1;
		}
		else {
			$scope.eventList = $scope.eventList;
		}
	}
	
	
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