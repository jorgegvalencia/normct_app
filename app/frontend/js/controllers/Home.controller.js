angular.module('normct').controller('HomeCtrl', function($scope, RESTClient, socket) {
    console.log("Loading Home controller");
    socket.on('socketToMe', function(data) {
        console.log(data);
    });
    RESTClient.getHome();
})
