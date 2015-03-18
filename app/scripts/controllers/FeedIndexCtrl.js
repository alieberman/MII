'use strict';

/* Query For Feeds Controller */
angular.module('mftApp')
  .controller('FeedIndexCtrl', ['$scope', '$resource', 'Feed', 'FeedExport', 'UserAuth', '$routeParams', '$route', '$location', '$filter', '$rootScope', '$cookieStore',  
  function($scope, $resource, Feed, FeedExport, UserAuth, $routeParams, $route, $location, $filter, $rootScope, $cookieStore) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	$scope.params = $routeParams;
	$scope.feedList = [];	

	//Export to CSV function
	$scope.downloadCSV = function() {
		FeedExport.query(function(res) {
			var encode = csv.encode( res.results );
			var uriContent = "data:text/csv;charset=UTF-8," + encodeURIComponent(encode);
			var newWindow = window.open(uriContent, 'filename.csv');
		});
	};
	
	$scope.feedShow = function(feedID) {
	  $location.path('/feeds/' + feedID);	
	};
	
	Feed.query(function(res) {

		$scope.keepGoing = false;
		var listOfFeeds = [];
		$scope.activeFeeds = [];
		$scope.inactiveFeeds = [];
		//Convert ID to an int
		for (var i = 0; i < res.results.length; i++) {
			res.results[i].ID = parseInt(res.results[i].ID);
			if (res.results[i].IS_ACTIVE == "Y") {
				$scope.activeFeeds.push(res.results[i]);
				
			}
			else {
				$scope.inactiveFeeds.push(res.results[i]);
			}
		}
		//Initialize 1st x amount of rows of feedList
		var init = 35;
		for (var i = 0; i < init; i++) {
		    listOfFeeds[i] = $scope.activeFeeds[i];
			$scope.feedList[i] = listOfFeeds[i];	
		 }
		//On Scroll, Load the next 50 feeds until list is done
		var inc = 50
		//hit max number of list exactly with $scope.keepGoing and else logic
		var i = init + inc
		$scope.loadMore = function() {
		  		for (var j = i - inc; j < i; j++) {
					//Stop Infinite Scroll At End Of List
					//if (j >= res.results.length) 
					if (j >= $scope.activeFeeds.length) {
						$scope.keepGoing = true;
						break;
					}
					else {
		    		//listOfFeeds.push(res.results[j]);
						listOfFeeds.push($scope.activeFeeds[j]);
					}
		  		}
				$scope.feedList = listOfFeeds;
				i+=inc;
		};
		
		//If User searches, search entire list of feeds	and break infinite scroll	
		$scope.filter = function() {
			$scope.keepGoing = true;
			if ($scope.feedActivity == "All Feeds") {
				$scope.feedList = res.results;			
			}
			else if ($scope.feedActivity == "Active Feeds") {
				$scope.feedList = $scope.activeFeeds;
			}
			else {
				$scope.feedList = $scope.inactiveFeeds;
			}
		};
		
		//Dropdown Select Filter by Feed Active vs. Inactive
		$scope.feedActivity = "Active Feeds";
		$scope.filterFeeds = function() {
			if ($scope.feedActivity == "All Feeds") {
				$scope.feedList = res.results;			
			}
			else if ($scope.feedActivity == "Active Feeds") {
				$scope.feedList = $scope.activeFeeds;
			}
			else {
				$scope.feedList = $scope.inactiveFeeds;
			}
		};
		
		//var sortOrder = 'ID';
		$scope.sortOrder = 'ID';
		$scope.reverse = false;
		//Order the Feeds by each column
		$scope.sort = function(newSortOrder) {
			if ($scope.feedActivity == "All Feeds") {
				$scope.feedList = res.results;			
			}
			else if ($scope.feedActivity == "Active Feeds") {
				$scope.feedList = $scope.activeFeeds;
			}
			else {
				$scope.feedList = $scope.inactiveFeeds;
			}
			$scope.keepGoing = true;
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
	});
  }
]);