'use strict';

var goals = require('../controllers/goals');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.article.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Goals, app, auth) {

    app.route('/goals')
        .get(goals.list)
        .post(auth.requiresLogin, goals.create)
        .put(auth.requiresLogin, hasAuthorization, goals.join);
    app.route('/goals/:goalId')
        .get(goals.show)
        .put(auth.requiresLogin, hasAuthorization, goals.update)
        .delete(auth.requiresLogin, hasAuthorization, goals.destroy);

    // Finish with setting up the goalId param
    app.param('goalId', goals.goal);
};
