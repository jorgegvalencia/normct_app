angular.module('normct', ['ui.router', 'ngAnimate', 'ngSanitize', 'googlechart'])
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])
