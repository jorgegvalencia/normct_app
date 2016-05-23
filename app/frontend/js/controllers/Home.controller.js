angular.module('normct').controller('HomeCtrl', function($scope, RESTClient, socket) {
    $scope.log = "";
    socket.on('socketToMe', function(data) {
        console.log(data);
        $scope.log += data + '<br>';
    });

    $scope.flushLog = function () {
    	$scope.log = "";
    }


    $scope.processTrial = function (trialid) {
    	$scope.flushLog();
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
