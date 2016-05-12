angular.module('normct')
    .factory('RESTClient', function($http, $q) {
        return {
            getTrials: getTrials
        };

        function getTrials(offset, limit) {
            var deferred = $q.defer();
            $http.get('/api/trials', {
                    params: {
                        offset: offset,
                        limit: limit
                    }
                })
                .success(function(response, status) {
                	console.log("RESTClient getTrials:", status);
                    deferred.resolve(response.trials);
                })
                .catch(function(error) {
                	console.error("RESTClient getTrials:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }
    })
