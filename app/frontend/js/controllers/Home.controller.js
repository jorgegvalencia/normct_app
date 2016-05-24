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
        }
    });

    socket.on('trialListSocket', function(data) {
        console.log(data);
        $scope.log_mt += data.message + '<br>';
        if(data.status === 'Ended' || data.status === 'Failure'){
        	$scope.processing = false;
        }
    });

    $scope.flushLog = function () {
    	$scope.log_st = "";
    	$scope.log_mt = "";
    }

    $scope.processTrial = function (trialid) {
    	$scope.flushLog();
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
    	$scope.flushLog();
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
