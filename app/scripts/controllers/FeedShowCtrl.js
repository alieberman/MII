'use strict';

/* Show Single Feed Controller */
angular.module('mftApp')
  .controller('FeedShowCtrl', ['$scope', '$rootScope', '$resource', 'SingleFeed', '$routeParams', '$route', '$location', '$filter', 'UserAuth', 
  function($scope, $rootScope, $resource, SingleFeed, $routeParams, $route, $location, $filter, UserAuth) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	$scope.params = $routeParams;
	$scope.singleFeed = SingleFeed.get({id: $routeParams.id}, function(results) {
		if (results.CREATED_AT != null) {
			var d = results.CREATED_AT;
			var created_at = new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), d.substr(11, 2), d.substr(14, 2), d.substr(17, 2));
			results.CREATED_AT = (created_at.setDate(created_at.getDate()));
		}
	});
  }
]);