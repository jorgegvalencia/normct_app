angular.module('normct')
    .controller('TrialsCtrl', function($scope, $state, trials, ntrials, RESTClient) {
    	$scope.limit = 30;
        $scope.trials = trials;
        $scope.trialsNumber = ntrials;
        $scope.currentPage = 0;
        $scope.maxPage = Math.round(ntrials/$scope.limit);

        var limit = $scope.limit;
        console.log("Se instancia TrialsCtrl", $scope.maxPage);

        $scope.prevPage = function() {
            var offset = ($scope.currentPage - 1) * limit;
            if (offset >= 0) {
                RESTClient.getTrials(offset, limit)
                    .then(function(trials) {
                        $scope.trials = trials;
                        $scope.currentPage = $scope.currentPage - 1;
                    })
                    .catch(function(error) {
                        alert('error');
                    })
            }
        }

        $scope.nextPage = function() {
            var offset = ($scope.currentPage + 1) * limit;
            RESTClient.getTrials(offset, limit)
                .then(function(trials) {
                    $scope.trials = trials;
                    $scope.currentPage = $scope.currentPage + 1;
                })
                .catch(function(error) {
                    alert('error');
                })
        }

        $scope.goPage = function(page) {
            var offset = (page) * limit;
            RESTClient.getTrials(offset, limit)
                .then(function(trials) {
                    $scope.trials = trials;
                    $scope.currentPage = page;
                })
                .catch(function(error) {
                    alert('error');
                })
        }

        $scope.goToTrial = function (trialid) {
            console.log("trigger", trialid)
            $state.go('trials.detail', {trialid: trialid});
        }
    })
