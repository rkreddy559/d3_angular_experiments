/**
 * Created by ramakrishna on 18/2/14.
 */
'use strict';

var petasenseServices = angular.module('petasenseServices', ['ngResource']);

petasenseServices.factory('Accelerometer', ['$resource',
    function($resource) {
        return $resource('json/:coordinateId.json', {}, {
            query: {method: 'GET', params:{coordinateId:'x-coordinate'}, isArray:true}
        });
}]);