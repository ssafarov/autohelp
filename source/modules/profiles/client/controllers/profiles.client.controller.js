'use strict';

// Profiles controller
angular.module('profiles').controller('ProfilesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Profiles',
  function ($scope, $stateParams, $location, Authentication, Profiles) {
    $scope.authentication = Authentication;

    // Create new Profile
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'profileForm');

        return false;
      }

      // Create new Profile object
      var profile = new Profiles({
        title: this.title,
        content: this.content,
        //////
        longitude: this.longitude,
        latitude: this.latitude
      });

      // Redirect after save
      profile.$save(function (response) {
        $location.path('profiles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        //////
        $scope.longitude = 0;
        $scope.latitude = 0;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Profile
    $scope.remove = function (profile) {
      if (profile) {
        profile.$remove();

        for (var i in $scope.profiles) {
          if ($scope.profiles[i] === profile) {
            $scope.profiles.splice(i, 1);
          }
        }
      } else {
        $scope.profile.$remove(function () {
          $location.path('profiles');
        });
      }
    };

    // Update existing Profile
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'profileForm');

        return false;
      }

      var profile = $scope.profile;

      profile.$update(function () {
        $location.path('profiles/' + profile._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Profiles
    $scope.find = function () {
      $scope.profiles = Profiles.query();
    };

    // Find existing Profile
    $scope.findOne = function () {
      $scope.profile = Profiles.get({
        profileId: $stateParams.profileId
      });
    };

    $scope.$on('mapInitialized', function(event,map) {
      var marker = map.markers[0];

      $scope.$watch('profile.latitude + profile.longitude', function(newVal, oldVal){
        if(newVal === oldVal){return;}
        // checks if value has changed
        map.setCenter({ latitude:$scope.profile.latitude, longitude:$scope.profile.longitude });
        marker.setPosition({ latitude:$scope.profile.latitude, longitude:$scope.profile.longitude });
      });
    });

    //marker link
    $scope.gotolink= function(event,i) {
      $location.path('profiles/'+ i._id);
    };
  }
]);
