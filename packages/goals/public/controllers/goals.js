'use strict';

angular.module('mean.goals').controller('GoalsController', ['$scope', '$state', '$stateParams', '$location', 'Global', 'Goals',
    function($scope, $state, $stateParams, $location, Global, Goals) {
        $scope.global = Global;

        $scope.isPrimary = function(goal) {
            if (!goal) return false;
            console.log(goal.parentGoals);
            
            if (goal.parentGoals.length === 0) return true;

            return false;
        };

        $scope.initChildState = function(goal) {
            goal.childState = false;  
        };

        $scope.toggleChildState = function(goal) {
            goal.childState = !goal.childState;
        };

        $scope.initCommentState = function(goal) {
            goal.commentState = false;  
        };

        $scope.toggleCommentState = function(goal) {
            goal.commentState = !goal.commentState;
        };

        $scope.hasAuthorization = function(goal) {
            if (!goal || !goal.user) return false;

            // TODO use this until underscore gets added in
            // for (var i = 0; i < goal.people.length; i+=) {
                // XXX uncomment to enable edit and delete access to all users
                // if (goal.people[i]._id === $scope.global.user._id)
                    // return true;
            // }
            return $scope.global.isAdmin || goal.user._id === $scope.global.user._id;
        };
        $scope.isInvited = function(goal) {
            if (!goal || !goal.user) return false;

            // TODO use this until underscore gets added in
            for (var i = 0; i < goal.invited.length; i += 1) {
                if (goal.invited[i]._id === $scope.global.user._id)
                    return true;
            }
            // return $scope.global.isAdmin || goal.user._id === $scope.global.user._id;
        };
        $scope.isCompleted = function(goal) {
            if (!goal || !goal.user) return false;

            // TODO use this until underscore gets added in
            for (var i = 0; i < goal.completed.length; i+=1) {
                console.log(goal.completed[i]._id, $scope.global.user._id);
                if (goal.completed[i]._id === $scope.global.user._id)
                    return true;
            }
            return false;
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
            for (var i = 0; i < goal.invited.length; i+=1) {
                if (goal.invited[i]._id === $scope.global.user._id)
                    goal.invited.splice(i, 1);
            }
           goal.$update(function() {
           });
        };

        $scope.addChildGoal = function(parentGoal) {
            var childGoal = new Goals({
                title: this.title,
                parentGoals: [parentGoal._id]
            });
           childGoal.$save(function() {
               parentGoal.childrenGoals.push(childGoal._id);

               console.log('addChild', parentGoal, childGoal);

               parentGoal.$update(function() {
               });
           });
        };

        $scope.complete = function(goal) {
           goal.completed.push($scope.global.user._id);

            // TODO use this until underscore gets added in
            for (var i = 0; i < goal.people.length; i+=1) {
                if (goal.people[i]._id === $scope.global.user._id)
                    goal.people.splice(i, 1);
            }

           goal.$update(function() {
           });
        };

        $scope.addComment = function(goal) {
            goal.comments.push(this.comment + ' -' + $scope.global.user.name);

            goal.$update(function() {
            });
        };

        $scope.removeComment = function(goal, comment) {
            goal.comments.splice(goal.comments.indexOf(comment), 1);
            goal.$update(function() {
            });
        };

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
            // XXX test query = {$or: [{"people":"53d86796399da40000a29112" }, {"invited":"53d86796399da40000a29112"}]}
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
