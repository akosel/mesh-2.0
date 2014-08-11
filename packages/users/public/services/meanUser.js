'use strict';

angular.module('mean.users').factory('MeanUser', [
  function() {
    return {
      name: 'users'
    };
  }
])
.factory('Users', ['$resource',  
    function($resource) {
        return $resource('users/:goalId', {
            userId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
