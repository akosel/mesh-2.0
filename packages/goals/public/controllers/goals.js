'use strict';

angular.module('mean.goals').controller('GoalsController', ['$scope', '$stateParams', '$location', 'Global', 'Goals',
    function($scope, $stateParams, $location, Global, Goals) {
        $scope.global = Global;
        
        $scope.commentState = false;
        
        $scope.toggleCommentState = function() {
            $scope.commentState = !$scope.commentState;
        };

        $scope.hasAuthorization = function(goal) {
            if (!goal || !goal.user) return false;

            // TODO use this until underscore gets added in
            for (var i = 0; i < goal.people.length; i++) {
                // XXX uncomment to enable edit and delete access to all users
                // if (goal.people[i]._id === $scope.global.user._id)
                    // return true;
            }
            return $scope.global.isAdmin || goal.user._id === $scope.global.user._id;
        };
        $scope.isInvited = function(goal) {
            if (!goal || !goal.user) return false;

            // TODO use this until underscore gets added in
            for (var i = 0; i < goal.invited.length; i++) {
                if (goal.invited[i]._id === $scope.global.user._id)
                    return true;
            }
            // return $scope.global.isAdmin || goal.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                    
                var goal = new Goals({
                    title: this.title,
                    description: this.description,
                    end: this.end,
                });

                if (this.invited)
                    goal.invited = this.invited._id;

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

            // TODO use this until underscore gets added in
            for (var i = 0; i < goal.invited.length; i++) {
                if (goal.invited[i]._id === $scope.global.user._id)
                    goal.invited.splice(i, 1);
            }
           goal.$update(function() {
           });
        };

        $scope.addComment = function(goal) {
            goal.comments.push(this.comment + " -" + $scope.global.user.name);

            goal.$update(function() {
            });
        };

        $scope.removeComment = function(goal, comment) {
            goal.comments.splice(goal.comments.indexOf(comment), 1);
            goal.$update(function() {
            });
        }

        $scope.remove = function(goal) {
            var r = confirm('really?');
            if (goal && r) {
                goal.$remove();

                for (var i in $scope.goals) {
                    if ($scope.goals[i] === goal) {
                        $scope.goals.splice(i, 1);
                    }
                }
            } else if (r){

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
