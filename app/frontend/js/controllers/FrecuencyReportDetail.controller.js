angular.module('normct')
    .controller('FrecuencyReportDetailCtrl', function($scope, $state, matches, RESTClient) {
        $scope.conceptid = $state.params.conceptid
        $scope.matches = matches;
        $scope.mainConcept = matches[0].fsn;
        $scope.ecs = [];
        $scope.criteriaDetail = false;
        $scope.currentUtt = null;
        $scope.toggleDetail = function() {
            $scope.criteriaDetail = $scope.criteriaDetail ? false : true;
        }
        $scope.goToEC = function(trial, ec, utt) {
            RESTClient.getPhraseConcepts(trial, ec)
                .then(function(ecs) {
                    $scope.ecs = ecs;
                    $scope.criteriaDetail = true;
                    $scope.currentUtt = utt;
                })
                .catch(function(err) {
                    alert(err);
                })
        }
    })
