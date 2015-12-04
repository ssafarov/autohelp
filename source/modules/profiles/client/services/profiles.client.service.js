'use strict';

//Profiles service used for communicating with the profiles REST endpoints
angular.module('profiles').factory('Profiles', ['$resource',
  function ($resource) {
    return $resource('api/profiles/:profileId', {
      profileId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
