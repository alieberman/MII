'use strict';

/* Show Single Feed Controller */
angular.module('mftApp')
  .controller('TransferIndexCtrl', ['$scope', '$rootScope', '$resource', 'Transfers', '$routeParams', '$route', '$location',
  function($scope, $rootScope, $resource, Transfers, $routeParams, $route, $location) {
	
	//Filter Transfer List by success/failure
	$scope.filterTransferList = 'All';
	$scope.filterTransfers = function(filter) {
		if ($scope.filterTransferList == 'All') {
			$scope.transferList = $scope.transferListAll;
		}
		else if ($scope.filterTransferList == 'Successful') {
			$scope.transferList = $scope.successTransferList;
		}
		else if ($scope.filterTransferList == 'Failed') {
			$scope.transferList = $scope.failedTransferList;
		}
		else if ($scope.filterTransferList == 'Inbound') {
			$scope.transferList = $scope.inboundTransferList;
		}
		else if ($scope.filterTransferList == 'Outbound') {
			$scope.transferList = $scope.outboundTransferList;
		}
	};
	
	//Sort the table by column
	$scope.sortOrder = '-EVENTTIMESTAMP';
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
		$scope.successfulTransfers = 0;
		$scope.failedTransfers = 0;
		$scope.sumDailyBytes = 0;
		$scope.sumMonthlyBytes = 0;
		$scope.sumYearlyBytes = 0;
		$scope.transferListAll = [];
		$scope.successTransferList = [];
		$scope.failedTransferList = [];
		$scope.inboundTransferList = [];
		$scope.outboundTransferList = [];
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
			
			//Add Transfer Amounts For Period of Time
			if (res.results[i].EVENTTIMESTAMP > oneDay && isSuccessfulTransfer) {
				$scope.sumDailyBytes = transferSize + $scope.sumDailyBytes;
				//$scope.successfulTransfers = $scope.successfulTransfers + 1;
			}
			else if (res.results[i].EVENTTIMESTAMP > oneDay && isSuccessfulTransfer == false) {
				//$scope.failedTransfers = $scope.failedTransfers + 1;
			}
			if (res.results[i].EVENTTIMESTAMP > oneMonth && isSuccessfulTransfer) {
				$scope.sumMonthlyBytes = transferSize + $scope.sumMonthlyBytes;
			}
			if (res.results[i].EVENTTIMESTAMP > oneYear && isSuccessfulTransfer) {
				$scope.sumYearlyBytes = transferSize + $scope.sumYearlyBytes;
			}
		}
		$scope.dailyTransferNumber = $scope.transferListAll.length;
		$scope.dailySuccessTransferNumber = $scope.successTransferList.length;
		$scope.dailyFailedTransferNumber = $scope.failedTransferList.length;
		$scope.transferList = $scope.transferListAll;
		
		//Separate Inbound and Outbound
		for (var i = 0; i < $scope.transferListAll.length; i++) {
			if ($scope.transferListAll[i].DIRECTION == "in") {
				$scope.inboundTransferList.push($scope.transferListAll[i]);
			}
			else if ($scope.transferListAll[i].DIRECTION == "out") {
				$scope.outboundTransferList.push($scope.transferListAll[i]);
			} 
		}
		
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
				var isSuccessfulTransfer = false;
				if (res.results[j].EVENTTYPE == "File Process Ended" && res.results[j].DIRECTION == "in") {
					isSuccessfulTransfer = true;
				}
				else if (res.results[j].EVENTTYPE == "File Upload Ended" && res.results[j].DIRECTION == "out") {
					isSuccessfulTransfer = true;
				}
				var transferSize = parseInt(res.results[j].FILESIZE);
				//Get Transfer Amounts in Bytes For Period of Time
				if (res.results[j].EVENTTIMESTAMP > dayIncrement && res.results[j].EVENTTIMESTAMP < dayRange && isSuccessfulTransfer) {
					//Get month for averaging
					var month = Math.ceil(i/30);
					//Get year for averaging
					var year = 1;
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
		
		//Daily Number of Transfers Average
		$scope.dailyTransferAvgAll = $scope.round($scope.average($scope.count));
		
		//Graphing Utility graph bytes transferred per day
		$('#graph').tooltip();	
		$scope.graphValues = [];
		$scope.graphAverageLine = [];
		var maxYValue = 0;
		//Epoch time for graph
		var milliseconds = Math.round(today/1000.0);
		for (var i = $scope.averagesDailyPerm.length - 1; i >= 0; i--) {
			var xValue = milliseconds - $scope.dateInTime[i]*86400;
			var yValue = $scope.averagesDailyPerm[i];
			if (yValue > maxYValue) {
				maxYValue = yValue;
			}
			$scope.graphValues.push({x: xValue, y: yValue});
			var yValue1 = $scope.dailyAverage;
			$scope.graphAverageLine.push({x: xValue, y: yValue1});
		}
		maxYValue = maxYValue + 1000;

			//Start Graph
			var graph = new Rickshaw.Graph( {
			        element: document.querySelector("#chart"),
			        width: 800,
			        height: 250,
					max: maxYValue,
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
			                color: 'rgb(0, 0, 0)',
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
			
			//Graphing Utility graph number of transfers per day
			//Graphing Utility graph bytes transferred per day
			$('#graph1').tooltip();	
			$scope.graphValues1 = [];
			$scope.graphAverageLine1 = [];
			var maxYValue1 = 0;
			//Epoch time for graph
			var milliseconds1 = Math.round(today/1000.0);
			for (var i = $scope.count.length - 1; i >= 0; i--) {
				var xValue1 = milliseconds - $scope.dateInTime[i]*86400;
				var yValue2 = $scope.count[i];
				if (yValue2 > maxYValue1) {
					maxYValue1 = yValue2;
				}
				$scope.graphValues1.push({x: xValue1, y: yValue2});
				var yValue3 = $scope.dailyTransferAvgAll;
				$scope.graphAverageLine1.push({x: xValue1, y: yValue3});
			}
			maxYValue1 = maxYValue1 + 5;

				//Start Graph
				var graph1 = new Rickshaw.Graph( {
				        element: document.querySelector("#chart1"),
				        width: 800,
				        height: 250,
						max: maxYValue1,
						renderer: 'multi',
				        series: [
								{
								name: 'Average Transfers',
				                color: 'rgb(255, 0, 0)',
								renderer: 'line',
				                data: $scope.graphValues1
				        		},
								{
								name: 'Average Transfers Points',
				                color: 'rgb(255, 0, 0)',
								renderer: 'scatterplot',
				                data: $scope.graphValues1
				        		},
								{
								name: 'Average Line',
				                color: 'rgb(0, 0, 0)',
								renderer: 'line',
				                data: $scope.graphAverageLine1
				        		}]
				} );

				var xAxis1 = new Rickshaw.Graph.Axis.Time({
				  graph: graph1
				});

				var y_axis1 = new Rickshaw.Graph.Axis.Y( {
				        graph: graph1,
				        orientation: 'left',
				        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
				        element: document.getElementById('y_axis1'),
				} );

				new Rickshaw.Graph.HoverDetail({
				  graph: graph1
				});

				graph1.render();
		
	  });
  }
]);