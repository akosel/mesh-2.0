'use strict';

var mongoose = require('mongoose'),
    Goal = mongoose.model('Goal'),
    _ = require('lodash');


/**
 *  Find goal by id
 */


exports.goal = function(req, res, next, id) {
    console.log('exports goal', id);
    Goal.load(id, function(err, goal) {
        if(err) return next(err);
        if(!goal) return next(new Error('Failed to load goal ' + id));
        req.goal = goal;
        next();
    });
};

/**
 *  Create a goal
 */

exports.create = function(req, res) {
    console.log('goal created');
    var goal = new Goal(req.body);
    goal.user = req.user;
    goal.people.push(goal.user);

    goal.save(function(err) {
        if(err) {
            console.log('exports create: ', err);
            return res.json(500, {
                error: 'Cannot save the goal'
            });
        }
        res.json(goal);
    });
};

/**
 *  Join a goal
 */

exports.join = function(req, res) {
    console.log('exports join');
    var goal = req.goal;
    goal.people.push(goal.user);

    goal.save(function(err) {
        if(err) {
            return res.json(500, {
                error: 'Cannot edit the goal'
            });
        }
        res.json(goal);
    });
};

/**
 *  Update a goal
 */
exports.update = function(req, res) {
    console.log('exports update');
    var goal = req.goal;

    goal = _.extend(goal, req.body);

    goal.save(function(err) {
        if(err) {
            return res.json(500, {
                error: 'Cannot update the goal'
            });
        }
        res.json(goal);
    });
};

/**
 *  Delete a goal
 */
exports.destroy = function(req, res) {
    var goal = req.goal;

    goal.remove(function(err) {
        if(err) {
            return res.json(500, {
                error: 'Cannot delete the goal'
            });
        }   
        res.json(goal);
    });
};

/**
 *  Show a goal
 */
exports.show = function(req, res) {
    res.json(req.goal);
};

/**
 * List of all goals
 */
exports.list = function(req, res) {
    Goal.find(req.query).sort('-end').populate('user', 'name username picture').populate('people', 'name username picture').exec(function(err, goals) {
        if(err) {
            return res.json(500, {
                error: 'Cannot list the goals'
            });
        }
        res.json(goals);
    });
};

