angular.module('normct')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                views: {
                    "header": {
                        templateUrl: "templates/partials/_header.html"
                    },
                    "content": {
                        templateUrl: "templates/home.html",
                        controller: 'HomeCtrl'
                    }
                },
                controller: 'HomeCtrl'
            })
            .state('frecuency', {
                url: '/reports/frecuency?topic',
                views: {
                    "header": {
                        templateUrl: "templates/partials/_header.html"
                    },
                    "content": {
                        templateUrl: "templates/frecuency.html",
                        controller: 'FrecuencyReportCtrl',
                        resolve: {
                            concepts: function (RESTClient, $stateParams) {
                                return RESTClient.getConceptsFrecuency(100, $stateParams.topic);
                            }
                        }
                    }
                }
            })
            .state('normalform', {
                url: '/reports/normalform?topic',
                views: {
                    "header": {
                        templateUrl: "templates/partials/_header.html"
                    },
                    "content": {
                        templateUrl: "templates/normalform.html",
                        controller: 'NormalformReportCtrl',
                        resolve: {
                            concepts: function (RESTClient, $stateParams) {
                                return RESTClient.getNormalformFrecuency(100, $stateParams.topic);
                            }
                        }
                    }
                }
            })
            .state('frecuency.detail', {
                url: '/detail/:conceptid',
                views: {
                    "header": {
                        templateUrl: "templates/partials/_header.html"
                    },
                    "content@": {
                        templateUrl: "templates/frecuencyDetail.html",
                        controller: 'FrecuencyReportDetailCtrl',
                        resolve: {
                            matches: function (RESTClient, $stateParams) {
                                return RESTClient.getConceptFrecuencyDetail($stateParams.conceptid, 50);
                            }
                        }
                    }
                }
            })
            .state('criteria', {
                url: '/criteria',
                views: {
                    "header": {
                        templateUrl: "templates/partials/_header.html"
                    },
                    "content": {
                        templateUrl: "templates/criteria.html"
                    }
                }
            })
            .state('concepts', {
                url: '/concepts',
                views: {
                    "header": {
                        templateUrl: "templates/partials/_header.html"
                    },
                    "content": {
                        templateUrl: "templates/concepts.html",
                        controller: 'ConceptsCtrl',
                        resolve: {
                            concepts: function(RESTClient) {
                                return RESTClient.getConcepts(0, 10000);
                            },
                            nconcepts: function(RESTClient) {
                                return RESTClient.getConceptsNumber();
                            }
                        }
                    }
                }
            })
            .state('trials', {
                url: '/trials',
                views: {
                    "header": {
                        templateUrl: "templates/partials/_header.html"
                    },
                    "content": {
                        templateUrl: "templates/trials.html",
                        controller: 'TrialsCtrl',
                        resolve: {
                            trials: function(RESTClient) {
                                return RESTClient.getTrials(0, 1000);
                            },
                            ntrials: function(RESTClient) {
                                return RESTClient.getTrialsNumber();
                            }
                        }
                    }
                }
            })
            .state('trials.detail', {
                url: '/:trialid',
                views: {
                    "header": {
                        templateUrl: "templates/partials/_header.html"
                    },
                    "content@": {
                        templateUrl: "templates/trialDetail.html",
                        controller: 'TrialDetailCtrl',
                        resolve: {
                            trial: function(RESTClient, $stateParams) {
                                return RESTClient.getTrial($stateParams.trialid);
                            },
                            ecs: function (RESTClient, $stateParams) {
                                return RESTClient.getTrialCriteria($stateParams.trialid);
                            }
                        }
                    }
                }
            })
        $urlRouterProvider.otherwise("/home");
    })
