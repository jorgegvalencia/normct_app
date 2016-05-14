angular.module('normct')
    .controller('FrecuencyReportDetailCtrl', function($scope, $state, matches) {
    	$scope.conceptid = $state.params.conceptid
    	$scope.matches = matches;
    	$scope.mainConcept = matches[0].fsn;  
    })
