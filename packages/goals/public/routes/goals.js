'use strict';

//Setting up route
angular.module('mean.goals').config(['$stateProvider',
    function($stateProvider) {
        // Check if the user is connected
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') $timeout(deferred.resolve);

                // Not Authenticated
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };

        // states for my app
        $stateProvider
        .state('create goal', {
            url: '/goals/create',
            templateUrl: 'goals/views/create.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('editGoal', {
            url: '/goals/:goalId/edit',
            templateUrl: 'goals/views/edit.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('list', {
            url: '/goals',
            templateUrl: 'system/views/index.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('invites', {
            url: '/invites',
            templateUrl: 'goals/views/invites.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('missed', {
            url: '/missed',
            templateUrl: 'goals/views/missed.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('completed', {
            url: '/completed',
            templateUrl: 'goals/views/completed.html',
            resolve: {
                loggedin: checkLoggedin
            }
        })
        .state('goal by id', {
            url: '/goals/:goalId',
        templateUrl: 'goals/views/view.html',
        resolve: {
            loggedin: checkLoggedin
        }
        });
    }
]);
