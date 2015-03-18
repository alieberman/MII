'use strict';

/* Query Comments Controller */
angular.module('mftApp')
  .controller('TransferShowCtrl', ['$scope', '$resource', 'TransferByIstrat', 'SingleFeed', '$routeParams', '$route', '$location', '$filter', 
  function($scope, $resource, TransferByIstrat, SingleFeed, $routeParams, $route, $location, $filter) {
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;
	$scope.params = $routeParams;

	//Get Feed and Transfer Details for that feed
	$scope.singleFeed = SingleFeed.get({id: $routeParams.id}, function(results) {
		$scope.istrat = results.ISTRATEGY;
		TransferByIstrat.get({id: $scope.istrat}, function(res) {
			$scope.transferListAll = [];
			$scope.successTransferList = [];
			$scope.failedTransferList = [];
			for (var i = 0; i < res.results.length; i++) {
				var isSuccessfulTransfer = null;
				var transferSize = parseInt(res.results[i].FILESIZE);
				var d = res.results[i].EVENTTIMESTAMP;
				var created_at = new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), d.substr(11, 2), d.substr(14, 2), d.substr(17, 2));
				res.results[i].EVENTTIMESTAMP = (created_at.setDate(created_at.getDate()));

				//Count successful or failed transfers
				if (res.results[i].EVENTTYPE == "File Process Ended" && res.results[i].DIRECTION == "in") {
					isSuccessfulTransfer = true;
					res.results[i].SUCCESS = 'Success';
					$scope.transferListAll.push(res.results[i]);
					$scope.successTransferList.push(res.results[i]);
				}
				else if (res.results[i].EVENTTYPE == "File Upload Ended" && res.results[i].DIRECTION == "out") {
					isSuccessfulTransfer = true;
					res.results[i].SUCCESS = 'Success';
					$scope.transferListAll.push(res.results[i]);
					$scope.successTransferList.push(res.results[i]);
				}
				else if (res.results[i].EVENTTYPE == "File Process Terminated" || res.results[i].EVENTTYPE == "File Upload Terminated") {
					isSuccessfulTransfer = false;
					res.results[i].SUCCESS = 'Failed';
					$scope.transferListAll.push(res.results[i]);
					$scope.failedTransferList.push(res.results[i]);
				}
			}
			$scope.transferList = $scope.transferListAll;
			$scope.dailyTransferNumber = $scope.transferListAll.length;
			$scope.dailySuccessTransferNumber = $scope.successTransferList.length;
			$scope.dailyFailedTransferNumber = $scope.failedTransferList.length;
		});
	});
	
	$scope.sortOrder = '-EVENTTIMESTAMP';
	$scope.reverse = false;
	//Order the Transfers by each column
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