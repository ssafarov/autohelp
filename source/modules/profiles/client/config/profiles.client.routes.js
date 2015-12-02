'use strict';

// Setting up route
angular.module('profiles').config(['$stateProvider',
  function ($stateProvider) {
    // Profiles state routing
    $stateProvider
      .state('profiles', {
        abstract: true,
        url: '/profiles',
        template: '<ui-view/>'
      })
      .state('profiles.list', {
        url: '',
        templateUrl: 'modules/profiles/client/views/list-profiles.client.view.html'
      })
      .state('profiles.create', {
        url: '/create',
        templateUrl: 'modules/profiles/client/views/create-profile.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('profiles.view', {
        url: '/:profileId',
        templateUrl: 'modules/profiles/client/views/view-profile.client.view.html'
      })
      .state('profiles.edit', {
        url: '/:profileId/edit',
        templateUrl: 'modules/profiles/client/views/edit-profile.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
