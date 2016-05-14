angular.module('normct')
    .controller('FrecuencyReportCtrl', function($scope, concepts, RESTClient) {
        $scope.concepts = concepts;

        var sum = function(items, prop) {
            if (items == null) {
                return 0;
            }
            return items.reduce(function(a, b) {
                return b[prop] == null ? a : a + b[prop];
            }, 0);
        };

        $scope.totalConcepts = sum(concepts, 'frecuency');

        $scope.myChartObject = {};
        $scope.myChartObject.type = "PieChart";
        $scope.myChartObject.options = {
            'title': 'SNOMED CT hierarchy distribution on most frequent concepts'
        };

        var rows = [];
        var map = {};
        for (var i = 0; i < concepts.length; i++) {
            if (map[concepts[i].hierarchy]) {
                map[concepts[i].hierarchy] += concepts[i].frecuency;
            } else {
                map[concepts[i].hierarchy] = concepts[i].frecuency;
            }
        }

        for (var key in map) {
            rows.push({ c: [{ v: key}, {v: map[key]}]});
        }

        $scope.myChartObject.data = {
            "cols": [
                { id: "t", label: "Hierarchy", type: "string" },
                { id: "s", label: "Appearances", type: "number" }
            ],
            "rows": rows
        }
    })
