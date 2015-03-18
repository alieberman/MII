'use strict';

/* Query Comments Controller */
angular.module('mftApp')
  .controller('CommentIndexCtrl', ['$scope', '$resource', 'Comment', 'UserAuth', '$routeParams', '$route', '$location', '$filter', 
  function($scope, $resource, Comment, UserAuth, $routeParams, $route, $location, $filter) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	$scope.params = $routeParams;
	$scope.dateFormat = new Date().getTime();      //'M/d/yy h:mm:ss a';
	$scope.commentList = [];
	Comment.get({id: $routeParams.id}, function(results){
		angular.forEach(results.results, function(value, key){
			var d = value.CREATED_AT;
			var created_at = new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), d.substr(11, 2), d.substr(14, 2), d.substr(17, 2));
			value.CREATED_AT = (created_at.setDate(created_at.getDate()));	
		});
		$scope.commentList = results.results;
		$scope.commentList.sort(function(a,b){
		  a = new Date(a.CREATED_AT);
		  b = new Date(b.CREATED_AT);
		  return a<b?1:a>b?-1:0;
		});
	});

	//Save Comments; POST to DB
	$scope.postCommentSuccess = false;
	$scope.postCommentFailure = false;
	$scope.submitted = false;
	$scope.save = function() {
		$scope.commentForm.$setPristine();
		$scope.submitted = true;
		if($scope.commentForm.$valid) {
		Comment.post({id:$routeParams.id, CURRENTUSER:$scope.user.email, COMMENT_FEED:$scope.commentData.COMMENT_FEED},
		$scope.commentData, 
		function() {
			$scope.submitted = false;
		    Comment.get({id: $routeParams.id}, function(results){
				angular.forEach(results.results, function(value, key){
					var d = value.CREATED_AT;
					var created_at = new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), d.substr(11, 2), d.substr(14, 2), d.substr(17, 2));
					value.CREATED_AT = (created_at.setDate(created_at.getDate()));	
				});
				$scope.commentList = results.results;
				$scope.commentList.sort(function(a,b){
				  a = new Date(a.CREATED_AT);
				  b = new Date(b.CREATED_AT);
				  return a<b?1:a>b?-1:0;
				});
			});
			$scope.commentData.COMMENT_FEED = "";
			$scope.postCommentSuccess = true;
		},
		function() {
			$scope.submitted = false;
			$scope.postCommentFailure = true;
			$scope.commentData.COMMENT_FEED = "";	
		});
		}
	};
	

  }
]);




	