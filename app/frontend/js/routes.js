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
                        templateUrl: "templates/home.html"
                    }
                },
                controller: 'HomeCtrl'
            })
            .state('concepts', {
                url: '/concepts',
                views: {
                    "header": {
                        templateUrl: "templates/partials/_header.html"
                    },
                    "content": {
                        templateUrl: "templates/concepts.html"
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
            .state('trials', {
                url: '/trials',
                views: {
                    "header": {
                        templateUrl: "templates/partials/_header.html"
                    },
                    "content": {
                        templateUrl: "templates/trials.html",
                        resolve: {
                            trials: function(RESTClient) {
                                return RESTClient.getTrials(0, 30);
                            }
                        },
                        controller: 'TrialsCtrl'
                    }
                }
            })
            $urlRouterProvider.otherwise("/home");
    })
