'use strict';

// The Package is past automatically as first parameter
module.exports = function(Tasks, app, auth, database) {

    app.get('/tasks/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/tasks/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/tasks/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/tasks/example/render', function(req, res, next) {
        Tasks.render('index', {
            package: 'tasks'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
