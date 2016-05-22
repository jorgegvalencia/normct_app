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
            getTrialCriteria: getTrialCriteria,

            // Concepts
            getConcepts: getConcepts,
            getConceptsNumber: getConceptsNumber,

            // Reports
            getConceptsFrecuency: getConceptsFrecuency,
            getConceptFrecuencyDetail: getConceptFrecuencyDetail,
            getNormalformFrecuency: getNormalformFrecuency,
            getPhraseConcepts: getPhraseConcepts,

            // Test
            processTrial: processTrial
        };

        function processTrial(trialid) {
            var deferred = $q.defer();
            $http.post('/api/process/trial', { trial: trialid })
                .success(function(response, status) {
                    console.log("RESTClient getTest:", status, response);
                    deferred.resolve(response);
                })
                .catch(function(error) {
                    console.error("RESTClient getTest:", status);
                    deferred.reject(error);
                })
            return deferred.promise;
        }

        function getTrial(trialid) {
            var deferred = $q.defer();
            $http.get('/api/trials/' + trialid)
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

        function getTrials(offset, limit, topic) {
            var deferred = $q.defer();
            $http.get('/api/trials', {
                    params: {
                        offset: offset,
                        limit: limit,
                        topic: topic
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

        function getTrialsNumber(topic) {
            var deferred = $q.defer();
            $http.get('/api/trials/count', {
                    params: {
                        topic: topic
                    }
                })
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

        function getTrialCriteria(trialid) {
            var deferred = $q.defer();
            $http.get('/api/criteria/'+trialid)
                .success(function(response, status) {
                    console.log("RESTClient getTrialCriteria:", status, response);
                    deferred.resolve(response.ec);
                })
                .catch(function(error) {
                    console.error("RESTClient getTrialCriteria:", status);
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

        function getConceptsFrecuency(limit, topic) {
            var deferred = $q.defer();
            $http.get('/api/reports/frecuency', { params: { limit: limit, topic: topic } })
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

        function getConceptFrecuencyDetail(conceptid, limit) {
            var deferred = $q.defer();
            $http.get('/api/reports/frecuency/detail/' + conceptid, { params: { limit: limit } })
                .success(function(response, status) {
                    console.log("RESTClient getConceptFrecuencyDetail:", status, response.matches);
                    deferred.resolve(response.matches);
                })
                .catch(function(error) {
                    console.error("RESTClient getConceptFrecuencyDetail:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }

        function getNormalformFrecuency(limit) {
            var deferred = $q.defer();
            $http.get('/api/reports/normalform', { params: { limit: limit } })
                .success(function(response, status) {
                    console.log("RESTClient getNormalformFrecuency:", status, response.concepts);
                    deferred.resolve(response.concepts);
                })
                .catch(function(error) {
                    console.error("RESTClient getNormalformFrecuency:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }

        function getPhraseConcepts(trialid, ecid, limit) {
            var deferred = $q.defer();
            $http.get(' /api/trials/'+trialid+'/criteria/'+ecid+'/concepts', { params: { limit: limit } })
                .success(function(response, status) {
                    console.log("RESTClient getPhraseConcepts:", status, response.concepts);
                    deferred.resolve(response.concepts);
                })
                .catch(function(error) {
                    console.error("RESTClient getPhraseConcepts:", status);
                    deferred.reject(error.message);
                })
            return deferred.promise;
        }

    })
