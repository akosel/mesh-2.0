'use strict';

angular.module('mean.goals').factory('Goals', ['$resource',
    function($resource) {
        return $resource('goals/:goalId', {
            goalId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
