angular.module('normct')
    .controller('TrialDetailCtrl', function($scope, $state, $stateParams, trial, ecs, RESTClient, $anchorScroll) {
        $anchorScroll();
        $scope.trial = trial;
        $scope.ecs = ecs;
        $scope.concepts = []; // concepts of the ec

        $scope.selectRow = function(ec, index) {
        	// query server for concepts of ec
        	if($scope.selectedRow !== null){
        		$scope.concepts = [];
        	}
        	RESTClient.getPhraseConcepts($stateParams.trialid, ec.number).then(function (concepts) {
        		$scope.concepts = concepts;
            	$scope.selectedRow = $scope.selectedRow == ec ? null : ec;
        	})
        }
        $scope.isSelected = function(row) {
            return $scope.selectedRow === row;
        }
    })
