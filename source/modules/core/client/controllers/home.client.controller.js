'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication',
  function ($scope, $state, Authentication) {
    // Initial we need to have clear and sharp map
    $state.blurred = false;
    $scope.blurred = false;

    $scope.$state = $state;
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);
