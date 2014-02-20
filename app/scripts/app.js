'use strict';

angular.module('petasenseApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'petasenseServices',
  'petasenseControllers',
  'petasenseDirectives'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
