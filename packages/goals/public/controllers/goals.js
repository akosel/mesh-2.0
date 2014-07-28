'use strict';

angular.module('mean.goals').controller('GoalsController', ['$scope', '$stateParams', '$location', 'Global', 'Goals',
    function($scope, $stateParams, $location, Global, Goals) {
        $scope.global = Global;

        $scope.hasAuthorization = function(goal) {
            if (!goal || !goal.user) return false;
            return $scope.global.isAdmin || goal.people.indexOf($scope.global.user._id) != -1;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var goal = new Goals({
                    title: this.title,
                    description: this.description,
                    end: this.end 
                });
                goal.$save(function(response) {
                    $location.path('goals/' + response._id);
                });

                this.title = '';
                this.description = '';
            } else {
                $scope.submitted = true;
            }
        };

        $scope.join = function(goal) {
           goal.people.push($scope.global.user._id);
           goal.$update(function() {
                console.log('in update');
                $location.path('goals/' + goal._id);
           });
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
                    $location.path('/goals');
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

        $scope.find = function(query) {
            Goals.query(query, function(goals) {
                console.log('scope find', query);
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
