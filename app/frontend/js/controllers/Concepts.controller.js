angular.module('normct')
    .controller('ConceptsCtrl', function($scope, concepts, nconcepts, RESTClient) {
    	$scope.limit = 100;
        $scope.concepts = concepts;
        $scope.conceptsNumber = nconcepts;
        $scope.currentPage = 0;
        $scope.maxPage = Math.round(nconcepts/$scope.limit);

        var limit = $scope.limit;
        console.log("Se instancia ConceptsCtrl", $scope.maxPage);

        $scope.prevPage = function() {
            var offset = ($scope.currentPage - 1) * limit;
            if (offset >= 0) {
                RESTClient.getConcepts(offset, limit)
                    .then(function(concepts) {
                        $scope.concepts = concepts;
                        $scope.currentPage = $scope.currentPage - 1;
                    })
                    .catch(function(error) {
                        alert('error');
                    })
            }
        }

        $scope.nextPage = function() {
            var offset = ($scope.currentPage + 1) * limit;
            RESTClient.getConcepts(offset, limit)
                .then(function(concepts) {
                    $scope.concepts = concepts;
                    $scope.currentPage = $scope.currentPage + 1;
                })
                .catch(function(error) {
                    alert('error');
                })
        }

        $scope.goPage = function(page) {
            var offset = (page) * limit;
            RESTClient.getConcepts(offset, limit)
                .then(function(concepts) {
                    $scope.concepts = concepts;
                    $scope.currentPage = page;
                })
                .catch(function(error) {
                    alert('error');
                })
        }
    })
