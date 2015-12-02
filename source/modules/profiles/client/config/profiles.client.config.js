'use strict';

// Configuring the Profiles module
angular.module('profiles').run(['Menus',
  function (Menus) {
    // Add the profiles dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Profiles',
      state: 'profiles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'List Profiles',
      state: 'profiles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'profiles', {
      title: 'Create Profiles',
      state: 'profiles.create',
      roles: ['user']
    });
  }
]);
