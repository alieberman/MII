'use strict';

/* Show Single Feed Controller */
angular.module('mftApp')
  .controller('TransferIndexCtrl', ['$scope', '$rootScope', '$resource', 'Transfers', '$routeParams', '$route', '$location',
  function($scope, $rootScope, $resource, Transfers, $routeParams, $route, $location) {
	
	  //Rounding Function
	  $scope.round = function(num) {    
	    return +(Math.round(num + "e+2")  + "e-2");
	  };
	  
	  //Summing function
	  $scope.sum = function(array) {
		var sum = 0;
		for (var i = 0; i < array.length; i++) {
			var sum = sum + array[i];
		}
		return sum;
	  };
	
	  //Averaging Function
	  $scope.average = function(array) {
		var sum = 0;
		var total = array.length;
		for (var i = 0; i < array.length; i++) {
			var sum = sum + array[i];
		}
		return sum/total;
	  };
	
	//Determine file size to condense to KB, MB, or GB
	$scope.byteSize = function(bytes) {
		//Daily Size
		if (bytes < 1000000) {
			var size = $scope.round(bytes/1000);
			var fileSuffix = 'KB';
		}
		else if (bytes < 1000000000) {
			var size = $scope.round(bytes/1000000);
			var fileSuffix = 'MB';
		}
		else if (bytes >= 1000000000) {
			var size = $scope.round(bytes/1000000000);
			var fileSuffix = 'GB';
		}
		else {
			var size = 0;
			var fileSuffix = 'KB';
		}
		return [size, fileSuffix];
	};
	
	  //Initialize Variables for Counting Bytes and Getting Dates
	  var currentDate = new Date();
	  var today = currentDate.setDate(currentDate.getDate());
	  var oneDay = currentDate.setDate(currentDate.getDate() - 1);
	  var oneMonth = currentDate.setDate(currentDate.getDate() - 31);
	  var oneYear = currentDate.setDate(currentDate.getDate() - 365);
	
	  //Sort Transfers By Time and add up transfer sizes
	  Transfers.query(function(res) {
		$scope.countSuccessTransfers = [];
		$scope.sumDailyBytes = 0;
		$scope.sumMonthlyBytes = 0;
		$scope.sumYearlyBytes = 0;
		for (var i = 0; i < res.results.length; i++) {
			var transferSize = parseInt(res.results[i].TRANSFER_SIZE);
			var d = res.results[i].START_TIME;
			var created_at = new Date(d.substr(0, 4), d.substr(5, 2) - 1, d.substr(8, 2), d.substr(11, 2), d.substr(14, 2), d.substr(17, 2));
			res.results[i].START_TIME = (created_at.setDate(created_at.getDate()));
			//Add Transfer Amounts For Period of Time
			if (res.results[i].START_TIME > oneDay) {
				$scope.sumDailyBytes = transferSize + $scope.sumDailyBytes;
				$scope.countSuccessTransfers.push(i);
			}
			if (res.results[i].START_TIME > oneMonth) {
				$scope.sumMonthlyBytes = transferSize + $scope.sumMonthlyBytes;
			}
			if (res.results[i].START_TIME > oneYear) {
				$scope.sumYearlyBytes = transferSize + $scope.sumYearlyBytes;
			}
		}
		$scope.successfulTransfers = $scope.countSuccessTransfers.length;
		
		//Daily Size
		$scope.dailySize = $scope.byteSize($scope.sumDailyBytes);
		$scope.sumDailyBytes = $scope.dailySize[0];
		$scope.dailyFileSuffix = $scope.dailySize[1];
		
		//Monthly Size
		$scope.monthlySize = $scope.byteSize($scope.sumMonthlyBytes);
		$scope.sumMonthlyBytes = $scope.monthlySize[0];
		$scope.monthlyFileSuffix = $scope.monthlySize[1];
		
		//Yearly Size
		$scope.yearlySize = $scope.byteSize($scope.sumYearlyBytes);
		$scope.sumYearlyBytes = $scope.yearlySize[0];
		$scope.yearlyFileSuffix = $scope.yearlySize[1];
		
		//Increment By Day to sort fileSize By Day, Month, and Year
		$scope.averageDailyTransfers = [];
		$scope.dateInTime = [];
		for (var i = 1; i <= 365; i++) {
			var dayIncrement = today - i*86400000;
			var dayRange = today - i*86400000 + 86400000;
			var duplicate = false;
			for (var j = 0; j < res.results.length; j++) {
				var transferSize = parseInt(res.results[j].TRANSFER_SIZE);
				//Get Transfer Amounts in Bytes For Period of Time
				if (res.results[j].START_TIME > dayIncrement && res.results[j].START_TIME < dayRange) {
					//Get month for averaging
					var month = Math.ceil(i/30);
					//Get year for averaging
					var year = Math.ceil(i/365);
					//Get number of transfers per day and per month
					$scope.averageDailyTransfers.push({day:i, month:month, year:year, fileSize:transferSize});
					//Send day of transfer for graph
					if (!duplicate) {
						$scope.dateInTime.push(i);
					}
					var duplicate = true;
				}
			}
		}
		//Average Transfer size and Daily Average # of Transfers
		$scope.count = [];
		$scope.averagesDailyPerm = [];
		$scope.averagesMonthlyPerm = [];
		$scope.averagesYearlyPerm = [];
		//Loop through days in the year
		for (var i = 1; i <= 365; i++) {
			$scope.averagesDailyTemp = [];
			$scope.averagesMonthlyTemp = [];
			$scope.averagesYearlyTemp = [];
			var counter = 0;
			for (var j = 0; j < $scope.averageDailyTransfers.length; j++) {
				//Daily Transfers
				if ($scope.averageDailyTransfers[j].day == i) {
					var counter = counter + 1;
					$scope.averagesDailyTemp.push($scope.averageDailyTransfers[j].fileSize);
				}
				//Monthly Transfers
				if ($scope.averageDailyTransfers[j].month == i) {
					$scope.averagesMonthlyTemp.push($scope.averageDailyTransfers[j].fileSize);
				}
				//Yearly Transfers
				if ($scope.averageDailyTransfers[j].year == i) {
					$scope.averagesYearlyTemp.push($scope.averageDailyTransfers[j].fileSize);
				}
				//# of Transfers
				if (j == $scope.averageDailyTransfers.length - 1 && counter > 0) {
					$scope.count.push(counter);	
				}
			}
			//Sum the transfer sizes per day then push to array that stores sum per day,
			//then average the sum per day for daily average
			if ($scope.averagesDailyTemp.length > 0) {
				$scope.sumPerDay = $scope.sum($scope.averagesDailyTemp);
				$scope.averagesDailyPerm.push($scope.sumPerDay);
			}
			//Sum the transfer sizes per month then push to array that stores sum per month,
			//then average the sum per month for monthly average
			if ($scope.averagesMonthlyTemp.length > 0) {
				$scope.sumPerMonth = $scope.sum($scope.averagesMonthlyTemp);
				$scope.averagesMonthlyPerm.push($scope.sumPerMonth);
			}
			//Sum the transfer sizes per year then push to array that stores sum per year,
			//then average the sum per year for yearly average
			if ($scope.averagesYearlyTemp.length > 0) {
				$scope.sumPerYear = $scope.sum($scope.averagesYearlyTemp);
				$scope.averagesYearlyPerm.push($scope.sumPerYear);
			}
		}
		
		//Daily Average
		$scope.dailyAverage = $scope.average($scope.averagesDailyPerm);
		$scope.dailyAvgSize = $scope.byteSize($scope.dailyAverage);
		$scope.formatDailyAvg = $scope.dailyAvgSize[0];
		$scope.formatDailyAvgSuffix = $scope.dailyAvgSize[1];
		
		//Monthly Average
		$scope.monthlyAverage = $scope.average($scope.averagesMonthlyPerm);
		$scope.monthlyAvgSize = $scope.byteSize($scope.monthlyAverage);
		$scope.formatMonthlyAvg = $scope.monthlyAvgSize[0];
		$scope.formatMonthlyAvgSuffix = $scope.monthlyAvgSize[1];
		
		//Yearly Average
		$scope.yearlyAverage = $scope.average($scope.averagesYearlyPerm);
		$scope.yearlyAvgSize = $scope.byteSize($scope.yearlyAverage);
		$scope.formatYearlyAvg = $scope.yearlyAvgSize[0];
		$scope.formatYearlyAvgSuffix = $scope.yearlyAvgSize[1];
		
		//Daily Transfer Average
		$scope.dailyTransferAvgAll = $scope.round($scope.average($scope.count));
		
		//Graphing Utility graph bytes transferred per day
		$('#graph').tooltip();	
		$scope.graphValues = [];
		$scope.graphAverageLine = [];
		//Epoch time for graph
		var milliseconds = Math.round(today/1000.0);
		for (var i = $scope.averagesDailyPerm.length - 1; i >= 0; i--) {
			var xValue = milliseconds - $scope.dateInTime[i]*86400;
			var yValue = $scope.averagesDailyPerm[i];
			$scope.graphValues.push({x: xValue, y: yValue});
			var yValue1 = $scope.dailyAverage;
			$scope.graphAverageLine.push({x: xValue, y: yValue1});
		}

			//Start Graph
			var graph = new Rickshaw.Graph( {
			        element: document.querySelector("#chart"),
			        width: 800,
			        height: 250,
					renderer: 'multi',
			        series: [
							{
							name: 'Average Transfers',
			                color: 'rgb(255, 0, 0)',
							renderer: 'line',
			                data: $scope.graphValues
			        		},
							{
							name: 'Average Transfers Points',
			                color: 'rgb(255, 0, 0)',
							renderer: 'scatterplot',
			                data: $scope.graphValues
			        		},
							{
							name: 'Average Line',
			                color: 'rgb(255, 0, 0)',
							renderer: 'line',
			                data: $scope.graphAverageLine
			        		}]
			} );

			var xAxis = new Rickshaw.Graph.Axis.Time({
			  graph: graph
			});
			
			var y_axis = new Rickshaw.Graph.Axis.Y( {
			        graph: graph,
			        orientation: 'left',
			        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
			        element: document.getElementById('y_axis'),
			} );

			new Rickshaw.Graph.HoverDetail({
			  graph: graph
			});

			graph.render();
		
	  });
  }
]);