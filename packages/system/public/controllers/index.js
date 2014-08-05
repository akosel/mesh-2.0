'use strict';

angular.module('mean.system')
.filter('timeUntil', function() {
    return function(endDate){
        var now = Date.now();
        var end = Date.parse(endDate);
        var dayMs = 1000 * 60 * 60 * 24;
//        var hourMs = 1000 * 60 * 60;
        return String(Math.floor((end - now) / dayMs)) + ' days left';
    };
})
.controller('IndexController', ['$scope', 'Global',
  function($scope, Global) {
    $scope.global = Global;
    console.log('system scope', $scope.global);
  }
]);
