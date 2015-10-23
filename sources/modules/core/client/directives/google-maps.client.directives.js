/**
 * Created by s.safarov on 31.08.2015.
 */


angular.module('core')
    .directive('showWorldMap', ['$timeout', '$interpolate', function ($timeout, $interpolate) {
        var fnMap = function (scope, el, attrs, formCtrl) {
                return '<strong>showWorldMap</strong>';
        };

        return {
            restrict: 'A',
            require: '^form',
            compile: function (elem, attrs) {
                return fnMap;
            }
        };
    }]);
