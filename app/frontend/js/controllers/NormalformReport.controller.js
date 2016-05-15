angular.module('normct')
    .controller('NormalformReportCtrl', function($scope, $state, concepts, RESTClient) {
        $scope.concepts = concepts;
        $scope.totalConcepts = sum(concepts, 'frecuency');
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

        function sum(items, prop) {
            if (items == null) {
                return 0;
            }
            return items.reduce(function(a, b) {
                return b[prop] == null ? a : a + b[prop];
            }, 0);
        };

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
            for (var i = 0; i < 60; i++) {
                map[concepts[i].concept] = concepts[i].frecuency;
            }
            for (var key in map) {
                rows.push({ c: [{ v: key }, { v: map[key] }] });
            }
            return rows;
        }
    })
