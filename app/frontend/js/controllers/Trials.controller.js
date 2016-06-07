angular.module('normct')
    .controller('TrialsCtrl', function($scope, $state, trials, ntrials, RESTClient, filterFilter) {
        $scope.trials = trials;

        // create empty search model (object) to trigger $watch on update
        $scope.search = {};
        $scope.predicate = 'nctid';
        $scope.reverse = false;
        $scope.limitOptions = [10, 20, 30, 50, 100];

        // pagination controls
        $scope.currentPage = 0;
        $scope.totalItems = $scope.trials.length;
        $scope.entryLimit = 10; // trials per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit) - 1;

        // $watch search to update pagination
        $scope.$watch('search', function(newVal, oldVal) {
            $scope.filtered = filterFilter($scope.trials, newVal);
            $scope.totalItems = $scope.filtered.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            $scope.currentPage = 0;
        }, true);

        $scope.$watch('entryLimit', function () {
            $scope.currentPage = 0;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit) - 1;
        })

        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        $scope.prevPage = function() {
            if($scope.currentPage > 0)
                $scope.currentPage--;
        }

        $scope.nextPage = function() {
            if($scope.currentPage < $scope.noOfPages)
                $scope.currentPage++;
        }

        $scope.goPage = function(page) {
            var offset = (page) * entryLimit;
            RESTClient.getTrials(offset, entryLimit)
                .then(function(trials) {
                    $scope.trials = trials;
                    $scope.currentPage = page;
                })
                .catch(function(error) {
                    alert('error');
                })
        }

        $scope.resetFilters = function() {
            // needs to be a function or it won't trigger a $watch
            $scope.search = {};
        };

        $scope.goToTrial = function(trialid) {
            $state.go('trials.detail', { trialid: trialid });
        }


    })
