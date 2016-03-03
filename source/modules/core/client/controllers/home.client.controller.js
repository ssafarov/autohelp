'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication',
  function ($scope, $state, Authentication) {
      $state.blurred = false;

    // This provides Authentication context.
    $scope.authentication = Authentication;
      $scope.$state = $state;
  }
]);
