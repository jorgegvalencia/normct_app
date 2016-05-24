angular.module('normct').controller('HomeCtrl', function($scope, RESTClient, socket) {
    $scope.log_st = ""; // single trial
    $scope.log_mt = ""; // multiple trial
    $scope.processing = false;

    socket.on('singleTrialSocket', function(data) {
        console.log(data);
        console.log(socket.getSocketId())
        $scope.log_st += data.message + '<br>';
        if(data.status === 'Ended' || data.status === 'Failure'){
        	$scope.processing = false;
        	if(data.status === 'Ended'){
        		$scope.log_st += 'View <a href="#/trials/'+data.trial+'">detail</a>' + '<br>';
        	}
        }
    });

    socket.on('trialListSocket', function(data) {
        console.log(data);
        $scope.log_mt += data.message + '<br>';
        if(data.status === 'Ended' || data.status === 'Failure'){
        	$scope.processing = false;
        }
    });

    $scope.flushLogST = function () {
    	$scope.log_st = "";
    }

    $scope.flushLogMT = function () {
    	$scope.log_mt = "";
    }

    $scope.processTrial = function (trialid) {
    	$scope.flushLogST();
    	$scope.processing = true;
    	RESTClient.processTrial(trialid)
    		.then(function (response) {
    			console.log(response)
    		})
    		.catch(function (response) {
    			console.log(response)
    		})
    }

    $scope.processTrials = function () {
    	$scope.flushLogMT();
    	$scope.processing = true;
    	var trials = $scope.trialList.trim().split(/\s*;\s*/);
    	RESTClient.processTrials(trials)
    		.then(function (response) {
    			console.log(response)
    		})
    		.catch(function (response) {
    			console.log(response)
    		})
    }
})
