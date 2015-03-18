'use strict';

/* Show Single Feed Controller */
angular.module('mftApp')
  .controller('FeedNewCtrl', ['$scope', '$rootScope', '$resource', 'SingleFeed', 'Feed', 'UserAuth', '$routeParams', '$route', '$location', '$filter', 
  function($scope, $rootScope, $resource, SingleFeed, Feed, UserAuth, $routeParams, $route, $location, $filter) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	$scope.params = $routeParams;
	$scope.singleFeed = {};
	$scope.newFeedFailure = false;
	$scope.noChange = false;
    $scope.submitted = false;
	//Initiate Active? to Yes
	$scope.singleFeed.IS_ACTIVE = "Y";
	//Save New Feeds
	$scope.save = function() {
		$scope.submitted = true;
		//If User types then deletes, don't count as a change
		angular.forEach(Object.keys($scope.singleFeed), function(key){
			if ($scope.singleFeed[key] == "") {
				$scope.newFeedForm.$setPristine();
				$scope.singleFeed = {};
				$scope.noChange = true;
			}
		});
		//If Form is Valid and Changed, Submit It
		if ($scope.newFeedForm.$dirty && $scope.newFeedForm.$valid) {
		SingleFeed.post($scope.singleFeed, 
		function() {
			$route.reload();
			$scope.newFeedForm.$setPristine();
			$rootScope.newFeedSuccess = true;
			//Display the new ID of the feed
			$scope.sortID = [];
			Feed.query(function(res){
				//Convert ID to an int
				for (var i = 0; i < res.results.length; i++) {
					res.results[i].ID = parseInt(res.results[i].ID);
					$scope.sortID[i] = res.results[i].ID;
				}
				$scope.sortID.sort(function(a,b){return a-b});
				$rootScope.lastID = $scope.sortID[res.results.length - 1]
				console.log("Saved!");
			});
		},
		function() {
			$scope.newFeedFailure = true;
			console.log("error");
		});
		}
		else {
			$scope.noChange = true;
		}
	};

  }
]);