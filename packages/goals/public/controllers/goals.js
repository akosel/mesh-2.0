'use strict';

angular.module('mean.goals').controller('GoalsController', ['$scope', '$stateParams', '$location', 'Global', 'Goals',
    function($scope, $stateParams, $location, Global, Goals) {
        $scope.global = Global;

        $scope.hasAuthorization = function(goal) {
            if (!goal || !goal.user) return false;
            return $scope.global.isAdmin || goal.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var goal = new Goals({
                    title: this.title,
                    content: this.content
                });
                goal.$save(function(response) {
                    $location.path('goals/' + response._id);
                });

                this.title = '';
                this.content = '';
            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(goal) {
            if (goal) {
                goal.$remove();

                for (var i in $scope.goals) {
                    if ($scope.goals[i] === goal) {
                        $scope.goals.splice(i, 1);
                    }
                }
            } else {
                $scope.goal.$remove(function(response) {
                    $location.path('goals');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var goal = $scope.goal;
                if (!goal.updated) {
                    goal.updated = [];
                }
                goal.updated.push(new Date().getTime());

                goal.$update(function() {
                    $location.path('goals/' + goal._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            Goals.query(function(goals) {
                $scope.goals = goals;
            });
        };

        $scope.findOne = function() {
            Goals.get({
                goalId: $stateParams.goalId
            }, function(goal) {
                $scope.goal = goal;
            });
        };
    }
]);
