'use strict';

angular.module('mean.tasks').controller('TasksController', ['$scope', 'Global', 'Tasks',
    function($scope, Global, Tasks) {
        $scope.global = Global;
        $scope.package = {
            name: 'tasks'
        };
    }
]);
