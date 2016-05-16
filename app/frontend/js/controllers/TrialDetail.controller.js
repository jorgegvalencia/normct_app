angular.module('normct')
    .controller('TrialDetailCtrl', function($scope, $state, trial, ecs, RESTClient) {
    	$scope.trial = trial;
    	$scope.ecs = ecs;
    })
