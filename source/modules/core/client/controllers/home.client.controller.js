'use strict';

angular.module('core').controller('HomeController', ['$scope', '$state', 'Authentication', 'geolocationService',
  function ($scope, $state, Authentication, geolocationService) {
    $state.blurred = false;

    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.$state = $state;

    $scope.$position = geolocationService.getCurrentPosition().then(onUserLocationFound);

    function onUserLocationFound (position) {
      return position;
    }

    //Try to get the user position
    // captureUserLocation();
    //
    // function captureUserLocation() {
    //   geolocationService.getCurrentPosition().then(onUserLocationFound);
    // }
    //



  }
]);
