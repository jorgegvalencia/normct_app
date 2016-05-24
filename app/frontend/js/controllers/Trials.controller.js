angular.module('normct')
    .controller('TrialsCtrl', function($scope, $state, trials, ntrials, RESTClient, filterFilter) {
        $scope.trials = trials;
        // $scope.limit = 30;
        // $scope.trialsNumber = ntrials;
        // $scope.currentPage = 0;
        // $scope.maxPage = Math.round(ntrials / $scope.limit);
        // var limit = $scope.limit;

        // create empty search model (object) to trigger $watch on update
        $scope.search = {};
        $scope.predicate = 'age';
        $scope.reverse = true;

        // pagination controls
        $scope.currentPage = 0;
        $scope.totalItems = $scope.trials.length;
        $scope.entryLimit = 10; // trials per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

        // $watch search to update pagination
        $scope.$watch('search', function(newVal, oldVal) {
            $scope.filtered = filterFilter($scope.trials, newVal);
            $scope.totalItems = $scope.filtered.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            $scope.currentPage = 0;
        }, true);

        $scope.order = function(predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        $scope.prevPage = function() {
            if($scope.currentPage > 0)
                $scope.currentPage--;
            // var offset = ($scope.currentPage - 1) * entryLimit;
            // if (offset >= 0) {
            //     RESTClient.getTrials(offset, entryLimit)
            //         .then(function(trials) {
            //             $scope.trials = trials;
            //             $scope.currentPage = $scope.currentPage - 1;
            //         })
            //         .catch(function(error) {
            //             alert('error');
            //         })
            // }
        }

        $scope.nextPage = function() {
            if($scope.currentPage < $scope.noOfPages)
                $scope.currentPage++;
            // var offset = ($scope.currentPage + 1) * entryLimit;
            // RESTClient.getTrials(offset, entryLimit)
            //     .then(function(trials) {
            //         $scope.trials = trials;
            //         $scope.currentPage = $scope.currentPage + 1;
            //     })
            //     .catch(function(error) {
            //         alert('error');
            //     })
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
            console.log("trigger", trialid)
            $state.go('trials.detail', { trialid: trialid });
        }


    })
