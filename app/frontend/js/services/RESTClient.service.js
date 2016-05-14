angular.module('normct')
    .factory('RESTClient', function($http, $q) {
        return {
            // Trials
            getTrial: getTrial,
            getTrials: getTrials,
            getTrialsNumber: getTrialsNumber,

            // Eligibility criteria
            getCriterias: getCriterias,
            getCriteriasNumber: getCriteriasNumber,

            // Concepts
            getConcepts: getConcepts,
            getConceptsNumber: getConceptsNumber,

            // Reports
            getConceptsFrecuency: getConceptsFrecuency,
            getConceptMatches: getConceptMatches
        };

        function getTrial(trialid) {
            var deferred = $q.defer();
            $http.get('/api/trials/'+trialid)
                .success(function(response, status) {
                    console.log("RESTClient getTrial:", status);
                    deferred.resolve(response.trial);
                })
                .catch(function(error) {
                    console.error("RESTClient getTrial:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }

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

        function getTrialsNumber() {
            var deferred = $q.defer();
            $http.get('/api/trials/count')
                .success(function(response, status) {
                	console.log("RESTClient getTrialsNumber:", status, response.trials);
                    deferred.resolve(response.trials);
                })
                .catch(function(error) {
                	console.error("RESTClient getTrials:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        } 
        function getConcepts(offset, limit) {
            var deferred = $q.defer();
            $http.get('/api/concepts', {
                    params: {
                        offset: offset,
                        limit: limit
                    }
                })
                .success(function(response, status) {
                    console.log("RESTClient getConcepts:", status, response);
                    deferred.resolve(response.concepts);
                })
                .catch(function(error) {
                    console.error("RESTClient getConcepts:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }

        function getConceptsNumber() {
            var deferred = $q.defer();
            $http.get('/api/concepts/count')
                .success(function(response, status) {
                    console.log("RESTClient getConceptsNumber:", status, response.concepts);
                    deferred.resolve(response.concepts);
                })
                .catch(function(error) {
                    console.error("RESTClient getConcepts:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }
        function getCriterias(offset, limit) {
            var deferred = $q.defer();
            $http.get('/api/criteria', {
                    params: {
                        offset: offset,
                        limit: limit
                    }
                })
                .success(function(response, status) {
                	console.log("RESTClient getConcepts:", status, response);
                    deferred.resolve(response.ec);
                })
                .catch(function(error) {
                	console.error("RESTClient getConcepts:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }

        function getCriteriasNumber() {
            var deferred = $q.defer();
            $http.get('/api/criteria/count')
                .success(function(response, status) {
                	console.log("RESTClient getConceptsNumber:", status, response.criteria);
                    deferred.resolve(response.criteria);
                })
                .catch(function(error) {
                	console.error("RESTClient getConcepts:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }

        function getConceptsFrecuency(limit) {
            var deferred = $q.defer();
            $http.get('/api/reports/frecuency', { params: { limit: limit } })
                .success(function(response, status) {
                    console.log("RESTClient getConceptsFrecuency:", status, response.concepts);
                    deferred.resolve(response.concepts);
                })
                .catch(function(error) {
                    console.error("RESTClient getConceptsFrecuency:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }

         function getConceptMatches(conceptid, limit) {
            var deferred = $q.defer();
            $http.get('/api/reports/frecuency/matches/'+conceptid, { params: { limit: limit } })
                .success(function(response, status) {
                    console.log("RESTClient getConceptMatches:", status, response.matches);
                    deferred.resolve(response.matches);
                })
                .catch(function(error) {
                    console.error("RESTClient getConceptMatches:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }

    })
