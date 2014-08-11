'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Goals = new Module('goals');

/*
 * All MEAN packages require registration
 * Dependency injection used to define models
 */
Goals.register(function(app, auth, database) {

    Goals.routes(app, auth, database);

    Goals.menus.add({
        'roles': ['authenticated'],
        'title': 'Create New Goal',
        'link': 'create goal'
    });
    Goals.menus.add({
        'roles': ['authenticated'],
        'title': 'Invites',
        'link': 'invites'
    });
    Goals.menus.add({
        'roles': ['authenticated'],
        'title': 'Completed',
        'link': 'completed'
    });
    Goals.menus.add({
        'roles': ['authenticated'],
        'title': 'Missed',
        'link': 'missed'
    });

    Goals.aggregateAsset('js', 'test.js', {
        group: 'footer',
        weight: -1
    });

    Goals.aggregateAsset('css', 'goals.css');

    return Goals;

});
