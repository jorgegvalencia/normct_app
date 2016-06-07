angular.module('normct')
    .filter('bold', function() {
        return function(input, search) {
            var result = search.replace(/[\])}[{(]/g, '');
            var reg = new RegExp(result, 'gi');
            var final_str = input.replace(reg, function(str) {
                return '<b>' + str + '</b>'
            });
            return final_str;
        }
    })
