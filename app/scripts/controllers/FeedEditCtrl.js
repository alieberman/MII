'use strict';

/* Edit Feed Controller */
angular.module('mftApp')
  .controller('FeedEditCtrl', ['$scope', '$rootScope', '$resource', 'SingleFeed', '$routeParams', '$route', '$location', '$filter', 'Event', 'SingleEvent', 'UserAuth', 
  function($scope, $rootScope, $resource, SingleFeed, $routeParams, $route, $location, $filter, Event, SingleEvent, UserAuth) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	$scope.params = $routeParams;
	$scope.singleFeed = SingleFeed.get({id: $routeParams.id});
	$scope.master = SingleFeed.get({id: $routeParams.id});
	//Update and Log Event
	$scope.log = function() {
		//Update DB with Changes
		SingleFeed.update({LAST_CHANGE_BY: $scope.user.email}, $scope.singleFeed, 
			function() {
				//$location.path('/feeds/' + $routeParams.id);
				$rootScope.editFeedSuccess = true;
				console.log("updated");
					//Post new data to Events Table
					SingleFeed.get({id: $routeParams.id}, function(results){
						$scope.eventData = {};
						$scope.eventData.InOut = results.TD_IN_OUT;
						Event.post({DATA:results, id:$routeParams.id, USER_NAME:$scope.user.email, IS_FIRST_CHANGE:false}, 
							results, 
							function() {
								$route.reload();
							});
					});									
			},
			function() {
				$scope.editFeedFailure = true;
			});
	};
	//Call log() after checking if it's the 1st change
	$scope.editFeedFailure = false;
	$scope.noChange = false;
	$scope.submitted = false;
	$scope.save = function() {
		$scope.submitted = true;
		//If No Changes, Don't submit the form
		if(angular.equals($scope.master, $scope.singleFeed)){
			$scope.noChange = true;
		}
		$scope.feedForm.$setPristine();
		angular.forEach(Object.keys($scope.singleFeed), function(key){
			if ($scope.singleFeed[key] == "") {
				$scope.singleFeed[key] = null;
			}
		});
		//Get Event By ID to see if there's been any changes made; if no changes, POST master to DB
		SingleEvent.get({id: $routeParams.id}, function(results) {
			if ($scope.feedForm.$valid && !angular.equals($scope.master, $scope.singleFeed)){
				if (results.results.length == 0) {
					Event.post({DATA:$scope.master, id:$routeParams.id, USER_NAME:$scope.user.email, IS_FIRST_CHANGE:true}, 
						$scope.master, 
						function() {
							$scope.log();
						},
						function() {
							$scope.editFeedFailure = true;
					});	
				}  //End 2nd if
				else {
					$scope.log();
				} //End else 
			} //End 1st if
		});
	};
  }
]);