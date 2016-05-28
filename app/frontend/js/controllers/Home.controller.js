angular.module('normct').controller('HomeCtrl', function($scope, $timeout, RESTClient, socket) {
    $scope.log_st = ""; // single trial
    $scope.log_mt = ""; // multiple trial
    $scope.processing = 0;
    $scope.invalid = false;

    socket.on('singleTrialSocket', function(data) {
        console.log(data);
        console.log(socket.getSocketId())
        $scope.log_st += data.message + '<br>';
        if(data.status === 'Ended' || data.status === 'Failure'){
        	$scope.processing = 0;
        	if(data.status === 'Ended'){
        		$scope.log_st += 'View <a href="#/trials/'+data.trial+'">detail</a>' + '<br>';
        	}
        }
    });

    socket.on('trialListSocket', function(data) {
        console.log(data);
        $scope.log_mt += data.message + '<br>';
        if(data.status === 'Ended' || data.status === 'Failure'){
        	$scope.processing = 0;
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
        $scope.processing = 1;
        RESTClient.processTrial(trialid)
            .then(function (response) {
                $scope.processing = 2;
    			console.log(response)
    		})
    		.catch(function (response) {
    			console.log(response)
                $scope.invalid = true;
                $timeout(function () {
                    $scope.processing = 0;
                    $scope.invalid = false;
                }, 1250);
    		})
    }

    $scope.processTrials = function () {
    	$scope.flushLogMT();
        $scope.processing = 1;
    	var trials = $scope.trialList.trim().split(/\s*;\s*/);
    	RESTClient.processTrials(trials)
    		.then(function (response) {
                $scope.processing = 2;
    			console.log(response);
    		})
    		.catch(function (response) {
    			console.log(response);
                $scope.processing = 0;
    		})
    }
})
