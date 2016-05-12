angular.module('normct')
	.controller('TrialsCtrl', function ($scope, trials, RESTClient) {
		$scope.trials = trials;
		$scope.currentPage = 1;
		var limit = 30;

		$scope.prevPage = function () {
			var offset = ($scope.currentPage - 1) * limit;
			RESTClient.getTrials(offset, limit)
				.then(function (trials) {
					$scope.trials = trials;
					$scope.currentPage = $scope.currentPage-1;
				})
				.catch(function (error) {
					alert('error');
				})
		}

		$scope.nextPage = function () {
			var offset = ($scope.currentPage - 1) * limit;
			RESTClient.getTrials(offset, limit)
				.then(function (trials) {
					$scope.trials = trials;
					$scope.currentPage = $scope.currentPage+1;
					console.log($scope.currentPage);
				})
				.catch(function (error) {
					alert('error');
				})
		}

		$scope.goPage = function (page) {
			var offset = (page) * limit;
			RESTClient.getTrials(offset, limit)
				.then(function (trials) {
					$scope.trials = trials;
					$scope.currentPage = page;
					console.log($scope.currentPage);
				})
				.catch(function (error) {
					alert('error');
				})
		}
	})