angular.module('normct', ['ui.router','ngAnimate', 'ngSanitize', 'googlechart', 'ui.bootstrap'])
    .run(['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])
