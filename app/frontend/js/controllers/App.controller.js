angular.module('normct').controller('AppCtrl', function($scope, $uibModal, socket, $state) {
    // $scope.items = ['item1', 'item2', 'item3'];
    $scope.message = "";

    socket.on('singleTrialSocket', function(data) {
        console.log(data);
        console.log(socket.getSocketId())
        $scope.log_st += data.message + '<br>';
        if (data.status === 'Ended' || data.status === 'Failure') {
            $scope.processing = 0;
            if (data.status === 'Ended') {
                $scope.log_st += 'View <a href="#/trials/' + data.trial + '">detail</a>' + '<br>';
                $scope.message = data.trial;
                $scope.open();
            }
        }
    });

    socket.on('trialListSocket', function(data) {
        console.log(data);
        $scope.log_mt += data.message + '<br>';
        if (data.status === 'Ended' || data.status === 'Failure') {
            $scope.processing = 0;
        }
    });

    $scope.open = function(size) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'templates/partials/modal.html',
            size: size,
            controller: function($scope, $uibModalInstance, message) {
            	$scope.message = message;
                $scope.ok = function() {
                    $uibModalInstance.close(message);
                };

                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };
            },
            resolve: {
                message: function() {
                    return $scope.message;
                }
            }
        });

        modalInstance.result
            .then(function(message) {
                $state.go('trials.detail', { trialid: message} );
            })
            .catch(function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };
});
