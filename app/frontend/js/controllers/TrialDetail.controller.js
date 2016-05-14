angular.module('normct')
    .controller('TrialDetailCtrl', function($scope, $state, trial, RESTClient) {
    	$scope.trial = trial;
    })
