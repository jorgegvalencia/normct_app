angular.module('normct')
    .controller('NormalformReportCtrl', function($scope, $state, concepts, RESTClient) {
        $scope.concepts = concepts ? concepts : [];
        $scope.totalConcepts = sum(concepts);
        $scope.pieChart = {
            type: "PieChart",
            options: {
                title: 'SNOMED CT hierarchy distribution on most frequent concepts'
            },
            data: {
                cols: [
                    { id: "t", label: "Hierarchy", type: "string" },
                    { id: "s", label: "Appearances", type: "number" }
                ],
                rows: buildPieChartData()
            }
        };

        $scope.columnChart = {
            type: "ColumnChart",
            options: {
                title: 'SNOMED CT most frequent concepts',
                textStle: {
                    fontSize: 10
                }
            },
            data: {
                cols: [
                    { id: "t", label: "Concept", type: "string" },
                    { id: "s", label: "Appearances", type: "number" }
                ],
                rows: buildColumnChartData()
            }
        }

        $scope.goToDetail = function(conceptid) {
            $state.go('frecuency.detail', { conceptid: conceptid });
        }

        $scope.filter = function () {
            $state.go('normalform', {topic: $scope.keywords});
        }

        // function sum(items, prop) {
        //     if (items == null) {
        //         return 0;
        //     }
        //     return items.reduce(function(a, b) {
        //         return b[prop] === undefined ? a : a + b[prop];
        //     });
        // };

        function getSum(a, b) {
            return b['frecuency'] === undefined ? a['frecuency'] || a : (a['frecuency'] || a) + b['frecuency'];
        }

        function sum(items) {
            if (items === null || items === undefined) {
                return 0;
            } else {
                var total = items.reduce(getSum);
                console.log(total);
                return total;
            }
        }

        function buildPieChartData() {
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
                rows.push({ c: [{ v: key }, { v: map[key] }] });
            }
            return rows;
        }

        function buildColumnChartData() {
            var rows = [];
            var map = {};
            for (var i = 0; i < 60 && i < concepts.length; i++) {
                if (map[concepts[i].concept]) {
                    map[concepts[i].concept] += concepts[i].frecuency;
                } else {
                    map[concepts[i].concept] = concepts[i].frecuency;
                }
            }
            for (var key in map) {
                rows.push({ c: [{ v: key }, { v: map[key] }] });
            }
            return rows;
        }
    })
