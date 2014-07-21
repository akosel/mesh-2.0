'use strict';

var mongoose = require('mongoose'),
    Goal = mongoose.model('Goal'),
    _ = require('lodash');


/**
 *  Find goal by id
 */


exports.goal = function(req, res, next, id) {
    Goal.load(id, function(err, goal) {
        if(err) return next(err);
        if(!goal) return next(new Error('Failed to load goal ' + id));
        req.goal = goal;
        next();
    });
};

/**
 *  Create an goal
 */

exports.create = function(req, res) {
    var goal = new Goal(req.description);
    goal.user = req.user;

    goal.save(function(err) {
        if(err) {
            return res.json(500, {
                error: 'Cannot save the goal'
            });
        }
        res.json(goal);
    });
};

/**
 *  Update a goal
 */
exports.update = function(req, res) {
    var goal = req.goal;

    goal = _.extend(goal, req.description);

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
exports.all = function(req, res) {
    Goal.find().sort('-end').populate('user', 'name username').exec(function(err, goals) {
        if(err) {
            return res.json(500, {
                error: 'Cannot list the goals'
            });
        }
        res.json(goals);
    });
};
