'use strict';

var mongoose = require('mongoose'),
    Goal = mongoose.model('Goal'),
    User = mongoose.model('User'),
    config = require('meanio').loadConfig(),
    _ = require('lodash'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    templates = require('../template');


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
 * Send reset email
 */
function sendMail(mailOptions) {
    console.log('trying to send!');
  var transport = nodemailer.createTransport('SMTP', config.mailer);
  transport.sendMail(mailOptions, function(err, response) {
      console.log(err, response);
    if (err) return err;
    return response;
  });
}

/**
 *  Create a goal
 */

exports.create = function(req, res) {
    var goal = new Goal(req.body);
    goal.user = req.user;
    goal.people.push(goal.user);
    console.log('goal created', goal);

    goal.save(function(err) {
        if(err) {
            console.log('exports create: ', err);
            return res.json(500, {
                error: 'Cannot save the goal'
            });
        }
        res.json(goal);
    });

    // XXX I have a suspicion this is not the most effective way to do this
    async.waterfall([
        function(done) {

            User.findOne({
                _id: goal.invited[0]
            }, function(err, user) {
              if (err || !user) return done(true);
              done(err, user);
            });
        },
        function(user, done) {
            var mailOptions = {
              to: user.email,
              from: config.emailFrom
            };
            mailOptions = templates.goal_invite_email(goal, user, req, mailOptions);
            sendMail(mailOptions);
        }
    ]);
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
    
    console.log(goal.childrenGoals, req.body);

    async.waterfall([
        function(done) {

            User.findOne({
                _id: goal.invited[0]
            }, function(err, user) {
              if (err || !user) return done(true);
              done(err, user);
            });
        },
        function(user, done) {
            var mailOptions = {
              to: user.email,
              from: config.emailFrom
            };
            mailOptions = templates.goal_invite_email(goal, user, req, mailOptions);
            sendMail(mailOptions);
        }
    ]);

    goal = _.extend(goal, req.body);
    console.log('extended goal', goal);

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
    console.log('exports show');
    res.json(req.goal);
};

/**
 * List of all goals
 */
exports.list = function(req, res) {
    console.log('query', req.query, typeof(req.query));
    Goal.find(req.query).sort('end')
        .populate('user', 'name username picture')
        .populate('people', 'name username picture')
        .populate('completed', 'name username picture')
        .populate('invited', 'name username picture')
        .populate('missed', 'name username picture')
        .populate('childrenGoals', 'title')
        .exec(function(err, goals) {
        if(err) {
            return res.json(500, {
                error: 'Cannot list the goals'
            });
        }

         // update any goals that have been missed
         _(goals).each(function(g, i) {
             if (!_(g).isEmpty() && !_(g.people).isEmpty() && Date.parse(g.end) < Date.now()) {
                 _(g.people).each(function(p, i) {
                    g.missed.push(p._id);
                 });
                 g.people = [];
                 
                 g.save(function(err) {
                     if(err) {
                         return res.json(500, {
                             error: 'Cannot update the goal'
                         });
                     }
                 });
                 goals.splice(i, 1);
             }
         });
        console.log('spliced goals', goals);
        res.json(goals);
    });
};

