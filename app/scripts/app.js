'use strict';

/**
 * @ngdoc overview
 * @name newSpreadsheetReplacementApp
 * @description
 * # newSpreadsheetReplacementApp
 *
 * Main module of the application.
 */
angular
  .module('mftApp', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'mftApp.directives',
    'infinite-scroll',
    'ui.bootstrap'
  ])
  .config(['$httpProvider', function($httpProvider) {
	        $httpProvider.defaults.useXDomain = true;
	        delete $httpProvider.defaults.headers.common['X-Requested-With'];
			$httpProvider.defaults.withCredentials = true;
	    }
  ])

  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'FeedIndexCtrl'
      })
      .when('/new', {
        templateUrl: 'views/feedNew.html',
        controller: 'FeedNewCtrl'
      })
	  .when('/feeds/:id', {
        templateUrl: 'views/feed.html',
        controller: 'FeedShowCtrl'
      })
	  .when('/feeds/:id/edit', {
        templateUrl: 'views/feedEdit.html',
        controller: 'FeedEditCtrl'
      })
	  .when('/transfers/:id', {
        templateUrl: 'views/transfers.html',
        controller: 'TransferShowCtrl'
      })
	  .when('/comments/:id', {
        templateUrl: 'views/comments.html',
        controller: 'CommentIndexCtrl'
      })
	  .when('/changeLog/:id', {
        templateUrl: 'views/changeLog.html',
        controller: 'EventShowCtrl'
      })
	  .when('/changeLog/:id/changeDetail/:index', {
        templateUrl: 'views/changeDetail.html',
        controller: 'EventCompareCtrl'
      })
	  .when('/users/:userId', {
        templateUrl: 'views/user.html',
        controller: 'UserEventShowCtrl'
      })
	  .when('/users/:userId/changeDetail/:userIndex', {
        templateUrl: 'views/userDetail.html',
        controller: 'UserEventCompareCtrl'
      })
	  .when('/changes', {
        templateUrl: 'views/trackAllChanges.html',
        controller: 'EventIndexCtrl'
      })
	  .when('/changes/changeDetail/:changeIndex', {
        templateUrl: 'views/trackAllChangesDetail.html',
        controller: 'EventIndexCompareCtrl'
      })
	  .when('/monitoringInbounds', {
        templateUrl: 'views/monitoringInbound.html',
        controller: 'TransferIndexInboundCtrl'
      })
	  .when('/monitoringOutbounds', {
        templateUrl: 'views/monitoringOutbound.html',
        controller: 'TransferIndexOutboundCtrl'
      })
	  .when('/monitoring/transfers', {
        templateUrl: 'views/allTransfers.html',
        controller: 'TransferIndexCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  //Run on route change to make sure user is logged in
  .run(function($rootScope, $location, $window, UserSession, UserAuth, UserAuthEndpoint) {
	$rootScope.baseUrl = 'http://zeus.bigcompass.com\:5555/rest/ShuttleApp';
	//$rootScope.baseUrl = '/rest/ShuttleApp';
	//$rootScope.baseUrl = 'http://10.207.64.209\:5555/rest/ShuttleApp';
    // register listener to watch route changes
	UserAuthEndpoint.get(function(results) {
		$rootScope.user.email = results.user;
	});
    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
		if ($rootScope.user.email == null || $rootScope.user.email.length == 0) {
			UserAuthEndpoint.get(function(results) {
				$rootScope.user.email = results.user;
			});
		}
	});
    /*$rootScope.$on("$routeChangeStart", function(event, next, current) {
	console.log(UserSession.isValid());
		  if ( UserSession.isValid() && $window.location == 'indexLogin.html#/') {
		    $window.location.href = 'index.html#/';
		  }
	      if ( !UserSession.isValid() && $window.location != 'indexLogin.html#/') {
	        $window.location.href = 'indexLogin.html#/';
	      }
	});*/
  });
